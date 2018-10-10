'use strict';

(function () {
  var ESC_KEYCODE = 27;

  function getRandomUniqueArrayEl(array) {
    var min = 0;
    var max = array.length - 1;
    var randomIndex = getRandomInRange(min, max);
    var element = array[randomIndex];
    array.splice(randomIndex, 1);
    return element;
  }

  function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomBool() {
    return Boolean(getRandomInRange(0, 1));
  }

  function isEscEvent(evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  }

  function getMaxArrayValue(arr) {
    return Math.max.apply(null, arr);
  }

  window.util = {
    getRandomUniqueArrayEl: getRandomUniqueArrayEl,
    getRandomInRange: getRandomInRange,
    getRandomBool: getRandomBool,
    isEscEvent: isEscEvent,
    getMaxArrayValue: getMaxArrayValue
  };
})();
