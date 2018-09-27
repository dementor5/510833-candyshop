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
    var basketCardIsRendered = false;
    var basketProductInfo = getProductInfo(title, productsInBasketInfo);

    if (basketProductInfo) {
      basketCardIsRendered = true;
    } else {
      basketProductInfo = createBasketProductInfo(catalogProductInfo);
      productsInBasketInfo.push(basketProductInfo);
    }

    catalogProductInfo.amount--;
    basketProductInfo.orderedAmount++;

    if (basketCardIsRendered) {
      renderDOMChanges(title, 'pointChange');
    } else {
      renderDOMChanges(title, 'add');
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
      changeBasketProductInfoAmount(evt.currentTarget, 'decreace');
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

  if (cardOrderCount.value > sumAllAvailableProduct) {
    cardOrderCount.value = sumAllAvailableProduct;
  } else if (cardOrderCount.value < 0) {
    cardOrderCount.value = 0;
  }

  if (cardOrderCount.value === '0') {
    deleteBasketProduct(basketCardElement);
  } else {
    var difference = cardOrderCount.value - basketProductInfo.orderedAmount;
    changeBasketProductInfoAmount(basketCardElement, difference);
  }
}

function changeBasketProductInfoAmount(basketCardElement, value) {
  var title = basketCardElement.querySelector('.card-order__title').textContent;
  var basketProductInfo = getProductInfo(title, productsInBasketInfo);
  var catalogProductInfo = getProductInfo(title, productsInCatalogInfo);

  switch (value) {
    case 'increase':
      if (catalogProductInfo.amount > 0) {
        catalogProductInfo.amount--;
        basketProductInfo.orderedAmount++;
        renderDOMChanges(title, 'pointChange');
      }
      break;

    case 'decreace':
      if (basketProductInfo.orderedAmount > 1) {
        basketProductInfo.orderedAmount--;
        catalogProductInfo.amount++;
        renderDOMChanges(title, 'pointChange');
      } else {
        deleteBasketProduct(basketCardElement);
      }
      break;

    default:
      catalogProductInfo.amount -= value;
      basketProductInfo.orderedAmount += value;
      renderDOMChanges(title);
      break;
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
      break;

    case 'pointChange':
      setBasketCardElementAmount(basketProductInfo);
      break;

    case 'delete':
      basketCardElement.remove();
      setBasketEmptyMessage(productsInBasketInfo.length);
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

