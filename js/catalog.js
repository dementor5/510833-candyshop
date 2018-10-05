'use strict';

(function () {
  var CATALOG_CARDS_COUNT = 26;
  var CURRENCY_SIGN = '₽';

  var mainHeaderBasketElement = document.querySelector('.main-header__basket');

  var catalogElement = document.querySelector('.catalog__cards');
  var catalogLoadElement = catalogElement.querySelector('.catalog__load');

  var orderFormElement = window.util.orderFormElement;
  var basketElement = orderFormElement.querySelector('.goods__cards');
  var goodsCardEmptyElement = basketElement.querySelector('.goods__card-empty');

  var catalogCardTemplateElement = document.querySelector('#card')
      .content.querySelector('.catalog__card');
  var basketCardTemplateElement = document.querySelector('#card-order')
      .content.querySelector('.goods_card');

  var productsInCatalogInfo = [];
  var productsInBasketInfo = [];
  var catalogCardsElements = [];
  var basketCardsElements = [];

  var setOrderFieldsState = window.order.setOrderFieldsState;
  setOrderFieldsState(productsInBasketInfo);

  renderCatalog();

  function renderCatalog() {
    productsInCatalogInfo =
      window.data.getRandomProductsInfo(CATALOG_CARDS_COUNT);
    var fragmentWithCatalogCards =
      getFragmentWithCards(productsInCatalogInfo, createCatalogCardElement);
    catalogElement.classList.remove('catalog__cards--load');
    catalogLoadElement.classList.add('visually-hidden');
    catalogElement.appendChild(fragmentWithCatalogCards);
    catalogCardsElements = catalogElement.querySelectorAll('.catalog__card');
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
    var title =
      basketCardElement.querySelector('.card-order__title').textContent;
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
    var title =
      basketCardElement.querySelector('.card-order__title').textContent;
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
    var title =
      basketCardElement.querySelector('.card-order__title').textContent;
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
        setOrderFieldsState(productsInBasketInfo);
        break;

      case 'pointChange':
        setBasketCardElementAmount(basketProductInfo);
        break;

      case 'delete':
        basketCardElement.remove();
        setBasketEmptyMessage(productsInBasketInfo.length);
        setOrderFieldsState(setOrderFieldsState);
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
})();
