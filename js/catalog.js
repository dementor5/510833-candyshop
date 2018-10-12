'use strict';

(function () {
  var catalogEl = document.querySelector('.catalog__cards');
  var catalogLoadEl = catalogEl.querySelector('.catalog__load');
  var catalogCardTemplateEl = document.querySelector('#card')
    .content.querySelector('.catalog__card');
  var catalogEmptyFiltersTemplateEl = document.querySelector('#empty-filters')
    .content.querySelector('.catalog__empty-filter');
  var catalogCardsEls = [];

  function renderCatalog(productsInCatalogInfo, addCatalogCardListener) {
    if (catalogCardsEls.length) {
      catalogCardsEls.forEach(function (it) {
        it.remove();
      });
    }

    catalogEl.classList.remove('catalog__cards--load');
    catalogLoadEl.classList.add('visually-hidden');

    if (!productsInCatalogInfo.length) {
      var emptyCatalogEl = getCatalogEmptyCard();
      catalogEl.appendChild(emptyCatalogEl);
      catalogCardsEls = [emptyCatalogEl];
    } else {
      var fragmentWithCatalogCards =
        getPackOfCatalogCards(productsInCatalogInfo, addCatalogCardListener);
      catalogEl.appendChild(fragmentWithCatalogCards);
      catalogCardsEls = catalogEl.querySelectorAll('.catalog__card');
    }
  }

  function getCatalogEmptyCard() {
    return catalogEmptyFiltersTemplateEl.cloneNode(true);
  }

  function getPackOfCatalogCards(data, addCatalogCardListener) {
    var fragment = document.createDocumentFragment();

    data.forEach(function (it) {
      var cardEl = createCatalogCardEl(it, addCatalogCardListener);
      fragment.appendChild(cardEl);
    });

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
    var favoriteButtonEl = newCatalogCard.querySelector('.card__btn-favorite');
    var compositionListEl =
      newCatalogCard.querySelector('.card__composition-list');

    newCatalogCard.dataset.name = product.name;
    cardTitleEl.textContent = product.name;
    cardImageEl.src = product.picture;
    cardImageEl.alt = product.name;
    cardPriceEl.firstChild.data = product.price + ' ';
    cardWeightEl.textContent = '/ ' + product.weight + ' Г';
    ratingEl.textContent = 'Рейтинг: ' + product.rating.value + ' звезд'
      + getStarEnding(product.rating.value);
    starCountEl.textContent = '(' + product.rating.number + ')';
    characteristicEl.textContent =
        getSugarStatusString(product.nutritionFacts.sugar)
        + getGlutenStatusString(product.nutritionFacts.gluten)
        + getVegeterianString(product.nutritionFacts.vegetarian)
        + product.nutritionFacts.energy
        + ' ккал';
    composition.textContent = product.contents;
    setAmountClass(newCatalogCard, product.amount);
    setRatingClass(ratingEl, product.rating.value);
    compositionListEl.textContent = product.nutritionFacts.contents;
    if (product.favorite) {
      toggleFavoriteClass(favoriteButtonEl);
    }
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
    return flag ? 'Содержит сахар, ' : 'Без сахара, ';
  }

  function getGlutenStatusString(flag) {
    return flag ? 'содержит глютен, ' : ' без глютена, ';
  }

  function getVegeterianString(flag) {
    return flag ? 'вегетарианское. ' : 'не вегетарианское. ';
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

  function renderCardChanges(catalogProductInfo) {
    var catalogCardEl = getCardEl(catalogProductInfo.name, catalogCardsEls);
    if (catalogCardEl) {
      setAmountClass(catalogCardEl, catalogProductInfo.amount);
    }
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

  function toggleFavoriteClass(button) {
    button.classList.toggle('card__btn-favorite--selected');
  }

  function toggleCompositionHiddenClass(card) {
    var cardComposition = card.querySelector('.card__composition');
    cardComposition.classList.toggle('card__composition--hidden');
  }

  function getCardEl(name, cardsCollection) {
    var cardsArray = Array.from(cardsCollection);

    return cardsArray.find(function (item) {
      return item.dataset.name === name;
    });
  }

  window.catalog = {
    render: renderCatalog,
    renderCardChanges: renderCardChanges,
    getCardEl: getCardEl,
    toggleFavoriteClass: toggleFavoriteClass,
    toggleCompositionHiddenClass: toggleCompositionHiddenClass
  };
})();
