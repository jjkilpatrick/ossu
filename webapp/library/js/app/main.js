define(["jquery", "jquery.alpha", "jquery.beta"], function($) {

    if (ossu === undefined) var ossu = {};

    ossu.Application = function() {

        var self = this;

        var clientId = "615387787130.apps.googleusercontent.com",
            apiKey = "AIzaSyCTQEqICWulDkacI5dQvdWpsl39eHI7wMs";

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
                        self.renderWeather(data.cachedWeather);
                    }
                }
            });
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

        this.init()

    };

    $(function() {

        ossu = new ossu.Application();

        /*********************
        Global Vars
        *********************/

        // var clientId = "615387787130.apps.googleusercontent.com",
        //     apiKey = "AIzaSyCTQEqICWulDkacI5dQvdWpsl39eHI7wMs",
        //     $time = $('.time'),
        //     $date = $('.date'),
        //     weekdays = [
        //         "Sunday",
        //         "Monday",
        //         "Tuesday",
        //         "Wednesday",
        //         "Thursday",
        //         "Friday",
        //         "Saturday",
        //     ],
        //     months = [
        //         "January",
        //         "February",
        //         "March",
        //         "April",
        //         "May",
        //         "June",
        //         "July",
        //         "August",
        //         "September",
        //         "October",
        //         "November",
        //         "December"
        //     ],
        //     weatherMap = {
        //         "fog": "g",
        //         "hazy": "g",
        //         "nt_fog": "g",
        //         "nt_hazy": "g",
        //         "chanceflurries": "p",
        //         "chancesnow": "p",
        //         "chancesleet": "4",
        //         "chancerain": "7",
        //         "chancetstorms": "x",
        //         "tstorms": "z",
        //         "nt_tstorms": "z",
        //         "clear": "v",
        //         "sunny": "v",
        //         "cloudy": "`",
        //         "flurries": "]",
        //         "nt_flurries": "]",
        //         "fog": "g",
        //         "hazy": "g",
        //         "nt_fog": "g",
        //         "nt_hazy": "g",
        //         "mostlycloudy": "1",
        //         "partlysunny": "1",
        //         "partlycloudy": "1",
        //         "mostlysunny": "1",
        //         "sleet": "3",
        //         "nt_sleet": "3",
        //         "rain": "6",
        //         "nt_rain": "6",
        //         "snow": "o",
        //         "nt_snow": "o",
        //         "nt_chanceflurries": "a",
        //         "nt_chancerain": "8",
        //         "nt_chancesleet": "5",
        //         "nt_chancesnow": "[",
        //         "nt_chancetstorms": "c",
        //         "nt_clear": "/",
        //         "nt_sunny": "/",
        //         "nt_cloudy": "2",
        //         "nt_mostlycloudy": "2",
        //         "nt_partlysunny": "2",
        //         "nt_partlycloudy": "2",
        //         "nt_mostlysunny": "2"
        //     },
        //     windDirection = {
        //         "North": "U",
        //         "East": "I",
        //         "South": "O"
        //     },
        //     options = {};
        /*********************
        Google Calendar
        *********************/

        // function fetchCalendars() {

        //     chrome.storage.sync.get('calendars', function(data) {
        //         var storedCalendars = data['calendars'] || {};

        //         $.get('https://www.google.com/calendar/feeds/default/allcalendars/full', function(data) {
        //             this.isAuthed = true;

        //             console.log(data);
        //         });

        //     });

        // }

        /*********************
        Geolocation
        *********************/

        // function geoLocation() {
        //     if (navigator.geolocation) {
        //         console.log(navigator);
        //         navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        //     }
        // }

        // function successCallback(position) {
        //     var lat = position.coords.latitude;
        //     var lng = position.coords.longitude;
        //     getWeather(lat, lng);
        // }

        // function errorCallback(error) {
        //     console.log('error code ' + error.code);
        // }

        /*********************
        Lunar
        *********************/

        // function setLunarDate() {
        //     var now = new Date();
        //     var year = now.getFullYear();
        //     var month = now.getMonth();
        //     var day = now.getDay();

        //     var lp = 2551443;
        //     var now = new Date(year, month - 1, day, 20, 35, 0);
        //     var new_moon = new Date(1970, 0, 7, 20, 35, 0);
        //     var phase = ((now.getTime() - new_moon.getTime()) / 1000) % lp;
        //     return Math.floor(phase / (24 * 3600)) + 1;
        // }

        /*********************
        Weather + Location
        *********************/

        // function getWeather(lat, lng) {
        //     //wunderground javascript
        //     $.ajax({
        //         url: "http://api.wunderground.com/api/adb290928409d8a2/forecast/geolookup/conditions/q/" + lat + "," + lng + ".json",
        //         //dataType : "jsonp",
        //         type: 'GET',
        //         retryLimit: 10,
        //         dataType: "json",
        //         tryCount: 0,
        //         success: function(data) {
        //             setWeather(data);
        //             setLocation(data);
        //         }
        //     });
        // }

        // function setWeather(data) {

        //     var dataMap = {
        //         condition: data.current_observation.icon,
        //         temp: data.current_observation.temp_c,
        //         wind: data.current_observation.wind_string,
        //         windMPH: data.current_observation.wind_gust_mph,
        //         windDir: data.current_observation.wind_dir,
        //         weather: data.current_observation.weather
        //     }

        //     var cacheTime = new Date();
        //     dataMap['cachedTime'] = cacheTime.getTime();

        //     chrome.storage.sync.set({
        //         'cachedWeather': dataMap
        //     });
        // }

        // function getCachedWeather() {
        //     chrome.storage.sync.get('cachedWeather', function(data) {
        //         if (data.cachedWeather) {
        //             if (String(data.cachedWeather.condition).length > 0) {
        //                 renderWeather(data.cachedWeather);
        //             }
        //         }
        //     });
        // }

        // function renderWeather(data) {
        //     $('.weather').append(weatherMap[data.condition]);
        //     $('.temp').append(data.temp + '&#176;');
        //     $('.overview').append('Mostly: ' + data.weather + ' - Wind: ' + data.wind + ' ' + data.windMPH + 'mph ' + data.windDir);
        // }

        // function setLocation(data) {
        //     var location = data['location']['city'];
        //     var locationArray = location.split(" ");
        //     var city = locationArray[0];
        //     var country = data['location']['country_name'];

        //     var cacheTime = new Date();
        //     var cachedTime = cacheTime.getTime();

        //     chrome.storage.sync.set({
        //         'cachedLoction': {
        //             'cachedTime': cachedTime,
        //             'city': city,
        //             'country': country
        //         }
        //     });
        // }

        // function getCachedLocation() {
        //     chrome.storage.sync.get('cachedLoction', function(data) {
        //         if (data.cachedLoction) {
        //             if (String(data.cachedLoction.city).length > 0) {
        //                 renderLocation(data.cachedLoction);
        //             }
        //             return false;
        //         }

        //     });
        // }

        // function renderLocation(data) {
        //     $('.place').append(data.city + ', ' + data.country);
        // }

        /*********************
        Time & Date
        *********************/

        // function updateTime() {
        //     var now = new Date();
        //     var year = now.getFullYear();
        //     var hour = now.getHours();
        //     var min = now.getMinutes();
        //     var sec = now.getSeconds();
        //     var meridiem = "AM";
        //     if (hour > 11) {
        //         meridiem = "PM";
        //     }
        //     if (hour > 12) {
        //         hour = hour - 12;
        //     }
        //     if (hour == 0) {
        //         hour = 12;
        //     }
        //     if (min < 10) {
        //         min = "0" + min;
        //     }

        //     setTimeout(updateTime, 1000);
        // }

        // function getTime() {
        //     var now = new Date(),

        //         date = now.getDate(),
        //         month = months[now.getMonth()],
        //         day = weekdays[now.getDay()],

        //         hour = now.getHours(),
        //         min = now.getMinutes(),
        //         sec = now.getSeconds(),
        //         meridiem = "AM";

        //     if (hour > 11) {
        //         meridiem = "PM";
        //     }
        //     if (hour > 12) {
        //         hour = hour - 12;
        //     }
        //     if (hour == 0) {
        //         hour = 12;
        //     }
        //     if (min < 10) {
        //         min = "0" + min;
        //     }

        //     return {
        //         day: day,
        //         month: month,
        //         date: date + getDateSuffix(date),
        //         hour: appendZero(now.getHours()),
        //         minute: appendZero(now.getMinutes()),
        //         second: appendZero(now.getSeconds()),
        //         meridiem: meridiem
        //     };

        // }

        // function getDateSuffix(date) {
        //     switch (date) {
        //         case 1:
        //         case 21:
        //         case 31:
        //             return 'st';
        //         case 2:
        //         case 22:
        //             return 'nd';
        //         case 3:
        //         case 23:
        //             return 'rd';
        //         default:
        //             return 'th';
        //     }
        // }

        // function appendZero(num) {
        //     if (num < 10) {
        //         return "0" + num;
        //     }
        //     return num;
        // }

        // function refreshTimeDate() {
        //     var now = getTime();
        //     $date.html(now.day + ' ' + now.date + ' ' + now.month);
        //     $time.html("<span class='hour'>" + now.hour + "</span><span class='join'>:</span><span class='minute'>" + now.minute + "</span>");
        // }

        /*********************
        Runtime
        *********************/

        // function loader(callback) {
        //     // Defaults shiz
        // }

        // loader(function() {
        //     refreshTimeDate();
        // })
        // setInterval(refreshTimeDate, 1000);

        // $(document).ready(function() {
        //     refreshTimeDate();
        //     geoLocation();
        //     getCachedLocation();
        //     getCachedWeather();
        //     // fetchCalendars();
        //     $('.container').fadeIn('400');
        //     // setLunarDate();
        //     // 
        //     $('#app').click(function(e) {
        //         e.preventDefault();
        //         chrome.tabs.update({
        //             url: 'chrome://apps'
        //         });
        //     });
        // });

    });

});