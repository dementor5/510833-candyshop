'use strict';

(function () {
  var rangeElement = document.querySelector('.range');
  var rangeFilter = rangeElement.querySelector('.range__filter');
  var rangeLine = rangeElement.querySelector('.range__fill-line');
  var leftPinElement = rangeElement.querySelector('.range__btn--left');
  var rightPinElement = rangeElement.querySelector('.range__btn--right');
  var rangePriceMinElement = rangeElement.querySelector('.range__price--min');
  var rangePriceMaxElement = rangeElement.querySelector('.range__price--max');

  var rangeWidth = rangeFilter.offsetWidth;
  var pinHalfWidth = leftPinElement.offsetWidth / 2;
  var minRangePosition = -pinHalfWidth;
  var maxRangePosition = rangeWidth - pinHalfWidth;

  var leftPinInfo;
  var rightPinInfo;
  var pinInfo;

  initRangeElement();

  function initRangeElement() {
    makePinInfos();
    addListenersOnRangeElement();
  }

  function makePinInfos() {
    leftPinInfo = {
      name: 'left',
      otherElement: rightPinElement,
      rangePriceElement: rangePriceMinElement,
      leftEdgePosition: parseInt(getComputedStyle(leftPinElement).left, 10),
      minPosition: minRangePosition,
    };

    rightPinInfo = {
      name: 'right',
      otherElement: leftPinElement,
      rangePriceElement: rangePriceMaxElement,
      leftEdgePosition: parseInt(getComputedStyle(rightPinElement).left, 10),
      maxPosition: maxRangePosition
    };
  }

  function addListenersOnRangeElement() {
    leftPinElement.addEventListener('mousedown', onMouseDown);
    rightPinElement.addEventListener('mousedown', onMouseDown);
  }

  function onMouseDown(evt) {
    preparePinInfo(evt.target, evt.clientX);
    changePinElementsZIndex();
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

  function changePinElementsZIndex() {
    pinInfo.otherElement.style.zIndex = 50;
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
    pinInfo.rangePriceElement.textContent = pinInfo.currentPercentPosition;

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
})();
