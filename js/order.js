'use strict';

(function () {
  var STORE_MAPS_PATH = 'img/map/';
  var orderFormElement = document.querySelector('.order_form');
  var orderElement = orderFormElement.querySelector('.order');
  var contactFieldElements =
    orderElement.querySelectorAll('.contact-data__inputs input');
  var paymentTabSwitchElements =
    orderElement.querySelectorAll('.payment__method input');
  var paymentCardSwitchElement = orderElement.querySelector('#payment__card');
  var paymentCardElement = orderElement.querySelector('.payment__card-wrap');
  var paymentFieldElements = paymentCardElement.querySelectorAll('input');
  var cardStatusElement =
    paymentCardElement.querySelector('.payment__card-status');
  var paymentCashElement = orderElement.querySelector('.payment__cash-wrap');
  var deliveryTabSwitchElements =
    orderElement.querySelectorAll('.deliver__toggle input');
  var deliveryStoreSwitchElement =
    orderElement.querySelector('#deliver__store');
  var deliveryStoreElement = orderElement.querySelector('.deliver__store');
  var deliveryStoresElement =
    deliveryStoreElement.querySelector('.deliver__stores');
  var deliveryStoresMapElement =
    deliveryStoreElement.querySelector('.deliver__store-map-img');
  var deliveryCourierElement = orderElement.querySelector('.deliver__courier');
  var deliveryRequestElement =
    deliveryCourierElement.querySelector('.deliver__entry-fields-wrap');
  var orderSubmitElement = orderFormElement.querySelector('.buy__submit-btn');
  var date = new Date();
  var month = date.getMonth();
  var year = date.getFullYear() - 2000;

  addListenerOnOrderElement();
  disableSendOrderFieldsInHidedTab();

  function addListenerOnOrderElement() {
    orderElement.addEventListener('input', function (evt) {
      checkCardFieldsOnInput(evt.target);
    });

    orderElement.addEventListener('change', function (evt) {
      if (evt.target.name === 'store') {
        changeStoreMap(evt.target.value);
      } else if (evt.target.classList.contains('toggle-btn__input')) {
        switchTabsInOrderElement(evt.target.id);
      } else {
        checkFieldOnChange(evt.target);
      }
    });
  }

  function checkCardFieldsOnInput(field) {
    switch (field.id) {
      case 'payment__card-number':
        limitInputToFigures(field);
        break;

      case 'payment__card-cvc':
        limitInputToFigures(field);
        break;

      case 'payment__card-date':
        filterCardDateField(field);
        break;

      case 'payment__cardholder':
        filterCardHolderField(field);
        break;
    }
  }

  function limitInputToFigures(element) {
    element.value = element.value.replace(/[^\d\/]/, '');
  }

  function filterCardDateField(cardDateElement) {
    cardDateElement.value = cardDateElement.value
      .replace(/[^\d\/]/, '') // remove all except digits and /
      .replace(/^\//, '') // remove first /
      .replace(/^(\d{2})\d$/, '$1') // remove third digit
      .replace(/\/{2}/, '/') // remove double slashes
      .replace(/(\/\d)\/$/, '$1') // remove last slash
      .replace(/^(0+|0+\/)$/, '0') // only one first 0
      .replace(/^1\/$/, '01/') // 1 -> 01/
      .replace(/^([2-9])$/, '0$1/') // 2->02/ to 09->09/
      .replace(/^1([3-9])/, '01/$1'); // from 13-> 01/3 to 19 -> 01/9
  }

  function filterCardHolderField(element) {
    element.value = element.value
      .replace(/[^A-Za-z\s]+/, '')
      .replace(/^([A-Za-z]+\s[A-Za-z]+)\s/, '$1')
      .toUpperCase();
  }

  function changeStoreMap(mapName) {
    var mapPath = STORE_MAPS_PATH + mapName + '.jpg';
    deliveryStoresMapElement.src = mapPath;
  }

  function switchTabsInOrderElement(flag) {
    switch (flag) {
      case 'payment__card':
        paymentCashElement.classList.add('visually-hidden');
        paymentCardElement.classList.remove('visually-hidden');
        setElementsDisabledState(paymentFieldElements, false);
        break;
      case 'payment__cash':
        paymentCardElement.classList.add('visually-hidden');
        paymentCashElement.classList.remove('visually-hidden');
        setElementsDisabledState(paymentFieldElements, true);
        break;
      case 'deliver__store':
        deliveryCourierElement.classList.add('visually-hidden');
        deliveryStoreElement.classList.remove('visually-hidden');
        deliveryRequestElement.disabled = true;
        deliveryStoresElement.disabled = false;
        break;
      case 'deliver__courier':
        deliveryStoreElement.classList.add('visually-hidden');
        deliveryCourierElement.classList.remove('visually-hidden');
        deliveryStoresElement.disabled = true;
        deliveryRequestElement.disabled = false;
        break;
    }
  }

  function checkFieldOnChange(field) {
    if (checkRelationToCard(field.id)) {
      switch (field.id) {
        case 'payment__card-number':
          checkCardNumberField(field);
          break;

        case 'payment__card-date':
          checkCardDateField(field);
          break;
      }

      checkCardFieldsValidState();
    }
  }

  function checkRelationToCard(id) {
    for (var i = 0; i < paymentFieldElements.length; i++) {
      if (paymentFieldElements[i].id === id) {
        return true;
      }
    }

    return false;
  }

  function checkCardNumberField(cardNumberElement) {
    var validityMessage = getLuhnCheckResult(cardNumberElement.value)
      ? ''
      : 'Номер карты указан не верно';

    cardNumberElement.setCustomValidity(validityMessage);
  }

  function getLuhnCheckResult(cardNumber) {
    if (!cardNumber) {
      return null;
    }

    var result = cardNumber
      .split('')
      .map(function (char, index) {
        var integer = parseInt(char, 10);
        var ordinalNumber = index + 1;

        if (isOdd(ordinalNumber)) {
          integer *= 2;
          if (integer > 9) {
            integer -= 9;
          }
        }

        return integer;
      })
      .reduce(function (sum, current) {
        return sum + current;
      });

    return result % 10 === 0;
  }

  function isOdd(integer) {
    return integer % 2 !== 0;
  }

  function checkCardDateField(element) {
    if (element.value.length === element.minLength) {
      var values = element.value.split('/');
      var cardMonth = parseInt(values[0], 10);
      var cardYear = parseInt(values[1], 10);
      var validityMessage =
        cardYear < year || cardYear === year && cardMonth < month
          ? 'Срок действия карты истёк'
          : '';

      element.setCustomValidity(validityMessage);
    }
  }

  function checkCardFieldsValidState() {
    for (var i = 0; i < paymentFieldElements.length; i++) {
      if (!paymentFieldElements[i].validity.valid) {
        return;
      }
    }

    cardStatusElement.textContent = 'Одобрен';
  }

  function disableSendOrderFieldsInHidedTab() {
    deliveryRequestElement.disabled = true;
  }

  function setOrderFieldsState(productsInBasketCount) {
    var flag = productsInBasketCount ? false : true;
    var element = deliveryStoreSwitchElement.checked
      ? deliveryStoresElement
      : deliveryRequestElement;

    if (paymentCardSwitchElement.checked) {
      setElementsDisabledState(paymentFieldElements, flag);
    }
    setElementsDisabledState(contactFieldElements, flag);
    setElementsDisabledState(paymentTabSwitchElements, flag);
    setElementsDisabledState(deliveryTabSwitchElements, flag);
    element.disabled = flag;
    orderSubmitElement.disabled = flag;
  }

  function setElementsDisabledState(elements, flag) {
    elements.forEach(function (item) {
      item.disabled = flag;
    });
  }

  window.order = {
    setFieldsState: setOrderFieldsState,
    getFormElement: function () {
      return orderFormElement;
    }
  };
})();
