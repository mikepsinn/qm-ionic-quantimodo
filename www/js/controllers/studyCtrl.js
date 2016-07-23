angular.module('starter')
	.controller('StudyCtrl', function($scope, $ionicModal, $timeout, measurementService, $ionicLoading,
                                         $state, $ionicPopup, correlationService, $rootScope,
                                         localStorageService, utilsService, authService, $stateParams, $ionicHistory) {

        $scope.state = {
            correlationObject: $stateParams.correlationObject
        };
		$scope.controller_name = "StudyCtrl";
        
        $scope.init = function(){
            authService.checkAuthOrSendToLogin();
            if (typeof analytics !== 'undefined')  {analytics.trackView("Study Controller");}
            if(!$scope.state.correlationObject) {
                $ionicHistory.backView();
            }
        };

        $scope.$on('$ionicView.enter', function(e){
            $scope.init();
        });
	});