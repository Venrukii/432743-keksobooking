'use strict';

var MAX_CARDS = 8;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 44;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 10;
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 150;
var MAX_Y = 500;
var pinsArea = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var generatedCard = mapCardTemplate.cloneNode(true);

var propertyTypesConvert = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};


var propertyTypes = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var apartmentTypes = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var checkinTime = [
  '12:00',
  '13:00',
  '14:00'
];

var featuresList = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// Функция генерации случайного числа

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// Генерация одного случайного объекта (карточки) объявления

var generateCard = function (index) {

  var coordinateAdress = {
    x: getRandomNumber(MIN_X, MAX_X),
    y: getRandomNumber(MIN_Y, MAX_Y)
  };
  var checkIn = checkinTime[getRandomNumber(0, 3)];
  var checkOut = checkIn;
  var featuresCount = getRandomNumber(0, featuresList.length);
  var features = featuresList.slice(0, featuresCount + 1);
  var newObj = {
    author: {
      'avatar': 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      'title': apartmentTypes[index],
      'address': coordinateAdress.x + ', ' + coordinateAdress.y,
      'price': getRandomNumber(PRICE_MIN, PRICE_MAX),
      'type': propertyTypes[getRandomNumber(0, 3)],
      'rooms': getRandomNumber(ROOMS_MIN, ROOMS_MAX),
      'guests': getRandomNumber(GUESTS_MIN, GUESTS_MAX),
      'checkin': checkIn,
      'checkout': checkOut,
      'features': features,
      'description': '',
      'photos': photos
    },
    location: coordinateAdress
  };
  return newObj;
};

// Собираем объекты в массив
var getAdsList = function (cardsNumber) {
  var cardsData = [];
  for (var i = 0; i < cardsNumber; i++) {
    cardsData.push(generateCard(i));
  }
  return cardsData;
};

// Создаем метки на карте на основе массива данных объявлений и отрисовываем их

var generatePin = function (offerData) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (offerData.location.x - PIN_WIDTH / 2) + 'px; top: ' + (offerData.location.y + PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').alt = offerData.offer.title;
  pinElement.querySelector('img').src = offerData.author.avatar;
  return pinElement;
};

var renderPins = function (pins) {
  var pinFragment = document.createDocumentFragment();
  pins.forEach(function (item, i) {
    pinFragment.appendChild(generatePin(item, i));
  });
  return pinFragment;
};

var pins = renderPins(getAdsList(MAX_CARDS));

// Генерация карточки объявления

var renderFeatures = function (features) {
  var featuresFragment = document.createDocumentFragment();
  for (var t = 0; t < features.offer.features.length; t++) {
    var featureListItem = document.createElement('li');
    featureListItem.className = 'popup__feature popup__feature--' + features.offer.features[t];
    featuresFragment.appendChild(featureListItem);
  }
  return featuresFragment;
};

var renderPhoto = function (photoData) {
  var photoFragment = document.createDocumentFragment();
  photoData.offer.photos.forEach(function (feature, k) {
    var photoItem = document.createElement('img');
    photoItem.className = 'popup__photo';
    photoItem.style.width = '45px';
    photoItem.style.height = '40px';
    photoItem.src = photoData.offer.photos[k];
    photoItem.draggable = 'false';
    photoFragment.appendChild(photoItem);
  });
  return photoFragment;
};

var renderCard = function (cardsArr) {
  generatedCard.querySelector('.popup__title').textContent = cardsArr.offer.title;
  generatedCard.querySelector('.popup__text--address').textContent = cardsArr.offer.address;
  generatedCard.querySelector('.popup__text--price').textContent = cardsArr.offer.price + '₽/ночь';
  generatedCard.querySelector('.popup__type').textContent = propertyTypesConvert[cardsArr.offer.type];
  generatedCard.querySelector('.popup__text--capacity').textContent = cardsArr.offer.rooms + 'комнаты для ' + cardsArr.offer.guests + 'гостей';
  generatedCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardsArr.offer.checkin + ', выезд до ' + cardsArr.offer.checkout;
  generatedCard.querySelector('.popup__avatar').src = cardsArr.author.avatar;
  generatedCard.querySelector('.popup__description').textContent = cardsArr.offer.description;

  var popupFeatures = generatedCard.querySelector('.popup__features');
  popupFeatures.innerHTML = '';
  popupFeatures.appendChild(renderFeatures(cardsArr));


  var popupPhotos = generatedCard.querySelector('.popup__photos');
  popupPhotos.innerHTML = '';
  popupPhotos.appendChild(renderPhoto(cardsArr));

  return generatedCard;
};

var insertAdvertCard = function () {
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  document.querySelector('.map').insertBefore(renderCard(getAdsList(MAX_CARDS)[0]), mapFiltersContainer);
};

// Активируем интерактивную карту
document.querySelector('.map.map--faded').classList.remove('map--faded');

// Вызовы функций
var renderAll = function () {
  pinsArea.appendChild(pins);
  renderCard(getAdsList(MAX_CARDS)[0]);
  insertAdvertCard();
  renderFeatures();
};

renderAll();
