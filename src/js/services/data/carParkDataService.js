'use strict';

angular.module('app')
        .factory('carParkDataService', function ($q, dataStorageService) {
            var carParkDataService = {};

            carParkDataService.getLatestEntry = function (carPark, $scope) {
                $scope.error = false;
                $scope.loading = true;
                var deferred = $q.defer();
                dataStorageService.getLatestEntry(carPark).then(function (carParkData) {
                    deferred.resolve(carParkData.data);
                }, function (response) {
                    $scope.error = true;
                    deferred.reject(response);
                }).
                finally(function () {
                    $scope.loading = false;
                });
                return deferred.promise;
            };

            return carParkDataService;
        });


