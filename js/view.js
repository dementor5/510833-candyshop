'use strict';

(function () {
  var PRODUCTS_PICTURES_PATH = 'img/cards/';
  var CURRENCY_SIGN = '₽';

  var catalogEl = document.querySelector('.catalog__cards');
  var catalogLoadEl = catalogEl.querySelector('.catalog__load');
  var mainHeaderBasketEl = document.querySelector('.main-header__basket');
  var orderFormEl = document.querySelector('.order_form');
  var goodsCardsEl = orderFormEl.querySelector('.goods__cards');
  var goodsCardEmptyEl = goodsCardsEl.querySelector('.goods__card-empty');
  var goodsTotal = orderFormEl.querySelector('.goods__total');
  var goodsTotalCount = goodsTotal.querySelector('.goods__total-count');
  var goodsPrice = goodsTotalCount.querySelector('.goods__price');
  var modalErrorEl = document.querySelector('.modal--error');
  var modalErrorMessageEl = modalErrorEl.querySelector('.modal__message');
  var modalSuccessEl = document.querySelector('.modal--success');

  var catalogCardTemplateEl = document.querySelector('#card')
    .content.querySelector('.catalog__card');
  var basketCardTemplateEl = document.querySelector('#card-order')
    .content.querySelector('.goods_card');

  var catalogCardsEls = [];
  var basketCardsEls = [];

  addListenersOnPopups();

  function renderCatalog(productsInCatalogInfo, addCatalogCardListener) {
    var fragmentWithCatalogCards =
      getPackOfCatalogCards(productsInCatalogInfo, addCatalogCardListener);

    catalogEl.classList.remove('catalog__cards--load');
    catalogLoadEl.classList.add('visually-hidden');
    catalogEl.appendChild(fragmentWithCatalogCards);
    catalogCardsEls = catalogEl.querySelectorAll('.catalog__card');
  }

  function getPackOfCatalogCards(data, addCatalogCardListener) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var cardEl = createCatalogCardEl(data[i], addCatalogCardListener);
      fragment.appendChild(cardEl);
    }

    return fragment;
  }

  function createCatalogCardEl(product, addCatalogCardListener) {
    var newCatalogCard = catalogCardTemplateEl.cloneNode(true);
    var cardTitleEl = newCatalogCard.querySelector('.card__title');
    var cardImageEl = newCatalogCard.querySelector('.card__img');
    var cardPriceEl = newCatalogCard.querySelector('.card__price');
    var cardWeightEl = cardPriceEl.querySelector('.card__weight');
    var starCountEl = newCatalogCard.querySelector('.star__count');
    var characteristicEl =
      newCatalogCard.querySelector('.card__characteristic');
    var composition = newCatalogCard.querySelector('.card__composition-list');
    var ratingEl = newCatalogCard.querySelector('.stars__rating');

    newCatalogCard.dataset.name = product.name;
    cardTitleEl.textContent = product.name;
    cardImageEl.src = PRODUCTS_PICTURES_PATH + product.picture;
    cardImageEl.alt = product.name;
    cardPriceEl.firstChild.data = product.price + ' ';
    cardWeightEl.textContent = '/ ' + product.weight + ' Г';
    ratingEl.textContent =
      'Рейтинг: ' + product.rating.value + ' звезд'
      + getStarEnding(product.rating.value);
    starCountEl.textContent = '(' + product.rating.number + ')';
    characteristicEl.textContent =
      getSugarStatusString(product.nutritionFacts.sugar)
      + product.nutritionFacts.energy + ' ккал';
    composition.textContent = product.contents;
    setAmountClass(newCatalogCard, product.amount);
    setRatingClass(ratingEl, product.rating.value);
    addCatalogCardListener(newCatalogCard);

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

  function getSugarStatusString(flag) {
    return flag ? 'Содержит сахар. ' : 'Без сахара. ';
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

  function changeDOM(
      catalogProductInfo,
      basketProductInfo,
      productsInBasketInfo,
      addBasketCardListeners
  ) {
    var name = catalogProductInfo.name;
    var catalogCardEl = getCardEl(name, catalogCardsEls);
    var basketCardEl = getCardEl(name, basketCardsEls)
      || renderBasketCardEl(basketProductInfo, addBasketCardListeners);

    if (basketProductInfo.orderedAmount) {
      setOrderCount(basketCardEl, basketProductInfo.orderedAmount);
    } else {
      var index = basketCardsEls.indexOf(basketCardEl);
      basketCardsEls.splice(index, 1);
      basketCardEl.remove();
    }

    setAmountClass(catalogCardEl, catalogProductInfo.amount);
    setBasketMessage(productsInBasketInfo.length);
    renderOrderResults(productsInBasketInfo);
    window.order.setFieldsState(productsInBasketInfo.length);
  }

  function getCardEl(name, cardsCollection) {
    var cardsArray = Array.from(cardsCollection);

    return cardsArray.find(function (item) {
      return item.dataset.name === name;
    });
  }

  function renderBasketCardEl(basketProductInfo, addBasketCardListeners) {
    var cardEl = createBasketCardEl(basketProductInfo, addBasketCardListeners);

    goodsCardsEl.appendChild(cardEl);
    basketCardsEls.push(cardEl);

    return cardEl;
  }

  function createBasketCardEl(basketProductInfo, addBasketCardListeners) {
    var newBasketCard = basketCardTemplateEl.cloneNode(true);
    var cardTitle = newBasketCard.querySelector('.card-order__title');
    var cardImage = newBasketCard.querySelector('.card-order__img');
    var cardPrice = newBasketCard.querySelector('.card-order__price');
    var orderCountEl = newBasketCard.querySelector('.card-order__count');

    newBasketCard.dataset.name = basketProductInfo.name;
    cardTitle.textContent = basketProductInfo.name;
    cardImage.src = PRODUCTS_PICTURES_PATH + basketProductInfo.picture;
    cardImage.alt = basketProductInfo.name;
    cardPrice.textContent = basketProductInfo.price + ' ' + CURRENCY_SIGN;
    orderCountEl.name = getOrderCountName(basketProductInfo.picture);
    orderCountEl.value = basketProductInfo.orderedAmount;
    orderCountEl.min = 0;
    orderCountEl.max = basketProductInfo.amount;
    addBasketCardListeners(newBasketCard);

    return newBasketCard;
  }

  function getOrderCountName(pictureName) {
    return pictureName.replace(/\.[^.]+$/, '');
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

  function setBasketMessage(basketProductCount) {
    if (basketProductCount) {
      goodsCardEmptyEl.classList.add('visually-hidden');
      goodsCardsEl.classList.remove('goods__cards--empty');
    } else {
      goodsCardEmptyEl.classList.remove('visually-hidden');
      goodsCardsEl.classList.add('goods__cards--empty');
    }
  }

  function renderOrderResults(productsInBasketInfo) {
    var orderResult = getOrderResult(productsInBasketInfo);
    orderResult.productEnding = getProductEnding(orderResult.productsCount);

    renderOrderResultInHeader(orderResult);
    renderOrderResultInBasket(orderResult);

  }

  function getOrderResult(productsInBasketInfo) {
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

    mainHeaderBasketEl.textContent = message;
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

  function addListenersOnPopups() {
    modalErrorEl.addEventListener('click', onPopupCloseButtonClick);
    modalSuccessEl.addEventListener('click', onPopupCloseButtonClick);

  }

  function onPopupCloseButtonClick(evt) {
    if (evt.target.classList.contains('modal__close')) {
      closePopups();
    }
  }

  function openSuccessPopup() {
    openPopup(modalSuccessEl);
  }

  function openErrorPopup(errorMessage) {
    modalErrorMessageEl.textContent = errorMessage;
    openPopup(modalErrorEl);
  }

  function openPopup(popup) {
    popup.classList.remove('modal--hidden');
    document.addEventListener('keydown', onPopupEscPress);
  }

  function onPopupEscPress(evt) {
    window.util.isEscEvent(evt, closePopups);
  }

  function closePopups() {
    modalErrorEl.classList.add('modal--hidden');
    modalSuccessEl.classList.add('modal--hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  }

  window.view = {
    getFormEl: function () {
      return orderFormEl;
    },
    renderCatalog: renderCatalog,
    changeDOM: changeDOM,
    openSuccessPopup: openSuccessPopup,
    openErrorPopup: openErrorPopup
  };
})();
