'use strict';

(function () {
  var CURRENCY_SIGN = '₽';

  var mainHeaderBasketEl = document.querySelector('.main-header__basket');
  var orderFormEl = document.querySelector('.order_form');
  var goodsCardsEl = orderFormEl.querySelector('.goods__cards');
  var goodsCardEmptyEl = goodsCardsEl.querySelector('.goods__card-empty');
  var goodsTotal = orderFormEl.querySelector('.goods__total');
  var goodsTotalCount = goodsTotal.querySelector('.goods__total-count');
  var goodsPrice = goodsTotalCount.querySelector('.goods__price');
  var basketCardTemplateEl = document.querySelector('#card-order')
      .content.querySelector('.goods_card');
  var basketCardsEls = [];


  function renderBasketChanges(basketProductInfo, productsInBasketInfo,
      addBasketCardListeners) {
    var name = basketProductInfo.name;
    var basketCardEl = window.catalog.getCardEl(name, basketCardsEls)
        || renderBasketCardEl(basketProductInfo, addBasketCardListeners);

    if (basketProductInfo.orderedAmount) {
      setOrderCount(basketCardEl, basketProductInfo.orderedAmount);
    } else {
      var index = basketCardsEls.indexOf(basketCardEl);
      basketCardsEls.splice(index, 1);
      basketCardEl.remove();
    }

    setBasketMessage(productsInBasketInfo.length);
    renderOrderResults(productsInBasketInfo);
    window.order.setFieldsState(productsInBasketInfo.length);
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
    cardImage.src = basketProductInfo.picture;
    cardImage.alt = basketProductInfo.name;
    cardPrice.textContent = basketProductInfo.price + ' ' + CURRENCY_SIGN;
    orderCountEl.name = basketProductInfo.id;
    orderCountEl.value = basketProductInfo.orderedAmount;
    orderCountEl.min = 0;
    orderCountEl.max = basketProductInfo.amount;
    addBasketCardListeners(newBasketCard);

    return newBasketCard;
  }

  function setOrderCount(card, count) {
    card.querySelector('.card-order__count').value = count;
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
      productsInBasketInfo.forEach(function (it) {
        productsCount += it.orderedAmount;
        totalPrice += it.orderedAmount * it.price;
      });
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

  function getFormEl() {
    return orderFormEl;
  }

  window.basket = {
    renderChanges: renderBasketChanges,
    getFormEl: getFormEl
  };
})();
