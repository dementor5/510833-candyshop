'use strict';

(function () {
  var LOAD_METHOD = 'GET';
  var UPLOAD_METHOD = 'POST';
  var LOAD_URL = 'https://js.dump.academy/candyshop/data';
  var UPLOAD_URL = 'https://js.dump.academy/candyshop';
  var RESPONSE_TYPE = 'json';
  var XHR_TIMEOUT = 10000;

  function load(onLoad, onError) {
    var conf = {
      method: LOAD_METHOD,
      URL: LOAD_URL,
      onLoad: onLoad,
      onError: onError
    };
    var xhr = new XMLHttpRequest();
    prepareXhr(xhr, conf);
    xhr.send();
  }

  function upload(data, onLoad, onError) {
    var conf = {
      method: UPLOAD_METHOD,
      URL: UPLOAD_URL,
      onLoad: onLoad,
      onError: onError
    };
    var xhr = new XMLHttpRequest();
    prepareXhr(xhr, conf);
    xhr.send(data);
  }

  function prepareXhr(xhr, conf) {
    xhr.responseType = RESPONSE_TYPE;
    xhr.timeout = XHR_TIMEOUT;
    xhr.open(conf.method, conf.URL);
    addListeners(xhr, conf.onLoad, conf.onError);
  }

  function addListeners(xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения.');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс.');
    });
  }

  window.backend = {
    load: load,
    upload: upload
  };
})();
