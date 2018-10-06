'use strict';

(function () {
  var CURRENCY_SIGN = '₽';
  var mainHeaderBasketElement = document.querySelector('.main-header__basket');
  var catalogElement = document.querySelector('.catalog__cards');
  var catalogLoadElement = catalogElement.querySelector('.catalog__load');
  var orderFormElement = window.order.getFormElement();
  var goodsCardsElement = orderFormElement.querySelector('.goods__cards');
  var goodsCardEmptyElement =
    goodsCardsElement.querySelector('.goods__card-empty');
  var goodsTotal = orderFormElement.querySelector('.goods__total');
  var goodsTotalCount = goodsTotal.querySelector('.goods__total-count');
  var goodsPrice = goodsTotalCount.querySelector('.goods__price');
  var catalogCardTemplateElement = document.querySelector('#card')
      .content.querySelector('.catalog__card');
  var basketCardTemplateElement = document.querySelector('#card-order')
      .content.querySelector('.goods_card');
  var productsInCatalogInfo = [];
  var productsInBasketInfo = [];
  var catalogCardsElements = [];
  var basketCardsElements = [];

  window.order.setFieldsState(productsInBasketInfo.length);
  renderCatalog();

  function addListenerOnCatalogCardElement(catalogCardElement) {
    catalogCardElement.addEventListener('click', function (evt) {

      if (evt.target.classList.contains('card__btn-favorite')) {
        evt.preventDefault();
        toggleFavoriteButton(evt.target);
      }

      if (evt.target.classList.contains('card__btn')) {
        evt.preventDefault();
        changeModelStructure(evt.currentTarget.dataset.name, 1);
      }

    });
  }

  function addListenersOnBasketCard(baskedCardElement) {
    baskedCardElement.addEventListener('click', function (evt) {
      var name = evt.currentTarget.dataset.name;

      if (evt.target.classList.contains('card-order__btn--increase')) {
        changeModelStructure(name, 1);
      }

      if (evt.target.classList.contains('card-order__btn--decrease')) {
        changeModelStructure(name, -1);
      }

      if (evt.target.classList.contains('card-order__close')) {
        evt.preventDefault();
        var amount = -getProductInfo(name, productsInBasketInfo).orderedAmount;
        changeModelStructure(name, amount);
      }
    });

    baskedCardElement.addEventListener('input', function (evt) {
      if (evt.target.classList.contains('card-order__count')
          && evt.target.value) {
        var name = evt.currentTarget.dataset.name;
        var difference = getDifference(name, evt.target);
        changeModelStructure(name, difference);
      }
    });
  }

  function renderCatalog() {
    productsInCatalogInfo = window.data.getRandomProductsInfo();
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

    newCatalogCard.dataset.name = product.name;
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

  function toggleFavoriteButton(button) {
    button.classList.toggle('card__btn-favorite--selected');
  }

  function changeModelStructure(title, value) {
    var catalogProductInfo = getProductInfo(title, productsInCatalogInfo);
    var basketProductInfo = getProductInfo(title, productsInBasketInfo)
      || createBasketProductInfo(catalogProductInfo);

    if (!catalogProductInfo.amount && value > 0) {
      return;
    }

    catalogProductInfo.amount -= value;
    basketProductInfo.orderedAmount += value;

    if (!basketProductInfo.orderedAmount) {
      var index = productsInBasketInfo.indexOf(basketProductInfo);
      productsInBasketInfo.splice(index, 1);
    }

    changeDOM(catalogProductInfo, basketProductInfo);
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

  function changeDOM(catalogProductInfo, basketProductInfo) {
    var name = catalogProductInfo.name;
    var catalogCardElement = getCardElement(name, catalogCardsElements);
    var basketCardElement = getCardElement(name, basketCardsElements)
      || renderBasketCardElement(basketProductInfo);

    if (basketProductInfo.orderedAmount) {
      setOrderCount(basketCardElement, basketProductInfo.orderedAmount);
    } else {
      var index = basketCardsElements.indexOf(basketCardElement);
      basketCardsElements.splice(index, 1);
      basketCardElement.remove();
    }

    setAmountClass(catalogCardElement, catalogProductInfo.amount);
    setBasketMessage();
    renderOrderResults();
    window.order.setFieldsState(productsInBasketInfo.length);
  }

  function getCardElement(name, cardsCollection) {
    var cardsArray = Array.from(cardsCollection);

    return cardsArray.find(function (item) {
      return item.dataset.name === name;
    });
  }

  function renderBasketCardElement(basketProductInfo) {
    var newBasketCardElement = createBasketCardElement(basketProductInfo);

    goodsCardsElement.appendChild(newBasketCardElement);
    basketCardsElements.push(newBasketCardElement);

    return newBasketCardElement;
  }

  function createBasketCardElement(basketProductInfo) {
    var newBasketCard = basketCardTemplateElement.cloneNode(true);
    var cardTitle = newBasketCard.querySelector('.card-order__title');
    var cardImage = newBasketCard.querySelector('.card-order__img');
    var cardPrice = newBasketCard.querySelector('.card-order__price');
    var orderCountElement = newBasketCard.querySelector('.card-order__count');

    newBasketCard.dataset.name = basketProductInfo.name;
    cardTitle.textContent = basketProductInfo.name;
    cardImage.src = basketProductInfo.picture;
    cardImage.alt = basketProductInfo.name;
    cardPrice.textContent = basketProductInfo.price + ' ' + CURRENCY_SIGN;
    orderCountElement.value = basketProductInfo.orderedAmount;
    orderCountElement.min = 0;
    orderCountElement.max = basketProductInfo.amount;
    addListenersOnBasketCard(newBasketCard);

    return newBasketCard;
  }

  function getDifference(name, orderCountElement) {
    var catalogProductInfo = getProductInfo(name, productsInCatalogInfo);
    var basketProductInfo = getProductInfo(name, productsInBasketInfo);

    var sumAllAvailableProduct =
      catalogProductInfo.amount + basketProductInfo.orderedAmount;

    orderCountElement.value =
      normalizeOrderCountValue(orderCountElement.value, sumAllAvailableProduct);
    var difference = orderCountElement.value - basketProductInfo.orderedAmount;

    return difference;
  }

  function normalizeOrderCountValue(value, maxValue) {
    if (value > maxValue) {
      value = maxValue;
    } else if (value < 0) {
      value = 0;
    }
    return value;
  }

  function getProductInfo(name, productsInfo) {
    return productsInfo.find(function (item) {
      return item.name === name;
    });
  }

  function setOrderCount(card, count) {
    card.querySelector('.card-order__count').value = count;
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

  function setBasketMessage() {
    if (productsInBasketInfo.length) {
      goodsCardEmptyElement.classList.add('visually-hidden');
      goodsCardsElement.classList.remove('goods__cards--empty');
    } else {
      goodsCardEmptyElement.classList.remove('visually-hidden');
      goodsCardsElement.classList.add('goods__cards--empty');
    }
  }

  function renderOrderResults() {
    var orderResult = getOrderResult();
    orderResult.productEnding = getProductEnding(orderResult.productsCount);

    renderOrderResultInHeader(orderResult);
    renderOrderResultInBasket(orderResult);

  }

  function getOrderResult() {
    var productsCount = 0;
    var totalPrice = 0;

    if (productsInBasketInfo.length) {
      for (var i = 0; i < productsInBasketInfo.length; i++) {
        productsCount += productsInBasketInfo[i].orderedAmount;
        var totalPositionPrice = productsInBasketInfo[i].orderedAmount
          * productsInBasketInfo[i].price;
        totalPrice += totalPositionPrice;
      }
    }
    return {
      productsCount: productsCount,
      totalPrice: totalPrice
    };
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

  function renderOrderResultInHeader(orderResult) {
    var message = 'В корзине ничего нет';

    if (orderResult.productsCount) {
      message = 'В корзине '
        + orderResult.productsCount
        + ' товар'
        + orderResult.productEnding
        + ' на '
        + orderResult.totalPrice
        + ' '
        + CURRENCY_SIGN;
    }

    mainHeaderBasketElement.textContent = message;
  }

  function renderOrderResultInBasket(orderResult) {
    if (orderResult.productsCount) {
      goodsTotal.classList.remove('visually-hidden');
      goodsTotalCount.firstChild.textContent = 'ИТОГО ЗА '
        + orderResult.productsCount
        + ' ТОВАР'
        + orderResult.productEnding;

      goodsPrice.textContent = orderResult.totalPrice + ' ' + CURRENCY_SIGN;
    } else {
      goodsTotal.classList.add('visually-hidden');
    }
  }
})();
