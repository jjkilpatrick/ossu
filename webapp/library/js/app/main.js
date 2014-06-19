define(["jquery", "jquery.alpha", "jquery.beta"], function($) {

    if (ossu === undefined) var ossu = {};

    ossu.Application = function() {

        var self = this;

        var clientId = "",
            apiKey = "";

        this.init = function() {
            // Time
            self.refreshTimeDate();
            // Location
            self.geoLocation();
            self.getCachedLocation();
            // Weather
            self.getCachedWeather();

            setInterval(self.refreshTimeDate, 1000);
        };

        // Time

        this.refreshTimeDate = function() {
            var now = self.getTime(),
                time = $('.time'),
                date = $('.date');

            date.html(now.day + ' ' + now.date + ' ' + now.month);
            time.html("<span class='hour'>" + now.hour + "</span><span class='join'>:</span><span class='minute'>" + now.minute + "</span>");
        }

        this.getTime = function() {
            var now = new Date(),
                weekdays = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                ],
                months = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                date = now.getDate(),
                month = months[now.getMonth()],
                day = weekdays[now.getDay()],
                hour = now.getHours(),
                min = now.getMinutes(),
                sec = now.getSeconds(),
                meridiem = "AM";

            if (hour > 11) {
                meridiem = "PM";
            }
            if (hour > 12) {
                hour = hour - 12;
            }
            if (hour == 0) {
                hour = 12;
            }
            if (min < 10) {
                min = "0" + min;
            }

            return {
                day: day,
                month: month,
                date: date + self.getDateSuffix(date),
                hour: self.appendZero(now.getHours()),
                minute: self.appendZero(now.getMinutes()),
                second: self.appendZero(now.getSeconds()),
                meridiem: meridiem
            };
        }

        this.getDateSuffix = function(date) {
            switch (date) {
                case 1:
                case 21:
                case 31:
                    return 'st';
                case 2:
                case 22:
                    return 'nd';
                case 3:
                case 23:
                    return 'rd';
                default:
                    return 'th';
            }
        }

        this.appendZero = function(num) {
            if (num < 10) {
                return "0" + num;
            }
            return num;
        }

        // Location

        this.geoLocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError);
            }

            function geoLocationSuccess(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                self.getWeather(lat, lng);
            }

            function geoLocationError(error) {
                console.log('error code ' + error.code);
            }
        }

        this.getCachedLocation = function() {
            chrome.storage.sync.get('cachedLoction', function(data) {
                if (data.cachedLoction) {
                    if (String(data.cachedLoction.city).length > 0) {
                        self.renderLocation(data.cachedLoction);
                    }
                } else {

                }

            });
        }

        this.renderLocation = function(data) {
            $('.place').append(data.city + ', ' + data.country);
        }

        this.setLocation = function(data) {
            var location = data['location']['city'];
            var locationArray = location.split(" ");
            var city = locationArray[0];
            var country = data['location']['country_name'];
            var cacheTime = new Date();
            var cachedTime = cacheTime.getTime();

            chrome.storage.sync.set({
                'cachedLoction': {
                    'cachedTime': cachedTime,
                    'city': city,
                    'country': country
                }
            });
        }

        // Weather

        this.getWeather = function(lat, lng) {
            $.ajax({
                url: "http://api.wunderground.com/api/adb290928409d8a2/forecast/geolookup/conditions/q/" + lat + "," + lng + ".json",
                type: 'GET',
                retryLimit: 10,
                dataType: "json",
                tryCount: 0,
                success: function(data) {
                    self.setWeather(data);
                    self.setLocation(data);
                }
            });
        }

        this.setWeather = function(data) {

            var dataMap = {
                condition: data.current_observation.icon,
                temp: data.current_observation.temp_c,
                wind: data.current_observation.wind_string,
                windMPH: data.current_observation.wind_gust_mph,
                windDir: data.current_observation.wind_dir,
                weather: data.current_observation.weather
            }

            var cacheTime = new Date();
            dataMap['cachedTime'] = cacheTime.getTime();

            chrome.storage.sync.set({
                'cachedWeather': dataMap
            });

        }

        this.getCachedWeather = function() {
            chrome.storage.sync.get('cachedWeather', function(data) {
                if (data.cachedWeather) {
                    if (String(data.cachedWeather.condition).length > 0) {
                        self.renderBackground(data.cachedWeather);
                        self.renderWeather(data.cachedWeather);
                    }
                }
            });
        }

        this.renderBackground = function(data) {

            console.log(data.condition);

            var backgroundMap = {
                "fog": "fog.jpg",
                "hazy": "hazy.jpg",
                "nt_fog": "fog.jpg",
                "nt_hazy": "hazy.jpg",
                // "chanceflurries": 
                "chancesnow": "chancesnow.jpg",
                // "chancesleet":
                "chancerain": "chancerain.jpg",
                "chancetstorms": "chancetstorms.jpg",
                "tstorms": "chancetstorms.jpg",
                "nt_tstorms": "chancetstorms.jpg",
                "clear": "clear.jpg",
                "sunny": "sunny.jpg",
                "cloudy": "cloudy.jpg",
                // "flurries"
                // "nt_flurries"
                "fog": "fog.jpg",
                "hazy": "hazy.jpg",
                "nt_fog": "fog.jpg",
                "nt_hazy": "hazy.jpg",
                "mostlycloudy": "mostlycloudy.jpg",
                "partlysunny": "partlysunny.jpg",
                "partlycloudy": "partlycloudy.jpg",
                "mostlysunny": "mostlysunny.jpg",
                // "sleet"
                // "nt_sleet"
                "rain": "rain.jpg",
                "nt_rain": "rain.jpg",
                "snow": "chancesnow.jpg",
                "nt_snow": "chancesnow.jpg",
                // "nt_chanceflurries": "",
                "nt_chancerain": "rain.jpg",
                // "nt_chancesleet": "",
                // "nt_chancesnow": "",
                "nt_chancetstorms": "chancetstorms.jpg",
                "nt_clear": "nt_clear.jpg",
                "nt_sunny": "nt_sunny.jpg",
                // "nt_cloudy": "",
                // "nt_mostlycloudy": "",
                // "nt_partlysunny": "",
                // "nt_partlycloudy": "",
                // "nt_mostlysunny": ""
            }

            $('body').css('background-image', 'url(library/images/backgrounds/' + backgroundMap[data.condition] + ')');
        }

        this.renderWeather = function(data) {
            var weatherMap = {
                "fog": "g",
                "hazy": "g",
                "nt_fog": "g",
                "nt_hazy": "g",
                "chanceflurries": "p",
                "chancesnow": "p",
                "chancesleet": "4",
                "chancerain": "7",
                "chancetstorms": "x",
                "tstorms": "z",
                "nt_tstorms": "z",
                "clear": "v",
                "sunny": "v",
                "cloudy": "`",
                "flurries": "]",
                "nt_flurries": "]",
                "fog": "g",
                "hazy": "g",
                "nt_fog": "g",
                "nt_hazy": "g",
                "mostlycloudy": "1",
                "partlysunny": "1",
                "partlycloudy": "1",
                "mostlysunny": "1",
                "sleet": "3",
                "nt_sleet": "3",
                "rain": "6",
                "nt_rain": "6",
                "snow": "o",
                "nt_snow": "o",
                "nt_chanceflurries": "a",
                "nt_chancerain": "8",
                "nt_chancesleet": "5",
                "nt_chancesnow": "[",
                "nt_chancetstorms": "c",
                "nt_clear": "/",
                "nt_sunny": "/",
                "nt_cloudy": "2",
                "nt_mostlycloudy": "2",
                "nt_partlysunny": "2",
                "nt_partlycloudy": "2",
                "nt_mostlysunny": "2"
            };

            $('.weather').append(weatherMap[data.condition]);
            $('.temp').append(data.temp + '&#176;');
            $('.overview').append('Mostly: ' + data.weather + ' - Wind: ' + data.wind + ' ' + data.windMPH + 'mph ' + data.windDir);
        }

        this.init();

    };

    $(function() {

        ossu = new ossu.Application();

    });

});
