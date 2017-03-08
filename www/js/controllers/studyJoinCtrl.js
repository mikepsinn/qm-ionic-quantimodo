angular.module('starter')
	.controller('StudyJoinCtrl', function($scope, $state, quantimodoService, $rootScope, $stateParams, $ionicLoading) {
		$scope.controller_name = "StudyJoinCtrl";

        var green = { backgroundColor: "#0f9d58", circleColor: "#03c466" };
        var blue = { backgroundColor: "#3467d6", circleColor: "#5b95f9" };
        var yellow = { backgroundColor: "#f09402", circleColor: "#fab952" };

        $scope.state = {
            title: 'Join Our Study',
            color: blue,
            image: {
                url: "img/quantimodo-robot-puzzled.svg",
                height: "100",
                width: "100"
            },
            bodyText: "One moment please...",
            moreInfo: "No personally identifiable data will be shared.  Data will only be used in an anonymous and " +
                "aggregated form as is done in epidemiological studies."
        };

        $scope.$on('$ionicView.beforeEnter', function(e) {
            $scope.requestParams = {
                //causeVariableName: $rootScope.urlParameters.causeVariableName,
                //effectVariableName: $rootScope.urlParameters.effectVariableName,
                causeVariableName: getParameterByName('causeVariableName'),
                effectVariableName: getParameterByName('effectVariableName'),
            };

            if($stateParams.correlationObject){ $scope.requestParams = $stateParams.correlationObject; }
            if(!$scope.requestParams.causeVariableName){ $scope.goBack(); }
            $scope.state.title = "How does " + $scope.requestParams.causeVariableName + " affect " +
                $scope.requestParams.effectVariableName +"?" ;
            $scope.state.bodyText = "Please help us answer this question by answering just two questions a day.";
            $scope.state.moreInfo = "By taking a few seconds to answer two questions a day and anonymously pooling your responses with thousands " +
                "of other participants, you can help us discover the effects of " + $scope.requestParams.causeVariableName +
                " on " + $scope.requestParams.effectVariableName + ".  After we accumulate a month or two of data, " +
                "you'll also be able to see personalized study results" +
                " showing the likely effects of " + $scope.requestParams.causeVariableName + " on your own " +
                $scope.requestParams.effectVariableName;

        });

        $scope.$on('$ionicView.enter', function(e) { console.debug("Entering state " + $state.current.name);

        });

        $scope.$on('$ionicView.afterEnter', function(){

        });

        $scope.$on('$ionicView.beforeLeave', function(){

        });

        $scope.$on('$ionicView.leave', function(){

        });

        $scope.$on('$ionicView.afterLeave', function(){

        });

        function getParameterByName(name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        $scope.joinStudy = function () {
            $scope.hideJoinStudyButton = true;
            $scope.state.image.url = "img/quantimodo-robot-happy.svg"
            $ionicLoading.show();
            if(!$rootScope.user){
                console.debug('Setting afterLoginGoToState to ' + $state.current.name);
                quantimodoService.setLocalStorageItem('afterLoginGoToState', $state.current.name);
                $ionicLoading.hide();
                $state.go('app.login');
            }
            $scope.state.title = "Joining study...";
            $scope.state.bodyText = "Thank you for helping us accelerate scientific discovery!";
            quantimodoService.joinStudyDeferred($scope.requestParams).then(function () {
                $ionicLoading.hide();
                $scope.state.title = "Thank you!";
                $scope.state.bodyText = "Let's record your first measurements!";
                $scope.showGetStartedButton = true;
            }, function (error) {
                $ionicLoading.hide();
                quantimodoService.reportError(error);
                $scope.showMaterialAlert("Could not join study.", "Please contact mike@quantimo.do and he'll fix it for you.  Thanks!");
            });
        };

        $scope.showMoreInfo = function () {
            $scope.showMaterialAlert($scope.state.title, $scope.state.moreInfo);
        };

	});
