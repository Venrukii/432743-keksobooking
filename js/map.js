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

var propertyTypes =
  ['palace',
    'flat',
    'house',
    'bungalo'];

var apartmentTypes =
   ['Большая уютная квартира',
     'Маленькая неуютная квартира',
     'Огромный прекрасный дворец',
     'Маленький ужасный дворец',
     'Красивый гостевой домик',
     'Некрасивый негостеприимный домик',
     'Уютное бунгало далеко от моря',
     'Неуютное бунгало по колено в воде'];

var checkinTime =
   ['12:00',
     '13:00',
     '14:00'];

var featuresList =
   ['wifi',
     'dishwasher',
     'parking',
     'washer',
     'elevator',
     'conditioner'];

var photos =
   ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
     'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
     'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// Функция генерации случайного числа

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// Генерация одного случайного объекта (карточки) объявления

var generateOneCard = function (index) {

  var addressCoordinates = {
    'coordinateX': getRandomNumber(300, 900),
    'coordinateY': getRandomNumber(150, 500)
  };

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
      'address': addressCoordinates,
      'price': getRandomNumber(PRICE_MIN, PRICE_MAX),
      'type': propertyTypes[getRandomNumber(0, 3)],
      'rooms': getRandomNumber(ROOMS_MIN, ROOMS_MAX),
      'guests': getRandomNumber(GUESTS_MIN, GUESTS_MAX),
      'checkin': checkinTime[getRandomNumber(0, 3)],
      'checkout': checkinTime[getRandomNumber(0, 3)],
      'features': features,
      'description': '',
      'photos': photos
    },

    location: {
      'x': addressCoordinates.coordinateX,
      'y': addressCoordinates.coordinateY
    }
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
    pinsArea.appendChild(pinFragment);
  }
};

drawMapPins(MAX_CARDS); // проверим отрисовку
