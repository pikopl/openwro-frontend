'use strict';

angular.module('app')


        .controller('carParkCtrl', function ($scope, carParkDataService) {
    
            $scope.loadLatestEntry = function (carPark) {
                return carParkDataService.getLatestEntry(carPark, $scope).then(function (latestEntry) {
                    $scope.latestEntry = latestEntry;
                    
                    var trend = {};
                    //prepare trend
                    trend.value = $scope.latestEntry.carOutAmount - $scope.latestEntry.carInAmount;
                    if (trend.value > 0){
                        trend.color = "green";
                        trend.text = "miejsc(a) zwolniono";
                        trend.icon = "fa-caret-up";
                    }else if (trend.value < 0){
                        trend.value = - trend.value;
                        trend.color = "red";
                        trend.text = "miejsc(e) ubylo";
                        trend.icon = "fa-caret-down";
                    }else{ //$scope.trend = 0
                        trend.color = "";
                        trend.text = "bez zmian";
                        trend.icon = "";
                    }
                    $scope.trend = trend;
                    //prepare chart
                    var carParkLoad = {};
                    carParkLoad.value = Math.round((($scope.latestEntry.carPark.capacity - $scope.latestEntry.freePlaceAmount) / $scope.latestEntry.carPark.capacity) * 100);
                    if (carParkLoad.value >= 0 && carParkLoad.value < 70){
                        carParkLoad.color = "success";
                    }else if (carParkLoad.value >= 70 && carParkLoad.value < 90){
                        carParkLoad.color = "warning";
                    }else{ //carParkLoad.value >= 90
                        carParkLoad.color = "danger";
                    }
                    $scope.carParkLoad = carParkLoad;
                    
                    //prepare read time
                    var milisInMin = 60000;
                    var readTime = {};
                    readTime.useDate = false;
                    readTime.value = Math.round((new Date() - $scope.latestEntry.timestamp) / milisInMin); 
                    readTime.outDated = false;
                    if (readTime.value < 60){
                        readTime.value = readTime.value + ' min. temu';
                    }else {
                        readTime.useDate = true;
                        readTime.value = $scope.latestEntry.timestamp;
                        readTime.outDated = true;
                        if (readTime.value >= 60 && readTime.value < 1440){
                            carParkLoad.color = "warning";
                        }else{
                            carParkLoad.color = "info";
                        }
                    }
                    $scope.readTime = readTime;
                });
            };
           
});

