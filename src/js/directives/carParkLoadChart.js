angular.module('app')
        .directive('carParkLoadChart', function () {
            return {
                restrict: 'AE',
                scope: {
                    carParkLoadColor: '@',
                    title: '@',
                    body: '@',
                    leftButtonText: '@',
                    rightButtonText: '@'
                },
                controller: function ($scope) {
                    $scope.closeModal = function () {
                        $(".modal-backdrop").remove();
                        $(".modal-open").css("overflow", "auto");
                    };
                },
                templateUrl: 'tpl/blocks/car-park-load-chart.html'
            };
        });


