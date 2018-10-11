'use strict';

(function () {
  var PRODUCTS_PICTURES_PATH = 'img/cards/';
  var InfoKindToFoodType = {
    'Мороженое': 'icecream',
    'Газировка': 'soda',
    'Жевательная резинка': 'gum',
    'Мармелад': 'marmalade',
    'Зефир': 'marshmallows'
  };
  var productsInCatalogInfo = [];
  var productsInBasketInfo = [];

  window.order.setFieldsState(productsInBasketInfo.length);
  window.order.addListenerOnSubmitForm(clearBasket);
  // onLoadDone(window.data.getRandomProductsInfo());
  window.backend.load(onLoadDone, onError);


  function onLoadDone(catalogInfo) {
    productsInCatalogInfo = catalogInfo;
    changeCatalogInfo();
    var boundaryValues = calculateBoundaryValues();
    window.filter.setBoundaryValues(boundaryValues);
    window.filter.setCallback(doFiltering);
    window.catalog.render(productsInCatalogInfo, addCatalogCardListener);
  }

  function changeCatalogInfo() {
    productsInCatalogInfo.forEach(function (it) {
      it.id = it.picture.replace(/\.[^.]+$/, '');
      it.picture = PRODUCTS_PICTURES_PATH + it.picture;
      it.favorite = false;
    });
  }

  function calculateBoundaryValues() {
    var prices = productsInCatalogInfo.map(function (it) {
      return it.price;
    });
    var maxPrice = window.util.getMaxArrayValue(prices);
    var count = productsInCatalogInfo.length;
    var availableCount = productsInCatalogInfo.filter(function (it) {
      return it.amount;
    }).length;
    var icecreamCount = productsInCatalogInfo.filter(function (it) {
      return it.kind === 'Мороженое';
    }).length;
    var sodaCount = productsInCatalogInfo.filter(function (it) {
      return it.kind === 'Газировка';
    }).length;
    var gumCount = productsInCatalogInfo.filter(function (it) {
      return it.kind === 'Жевательная резинка';
    }).length;
    var marmaladeCount = productsInCatalogInfo.filter(function (it) {
      return it.kind === 'Мармелад';
    }).length;
    var marshmallowCount = productsInCatalogInfo.filter(function (it) {
      return it.kind === 'Зефир';
    }).length;
    var withoutSugarCount = productsInCatalogInfo.filter(function (it) {
      return !it.nutritionFacts.sugar;
    }).length;
    var vegetarianCount = productsInCatalogInfo.filter(function (it) {
      return it.nutritionFacts.vegetarian;
    }).length;
    var withoutGlutenCount = productsInCatalogInfo.filter(function (it) {
      return !it.nutritionFacts.gluten;
    }).length;

    return {
      maxPrice: maxPrice,
      count: count,
      availableCount: availableCount,
      icecreamCount: icecreamCount,
      sodaCount: sodaCount,
      gumCount: gumCount,
      marmaladeCount: marmaladeCount,
      marshmallowCount: marshmallowCount,
      withoutSugarCount: withoutSugarCount,
      vegetarianCount: vegetarianCount,
      withoutGlutenCount: withoutGlutenCount
    };
  }

  function onError(errorMessage) {
    window.popup.openError(errorMessage);
  }

  function addCatalogCardListener(catalogCardEl) {
    catalogCardEl.addEventListener('click', function (evt) {

      if (evt.target.classList.contains('card__btn-favorite')) {
        evt.preventDefault();
        markAsFavorite(evt.currentTarget.dataset.name);
        window.catalog.toggleFavoriteClass(evt.target);
      }

      if (evt.target.classList.contains('card__btn')) {
        evt.preventDefault();
        changeModelStructure(evt.currentTarget.dataset.name, 1);
      }

    });
  }

  function markAsFavorite(name) {
    var catalogProductInfo = getProductInfo(name, productsInCatalogInfo);
    catalogProductInfo.favorite = catalogProductInfo.favorite ? false : true;
    window.filter.renderFavoriteCount(getFavoriteCount());
  }

  function getFavoriteCount() {
    return productsInCatalogInfo.filter(function (it) {
      return it.favorite;
    }).length;
  }


  function clearBasket() {
    while (productsInBasketInfo[0]) {
      changeModelStructure(
          productsInBasketInfo[0].name,
          -productsInBasketInfo[0].orderedAmount
      );
    }
  }

  function changeModelStructure(name, value) {
    var catalogProductInfo = getProductInfo(name, productsInCatalogInfo);
    var basketProductInfo = getProductInfo(name, productsInBasketInfo)
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

    window.catalog.renderCardChanges(catalogProductInfo);
    window.basket.renderChanges(
        basketProductInfo,
        productsInBasketInfo,
        addBasketCardListeners
    );
  }

  function createBasketProductInfo(catalogProductInfo) {
    var basketProductInfo = Object.assign({}, catalogProductInfo);

    delete basketProductInfo.contents;
    delete basketProductInfo.kind;
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
    return productsInfo.find(function (it) {
      return it.name === name;
    });
  }

  function doFiltering(values) {
    var newInfo = productsInCatalogInfo.slice();
    var foodTypes = values['food-type'];
    var foodPropertys = values['food-property'];
    var priceLimits = values.priceLimits;
    var markLimits = values.mark;
    var sort = values.sort[0];

    if (foodPropertys) {
      var checkSugarFlag = foodPropertys.indexOf('sugar-free') !== -1;
      var checkVegetarianFlag = foodPropertys.indexOf('vegetarian') !== -1;
      var checkGlutenFlag = foodPropertys.indexOf('gluten-free') !== -1;
    }

    newInfo = newInfo.filter(function (it) {
      return checkFoodTypes(foodTypes, it)
        && checkSugar(checkSugarFlag, it)
        && checkVegetarian(checkVegetarianFlag, it)
        && checkGluten(checkGlutenFlag, it)
        && checkMinPrice(priceLimits, it)
        && checkMaxPrice(priceLimits, it)
        && checkAvailability(markLimits, it)
        && checkIsFavorite(markLimits, it);
    });

    switch (sort) {
      case 'expensive':
        sortByExpensive(newInfo);
        break;

      case 'cheep':
        sortByCheep(newInfo);
        break;

      case 'rating':
        sortByRating(newInfo);
        break;
    }

    function checkFoodTypes(types, it) {
      return !types || types.indexOf(InfoKindToFoodType[it.kind]) !== -1;
    }

    function checkSugar(flag, it) {
      return !flag || !it.nutritionFacts.sugar;
    }

    function checkVegetarian(flag, it) {
      return !flag || it.nutritionFacts.vegetarian;
    }

    function checkGluten(flag, it) {
      return !flag || !it.nutritionFacts.gluten;
    }

    function checkMinPrice(prices, it) {
      return !prices || prices.min === null || it.price >= prices.min;
    }

    function checkMaxPrice(prices, it) {
      return !prices || prices.max === null || it.price <= prices.max;
    }

    function checkAvailability(marks, it) {
      return !marks || marks[0] !== 'availability' || it.amount;
    }

    function checkIsFavorite(marks, it) {
      return !marks || marks[0] !== 'favorite' || it.favorite;
    }

    function sortByExpensive(info) {
      info.sort(function (a, b) {
        return b.price - a.price;
      });
    }

    function sortByCheep(info) {
      info.sort(function (a, b) {
        return a.price - b.price;
      });
    }

    function sortByRating(info) {
      info.sort(function (a, b) {
        var result = b.rating.value - a.rating.value;
        if (result === 0) {
          result = b.rating.number - a.rating.number;
        }
        return result;
      });
    }

    window.filter.renderFoundCount(newInfo.length);
    window.catalog.render(newInfo, addCatalogCardListener);
  }
})();
