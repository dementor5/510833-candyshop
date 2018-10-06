'use strict';

(function () {
  var UP_KEYCODE = 38;
  var DOWN_KEYCODE = 40;

  function getRandomUniqueArrayElement(array) {
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

  window.util = {
    getRandomUniqueArrayElement: getRandomUniqueArrayElement,
    getRandomInRange: getRandomInRange,
    getRandomBool: getRandomBool,
    UP_KEYCODE: UP_KEYCODE,
    DOWN_KEYCODE: DOWN_KEYCODE
  };
})();
