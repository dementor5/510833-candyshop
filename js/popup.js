'use strict';

(function () {
  var modalSuccessEl = document.querySelector('.modal--success');
  var modalErrorEl = document.querySelector('.modal--error');
  var modalErrorMessageEl = modalErrorEl.querySelector('.modal__message');

  addListenersOnPopups();

  function addListenersOnPopups() {
    modalErrorEl.addEventListener('click', onPopupCloseButtonClick);
    modalSuccessEl.addEventListener('click', onPopupCloseButtonClick);

  }

  function onPopupCloseButtonClick(evt) {
    if (evt.target.classList.contains('modal__close')) {
      closePopups();
    }
  }

  function openSuccessPopup() {
    openPopup(modalSuccessEl);
  }

  function openErrorPopup(errorMessage) {
    modalErrorMessageEl.textContent = errorMessage;
    openPopup(modalErrorEl);
  }

  function openPopup(popup) {
    popup.classList.remove('modal--hidden');
    document.addEventListener('keydown', onPopupEscPress);
  }

  function onPopupEscPress(evt) {
    window.util.isEscEvent(evt, closePopups);
  }

  function closePopups() {
    modalErrorEl.classList.add('modal--hidden');
    modalSuccessEl.classList.add('modal--hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  }

  window.popup = {
    openSuccess: openSuccessPopup,
    openError: openErrorPopup
  };
})();
