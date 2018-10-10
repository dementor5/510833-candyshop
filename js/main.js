'use strict';

(function () {
  var PRODUCTS_PICTURES_PATH = 'img/cards/';
  var infoKindToFoodType = {
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
    window.filter.setCallback(doFiltring);
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

  function doFiltring(values) {
    var newInfo = productsInCatalogInfo.slice();
    var foodType = values['food-type'];
    var foodProperty = values['food-property'];
    var price = values.price;
    var sort = values.sort[0];
    var mark = values.mark;

    if (foodType) {
      newInfo = productsInCatalogInfo.filter(function (it) {
        var result = foodType.indexOf(infoKindToFoodType[it.kind]);
        return result > -1;
      });
    }

    if (foodProperty) {
      var checkSugar = foodProperty.indexOf('sugar-free');
      var checkVegetarian = foodProperty.indexOf('vegetarian');
      var checkGluten = foodProperty.indexOf('gluten-free');

      if (checkSugar > -1) {
        newInfo = newInfo.filter(function (it) {
          return !it.nutritionFacts.sugar;
        });
      }

      if (checkVegetarian > -1) {
        newInfo = newInfo.filter(function (it) {
          return it.nutritionFacts.vegetarian;
        });
      }

      if (checkGluten > -1) {
        newInfo = newInfo.filter(function (it) {
          return !it.nutritionFacts.gluten;
        });
      }
    }

    if (price) {
      if (price.min !== undefined) {
        newInfo = newInfo.filter(function (it) {
          return it.price >= price.min;
        });
      }

      if (price.max !== undefined) {
        newInfo = newInfo.filter(function (it) {
          return it.price <= price.max;
        });
      }
    }

    if (mark) {
      if (mark[0] === 'availability') {
        newInfo = newInfo.filter(function (it) {
          return it.amount;
        });
      } else if (mark[0] === 'favorite') {
        newInfo = newInfo.filter(function (it) {
          return it.favorite;
        });
      }
    }

    if (sort !== 'popular') {
      switch (sort) {
        case 'expensive':
          newInfo.sort(function (a, b) {
            return b.price - a.price;
          });
          break;

        case 'cheep':
          newInfo.sort(function (a, b) {
            return a.price - b.price;
          });
          break;

        case 'rating':
          newInfo.sort(function (a, b) {
            var result = b.rating.value - a.rating.value;
            if (result === 0) {
              result = b.rating.number - a.rating.number;
            }
            return result;
          });
          break;
      }
    }

    window.filter.renderFindedCount(newInfo.length);
    window.catalog.render(newInfo, addCatalogCardListener);
  }
})();
