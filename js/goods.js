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
var CATALOG_CARDS_COUNT = 26;
var CURRENCY_SIGN = '₽';

var catalogCardTemplateElement = document.querySelector('#card')
    .content.querySelector('.catalog__card');
var basketCardTemplateElement = document.querySelector('#card-order')
    .content.querySelector('.goods_card');
var catalogElement = document.querySelector('.catalog__cards');
var catalogLoadElement = catalogElement.querySelector('.catalog__load');
var orderFormElement = document.querySelector('.order_form');
var basketElement = orderFormElement.querySelector('.goods__cards');
var goodsCardEmptyElement = basketElement.querySelector('.goods__card-empty');
var mainHeaderBasketElement = document.querySelector('.main-header__basket');
var paymentCardElement = orderFormElement.querySelector('.payment__card-wrap');
var paymentCashElement = orderFormElement.querySelector('.payment__cash-wrap');
var deliverStoreElement = orderFormElement.querySelector('.deliver__store');
var deliverCourierElement = orderFormElement.querySelector('.deliver__courier');
var rangeElement = document.querySelector('.range');
var rangeButtonsElements = rangeElement.querySelectorAll('.range__btn');
var rangePriceMinElement = rangeElement.querySelector('.range__price--min');
var rangePriceMaxElement = rangeElement.querySelector('.range__price--max');

var productsInCatalogInfo = getRandomProductsInfo(CATALOG_CARDS_COUNT);
var productsInBasketInfo = [];
var catalogCardsElements = [];
var basketCardsElements = [];

renderCatalog();
addListenerOnOrderFormElement();
addListenersOnSlider();

function renderCatalog() {
  catalogElement.classList.remove('catalog__cards--load');
  catalogLoadElement.classList.add('visually-hidden');
  var fragmentWithCatalogCards =
    getFragmentWithCards(productsInCatalogInfo, createCatalogCardElement);
  catalogElement.appendChild(fragmentWithCatalogCards);
  catalogCardsElements = catalogElement.querySelectorAll('.catalog__card');
}

function addListenerOnOrderFormElement() {
  orderFormElement.addEventListener('change', function (evt) {
    if (evt.target.classList.contains('toggle-btn__input')) {
      switchTabsInOrderForm(evt.target.id);
    }
  });
}

function switchTabsInOrderForm(flag) {
  switch (flag) {
    case 'payment__card':
      paymentCashElement.classList.add('visually-hidden');
      paymentCardElement.classList.remove('visually-hidden');
      break;
    case 'payment__cash':
      paymentCardElement.classList.add('visually-hidden');
      paymentCashElement.classList.remove('visually-hidden');
      break;
    case 'deliver__store':
      deliverCourierElement.classList.add('visually-hidden');
      deliverStoreElement.classList.remove('visually-hidden');
      break;
    case 'deliver__courier':
      deliverStoreElement.classList.add('visually-hidden');
      deliverCourierElement.classList.remove('visually-hidden');
      break;
  }
}

function addListenersOnSlider() {
  for (var i = 0; i < rangeButtonsElements.length; i++) {
    rangeButtonsElements[i].addEventListener('mouseup', function (evt) {
      changeSliderButtonPosition(evt.target);
    });
  }
}

function changeSliderButtonPosition(button) {
  if (button.classList.contains('range__btn--left')) {
    button.style.left = '30%';
    rangePriceMinElement.textContent = button.style.left.slice(0, -1);
  } else {
    button.style.left = '70%';
    rangePriceMaxElement.textContent = button.style.left.slice(0, -1);
  }
}

function getRandomProductsInfo(count) {
  var randomProducts = [];
  for (var i = 0; i < count; i++) {
    randomProducts.push(getOneRandomProductInfo());
  }
  return randomProducts;
}

function getOneRandomProductInfo() {
  var newRandomProductInfo = {};
  newRandomProductInfo.name = getRandomUniqueArrayElement(PRODUCT_NAMES);
  newRandomProductInfo.picture = PRODUCTS_PICTURES_PATH
    + getRandomArrayElement(PRODUCT_PICTURES);
  newRandomProductInfo.amount = getRandomInRange(0, 20);
  newRandomProductInfo.price = getRandomInRange(100, 1500);
  newRandomProductInfo.weight = getRandomInRange(30, 300);
  newRandomProductInfo.rating = {};
  newRandomProductInfo.rating.value = getRandomInRange(1, 5);
  newRandomProductInfo.rating.number = getRandomInRange(10, 900);
  newRandomProductInfo.nutritionFacts = {};
  newRandomProductInfo.nutritionFacts.sugar = getRandomBool();
  newRandomProductInfo.nutritionFacts.energy = getRandomInRange(70, 500);
  newRandomProductInfo.contents = generateComposition();

  return newRandomProductInfo;
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

function getRandomArrayElement(array) {
  var min = 0;
  var max = array.length - 1;
  var randomIndex = getRandomInRange(min, max);
  return array[randomIndex];
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

  setAmountClass(newCatalogCard, product.amount);

  newCatalogCard.querySelector('.card__title').textContent = product.name;
  var cardImage = newCatalogCard.querySelector('.card__img');
  cardImage.src = product.picture;
  cardImage.alt = product.name;

  var cardPrice = newCatalogCard.querySelector('.card__price');
  cardPrice.firstChild.data = product.price + ' ';
  cardPrice.querySelector('.card__weight').textContent =
    '/ ' + product.weight + ' Г';

  var ratingElement = newCatalogCard.querySelector('.stars__rating');

  ratingElement.textContent =
    'Рейтинг: ' + product.rating.value + ' звезд'
    + getEndingForWordStar(product.rating.value);

  ratingElement.classList.remove('stars__rating--five');// fix error in template
  ratingElement.classList.add(getClassOnRating(product.rating.value));

  newCatalogCard.querySelector('.star__count').textContent =
    '(' + product.rating.number + ')';

  newCatalogCard.querySelector('.card__characteristic').textContent =
    getSugarStatusString(product.nutritionFacts.sugar)
    + product.nutritionFacts.energy + ' ккал';

  newCatalogCard.querySelector('.card__composition-list').textContent =
    product.contents;

  addListenerOnCatalogCardElement(newCatalogCard);

  return newCatalogCard;
}

function getEndingForWordStar(number) {
  var ending = null;

  if (number === 1) {
    ending = 'а';
  } else if (number > 1 && number < 5) {
    ending = 'ы';
  }

  return ending;
}

function getClassOnRating(productRating) {
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

  return className;
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
  var catalogCardTitle =
    catalogCardElement.querySelector('.card__title').textContent;
  var catalogProductInfo =
    getProductInfoByName(catalogCardTitle, productsInCatalogInfo);

  if (catalogProductInfo.amount) {
    var basketCardIsRendered = false;
    var basketProductInfo =
      getProductInfoByName(catalogProductInfo.name, productsInBasketInfo);

    if (basketProductInfo) {
      basketCardIsRendered = true;
    } else {
      basketProductInfo = createBasketProductInfo(catalogProductInfo);
      productsInBasketInfo.push(basketProductInfo);
    }

    catalogProductInfo.amount--;
    basketProductInfo.orderedAmount++;
    basketProductInfo.alreadyOrdered = basketProductInfo.orderedAmount;

    setAmountClass(catalogCardElement, catalogProductInfo.amount);
    setHeaderBasketElementText();

    if (!basketCardIsRendered) {
      renderBasketCardElement(basketProductInfo);
    } else {
      changeBasketCardElementOrderCountValue(basketProductInfo);
    }
  }
}

function createBasketProductInfo(catalogProductInfo) {
  var basketProductInfo = Object.assign({}, catalogProductInfo);

  delete basketProductInfo.contents;
  delete basketProductInfo.nutritionFacts;
  delete basketProductInfo.rating;
  delete basketProductInfo.weight;
  basketProductInfo.orderedAmount = 0;
  basketProductInfo.alreadyOrdered = basketProductInfo.orderedAmount;

  return basketProductInfo;
}

function renderBasketCardElement(basketProductInfo) {
  var newBasketCardElement = createBasketCardElement(basketProductInfo);

  if (productsInBasketInfo.length === 1) {
    hideBasketEmptyMessage();
  }

  basketElement.appendChild(newBasketCardElement);
  basketCardsElements = basketElement.querySelectorAll('.goods_card');
}

function createBasketCardElement(basketProductInfo) {
  var newBasketCard = basketCardTemplateElement.cloneNode(true);
  var cardImage = newBasketCard.querySelector('.card-order__img');
  var cardOrderCount = newBasketCard.querySelector('.card-order__count');

  newBasketCard.querySelector('.card-order__title').textContent =
    basketProductInfo.name;
  cardImage.src = basketProductInfo.picture;
  cardImage.alt = basketProductInfo.name;
  newBasketCard.querySelector('.card-order__price').textContent =
    basketProductInfo.price + ' ' + CURRENCY_SIGN;
  cardOrderCount.value = basketProductInfo.orderedAmount;
  cardOrderCount.min = 0;
  cardOrderCount.max = basketProductInfo.amount;
  addListenersOnBasketCard(newBasketCard);

  return newBasketCard;
}

function addListenersOnBasketCard(baskedCardElement) {
  baskedCardElement.addEventListener('click', function (evt) {

    if (evt.target.classList.contains('card-order__btn--decrease')) {
      reduceBasketProductInfoOrderedAmount(evt.currentTarget);
    }

    if (evt.target.classList.contains('card-order__btn--increase')) {
      increaseBasketProductInfoOrderedAmount(evt.currentTarget);
    }

    if (evt.target.classList.contains('card-order__close')) {
      evt.preventDefault();
      deleteBasketProduct(evt.currentTarget);
    }

  });

  baskedCardElement.addEventListener('input', function (evt) {
    if (evt.target.classList.contains('card-order__count')) {
      changeBasketProductInfoOrderAmount(evt.currentTarget, evt.target);
    }
  });
}

function reduceBasketProductInfoOrderedAmount(basketCardElement) {
  var basketCardElementTitle =
    basketCardElement.querySelector('.card-order__title').textContent;
  var basketProductInfo =
    getProductInfoByName(basketCardElementTitle, productsInBasketInfo);
  var catalogProductInfo =
    getProductInfoByName(basketCardElementTitle, productsInCatalogInfo);
  var catalogCardElement =
    getcatalogProductElementByName(basketCardElementTitle);

  if (basketProductInfo.orderedAmount > 1) {
    basketProductInfo.orderedAmount--;
    basketProductInfo.alreadyOrdered = basketProductInfo.orderedAmount;
    catalogProductInfo.amount++;
    changeBasketCardElementOrderCountValue(basketProductInfo);
  } else {
    deleteBasketProductInfo(basketCardElementTitle);
    deleteBasketProductElementByName(basketCardElementTitle);
  }

  setAmountClass(catalogCardElement, catalogProductInfo.amount);
  setHeaderBasketElementText();
}

function increaseBasketProductInfoOrderedAmount(basketCardElement) {
  var basketCardElementTitle =
    basketCardElement.querySelector('.card-order__title').textContent;
  var catalogProductInfo =
    getProductInfoByName(basketCardElementTitle, productsInCatalogInfo);
  var basketProductInfo =
    getProductInfoByName(basketCardElementTitle, productsInBasketInfo);
  var catalogCardElement =
    getcatalogProductElementByName(basketCardElementTitle);

  if (catalogProductInfo.amount > 0) {
    catalogProductInfo.amount--;
    basketProductInfo.orderedAmount++;
    basketProductInfo.alreadyOrdered = basketProductInfo.orderedAmount;
    changeBasketCardElementOrderCountValue(basketProductInfo);

    setAmountClass(catalogCardElement, catalogProductInfo.amount);
    setHeaderBasketElementText();
  }
}

function deleteBasketProduct(basketCardElement) {
  var basketCardElementTitle =
    basketCardElement.querySelector('.card-order__title').textContent;
  var catalogProductInfo =
    getProductInfoByName(basketCardElementTitle, productsInCatalogInfo);
  var catalogCardElement =
    getcatalogProductElementByName(basketCardElementTitle);

  deleteBasketProductInfo(basketCardElementTitle);
  deleteBasketProductElementByName(basketCardElementTitle);

  setAmountClass(catalogCardElement, catalogProductInfo.amount);
  setHeaderBasketElementText();

}

function changeBasketProductInfoOrderAmount(basketCardElement, cardOrderCount) {
  var basketCardElementTitle =
    basketCardElement.querySelector('.card-order__title').textContent;
  var catalogProductInfo =
    getProductInfoByName(basketCardElementTitle, productsInCatalogInfo);
  var basketProductInfo =
    getProductInfoByName(basketCardElementTitle, productsInBasketInfo);
  var sumAllAvailableProduct =
    catalogProductInfo.amount + basketProductInfo.orderedAmount;
  var catalogCardElement =
    getcatalogProductElementByName(basketCardElementTitle);

  if (cardOrderCount.value > sumAllAvailableProduct) {
    cardOrderCount.value = sumAllAvailableProduct;
  } else if (cardOrderCount.value < 0) {
    cardOrderCount.value = 0;
  }

  var difference = cardOrderCount.value - basketProductInfo.alreadyOrdered;
  catalogProductInfo.amount -= difference;
  basketProductInfo.orderedAmount += difference;
  basketProductInfo.alreadyOrdered = basketProductInfo.orderedAmount;

  if (cardOrderCount.value === '0') {
    deleteBasketProductInfo(basketCardElementTitle);
    deleteBasketProductElementByName(basketCardElementTitle);
  }

  setAmountClass(catalogCardElement, catalogProductInfo.amount);
  setHeaderBasketElementText();
}

function deleteBasketProductInfo(cardTitle) {
  var catalogProductInfo = getProductInfoByName(cardTitle, productsInCatalogInfo);
  var basketProductInfo = getProductInfoByName(cardTitle, productsInBasketInfo);
  var basketProductIndex =
    getProductInfoIndexByName(cardTitle, productsInBasketInfo);

  catalogProductInfo.amount += basketProductInfo.orderedAmount;
  productsInBasketInfo.splice(basketProductIndex, 1);
}

function deleteBasketProductElementByName(name) {
  getBasketCardByName(name).remove();
  if (!productsInBasketInfo.length) {
    showBasketEmptyMessage();
  }
}

function getProductInfoByName(name, productsInfo) {
  for (var i = 0; i < productsInfo.length; i++) {
    if (productsInfo[i].name === name) {
      return productsInfo[i];
    }
  }
  return null;
}

function getProductInfoIndexByName(name, products) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].name === name) {
      return i;
    }
  }
  return null;
}

function getcatalogProductElementByName(name) {
  for (var i = 0; i < catalogCardsElements.length; i++) {
    if (catalogCardsElements[i].querySelector('.card__title')
                                        .textContent === name) {
      return catalogCardsElements[i];
    }
  }
  return null;
}

function hideBasketEmptyMessage() {
  goodsCardEmptyElement.classList.add('visually-hidden');
  basketElement.classList.remove('goods__cards--empty');
}

function showBasketEmptyMessage() {
  goodsCardEmptyElement.classList.remove('visually-hidden');
  basketElement.classList.add('goods__cards--empty');
}

function changeBasketCardElementOrderCountValue(basketProductInfo) {
  var basketCardElement = getBasketCardByName(basketProductInfo.name);
  basketCardElement
    .querySelector('.card-order__count')
    .value = basketProductInfo.orderedAmount;
}

function getBasketCardByName(name) {
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
      + ' товар' + getEndingForProductWord(productsCount)
      + ' на сумму ' + totalPrice + ' ' + CURRENCY_SIGN;
  }
  mainHeaderBasketElement.textContent = message;
}

function getEndingForProductWord(productCount) {
  var ending = '';

  if (productCount > 1 && productCount < 5) {
    ending = 'а';
  } else if (productCount >= 5) {
    ending = 'ов';
  }

  return ending;
}

