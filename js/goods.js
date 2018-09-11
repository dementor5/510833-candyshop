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
var CATALOG_ITEMS_COUNT = 26;
var BASKET_ITEMS_COUNT = 3;
var RUBLE_SIGN = '₽';
var CATALOG_ITEM_TEMPLATE = document.querySelector('#card')
    .content.querySelector('.catalog__card');
var BASKET_ITEM_TEMPLATE = document.querySelector('#card-order')
    .content.querySelector('.goods_card');

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(array) {
  var min = 0;
  var max = array.length - 1;
  var randomIndex = getRandomInRange(min, max);
  return array[randomIndex];
}

function getRandomBool() {
  return Boolean(getRandomInRange(0, 1));
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

function generateItemData() {
  var product = {};
  product.name = getRandomArrayElement(PRODUCT_NAMES);
  product.picture = PRODUCTS_PICTURES_PATH
    + getRandomArrayElement(PRODUCT_PICTURES);
  product.amount = getRandomInRange(0, 20);
  product.price = getRandomInRange(100, 1500);
  product.weight = getRandomInRange(30, 300);
  product.rating = {};
  product.rating.value = getRandomInRange(1, 5);
  product.rating.number = getRandomInRange(10, 900);
  product.nutritionFacts = {};
  product.nutritionFacts.sugar = getRandomBool();
  product.nutritionFacts.energy = getRandomInRange(70, 500);
  product.contents = generateComposition();

  return product;
}

function getProductsData(count) {
  var productsData = [];
  for (var i = 0; i < count; i++) {
    productsData.push(generateItemData());
  }
  return productsData;
}

function makeCatalogItem(itemData) {
  var item = CATALOG_ITEM_TEMPLATE.cloneNode(true);

  item.classList.remove('card--in-stock');// fix error in template
  if (itemData.amount > 5) {
    item.classList.add('card--in-stock');
  } else if (itemData.amount >= 1 && itemData.amount <= 5) {
    item.classList.add('card--little');
  } else {
    item.classList.add('card--soon');
  }

  item.querySelector('.card__title').textContent = itemData.name;
  var itemImage = item.querySelector('.card__img');
  itemImage.src = itemData.picture;
  itemImage.alt = itemData.name;

  var cardPrice = item.querySelector('.card__price');
  cardPrice.firstChild.data = itemData.price + ' ';
  cardPrice.querySelector('.card__weight').textContent =
    '/ ' + itemData.weight + ' Г';

  var ratingElement = item.querySelector('.stars__rating');

  var lastWord = ' звёзда';
  if (itemData.rating.value > 1 && itemData.rating.value < 5) {
    lastWord = ' звёзды';
  } else if (itemData.rating.value === 5) {
    lastWord = ' звёзд';
  }
  ratingElement.textContent =
    'Рейтинг: ' + itemData.rating.value + lastWord;

  ratingElement.classList.remove('stars__rating--five');// fix error in template
  if (itemData.rating.value === 1) {
    ratingElement.classList.add('stars__rating-one');
  } else if (itemData.rating.value === 2) {
    ratingElement.classList.add('stars__rating-two');
  } else if (itemData.rating.value === 3) {
    ratingElement.classList.add('stars__rating-three');
  } else if (itemData.rating.value === 4) {
    ratingElement.classList.add('stars__rating-four');
  } else if (itemData.rating.value === 5) {
    ratingElement.classList.add('stars__rating-five');
  }

  item.querySelector('.star__count').textContent =
    '(' + itemData.rating.number + ')';

  var sugarStatus = 'Без сахара. ';
  if (itemData.nutritionFacts.sugar) {
    sugarStatus = 'Содержит сахар. ';
  }
  item.querySelector('.card__characteristic').textContent =
    sugarStatus + itemData.nutritionFacts.energy + ' ккал';

  item.querySelector('.card__composition-list').textContent =
    itemData.contents;

  return item;
}

function makeBasketItem(itemData) {
  var item = BASKET_ITEM_TEMPLATE.cloneNode(true);

  item.querySelector('.card-order__title').textContent = itemData.name;
  var itemImage = item.querySelector('.card-order__img');
  itemImage.src = itemData.picture;
  itemImage.alt = itemData.name;
  item.querySelector('.card-order__price').textContent =
    itemData.price + ' ' + RUBLE_SIGN;

  return item;
}

function makePackOfElements(data, element) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(element(data[i]));
  }

  return fragment;
}

function renderCatalog() {
  var catalogCards = document.querySelector('.catalog__cards');
  catalogCards.classList.remove('catalog__cards--load');

  catalogCards.querySelector('.catalog__load')
    .classList.add('visually-hidden');

  var catalogItemsData = getProductsData(CATALOG_ITEMS_COUNT);
  var packOfCatalogItems =
    makePackOfElements(catalogItemsData, makeCatalogItem);

  catalogCards.appendChild(packOfCatalogItems);
}

function renderBasket() {
  var goodsCards = document.querySelector('.goods__cards');
  goodsCards.classList.remove('goods__cards--empty');

  goodsCards.querySelector('.goods__card-empty')
    .classList.add('visually-hidden');

  var basketItemsData = getProductsData(BASKET_ITEMS_COUNT);
  var packOfBasketItems = makePackOfElements(basketItemsData, makeBasketItem);

  goodsCards.appendChild(packOfBasketItems);
}

renderCatalog();
renderBasket();
