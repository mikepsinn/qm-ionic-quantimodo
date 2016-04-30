angular.module('starter')

    // Controls the Track Page of the App
    .controller('IntroPageCtrl', function($scope, $ionicModal, $state, $timeout, utilsService, authService,
                                      measurementService, chartService, $ionicPopup, localStorageService, $ionicLoading,
                                          $ionicSlideBoxDelegate) {
        $scope.controller_name = "IntroPageCtrl";

            $scope.view_title = config.appSettings.app_name;
            $scope.primary_outcome_variable = config.appSettings.primary_outcome_variable;
            $scope.primaryOutcomeVariableRatingOptions = config.getPrimaryOutcomeVariableOptions();
            $scope.primary_outcome_variable_numbers = config.getPrimaryOutcomeVariableOptions(true);
            $scope.intro_config = config.appSettings.intro;

            $scope.myIntro = {
                ready : false,

                slideIndex : 0,
                // Called to navigate to the main app
                startApp : function() {
                    $state.go(config.appSettings.default_state);
                },

                next : function() {
                    $ionicSlideBoxDelegate.next();
                },

                previous : function() {
                    $ionicSlideBoxDelegate.previous();
                },

                // Called each time the slide changes
                slideChanged : function(index) {
                    $scope.myIntro.slideIndex = index;
                }
            };

            var init = function(){
                // show loader
                $ionicLoading.show(
                    {
                        noBackdrop: true,
                        template: '<p class="item-icon-left">Loading stuff...<ion-spinner icon="lines"/></p>'
                    }
                );

                $scope.myIntro.ready = true;

                $ionicLoading.hide();

            };

            // when view is changed
            $scope.$on(
                '$ionicView.enter', function(e) {
                    init();
                }
            );
        }
    );