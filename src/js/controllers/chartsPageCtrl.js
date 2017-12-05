angular.module('starter').controller('ChartsPageCtrl', ["$scope", "$q", "$state", "$timeout", "$rootScope",
    "$ionicLoading", "$ionicActionSheet", "$stateParams", "qmService", "qmLogService", "clipboard",
    function($scope, $q, $state, $timeout, $rootScope, $ionicLoading,  $ionicActionSheet, $stateParams, qmService, qmLogService, clipboard) {
    $scope.controller_name = "ChartsPageCtrl";
    $rootScope.showFilterBarSearchIcon = false;
    $scope.state = {title: "Charts"};
    function getVariableName() {
        if($scope.variableName){return $scope.variableName;}
        if(urlHelper.getParam('variableName')){return urlHelper.getParam('variableName');}
        if($stateParams.variableName){return $stateParams.variableName;}
        if($stateParams.variableObject){return $stateParams.variableObject.name;}
        if($scope.state.variableObject){return $scope.state.variableObject.name;}
        $scope.goBack();
    }
    function getScopedVariableObject() {
        if($scope.state.variableObject && $scope.state.variableObject.name === getVariableName()){return $scope.state.variableObject;}
        if($stateParams.variableObject){
            return $scope.state.variableObject = $stateParams.variableObject;
        }
        if(qm.userVariableHelper.getUserVariablesFromLocalStorage(getVariableName())){
            return $scope.state.variableObject = qm.userVariableHelper.getUserVariablesFromLocalStorageByName(getVariableName());
        }
        return $scope.state.variableObject;
    }
    function initializeCharts() {
        if(!getScopedVariableObject() || !getScopedVariableObject().charts){
            qmService.showBlackRingLoader();
            getCharts();
        } else {
            qmService.hideLoader();
        }
    }
    function getCharts(refresh) {
        qmService.getUserVariableByNameFromLocalStorageOrApiDeferred(getVariableName(), {includeCharts: true}, refresh)
            .then(function (variableObject) {
                if(!variableObject.charts){
                    qmLog.error("No charts!");
                    if(!$scope.state.variableObject || !$scope.state.variableObject.charts){
                        qmService.goToDefaultState();
                        return;
                    }
                }
                $scope.state.variableObject = variableObject;
                qmService.hideLoader();
                $scope.$broadcast('scroll.refreshComplete');
            });
    }
    $scope.refreshCharts = function () {getCharts(true);};
    $scope.$on('$ionicView.enter', function(e) { qmLogService.debug('Entering state ' + $state.current.name);
        qmService.unHideNavigationMenu();
        $scope.variableName = getVariableName();
        $scope.state.title = qmService.getTruncatedVariableName(getVariableName());
        $rootScope.showActionSheetMenu = function setActionSheet() {
            return qmService.showVariableObjectActionSheet(getVariableName(), getScopedVariableObject());
        };
        initializeCharts();
        if (!clipboard.supported) {
            console.log('Sorry, copy to clipboard is not supported');
            $scope.hideClipboardButton = true;
        }
    });
    $scope.addNewReminderButtonClick = function() {
        qmLogService.debug('addNewReminderButtonClick', null);
        qmService.goToState('app.reminderAdd', {variableObject: $scope.state.variableObject, fromState: $state.current.name});
    };
    $scope.compareButtonClick = function() {
        qmLogService.debug('compareButtonClick');
        qmService.goToStudyCreationForVariable($scope.state.variableObject);
    };
    $scope.recordMeasurementButtonClick = function() {qmService.goToState('app.measurementAdd',
        {variableObject: $scope.state.variableObject, fromState: $state.current.name});};
    $scope.editSettingsButtonClick = function() {qmService.goToVariableSettingsByObject($scope.state.variableObject);};
    $scope.shareCharts = function(variableObject, sharingUrl, ev){
        if(!variableObject.shareUserMeasurements){
            qmService.showShareVariableConfirmation(variableObject, sharingUrl, ev);
        } else {
            qmService.openSharingUrl(sharingUrl);
        }
    };
}]);
