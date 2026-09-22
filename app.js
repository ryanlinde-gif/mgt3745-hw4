(() => {
  'use strict';

  // Where the data lives as of ADR-002. Entries no longer live in this browser;
  // this page is now a client for a server it does not own.
  const API = "https://mgt3745-hw4.ryanlindebusiness.workers.dev";

  // The HW3 switch simulated a failed localStorage write. There is no local
  // write any more, so it now points the page at a host that cannot resolve,
  // which is the closest honest stand-in for "the network is down".
  const simulateNetworkFailure = new URLSearchParams(window.location.search).has('failSave');
  const apiBase = simulateNetworkFailure ? "https://mgt3745-hw4.invalid" : API;

  // E13: the seven-day threshold comes from the day 3 / day 7 follow-up cadence
  // already committed to in FEATURES.md E8, not from a fresh guess.
  const followUpDays = 7;
  const maxFieldLength = 200;

  const contactForm = document.querySelector('#contact-form');
  const coachNameInput = document.querySelector('#coach-name-input');
  const schoolInput = document.querySelector('#school-input');
  const contactDateInput = document.querySelector('#contact-date-input');
  const statusSelect = document.querySelector('#status-select');
  const contactList = document.querySelector('#contact-list');
  const entryError = document.querySelector('#entry-error');
  const saveStatus = document.querySelector('#save-status');
  const emptyState = document.querySelector('#empty-state');
  const overdueCount = document.querySelector('#overdue-count');

  const requiredFields = [
    { key: 'coachName', label: 'Coach name', element: coachNameInput },
    { key: 'school', label: 'School', element: schoolInput },
    { key: 'contactDate', label: 'Date contacted', element: contactDateInput }
  ];

  let contactEntries = [];

  // Every network call in this file goes through here, so a failure has exactly
  // one place to be handled and can never reach the console as an exception.
  async function request(path, options) {
    try {
      const response = await fetch(apiBase + path, options);
      if (!response.ok) {
        const detail = await response.text();
        return { ok: false, message: detail || `Server returned ${response.status}.` };
      }
      return { ok: true, response };
    } catch {
      return { ok: false, message: 'Could not reach the server.' };
    }
  }

  function showError(message) {
    entryError.textContent = message;
    saveStatus.textContent = '';
  }

  async function loadContacts() {
    const result = await request('/entries');
    if (!result.ok) {
      showError('Could not load saved contacts. ' + result.message + ' The list below may be incomplete.');
      return [];
    }
    return result.response.json();
  }

  async function saveContact(candidate) {
    // Persist before changing anything visible, exactly as the localStorage
    // version did. A failed save must leave the list and the form untouched.
    const result = await request('/entries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(candidate)
    });
    if (!result.ok) {
      // Only the save path can promise the typed entry survived, because only
      // the save path had something typed to preserve.
      showError(result.message + ' Your entry is still here. Try again.');
      return false;
    }
    return true;
  }

  async function deleteContact(id) {
    const result = await request('/entries/' + id, { method: 'DELETE' });
    if (!result.ok) {
      showError(result.message);
      return false;
    }
    return true;
  }

  function daysSinceContact(isoDate) {
    // Both sides are reduced to local midnight so a contact logged earlier today
    // counts as zero days rather than a fraction that rounds unpredictably.
    const contactDay = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(contactDay.getTime())) return 0;
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.floor((todayMidnight - contactDay) / 86400000);
  }

  function isOverdue(entry) {
    return entry.status === 'awaiting reply'
      && daysSinceContact(entry.contactDate) >= followUpDays;
  }

  function findFieldProblem(candidate) {
    // E12 requires naming the offending field, so validation returns which one
    // failed rather than a single generic rejection message.
    for (const field of requiredFields) {
      if (candidate[field.key] === '') {
        return { message: `${field.label} is required.`, element: field.element };
      }
    }
    for (const field of requiredFields) {
      if (candidate[field.key].length > maxFieldLength) {
        return {
          message: `${field.label} must be ${maxFieldLength} characters or fewer.`,
          element: field.element
        };
      }
    }
    return null;
  }

  function clearFieldErrors() {
    requiredFields.forEach(field => field.element.removeAttribute('aria-invalid'));
  }

  function renderContactLog() {
    contactList.replaceChildren();
    emptyState.hidden = contactEntries.length > 0;

    const overdueEntries = contactEntries.filter(isOverdue);
    if (overdueEntries.length === 0) {
      overdueCount.textContent = '';
    } else if (overdueEntries.length === 1) {
      overdueCount.textContent = '1 contact due for follow-up.';
    } else {
      overdueCount.textContent = `${overdueEntries.length} contacts due for follow-up.`;
    }

    contactEntries.forEach((entry, index) => {
      const listItem = document.createElement('li');

      const summary = document.createElement('span');
      summary.textContent = `${entry.coachName} — ${entry.school} — contacted ${entry.contactDate} — ${entry.status}`;
      listItem.append(summary);

      if (isOverdue(entry)) {
        const flag = document.createElement('span');
        flag.className = 'overdue-flag';
        flag.textContent = `Due for follow-up (${daysSinceContact(entry.contactDate)} days)`;
        listItem.append(flag);
      }

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Delete';
      deleteButton.setAttribute('aria-label', `Delete contact ${index + 1}: ${entry.coachName} at ${entry.school}`);
      deleteButton.addEventListener('click', async () => {
        deleteButton.disabled = true;
        const deleted = await deleteContact(entry.id);
        if (!deleted) { deleteButton.disabled = false; return; }
        contactEntries = await loadContacts();
        entryError.textContent = '';
        renderContactLog();
        saveStatus.textContent = 'Contact deleted.';
        coachNameInput.focus();
      });

      listItem.append(deleteButton);
      contactList.append(listItem);
    });
  }

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const candidate = {
      coachName: coachNameInput.value.trim(),
      school: schoolInput.value.trim(),
      contactDate: contactDateInput.value,
      status: statusSelect.value
    };

    const problem = findFieldProblem(candidate);
    if (problem !== null) {
      clearFieldErrors();
      showError(problem.message);
      problem.element.setAttribute('aria-invalid', 'true');
      problem.element.focus();
      return;
    }

    clearFieldErrors();
    entryError.textContent = '';
    saveStatus.textContent = 'Saving…';

    // The form is only cleared after the server confirms the write, so a failed
    // request leaves the typed entry where the athlete can retry it.
    const saved = await saveContact(candidate);
    if (!saved) return;

    contactEntries = await loadContacts();
    renderContactLog();
    contactForm.reset();
    coachNameInput.focus();
    saveStatus.textContent = 'Contact saved to the server.';
  });

  // Initial load. The page starts empty and fills in when the server answers.
  (async () => {
    contactEntries = await loadContacts();
    renderContactLog();
  })();
})();
