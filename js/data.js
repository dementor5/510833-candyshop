'use strict';

(function () {
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

  window.data = {
    getRandomProductsInfo: getRandomProductsInfo
  };

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
    var countElementsToCut =
      getRandomInRange(0, availableIngredients.length - 1);

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
})();
