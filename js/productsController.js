'use strict';

(function () {
  var productsInCatalogInfo = [];
  var productsInBasketInfo = [];

  window.order.setFieldsState(productsInBasketInfo.length);
  window.order.addListenerOnSubmitForm(clearBasket);
  // onCatalogInfoLoad(window.data.getRandomProductsInfo());
  window.backend.load(onCatalogInfoLoad, function (errorMessage) {
    window.view.openErrorPopup(errorMessage);
  });

  function onCatalogInfoLoad(catalogInfo) {
    productsInCatalogInfo = catalogInfo;
    window.view.renderCatalog(productsInCatalogInfo, addCatalogCardListener);
  }

  function addCatalogCardListener(catalogCardEl) {
    catalogCardEl.addEventListener('click', function (evt) {

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

  function toggleFavoriteButton(button) {
    button.classList.toggle('card__btn-favorite--selected');
  }

  function clearBasket() {
    Array.from(productsInBasketInfo).forEach(function (item) {
      changeModelStructure(item.name, -item.orderedAmount);
    });
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

    window.view.changeDOM(
        catalogProductInfo,
        basketProductInfo,
        productsInBasketInfo,
        addBasketCardListeners
    );
  }

  function createBasketProductInfo(catalogProductInfo) {
    var basketProductInfo = Object.assign({}, catalogProductInfo);

    delete basketProductInfo.contents;
    delete basketProductInfo.nutritionFacts;
    delete basketProductInfo.rating;
    delete basketProductInfo.weight;
    basketProductInfo.orderedAmount = 0;
    productsInBasketInfo.push(basketProductInfo);

    return basketProductInfo;
  }

  function addBasketCardListeners(baskedCardEl) {
    baskedCardEl.addEventListener('click', function (evt) {
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

    baskedCardEl.addEventListener('input', function (evt) {
      if (evt.target.classList.contains('card-order__count')
          && evt.target.value) {
        var name = evt.currentTarget.dataset.name;
        var difference = getDifference(name, evt.target);
        changeModelStructure(name, difference);
      }
    });
  }

  function getDifference(name, orderCountEl) {
    var catalogProductInfo = getProductInfo(name, productsInCatalogInfo);
    var basketProductInfo = getProductInfo(name, productsInBasketInfo);

    var sumAllAvailableProduct =
      catalogProductInfo.amount + basketProductInfo.orderedAmount;

    orderCountEl.value =
      normalizeOrderCountValue(orderCountEl.value, sumAllAvailableProduct);
    var difference = orderCountEl.value - basketProductInfo.orderedAmount;

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
})();
