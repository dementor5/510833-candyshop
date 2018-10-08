'use strict';

(function () {
  var STORE_MAPS_PATH = 'img/map/';
  var orderFormEl = window.view.getFormEl();
  var orderEl = orderFormEl.querySelector('.order');
  var contactFieldEls = orderEl.querySelectorAll('.contact-data__inputs input');
  var emailFieldEl = Array.from(contactFieldEls).find(function (item) {
    return item.type === 'email';
  });
  var emailFieldName = emailFieldEl.name;
  var paymentTabSwitchEls = orderEl.querySelectorAll('.payment__method input');
  var paymentCardSwitchEl = orderEl.querySelector('#payment__card');
  var paymentCardEl = orderEl.querySelector('.payment__card-wrap');
  var paymentFieldEls = paymentCardEl.querySelectorAll('input');
  var cardStatusEl = paymentCardEl.querySelector('.payment__card-status');
  var paymentCashEl = orderEl.querySelector('.payment__cash-wrap');
  var deliveryTabSwitchEls = orderEl.querySelectorAll('.deliver__toggle input');
  var deliveryStoreSwitchEl = orderEl.querySelector('#deliver__store');
  var deliveryStoreEl = orderEl.querySelector('.deliver__store');
  var deliveryStoresEl = deliveryStoreEl.querySelector('.deliver__stores');
  var defaultStoreEl = deliveryStoreEl.querySelector('#store-academicheskaya');
  var deliveryStoresMapEl =
    deliveryStoreEl.querySelector('.deliver__store-map-img');
  var deliveryCourierEl = orderEl.querySelector('.deliver__courier');
  var deliveryRequestEl =
    deliveryCourierEl.querySelector('.deliver__entry-fields-wrap');
  var courierFieldEls = deliveryRequestEl.querySelectorAll('input, textarea');
  var floorFieldEl = deliveryRequestEl.querySelector('#deliver__floor');
  var floorFieldName = floorFieldEl.name;
  var descriptionEl = deliveryRequestEl.querySelector('.deliver__textarea');
  var descriptionName = descriptionEl.name;
  var orderSubmitEl = orderFormEl.querySelector('.buy__submit-btn');
  var date = new Date();
  var month = date.getMonth() + 1;
  var year = date.getFullYear() - 2000;

  addListenerOnOrderEl();
  disableSendOrderFieldsInHidedTab();

  function addListenerOnOrderEl() {
    orderEl.addEventListener('input', function (evt) {
      checkCardFieldsOnInput(evt.target);
    });

    orderEl.addEventListener('change', function (evt) {
      if (evt.target.name === 'store') {
        changeStoreMap(evt.target.value);
      } else if (evt.target.classList.contains('toggle-btn__input')) {
        switchTabsInOrderEl(evt.target.id);
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

  function filterCardDateField(cardDateEl) {
    cardDateEl.value = cardDateEl.value
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
    deliveryStoresMapEl.src = mapPath;
  }

  function switchTabsInOrderEl(flag) {
    switch (flag) {
      case 'payment__card':
        paymentCashEl.classList.add('visually-hidden');
        paymentCardEl.classList.remove('visually-hidden');
        setElsDisabledState(paymentFieldEls, false);
        break;
      case 'payment__cash':
        paymentCardEl.classList.add('visually-hidden');
        paymentCashEl.classList.remove('visually-hidden');
        setElsDisabledState(paymentFieldEls, true);
        break;
      case 'deliver__store':
        deliveryCourierEl.classList.add('visually-hidden');
        deliveryStoreEl.classList.remove('visually-hidden');
        deliveryRequestEl.disabled = true;
        deliveryStoresEl.disabled = false;
        break;
      case 'deliver__courier':
        deliveryStoreEl.classList.add('visually-hidden');
        deliveryCourierEl.classList.remove('visually-hidden');
        deliveryStoresEl.disabled = true;
        deliveryRequestEl.disabled = false;
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
    for (var i = 0; i < paymentFieldEls.length; i++) {
      if (paymentFieldEls[i].id === id) {
        return true;
      }
    }

    return false;
  }

  function checkCardNumberField(cardNumberEl) {
    var validityMessage = getLuhnCheckResult(cardNumberEl.value)
      ? ''
      : 'Номер карты указан не верно';

    cardNumberEl.setCustomValidity(validityMessage);
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
    for (var i = 0; i < paymentFieldEls.length; i++) {
      if (!paymentFieldEls[i].validity.valid) {
        cardStatusEl.textContent = 'Не определён';
        return;
      }
    }

    cardStatusEl.textContent = 'Одобрен';
  }

  function disableSendOrderFieldsInHidedTab() {
    deliveryRequestEl.disabled = true;
  }

  function setOrderFieldsState(productsInBasketCount) {
    var flag = productsInBasketCount ? false : true;
    var element = deliveryStoreSwitchEl.checked
      ? deliveryStoresEl
      : deliveryRequestEl;

    if (paymentCardSwitchEl.checked) {
      setElsDisabledState(paymentFieldEls, flag);
    }
    setElsDisabledState(contactFieldEls, flag);
    setElsDisabledState(paymentTabSwitchEls, flag);
    setElsDisabledState(deliveryTabSwitchEls, flag);
    element.disabled = flag;
    orderSubmitEl.disabled = flag;
  }

  function setElsDisabledState(elements, flag) {
    elements.forEach(function (item) {
      item.disabled = flag;
    });
  }

  function addListenerOnSubmitForm(clearBasketFunction) {
    orderFormEl.addEventListener('submit', function (evt) {
      switchEmptyOptionalFields();
      var formData = new FormData(orderFormEl);

      window.backend.upload(formData, function () {
        window.view.openSuccessPopup();
        setDefaultFormState();
        clearBasketFunction();
      }, function (errorMessage) {
        window.view.openErrorPopup(errorMessage);
      });

      evt.preventDefault();
    });
  }

  function switchEmptyOptionalFields() {
    emailFieldEl.name = emailFieldEl.value ? emailFieldName : '';
    floorFieldEl.name = floorFieldEl.value ? floorFieldName : '';
    descriptionEl.name = descriptionEl.value ? descriptionName : '';
  }

  function setDefaultFormState() {
    clearAllOrderFIelds();
    changeTabsStateToDefault();
    changeSelectedStoreToDefault();
  }

  function clearAllOrderFIelds() {
    var allOrderFields = Array.from(contactFieldEls)
      .concat(Array.from(paymentFieldEls), Array.from(courierFieldEls));
    allOrderFields.forEach(function (item) {
      item.value = '';
    });
  }

  function changeTabsStateToDefault() {
    paymentCardSwitchEl.checked = true;
    switchTabsInOrderEl(paymentCardSwitchEl.id);
    deliveryStoreSwitchEl.checked = true;
    switchTabsInOrderEl(deliveryStoreSwitchEl.id);
  }

  function changeSelectedStoreToDefault() {
    defaultStoreEl.checked = true;
    changeStoreMap(defaultStoreEl.value);
  }

  window.order = {
    setFieldsState: setOrderFieldsState,
    addListenerOnSubmitForm: addListenerOnSubmitForm
  };
})();
