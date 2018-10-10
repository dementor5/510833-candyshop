'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var filterForm = document.querySelector('.filter_form');
  var mostCheckboxEls = filterForm.querySelectorAll(
      'input[type=checkbox]:not(#filter-favorite):not(#filter-availability)'
  );
  var filterFavoriteEl = filterForm.querySelector('#filter-favorite');
  var filterAvailabilityEl = filterForm.querySelector('#filter-availability');
  var popularFilterEl = filterForm.querySelector('#filter-popular');
  var icecreamCountEl =
    filterForm.querySelector('.input-btn__item-count--icecream');
  var sodaCountEl = filterForm.querySelector('.input-btn__item-count--soda');
  var gumCountEl = filterForm.querySelector('.input-btn__item-count--gum');
  var marmaladeCountEl =
    filterForm.querySelector('.input-btn__item-count--marmalade');
  var marshmallowCountEl =
    filterForm.querySelector('.input-btn__item-count--marshmallows');
  var sugarFreeCountEl =
    filterForm.querySelector('.input-btn__item-count--sugar-free');
  var vegetarianCountEl =
    filterForm.querySelector('.input-btn__item-count--vegetarian');
  var glutenFreeCountEl =
    filterForm.querySelector('.input-btn__item-count--gluten-free');
  var favoriteCountEl =
    filterForm.querySelector('.input-btn__item-count--favorite');
  var availableCountEl =
    filterForm.querySelector('.input-btn__item-count--availability');
  var rangePriceMinEl = filterForm.querySelector('.range__price--min');
  var rangePriceMaxEl = filterForm.querySelector('.range__price--max');
  var rangeCountEl = filterForm.querySelector('.range__count');
  var showAllEl = filterForm.querySelector('.catalog__submit');
  var oldLeftPinPosition;
  var oldRightPinPosition;
  var minPrice = 0;
  var maxPrice;
  var maxProductPrice;
  var callback;

  addListenersOnForm();
  window.slider.initRange(onSliderChange);
  setMinPrice();

  function addListenersOnForm() {
    filterForm.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });

    showAllEl.addEventListener('click', function () {
      clearFilters();
      callback(getFormValues());
    });

    filterForm.addEventListener('change', function (evt) {
      if (
        evt.target.id === 'filter-favorite' && evt.target.checked === true
      ) {
        clearFilters('favorite');
      } else if (
        evt.target.id === 'filter-availability' && evt.target.checked === true
      ) {
        clearFilters('availability');
      }
      callback(getFormValues());
    });
  }

  function clearFilters(flag) {
    if (flag === 'favorite') {
      filterAvailabilityEl.checked = false;
    } else if (flag === 'availability') {
      filterFavoriteEl.checked = false;
    } else {
      filterFavoriteEl.checked = false;
      filterAvailabilityEl.checked = false;
    }
    mostCheckboxEls.forEach(function (it) {
      it.checked = false;
    });
    popularFilterEl.checked = true;
    window.slider.reset();
  }

  function onSliderChange(newPinPosition) {
    if (oldLeftPinPosition !== newPinPosition.left) {
      oldLeftPinPosition = newPinPosition.left;
      minPrice = getPriceValue(newPinPosition.left);
      rangePriceMinEl.textContent = minPrice;
    }
    if (oldRightPinPosition !== newPinPosition.right) {
      oldRightPinPosition = newPinPosition.right;
      maxPrice = getPriceValue(newPinPosition.right);
      rangePriceMaxEl.textContent = maxPrice;
    }
    callback(getFormValues());
  }

  function getPriceValue(pinPosition) {
    return Math.round(maxProductPrice / 100 * pinPosition);
  }

  function getFormValues() {
    var values = {};
    var formData = new FormData(filterForm);

    formData.forEach(function (value, name) {
      if (!values[name]) {
        values[name] = [];
      }
      values[name].push(value);
    });

    if (!(minPrice === 0 && maxPrice === maxProductPrice)) {
      values.price = {};

      if (minPrice !== 0) {
        values.price.min = minPrice;
      }

      if (maxPrice !== maxProductPrice) {
        values.price.max = maxPrice;
      }
    }

    return values;
  }

  function setMinPrice() {
    rangePriceMinEl.textContent = minPrice;
  }

  function setBoundaryValues(values) {
    maxProductPrice = values.maxPrice;
    maxPrice = values.maxPrice;
    rangePriceMaxEl.textContent = values.maxPrice;
    icecreamCountEl.textContent = '(' + values.icecreamCount + ')';
    sodaCountEl.textContent = '(' + values.sodaCount + ')';
    gumCountEl.textContent = '(' + values.gumCount + ')';
    marmaladeCountEl.textContent = '(' + values.marmaladeCount + ')';
    marshmallowCountEl.textContent = '(' + values.marshmallowCount + ')';
    sugarFreeCountEl.textContent = '(' + values.withoutSugarCount + ')';
    vegetarianCountEl.textContent = '(' + values.vegetarianCount + ')';
    glutenFreeCountEl.textContent = '(' + values.withoutGlutenCount + ')';
    rangeCountEl.textContent = '(' + values.count + ')';
    availableCountEl.textContent = '(' + values.availableCount + ')';
  }

  function setCallback(cb) {
    callback = window.debounce(cb, DEBOUNCE_INTERVAL);
  }

  function renderFindedCount(count) {
    rangeCountEl.textContent = '(' + count + ')';
  }

  function renderFavoriteCount(count) {
    favoriteCountEl.textContent = '(' + count + ')';
  }

  window.filter = {
    setBoundaryValues: setBoundaryValues,
    setCallback: setCallback,
    renderFindedCount: renderFindedCount,
    renderFavoriteCount: renderFavoriteCount
  };
})();