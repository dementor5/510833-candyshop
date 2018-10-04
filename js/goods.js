'use strict';

var PRODUCT_NAMES = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя-удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Карманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычoк'
];
var PRODUCT_PICTURES = [
  'gum-cedar.jpg',
  'gum-chile.jpg',
  'gum-eggplant.jpg',
  'gum-mustard.jpg',
  'gum-portwine.jpg',
  'gum-wasabi.jpg',
  'ice-cucumber.jpg',
  'ice-eggplant.jpg',
  'ice-garlic.jpg',
  'ice-italian.jpg',
  'ice-mushroom.jpg',
  'ice-pig.jpg',
  'marmalade-beer.jpg',
  'marmalade-caviar.jpg',
  'marmalade-corn.jpg',
  'marmalade-new-year.jpg',
  'marmalade-sour.jpg',
  'marshmallow-bacon.jpg',
  'marshmallow-beer.jpg',
  'marshmallow-shrimp.jpg',
  'marshmallow-spicy.jpg',
  'marshmallow-wine.jpg',
  'soda-bacon.jpg',
  'soda-celery.jpg',
  'soda-cob.jpg',
  'soda-garlic.jpg',
  'soda-peanut-grapes.jpg',
  'soda-russian.jpg'
];
var PRODUCT_INGREDIENTS = [
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо'
];
var PRODUCTS_PICTURES_PATH = 'img/cards/';
var STORE_MAPS_PATH = 'img/map/';
var CATALOG_CARDS_COUNT = 26;
var CURRENCY_SIGN = '₽';
var CARD_CODE_LENGTH = 16;
var CVC_LENGTH = 3;

var UP_KEYCODE = 38;
var DOWN_KEYCODE = 40;

var mainHeaderBasketElement = document.querySelector('.main-header__basket');

var rangeElement = document.querySelector('.range');
var rangeFilter = rangeElement.querySelector('.range__filter');
var rangeLine = rangeElement.querySelector('.range__fill-line');
var leftHandleElement = rangeElement.querySelector('.range__btn--left');
var rightHandleElement = rangeElement.querySelector('.range__btn--right');
var rangePriceMinElement = rangeElement.querySelector('.range__price--min');
var rangePriceMaxElement = rangeElement.querySelector('.range__price--max');

var catalogElement = document.querySelector('.catalog__cards');
var catalogLoadElement = catalogElement.querySelector('.catalog__load');

var orderFormElement = document.querySelector('.order_form');

var basketElement = orderFormElement.querySelector('.goods__cards');
var goodsCardEmptyElement = basketElement.querySelector('.goods__card-empty');

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
var deliveryStoreSwitchElement = orderElement.querySelector('#deliver__store');
var deliveryStoreElement = orderElement.querySelector('.deliver__store');
var deliveryStoresElement = deliveryStoreElement.querySelector('.deliver__stores');
var deliveryStoresMapElement =
  deliveryStoreElement.querySelector('.deliver__store-map-img');

var deliveryCourierElement = orderElement.querySelector('.deliver__courier');
var deliveryRequestElement =
  deliveryCourierElement.querySelector('.deliver__entry-fields-wrap');

var orderSubmitElement = orderFormElement.querySelector('.buy__submit-btn');

var catalogCardTemplateElement = document.querySelector('#card')
    .content.querySelector('.catalog__card');
var basketCardTemplateElement = document.querySelector('#card-order')
    .content.querySelector('.goods_card');

var date = new Date();
var month = date.getMonth();
var year = date.getFullYear() - 2000;

var productsInCatalogInfo = [];
var productsInBasketInfo = [];
var catalogCardsElements = [];
var basketCardsElements = [];

addListenersOnRangeElement();
addListenerOnOrderElement();
renderCatalog();
disableOrderFieldsInHidedTab();
setOrderFieldsState();

var rangeWidth = rangeFilter.offsetWidth;
var handleHalfWidth = leftHandleElement.offsetWidth / 2;
var minRangePosition = -handleHalfWidth;
var maxRangePosition = rangeWidth - handleHalfWidth;

var leftHandleInfo;
var rightHandleInfo;
var handleInfo;

var handlesPercentPosition = {
  left: 0,
  right: 0
};

rangeInit();
function rangeInit() {
  leftHandleInfo = {
    name: 'left',
    otherHandleElement: rightHandleElement,
    rangePriceElement: rangePriceMinElement,
    position: getComputedStyle(leftHandleElement).left.slice(0, -2),
    minPosition: minRangePosition,
  };

  rightHandleInfo = {
    name: 'right',
    otherHandleElement: leftHandleElement,
    rangePriceElement: rangePriceMaxElement,
    position: getComputedStyle(rightHandleElement).left.slice(0, -2),
    maxPosition: maxRangePosition
  };
}

function addListenersOnRangeElement() {
  leftHandleElement.addEventListener('mousedown', onMouseDown);
  rightHandleElement.addEventListener('mousedown', onMouseDown);
}

function onMouseDown(evt) {
  var handleElement = evt.target;

  if (handleElement.classList.contains('range__btn--left')) {
    handleInfo = leftHandleInfo;
    handleInfo.maxPosition = rightHandleInfo.position;
  } else if (handleElement.classList.contains('range__btn--right')) {
    handleInfo = rightHandleInfo;
    handleInfo.minPosition = leftHandleInfo.position;
  }

  handleInfo.handleElement = handleElement;
  handleInfo.initialPosition = evt.clientX;
  handleInfo.otherHandleElement.style.zIndex = 50;
  handleInfo.handleElement.style.zIndex = 100;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(evt) {
  var shift = evt.clientX - handleInfo.initialPosition;
  var newPosition = handleInfo.handleElement.offsetLeft + shift;
  handleInfo.initialPosition = evt.clientX;

  if (newPosition < handleInfo.minPosition) {
    newPosition = handleInfo.minPosition;
  } else if (newPosition > handleInfo.maxPosition) {
    newPosition = handleInfo.maxPosition;
  }

  handleInfo.handleElement.style.left = newPosition + 'px';
  handleInfo.position = newPosition;

  var newCenterCoordinate = newPosition + handleHalfWidth;
  var centerCoordinateOnMaxRange = maxRangePosition + handleHalfWidth;
  var percentHandlePosition = Math.round(
      newCenterCoordinate / centerCoordinateOnMaxRange * 100
  );

  handleInfo.rangePriceElement.textContent = percentHandlePosition;

  if (handleInfo.name === 'left') {
    rangeLine.style.left = newCenterCoordinate + 'px';
    handlesPercentPosition.left = percentHandlePosition;

  } else if (handleInfo.name === 'right') {
    rangeLine.style.right = (maxRangePosition - newPosition) + 'px';
    handlesPercentPosition.right = percentHandlePosition;
  }
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

function addListenerOnOrderElement() {
  orderElement.addEventListener('change', function (evt) {

    if (evt.target.classList.contains('toggle-btn__input')) {
      switchTabsInOrderElement(evt.target.id);
    }

    switch (evt.target.id) {
      case 'payment__card-number':
        checkCardNumberField(evt.target);
        break;

      case 'payment__card-date':
        checkCardDateField(evt.target);
        break;
    }

    if (checkOnCardField(evt.target.id) && checkCardFieldsOnValid()) {
      cardStatusElement.textContent = 'Одобрен';
    }

    if (evt.target.name === 'store') {
      changeStoreMap(evt.target.value);
    }

  });

  orderElement.addEventListener('input', function (evt) {
    switch (evt.target.id) {
      case 'payment__card-number':
        limitLengthOfinputElementValue(evt.target, CARD_CODE_LENGTH);
        break;

      case 'payment__card-cvc':
        limitLengthOfinputElementValue(evt.target, CVC_LENGTH);
        break;

      case 'payment__card-date':
        filterCardDateField(evt.target);
        break;

      case 'payment__cardholder':
        filterCardHolderField(evt.target);
        break;
    }
  });

  orderElement.addEventListener('keydown', function (evt) {
    if (evt.target.id === 'payment__card-number'
        || evt.target.id === 'payment__card-cvc') {
      disableInputModificationsByArrows(evt);
    }
  });

  orderElement.addEventListener('wheel', function (evt) {
    if (evt.target.id === 'payment__card-number'
        || evt.target.id === 'payment__card-cvc') {
      disableInputModificationsByMouseWeel(evt);
    }
  });
}

function checkOnCardField(id) {
  for (var i = 0; i < paymentFieldElements.length; i++) {
    if (paymentFieldElements[i].id === id) {
      return true;
    }
  }

  return false;
}

function checkCardFieldsOnValid() {
  for (var i = 0; i < paymentFieldElements.length; i++) {
    if (!paymentFieldElements[i].validity.valid) {
      return false;
    }
  }

  return true;
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

function limitLengthOfinputElementValue(element, maxLength) {
  if (element.value.length > maxLength) {
    element.value = element.value.substring(0, maxLength);
  }
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

function disableInputModificationsByArrows(evt) {
  if (evt.keyCode === UP_KEYCODE || evt.keyCode === DOWN_KEYCODE) {
    evt.preventDefault();
  }
}

function disableInputModificationsByMouseWeel(evt) {
  evt.preventDefault();
  var scrollTo = document.documentElement.scrollTop - evt.wheelDelta;
  document.documentElement.scrollTop = scrollTo;
}

function disableOrderFieldsInHidedTab() {
  deliveryRequestElement.disabled = true;
}

function setOrderFieldsState() {
  var flag = productsInBasketInfo.length ? false : true;

  setElementsDisabledState(contactFieldElements, flag);

  setElementsDisabledState(paymentTabSwitchElements, flag);

  if (paymentCardSwitchElement.checked) {
    setElementsDisabledState(paymentFieldElements, flag);
  }

  setElementsDisabledState(deliveryTabSwitchElements, flag);

  var element = deliveryStoreSwitchElement.checked
    ? deliveryStoresElement
    : deliveryRequestElement;

  element.disabled = flag;
  orderSubmitElement.disabled = flag;
}

function setElementsDisabledState(elements, flag) {
  elements.forEach(function (item) {
    item.disabled = flag;
  });
}

function renderCatalog() {
  productsInCatalogInfo = getRandomProductsInfo(CATALOG_CARDS_COUNT);
  var fragmentWithCatalogCards =
    getFragmentWithCards(productsInCatalogInfo, createCatalogCardElement);
  catalogElement.classList.remove('catalog__cards--load');
  catalogLoadElement.classList.add('visually-hidden');
  catalogElement.appendChild(fragmentWithCatalogCards);
  catalogCardsElements = catalogElement.querySelectorAll('.catalog__card');
}

function getRandomProductsInfo(count) {
  var randomProducts = [];
  for (var i = 0; i < count; i++) {
    randomProducts.push(getOneRandomProductInfo());
  }
  return randomProducts;
}

function getOneRandomProductInfo() {
  return {
    name: getRandomUniqueArrayElement(PRODUCT_NAMES),
    picture: PRODUCTS_PICTURES_PATH
      + getRandomUniqueArrayElement(PRODUCT_PICTURES),
    amount: getRandomInRange(0, 20),
    price: getRandomInRange(100, 1500),
    weight: getRandomInRange(30, 300),
    rating: {
      value: getRandomInRange(1, 5),
      number: getRandomInRange(10, 900)
    },
    nutritionFacts: {
      sugar: getRandomBool(),
      energy: getRandomInRange(70, 500)
    },
    contents: generateComposition()
  };
}

function generateComposition() {
  var availableIngredients = PRODUCT_INGREDIENTS.slice();
  var countElementsToCut = getRandomInRange(0, availableIngredients.length - 1);

  for (var i = 0; i < countElementsToCut; i++) {
    var randomIndex = getRandomInRange(0, availableIngredients.length - 1);
    availableIngredients.splice(randomIndex, 1);
  }

  return availableIngredients.join(', ');
}

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

function getFragmentWithCards(data, makeCard) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(makeCard(data[i], i));
  }

  return fragment;
}

function createCatalogCardElement(product) {
  var newCatalogCard = catalogCardTemplateElement.cloneNode(true);
  var cardTitleElement = newCatalogCard.querySelector('.card__title');
  var cardImageElement = newCatalogCard.querySelector('.card__img');
  var cardPriceElement = newCatalogCard.querySelector('.card__price');
  var cardWeightElement = cardPriceElement.querySelector('.card__weight');
  var starCountElement = newCatalogCard.querySelector('.star__count');
  var characteristicElement =
    newCatalogCard.querySelector('.card__characteristic');
  var composition = newCatalogCard.querySelector('.card__composition-list');
  var ratingElement = newCatalogCard.querySelector('.stars__rating');

  cardTitleElement.textContent = product.name;
  cardImageElement.src = product.picture;
  cardImageElement.alt = product.name;
  cardPriceElement.firstChild.data = product.price + ' ';
  cardWeightElement.textContent = '/ ' + product.weight + ' Г';
  ratingElement.textContent =
    'Рейтинг: ' + product.rating.value + ' звезд'
    + getStarEnding(product.rating.value);
  starCountElement.textContent = '(' + product.rating.number + ')';
  characteristicElement.textContent =
    getSugarStatusString(product.nutritionFacts.sugar)
    + product.nutritionFacts.energy + ' ккал';
  composition.textContent = product.contents;
  setAmountClass(newCatalogCard, product.amount);
  setRatingClass(ratingElement, product.rating.value);
  addListenerOnCatalogCardElement(newCatalogCard);

  return newCatalogCard;
}

function getStarEnding(number) {
  var ending = null;

  if (number === 1) {
    ending = 'а';
  } else if (number > 1 && number < 5) {
    ending = 'ы';
  }

  return ending;
}

function setRatingClass(element, productRating) {
  var className = null;

  switch (productRating) {
    case 1:
      className = 'stars__rating--one';
      break;
    case 2:
      className = 'stars__rating--two';
      break;
    case 3:
      className = 'stars__rating--three';
      break;
    case 4:
      className = 'stars__rating--four';
      break;
    case 5:
      className = 'stars__rating--five';
      break;
  }

  element.classList.remove('stars__rating--five');// fix error in template
  if (className) {
    element.classList.add(className);
  }
}

function getSugarStatusString(flag) {
  return flag ? 'Содержит сахар. ' : 'Без сахара. ';
}

function addListenerOnCatalogCardElement(catalogCardElement) {
  catalogCardElement.addEventListener('click', function (evt) {

    if (evt.target.classList.contains('card__btn-favorite')) {
      evt.preventDefault();
      toggleFavoriteButton(evt.target);
    }

    if (evt.target.classList.contains('card__btn')) {
      evt.preventDefault();
      addProductToBasket(evt.currentTarget);
    }

  });
}

function toggleFavoriteButton(button) {
  button.classList.toggle('card__btn-favorite--selected');
}

function addProductToBasket(catalogCardElement) {
  var title = catalogCardElement.querySelector('.card__title').textContent;
  var catalogProductInfo = getProductInfo(title, productsInCatalogInfo);

  if (catalogProductInfo.amount) {
    var basketProductInfo = getProductInfo(title, productsInBasketInfo)
      || createBasketProductInfo(catalogProductInfo);

    catalogProductInfo.amount--;
    basketProductInfo.orderedAmount++;

    var action = basketProductInfo.isNew ? 'add' : 'pointChange';
    delete basketProductInfo.isNew;
    renderDOMChanges(title, action);
  }
}

function createBasketProductInfo(catalogProductInfo) {
  var basketProductInfo = Object.assign({}, catalogProductInfo);

  delete basketProductInfo.contents;
  delete basketProductInfo.nutritionFacts;
  delete basketProductInfo.rating;
  delete basketProductInfo.weight;
  basketProductInfo.orderedAmount = 0;
  basketProductInfo.isNew = true;
  productsInBasketInfo.push(basketProductInfo);

  return basketProductInfo;
}

function renderBasketCardElement(basketProductInfo) {
  var newBasketCardElement = createBasketCardElement(basketProductInfo);

  basketElement.appendChild(newBasketCardElement);
  basketCardsElements = basketElement.querySelectorAll('.goods_card');
}

function createBasketCardElement(basketProductInfo) {
  var newBasketCard = basketCardTemplateElement.cloneNode(true);
  var cardTitle = newBasketCard.querySelector('.card-order__title');
  var cardImage = newBasketCard.querySelector('.card-order__img');
  var cardPrice = newBasketCard.querySelector('.card-order__price');
  var cardOrderCount = newBasketCard.querySelector('.card-order__count');

  cardTitle.textContent = basketProductInfo.name;
  cardImage.src = basketProductInfo.picture;
  cardImage.alt = basketProductInfo.name;
  cardPrice.textContent = basketProductInfo.price + ' ' + CURRENCY_SIGN;
  cardOrderCount.value = basketProductInfo.orderedAmount;
  cardOrderCount.min = 0;
  cardOrderCount.max = basketProductInfo.amount;
  addListenersOnBasketCard(newBasketCard);

  return newBasketCard;
}

function addListenersOnBasketCard(baskedCardElement) {
  baskedCardElement.addEventListener('click', function (evt) {

    if (evt.target.classList.contains('card-order__btn--increase')) {
      changeBasketProductInfoAmount(evt.currentTarget, 'increase');
    }

    if (evt.target.classList.contains('card-order__btn--decrease')) {
      changeBasketProductInfoAmount(evt.currentTarget, 'decrease');
    }

    if (evt.target.classList.contains('card-order__close')) {
      evt.preventDefault();
      deleteBasketProduct(evt.currentTarget);
    }

  });

  baskedCardElement.addEventListener('input', function (evt) {
    if (evt.target.classList.contains('card-order__count')) {
      setBasketProductInfoAmount(evt.currentTarget, evt.target);
    }
  });
}

function setBasketProductInfoAmount(basketCardElement, cardOrderCount) {
  var title = basketCardElement.querySelector('.card-order__title').textContent;
  var catalogProductInfo = getProductInfo(title, productsInCatalogInfo);
  var basketProductInfo = getProductInfo(title, productsInBasketInfo);
  var sumAllAvailableProduct =
    catalogProductInfo.amount + basketProductInfo.orderedAmount;

  cardOrderCount.value =
    normalizeOrderCountValue(cardOrderCount.value, sumAllAvailableProduct);

  if (cardOrderCount.value === '0') {
    deleteBasketProduct(basketCardElement);
  } else {
    var difference = cardOrderCount.value - basketProductInfo.orderedAmount;
    changeBasketProductInfoAmount(basketCardElement, 'change', difference);
  }
}

function normalizeOrderCountValue(value, maxValue) {
  if (value > maxValue) {
    value = maxValue;
  } else if (value < 0) {
    value = 0;
  }
  return value;
}

function changeBasketProductInfoAmount(basketCardElement, action, value) {
  var title = basketCardElement.querySelector('.card-order__title').textContent;
  var basketProductInfo = getProductInfo(title, productsInBasketInfo);
  var catalogProductInfo = getProductInfo(title, productsInCatalogInfo);

  if (action === 'increase' && catalogProductInfo.amount > 0) {
    catalogProductInfo.amount--;
    basketProductInfo.orderedAmount++;
    renderDOMChanges(title, 'pointChange');
  } else if (action === 'decrease' && basketProductInfo.orderedAmount > 1) {
    basketProductInfo.orderedAmount--;
    catalogProductInfo.amount++;
    renderDOMChanges(title, 'pointChange');
  } else if (action === 'decrease' && basketProductInfo.orderedAmount <= 1) {
    deleteBasketProduct(basketCardElement);
  } else if (action === 'change' && Number.isInteger(value)) {
    catalogProductInfo.amount -= value;
    basketProductInfo.orderedAmount += value;
    renderDOMChanges(title);
  }
}

function deleteBasketProduct(basketCardElement) {
  var title = basketCardElement.querySelector('.card-order__title').textContent;
  var catalogProductInfo = getProductInfo(title, productsInCatalogInfo);
  var basketProductInfo = getProductInfo(title, productsInBasketInfo);
  var basketProductIndex = getProductInfoIndex(title, productsInBasketInfo);

  catalogProductInfo.amount += basketProductInfo.orderedAmount;
  productsInBasketInfo.splice(basketProductIndex, 1);
  renderDOMChanges(title, 'delete');
}

function renderDOMChanges(name, flag) {
  var catalogCardElement = getCatalogCardElement(name);
  var basketCardElement = getBasketCardElement(name);
  var catalogProductInfo = getProductInfo(name, productsInCatalogInfo);
  var basketProductInfo = getProductInfo(name, productsInBasketInfo);

  setAmountClass(catalogCardElement, catalogProductInfo.amount);
  setHeaderBasketElementText();

  switch (flag) {
    case 'add':
      setBasketEmptyMessage(productsInBasketInfo.length);
      renderBasketCardElement(basketProductInfo);
      setOrderFieldsState();
      break;

    case 'pointChange':
      setBasketCardElementAmount(basketProductInfo);
      break;

    case 'delete':
      basketCardElement.remove();
      setBasketEmptyMessage(productsInBasketInfo.length);
      setOrderFieldsState();
      break;
  }
}

function getProductInfo(name, productsInfo) {
  for (var i = 0; i < productsInfo.length; i++) {
    if (productsInfo[i].name === name) {
      return productsInfo[i];
    }
  }
  return null;
}

function getProductInfoIndex(name, products) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].name === name) {
      return i;
    }
  }
  return null;
}

function getCatalogCardElement(name) {
  for (var i = 0; i < catalogCardsElements.length; i++) {
    if (catalogCardsElements[i].querySelector('.card__title')
                                       .textContent === name) {
      return catalogCardsElements[i];
    }
  }
  return null;
}

function setBasketEmptyMessage(productsCount) {
  if (productsCount === 1) {
    goodsCardEmptyElement.classList.add('visually-hidden');
    basketElement.classList.remove('goods__cards--empty');
  } else if (!productsCount) {
    goodsCardEmptyElement.classList.remove('visually-hidden');
    basketElement.classList.add('goods__cards--empty');
  }
}

function setBasketCardElementAmount(basketProductInfo) {
  var basketCardElement = getBasketCardElement(basketProductInfo.name);
  basketCardElement.querySelector('.card-order__count')
    .value = basketProductInfo.orderedAmount;
}

function getBasketCardElement(name) {
  for (var i = 0; i < basketCardsElements.length; i++) {
    if (basketCardsElements[i].querySelector('.card-order__title')
                                            .textContent === name) {
      return basketCardsElements[i];
    }
  }
  return null;
}

function setAmountClass(catalogCard, amount) {
  if (amount >= 1 && amount <= 5) {
    catalogCard.classList.remove('card--soon');
    catalogCard.classList.remove('card--in-stock');
    catalogCard.classList.add('card--little');
  } else if (amount > 5) {
    catalogCard.classList.remove('card--soon');
    catalogCard.classList.remove('card--little');
    catalogCard.classList.add('card--in-stock');
  } else {
    catalogCard.classList.remove('card--little');
    catalogCard.classList.remove('card--in-stock');
    catalogCard.classList.add('card--soon');
  }
}

function setHeaderBasketElementText() {
  var message = 'В корзине ничего нет';
  if (productsInBasketInfo.length) {
    var productsCount = 0;
    var totalPrice = 0;

    for (var i = 0; i < productsInBasketInfo.length; i++) {
      productsCount += productsInBasketInfo[i].orderedAmount;
      var totalPositionPrice = productsInBasketInfo[i].orderedAmount
        * productsInBasketInfo[i].price;
      totalPrice += totalPositionPrice;

    }
    message = 'В корзине ' + productsCount
      + ' товар' + getProductEnding(productsCount)
      + ' на сумму ' + totalPrice + ' ' + CURRENCY_SIGN;
  }
  mainHeaderBasketElement.textContent = message;
}

function getProductEnding(productCount) {
  var ending = '';

  if (productCount > 1 && productCount < 5) {
    ending = 'а';
  } else if (productCount >= 5) {
    ending = 'ов';
  }

  return ending;
}

