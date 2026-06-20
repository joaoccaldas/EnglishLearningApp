document.addEventListener('click', event => {
  const leaveButton = event.target.closest('[data-action="leave-game"]');
  if (!leaveButton) return;
  const feedback = document.querySelector('.feedback');
  if (feedback?.textContent.trim()) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
