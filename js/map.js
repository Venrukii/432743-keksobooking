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

var generateOneCard = function (index) {

  var coordinateAdress = {
    x: getRandomNumber(MIN_X, MAX_X),
    y: getRandomNumber(MIN_Y, MAX_Y)
  };

  var checkIn = checkinTime[getRandomNumber(0, 3)];
  var checkOut = checkIn;

  var features = [];
  var featuresCount = getRandomNumber(0, featuresList.length);

  for (var i = 0; i < featuresCount; i++) {
    features[i] = featuresList[i];
  }

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
var cardsData = [];
for (var i = 0; i < MAX_CARDS; i++) {
  cardsData.push(generateOneCard(i));
}

// Активируем интерактивную карту

document.querySelector('.map.map--faded').classList.remove('map--faded');


// Создаем метки на карте на основе массива данных объявлений и отрисовываем их

var pinsArea = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var pinFragment = document.createDocumentFragment();

var generateOnePin = function (index) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (cardsData[index].location.x - PIN_WIDTH / 2) + 'px; top: ' + (cardsData[index].location.y + PIN_HEIGHT / 2) + 'px;';
  pinElement.querySelector('img').alt = cardsData[index].offer.title;
  pinElement.querySelector('img').src = cardsData[index].author.avatar;
  return pinElement;
};


var drawMapPins = function (pinMax) {
  for (var j = 0; j < pinMax; j++) {
    pinFragment.appendChild(generateOnePin(j));
  }
};

drawMapPins(MAX_CARDS);
pinsArea.appendChild(pinFragment);


// Отрисовываем карточку объявления

var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

// Функция перевода типов недвижимости в русские названия

var propertyTypesConverter = function (offerType) {
  if (offerType === 'palace') {
    return 'Дворец';
  } else if (offerType === 'flat') {
    return 'Квартира';
  } else if (offerType === 'house') {
    return 'Дом';
  } else {
    return 'Бунгало';
  }
};

var generateAdvertCard = function (cardsArr) {
  var generatedCard = mapCardTemplate.cloneNode(true);
  generatedCard.querySelector('.popup__title').textContent = cardsArr.offer.title;
  generatedCard.querySelector('.popup__title').textContent = cardsArr.offer.address;
  generatedCard.querySelector('.popup__text--price').textContent = cardsArr.offer.price + '₽/ночь';
  generatedCard.querySelector('.popup__type').textContent = propertyTypesConverter(cardsArr.offer.type);
  generatedCard.querySelector('.popup__text--capacity').textContent = cardsArr.offer.rooms + 'комнаты для ' + cardsArr.offer.guests + 'гостей';
  generatedCard.querySelector('.popup__text--time').textContent = 'Заезд после' + cardsArr.offer.checkin + ', выезд до' + cardsArr.offer.checkout;
  generatedCard.querySelector('.popup__avatar').src = cardsArr.author.avatar;

  var popupFeatures = generatedCard.querySelector('.popup__features');
  var featuresFragment = document.createDocumentFragment();
  popupFeatures.innerHTML = '';

  for (var t = 0; t < cardsArr.offer.features.length; t++) {
    var featureListItem = document.createElement('li');
    featureListItem.className = 'popup__feature popup__feature--' + cardsArr.offer.features[t];
    featuresFragment.appendChild(featureListItem);
  }
  popupFeatures.appendChild(featuresFragment);

  generatedCard.querySelector('.popup__description').textContent = cardsArr.offer.description;

  var popupPhotos = generatedCard.querySelector('.popup__photos');
  var photoFragment = document.createDocumentFragment();
  popupPhotos.innerHTML = '';
  for (var j = 0; j < cardsArr.offer.photos.length; j++) {
    var photoItem = document.createElement('img');
    photoItem.className = 'popup__photo';
    photoItem.style.width = '45px';
    photoItem.style.height = '40px';
    photoItem.src = cardsArr.offer.photos[j];
    photoItem.draggable = 'false';
    photoFragment.appendChild(photoItem);
  }
  popupPhotos.appendChild(photoFragment);
  return generatedCard;
};

var insertAdvertCard = function () {
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  document.querySelector('.map').insertBefore(generateAdvertCard(cardsData[0]), mapFiltersContainer);
};

generateAdvertCard(cardsData[0]);
insertAdvertCard();
