'use strict';

(function () {
  var ESC_KEYCODE = 27;

  function isEscEvent(evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  }

  function getMaxArrayValue(arr) {
    return Math.max.apply(null, arr);
  }

  window.util = {
    isEscEvent: isEscEvent,
    getMaxArrayValue: getMaxArrayValue
  };
})();
