'use strict';

(function () {
  var rangeEl = document.querySelector('.range');
  var rangeFilter = rangeEl.querySelector('.range__filter');
  var rangeLineEl = rangeEl.querySelector('.range__fill-line');
  var leftPinEl = rangeEl.querySelector('.range__btn--left');
  var rightPinEl = rangeEl.querySelector('.range__btn--right');
  var rangeWidth = rangeFilter.offsetWidth;
  var pinHalfWidth = leftPinEl.offsetWidth / 2;
  var minRangePosition = -pinHalfWidth;
  var maxRangePosition = rangeWidth - pinHalfWidth;
  var leftPinInfo;
  var rightPinInfo;
  var pinInfo;
  var leftPinCallback;
  var rightPinCallback;
  var callback;
  var currentValue;

  function initRange(cb) {
    callback = cb;
    setInitStartPosition();
    makePinInfos();
    addListenersOnRangeEl();
  }

  function setInitStartPosition() {
    leftPinEl.style.left = minRangePosition + 'px';
    rightPinEl.style.left = maxRangePosition + 'px';
    rangeLineEl.style.left = minRangePosition + pinHalfWidth + 'px';
    rangeLineEl.style.right = minRangePosition + pinHalfWidth + 'px';
  }

  function makePinInfos() {
    leftPinInfo = {
      name: 'left',
      otherEl: rightPinEl,
      leftEdgePosition: parseInt(getComputedStyle(leftPinEl).left, 10),
      minPosition: minRangePosition,
      currentPercentPosition: 0
    };

    rightPinInfo = {
      name: 'right',
      otherEl: leftPinEl,
      leftEdgePosition: parseInt(getComputedStyle(rightPinEl).left, 10),
      maxPosition: maxRangePosition,
      currentPercentPosition: 100
    };
  }

  function addListenersOnRangeEl() {
    leftPinEl.addEventListener('mousedown', onMouseDown);
    rightPinEl.addEventListener('mousedown', onMouseDown);
  }

  function onMouseDown(evt) {
    preparePinInfo(evt.target, evt.clientX);
    changePinElsZIndex();
    addGlobalMouseListeners();
  }

  function preparePinInfo(element, initialPosition) {
    if (element.classList.contains('range__btn--left')) {
      pinInfo = leftPinInfo;
      pinInfo.maxPosition = rightPinInfo.leftEdgePosition;
      pinInfo.callback = leftPinCallback;
    } else if (element.classList.contains('range__btn--right')) {
      pinInfo = rightPinInfo;
      pinInfo.minPosition = leftPinInfo.leftEdgePosition;
      pinInfo.callback = rightPinCallback;
    }

    pinInfo.element = element;
    pinInfo.initialPosition = initialPosition;
  }

  function changePinElsZIndex() {
    pinInfo.otherEl.style.zIndex = 50;
    pinInfo.element.style.zIndex = 100;
  }

  function addGlobalMouseListeners() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(evt) {
    calcNewPinCoords(evt.clientX);
    renderRangeDOMChanges();
    if (currentValue !== pinInfo.currentPercentPosition) {
      currentValue = pinInfo.currentPercentPosition;
      returnPinPosition();
    }
  }

  function returnPinPosition() {
    callback({
      left: leftPinInfo.currentPercentPosition,
      right: rightPinInfo.currentPercentPosition
    });
  }

  function calcNewPinCoords(newMouseCords) {
    pinInfo.leftEdgePosition = getNewPosition(newMouseCords);
    pinInfo.currentMiddleCoord = pinInfo.leftEdgePosition + pinHalfWidth;
    pinInfo.currentPercentPosition =
      pinInfo.currentMiddleCoord / rangeWidth * 100;
  }

  function getNewPosition(newMousePosition) {
    var shift = newMousePosition - pinInfo.initialPosition;
    var newPosition = pinInfo.element.offsetLeft + shift;
    pinInfo.initialPosition = newMousePosition;

    if (newPosition < pinInfo.minPosition) {
      newPosition = pinInfo.minPosition;
    } else if (newPosition > pinInfo.maxPosition) {
      newPosition = pinInfo.maxPosition;
    }
    return newPosition;
  }

  function renderRangeDOMChanges() {
    pinInfo.element.style.left = pinInfo.leftEdgePosition + 'px';

    if (pinInfo.name === 'left') {
      rangeLineEl.style.left = pinInfo.currentMiddleCoord + 'px';

    } else if (pinInfo.name === 'right') {
      var rightCoord = maxRangePosition - pinInfo.leftEdgePosition;
      rangeLineEl.style.right = rightCoord + 'px';
    }
  }

  function onMouseUp() {
    removeGlobalMouseListeners();
  }

  function removeGlobalMouseListeners() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function reset() {
    setInitStartPosition();
    makePinInfos();
    returnPinPosition();
  }

  window.slider = {
    initRange: initRange,
    reset: reset
  };
})();
