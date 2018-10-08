'use strict';

(function () {
  var rangeEl = document.querySelector('.range');
  var rangeFilter = rangeEl.querySelector('.range__filter');
  var rangeLine = rangeEl.querySelector('.range__fill-line');
  var leftPinEl = rangeEl.querySelector('.range__btn--left');
  var rightPinEl = rangeEl.querySelector('.range__btn--right');
  var rangePriceMinEl = rangeEl.querySelector('.range__price--min');
  var rangePriceMaxEl = rangeEl.querySelector('.range__price--max');
  var rangeWidth = rangeFilter.offsetWidth;
  var pinHalfWidth = leftPinEl.offsetWidth / 2;
  var minRangePosition = -pinHalfWidth;
  var maxRangePosition = rangeWidth - pinHalfWidth;
  var leftPinInfo;
  var rightPinInfo;
  var pinInfo;

  initRangeEl();

  function addListenersOnRangeEl() {
    leftPinEl.addEventListener('mousedown', onMouseDown);
    rightPinEl.addEventListener('mousedown', onMouseDown);
  }

  function switchGlobalMouseListeners(flag) {
    switch (flag) {
      case 'add':
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        break;
      case 'remove':
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        break;
    }
  }

  function initRangeEl() {
    addListenersOnRangeEl();
    makePinInfos();
  }

  function makePinInfos() {
    leftPinInfo = {
      name: 'left',
      otherEl: rightPinEl,
      rangePriceEl: rangePriceMinEl,
      leftEdgePosition: parseInt(getComputedStyle(leftPinEl).left, 10),
      minPosition: minRangePosition,
    };

    rightPinInfo = {
      name: 'right',
      otherEl: leftPinEl,
      rangePriceEl: rangePriceMaxEl,
      leftEdgePosition: parseInt(getComputedStyle(rightPinEl).left, 10),
      maxPosition: maxRangePosition
    };
  }

  function onMouseDown(evt) {
    preparePinInfo(evt.target, evt.clientX);
    changePinElsZIndex();
    switchGlobalMouseListeners('add');
  }

  function preparePinInfo(element, initialPosition) {
    if (element.classList.contains('range__btn--left')) {
      pinInfo = leftPinInfo;
      pinInfo.maxPosition = rightPinInfo.leftEdgePosition;
    } else if (element.classList.contains('range__btn--right')) {
      pinInfo = rightPinInfo;
      pinInfo.minPosition = leftPinInfo.leftEdgePosition;
    }

    pinInfo.element = element;
    pinInfo.initialPosition = initialPosition;
  }

  function changePinElsZIndex() {
    pinInfo.otherEl.style.zIndex = 50;
    pinInfo.element.style.zIndex = 100;
  }

  function onMouseMove(evt) {
    calcNewPinCoords(evt.clientX);
    renderRangeDOMChanges();

    // get percentPosition object
    getPinsPercentPosition();
  }

  function calcNewPinCoords(newMouseCords) {
    pinInfo.leftEdgePosition = getNewPosition(newMouseCords);
    pinInfo.currentMiddleCoord = pinInfo.leftEdgePosition + pinHalfWidth;
    pinInfo.currentPercentPosition =
      Math.round(pinInfo.currentMiddleCoord / rangeWidth * 100);

    return pinInfo;
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
    pinInfo.rangePriceEl.textContent = pinInfo.currentPercentPosition;

    if (pinInfo.name === 'left') {
      rangeLine.style.left = pinInfo.currentMiddleCoord + 'px';

    } else if (pinInfo.name === 'right') {
      var rightCoord = maxRangePosition - pinInfo.leftEdgePosition;
      rangeLine.style.right = rightCoord + 'px';
    }
  }

  function getPinsPercentPosition() {
    return {
      left: leftPinInfo.currentPercentPosition,
      right: rightPinInfo.currentPercentPosition
    };
  }

  function onMouseUp() {
    switchGlobalMouseListeners('remove');
  }
})();
