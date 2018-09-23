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
  'Корманный портвейн',
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
  'Бескоечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычёк'
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
  'ароматизатор дуба, идентичный натуарльному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбит калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо'
];
var PRODUCTS_PICTURES_PATH = 'img/cards/';
var CATALOG_CARDS_COUNT = 26;
var CURRENCY_SIGN = '₽';

var catalogCardTemplate = document.querySelector('#card')
    .content.querySelector('.catalog__card');
var basketCardTemplate = document.querySelector('#card-order')
    .content.querySelector('.goods_card');
var catalog = document.querySelector('.catalog__cards');
var catalogLoad = catalog.querySelector('.catalog__load');
var basket = document.querySelector('.goods__cards');
var goodsCardEmpty = basket.querySelector('.goods__card-empty');
var mainHeaderBasketLink = document.querySelector('.main-header__basket');
var productsInCatalog = getRandomProducts(CATALOG_CARDS_COUNT);
var productsInBasket = [];
var payment = document.querySelector('.payment');
var paymentCardTab = payment.querySelector('.payment__card-wrap');
var paymentCashTab = payment.querySelector('.payment__cash-wrap');
var deliver = document.querySelector('.deliver');
var deliverStore = deliver.querySelector('.deliver__store');
var deliverCourier = deliver.querySelector('.deliver__courier');
var slider = document.querySelector('.range');
var rangeButtons = slider.querySelectorAll('.range__btn');
var rangePriceMin = slider.querySelector('.range__price--min');
var rangePriceMax = slider.querySelector('.range__price--max');

renderCatalog();

var catalogCards = catalog.querySelectorAll('.catalog__card');
addListenersOnEachFavoritButtonInCatalog();
addListenersOnEachCardInCatalog();
addListenerOnPaymentButtons();
addListenerOnDeliverButtons();
addListenersOnSlider();

function renderCatalog() {
  catalog.classList.remove('catalog__cards--load');
  catalogLoad.classList.add('visually-hidden');
  var fragmentWithCatalogCards =
    getFragmentWithCards(productsInCatalog, makeCatalogCard);
  catalog.appendChild(fragmentWithCatalogCards);
}

function addListenersOnEachFavoritButtonInCatalog() {
  var favoriteButtons = catalog.querySelectorAll('.card__btn-favorite');

  for (var i = 0; i < favoriteButtons.length; i++) {
    favoriteButtons[i].addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.target.classList.toggle('card__btn-favorite--selected');
    });
  }
}

function addListenersOnEachCardInCatalog() {
  for (var i = 0; i < catalogCards.length; i++) {
    catalogCards[i].addEventListener('click', function (evt) {
      if (evt.target.classList.contains('card__btn')) {
        evt.preventDefault();
        var currentCard = evt.currentTarget;
        var cardTitle = currentCard.querySelector('.card__title').textContent;
        var product = getProductByName(cardTitle, productsInCatalog);

        if (product.amount) {
          addProductToBasket(product);
          product.amount--;
          setAmountClass(currentCard, product.amount);
          setHeaderBasketLinkMessage();
          renderBasket();
        }
      }
    });
  }
}

function addListenerOnPaymentButtons() {
  payment.addEventListener('change', function (evt) {
    if (evt.target.classList.contains('toggle-btn__input')) {
      if (evt.target.id === 'payment__cash') {
        paymentCardTab.classList.add('visually-hidden');
        paymentCashTab.classList.remove('visually-hidden');
      } else {
        paymentCardTab.classList.remove('visually-hidden');
        paymentCashTab.classList.add('visually-hidden');
      }
    }
  });
}

function addListenerOnDeliverButtons() {
  deliver.addEventListener('change', function (evt) {
    if (evt.target.classList.contains('toggle-btn__input')) {
      if (evt.target.id === 'deliver__courier') {
        deliverStore.classList.add('visually-hidden');
        deliverCourier.classList.remove('visually-hidden');
      } else {
        deliverStore.classList.remove('visually-hidden');
        deliverCourier.classList.add('visually-hidden');
      }
    }
  });
}

function addListenersOnSlider() {
  for (var i = 0; i < rangeButtons.length; i++) {
    rangeButtons[i].style.zIndex = 100; // fix for left pin
    rangeButtons[i].addEventListener('mouseup', function (evt) {
      if (evt.target.classList.contains('range__btn--left')) {
        evt.target.style.left = '30%';
        rangePriceMin.textContent = evt.target.style.left.slice(0, -1);
      } else {
        evt.target.style.left = '70%';
        rangePriceMax.textContent = evt.target.style.left.slice(0, -1);
      }
    });
  }
}

function addProductToBasket(product) {
  var basketProduct = getProductByName(product.name, productsInBasket);
  if (basketProduct) {
    basketProduct.orderedAmount++;
    basketProduct.alreadyOrdered = basketProduct.orderedAmount;
  } else {
    basketProduct = Object.assign({}, product);
    delete basketProduct.contents;
    delete basketProduct.nutritionFacts;
    delete basketProduct.rating;
    delete basketProduct.weight;
    basketProduct.orderedAmount = 1;
    basketProduct.alreadyOrdered = basketProduct.orderedAmount;
    productsInBasket.push(basketProduct);
  }
}

function renderBasket() {
  removeAllCardsInBasket();
  checkBasketMessage();
  addCardsToBasket();
  addListenersOnEachCardInBasket();
}

function removeAllCardsInBasket() {
  var cardsInBasket = basket.querySelectorAll('.goods_card');
  if (cardsInBasket.length) {
    for (var i = 0; i < cardsInBasket.length; i++) {
      cardsInBasket[i].remove();
    }
  }
}

function checkBasketMessage() {
  if (productsInBasket.length) {
    basket.classList.remove('goods__cards--empty');
    goodsCardEmpty.classList.add('visually-hidden');
  } else {
    basket.classList.add('goods__cards--empty');
    goodsCardEmpty.classList.remove('visually-hidden');
  }
}

function addCardsToBasket() {
  var fragmentWithProductsForBasket =
    getFragmentWithCards(productsInBasket, makeBasketCard);
  basket.appendChild(fragmentWithProductsForBasket);
}

function addListenersOnEachCardInBasket() {
  var cardsInBasket = basket.querySelectorAll('.goods_card');
  for (var i = 0; i < cardsInBasket.length; i++) {

    cardsInBasket[i].addEventListener('click', function (evt) {
      if (evt.target.classList.contains('card-order__btn--decrease')) {
        var cardTitle =
          evt.currentTarget.querySelector('.card-order__title').textContent;
        var basketProduct = getProductByName(cardTitle, productsInBasket);
        var catalogProduct = getProductByName(cardTitle, productsInCatalog);
        var catalogCard = getCatalogCardByName(cardTitle);

        if (basketProduct.orderedAmount > 1) {
          basketProduct.orderedAmount--;
          basketProduct.alreadyOrdered = basketProduct.orderedAmount;
          catalogProduct.amount++;
        } else {
          deleteProductFromBasket(cardTitle);
        }
        setAmountClass(catalogCard, catalogProduct.amount);
        setHeaderBasketLinkMessage();
        renderBasket();
      }
    });

    cardsInBasket[i].addEventListener('click', function (evt) {
      if (evt.target.classList.contains('card-order__btn--increase')) {
        var cardTitle =
          evt.currentTarget.querySelector('.card-order__title').textContent;
        var catalogProduct = getProductByName(cardTitle, productsInCatalog);
        var basketProduct = getProductByName(cardTitle, productsInBasket);
        var catalogCard = getCatalogCardByName(cardTitle);

        if (catalogProduct.amount > 0) {
          catalogProduct.amount--;
          basketProduct.orderedAmount++;
          basketProduct.alreadyOrdered = basketProduct.orderedAmount;
          setAmountClass(catalogCard, catalogProduct.amount);
          setHeaderBasketLinkMessage();
          renderBasket();
        }
      }
    });

    cardsInBasket[i].addEventListener('click', function (evt) {
      if (evt.target.classList.contains('card-order__close')) {
        evt.preventDefault();
        var cardTitle =
          evt.currentTarget.querySelector('.card-order__title').textContent;
        var catalogProduct = getProductByName(cardTitle, productsInCatalog);
        var catalogCard = getCatalogCardByName(cardTitle);

        deleteProductFromBasket(cardTitle);
        setAmountClass(catalogCard, catalogProduct.amount);
        setHeaderBasketLinkMessage();
        renderBasket();
      }
    });

    cardsInBasket[i].addEventListener('input', function (evt) {
      if (evt.target.classList.contains('card-order__count')) {
        var cardTitle =
          evt.currentTarget.querySelector('.card-order__title').textContent;
        var basketProduct = getProductByName(cardTitle, productsInBasket);
        var catalogProduct = getProductByName(cardTitle, productsInCatalog);
        var sumAvailableAndInBasket =
          catalogProduct.amount + basketProduct.orderedAmount;
        var catalogCard = getCatalogCardByName(cardTitle);

        if (evt.target.value > sumAvailableAndInBasket) {
          evt.target.value = sumAvailableAndInBasket;
        } else if (evt.target.value < 0) {
          evt.target.value = 0;
        }

        var difference = evt.target.value - basketProduct.alreadyOrdered;
        catalogProduct.amount -= difference;
        basketProduct.orderedAmount += difference;
        basketProduct.alreadyOrdered = basketProduct.orderedAmount;

        setAmountClass(catalogCard, catalogProduct.amount);
        setHeaderBasketLinkMessage();
        if (evt.target.value === '0') {
          deleteProductFromBasket(cardTitle);
          renderBasket();
        }
      }
    });

  }
}

function deleteProductFromBasket(cardTitle) {
  var catalogProduct = getProductByName(cardTitle, productsInCatalog);
  var basketProduct = getProductByName(cardTitle, productsInBasket);
  var basketProductIndex = getProductIndexByName(cardTitle, productsInBasket);

  catalogProduct.amount += basketProduct.orderedAmount;
  productsInBasket.splice(basketProductIndex, 1);
}

function getProductByName(name, products) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].name === name) {
      return products[i];
    }
  }
  return false;
}

function getProductIndexByName(name, products) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].name === name) {
      return i;
    }
  }
  return false;
}

function getCatalogCardByName(name) {
  for (var i = 0; i < catalogCards.length; i++) {
    if (catalogCards[i].querySelector('.card__title').textContent === name) {
      return catalogCards[i];
    }
  }
  return false;
}

function setHeaderBasketLinkMessage() {
  var message = 'В корзине ничего нет';
  if (productsInBasket.length) {
    var productsCount = 0;
    var totalPrice = 0;

    for (var i = 0; i < productsInBasket.length; i++) {
      productsCount += productsInBasket[i].orderedAmount;
      var totalPositionPrice = productsInBasket[i].orderedAmount
        * productsInBasket[i].price;
      totalPrice += totalPositionPrice;

    }
    message = 'В корзине ' + productsCount
      + ' товар' + getEndingForProductWord(productsCount)
      + ' на сумму ' + totalPrice + ' ' + CURRENCY_SIGN;
  }
  mainHeaderBasketLink.textContent = message;
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

function getRandomProducts(count) {
  var randomProducts = [];
  for (var i = 0; i < count; i++) {
    randomProducts.push(getOneRandomProduct());
  }
  return randomProducts;
}

function getOneRandomProduct() {
  var newRandomProduct = {};
  newRandomProduct.name = getRandomUniqueArrayElement(PRODUCT_NAMES);
  newRandomProduct.picture = PRODUCTS_PICTURES_PATH
    + getRandomArrayElement(PRODUCT_PICTURES);
  newRandomProduct.amount = getRandomInRange(0, 20);
  newRandomProduct.price = getRandomInRange(100, 1500);
  newRandomProduct.weight = getRandomInRange(30, 300);
  newRandomProduct.rating = {};
  newRandomProduct.rating.value = getRandomInRange(1, 5);
  newRandomProduct.rating.number = getRandomInRange(10, 900);
  newRandomProduct.nutritionFacts = {};
  newRandomProduct.nutritionFacts.sugar = getRandomBool();
  newRandomProduct.nutritionFacts.energy = getRandomInRange(70, 500);
  newRandomProduct.contents = generateComposition();

  return newRandomProduct;
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

function makeCatalogCard(product) {
  var newCatalogCard = catalogCardTemplate.cloneNode(true);

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

  return newCatalogCard;
}

function setAmountClass(catalogCard, amount) {
  switch (true) {
    case amount >= 1 && amount <= 5:
      catalogCard.classList.remove('card--soon');
      catalogCard.classList.remove('card--in-stock');
      catalogCard.classList.add('card--little');
      break;
    case amount > 5:
      catalogCard.classList.remove('card--soon');
      catalogCard.classList.remove('card--little');
      catalogCard.classList.add('card--in-stock');
      break;
    default:
      catalogCard.classList.remove('card--little');
      catalogCard.classList.remove('card--in-stock');
      catalogCard.classList.add('card--soon');
  }
}

function getEndingForWordStar(number) {
  var ending = '';
  if (number === 1) {
    ending = 'а';
  } else if (number > 1 && number < 5) {
    ending = 'ы';
  }
  return ending;
}

function getClassOnRating(productRating) {
  var className = '';

  switch (productRating) {
    case 1:
      className = 'stars__rating-one';
      break;
    case 2:
      className = 'stars__rating-two';
      break;
    case 3:
      className = 'stars__rating-three';
      break;
    case 4:
      className = 'stars__rating-four';
      break;
    case 5:
      className = 'stars__rating-five';
      break;
  }

  return className;
}

function getSugarStatusString(flag) {
  return flag ? 'Содержит сахар. ' : 'Без сахара. ';
}

function makeBasketCard(product) {
  var newBasketCard = basketCardTemplate.cloneNode(true);
  var cardImage = newBasketCard.querySelector('.card-order__img');
  var cardOrderCount = newBasketCard.querySelector('.card-order__count');

  newBasketCard.querySelector('.card-order__title').textContent = product.name;
  cardImage.src = product.picture;
  cardImage.alt = product.name;
  newBasketCard.querySelector('.card-order__price').textContent =
    product.price + ' ' + CURRENCY_SIGN;
  cardOrderCount.value = product.orderedAmount;
  cardOrderCount.type = 'number';
  cardOrderCount.min = 0;
  cardOrderCount.max = product.amount;

  return newBasketCard;
}

