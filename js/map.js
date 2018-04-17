'use strict';

var MAX_CARDS = 8;
var PIN_SIZE = 40;
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

//Функция генерации случайного числа

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

//Генерация одного случайного объекта объявления

var generateOneCard = function(index) {
  var newObj = {};
  var author = {
    'avatar': 'img/avatars/user0' + (index + 1) +'.png'
  };

  var addressCoordinates = {
    'coordinateX': getRandomNumber(300, 900),
    'coordinateY': getRandomNumber(150, 500)
  };

  var features = [];
  var featuresCount = getRandomNumber(0, featuresList.length);

  for (var i = 0; i < featuresCount; i++) {
    features[i] = featuresList[i];
  }

  var offer = {
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
  };

  var location = {
    'x': addressCoordinates.coordinateX,
    'y': addressCoordinates.coordinateY
  };

  newObj['author'] = author;
  newObj['offer'] = offer;
  newObj['location'] = location;

  return newObj;
};

// Собрали объекты в массив

var generateCardsArr = function(cardsMax) {
  var cardsData = [];
  for (var i = 0; i < MAX_CARDS; i++) {
  cardsData.push(generateOneCard(i));
  }
  return cardsData;
};

 //Убираем класс map--faded

document.querySelector('.map.map--faded').classList.remove('map--faded');


//Создаем метки на карте на основе массива данных

var generateOnePin = function (cardsData) {
  var mapPin = document.createElement('button');
  var pinImg = document.createElement('img');

  mapPin.classList.add('map__pin');
  mapPin.style.left = cardsData.location.x - PIN_SIZE / 2 + 'px';
  mapPin.style.top = cardsData.location.y + PIN_SIZE + 'px';

  pinImg.src = cardsData.author.avatar;
  pinImg.alt = cardsData.offer.title;

  mapPin.appendChild(pinImg);

  return mapPin;
};

//Отрисовываем метки на карте

var drawMapPins = function (pinMax) {
  var pinsArea = document.querySelector('.map__pins');
  var pinFragment = document.createDocumentFragment();

  for (var i = 0; i < pinMax; i++) {
    pinFragment.appendChild(generateOnePin(generateCardsArr(i)));
  }

  pinsArea.appendChild(pinFragment);
};


drawMapPins(MAX_CARDS);











