'use strict';

angular.module('app')
        .factory('dataStorageService', function ($http/*, envConfig*/) {
            var dataStorageService = {};

            dataStorageService.getLatestEntry = function (carPark) {
                return $http({
                    method: 'get',
                    url: 'http://carparks-openwro.rhcloud.com/carparks/latestEntry/' + carPark
                    //url: envConfig.restUrl + '/latestEntry/' + carPark
                });
            };

            return dataStorageService;
        });


