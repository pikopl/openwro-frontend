'use strict';

angular.module('app')


        .controller('carParkCtrl', ['$scope', '$interval', 'dateFilter', 'carParkDataService', function ($scope, $interval, dateFilter, carParkDataService) {
              
            var restRequestInterval = 300000; //every 5 min.
            var timeUpdateInterval = 1000; //every 1 sec.
            var milisInMin = 60000;
            var milisInSec = 1000;
            $scope.updateTime = Math.round((restRequestInterval / milisInSec));
            $scope.loadLatestEntries = function(){
                return carParkDataService.getLatestEntries($scope).then(function (latestEntries) {
                    $scope.latestEntries = latestEntries;
                    $scope.latestEntries.forEach(prepareData);
                    
                });
            };
            
            function prepareData(latestEntry){
                    var trend = {};
                    //prepare trend
                    trend.value = latestEntry.carOutAmount - latestEntry.carInAmount;
                    if (trend.value > 0){
                        trend.color = "green";
                        trend.text = "miejsc(a) zwolniono";
                        trend.icon = "fa-caret-up";
                    }else if (trend.value < 0){
                        trend.value = - trend.value;
                        trend.color = "red";
                        trend.text = "miejsc(e) ubylo";
                        trend.icon = "fa-caret-down";
                    }else{ //trend = 0
                        trend.color = "";
                        trend.text = "bez zmian";
                        trend.icon = "";
                    }
                    latestEntry.trend = trend;
                    //prepare chart
                    var carParkLoad = {};
                    carParkLoad.value = Math.round(((latestEntry.carPark.capacity - latestEntry.freePlaceAmount) / latestEntry.carPark.capacity) * 100);
                    if (carParkLoad.value >= 0 && carParkLoad.value < 80){
                        carParkLoad.color = "success";
                        carParkLoad.font = "none";
                        carParkLoad.chartColor = $scope.app.color.success;
                    }else if (carParkLoad.value >= 80 && carParkLoad.value < 99){
                        carParkLoad.color = "warning";
                        carParkLoad.font = "warning";
                        carParkLoad.chartColor = $scope.app.color.warning;
                    }else{ //carParkLoad.value >= 99
                        carParkLoad.color = "danger";
                        carParkLoad.font = "times-circle";
                        carParkLoad.chartColor = $scope.app.color.danger;
                    }
                    latestEntry.carParkLoad = carParkLoad;
                    
                    //prepare read time
                    var readTime = {};
                    readTime.useDate = false;
                    readTime.value = Math.round((new Date() - latestEntry.timestamp) / milisInMin);
                    if (readTime.value < 0){
                        readTime.value = 0;
                    }
                    readTime.outDated = false;
                    if (readTime.value < 60){
                        readTime.value = readTime.value + ' min. temu (' + dateFilter(latestEntry.timestamp, 'HH:mm:ss dd-MM-yyyy') + ')';
                    }else {
                        readTime.useDate = true;
                        readTime.value = latestEntry.timestamp;
                        readTime.outDated = true;
                        if (readTime.value >= 60 && readTime.value < 1440){
                            carParkLoad.color = "warning";
                            carParkLoad.font = "warning";
                        }else{
                            carParkLoad.color = "info";
                            carParkLoad.font = "info";
                        }
                    }
                    latestEntry.readTime = readTime;
            };
            var timeoutIdForTimeUpdate, timeoutIdForRestRequest;
            
            function updateTime() {
                $scope.updateTime = $scope.updateTime - 1;
                if ($scope.updateTime === 0){
                    $scope.updateTime = Math.round((restRequestInterval / milisInSec));;
                }
            }
            

            $scope.$on('$destroy', function() {
                $interval.cancel(timeoutIdForTimeUpdate);
                $interval.cancel(timeoutIdForRestRequest);
            });

            // start the UI update process; save the timeoutId for canceling
            timeoutIdForTimeUpdate = $interval(updateTime, timeUpdateInterval);
            
            timeoutIdForRestRequest = $interval($scope.loadLatestEntries, restRequestInterval); //every 5 min.
}]);

