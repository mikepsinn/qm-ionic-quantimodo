angular.module('starter')
	
	// Controls the settings page
	.controller('SettingsCtrl', function($scope,localStorageService, $ionicModal, $timeout, utilsService, authService,
										 measurementService, chartService, $ionicPopover, $cordovaFile,
										 $cordovaFileOpener2, $ionicPopup, $state,notificationService, QuantiModo,
                                         $rootScope, reminderService) {
		$scope.controller_name = "SettingsCtrl";
		$scope.state = {};
		$scope.showReminderFrequencySelector = config.appSettings.settingsPageOptions.showReminderFrequencySelector;
		$rootScope.isIOS = ionic.Platform.isIPad() || ionic.Platform.isIOS();
		$rootScope.isAndroid = ionic.Platform.isAndroid();
        $rootScope.isChrome = window.chrome ? true : false;
	    // populate user data
		//$scope.state.combineNotifications = true;
		$scope.state.combineNotifications = $rootScope.combineNotifications;
		console.debug('CombineNotifications is '+ $scope.state.combineNotifications);
		$scope.state.trackLocation = $rootScope.trackLocation;
		console.debug('trackLocation is '+ $scope.state.trackLocation);

		// populate ratings interval
		localStorageService.getItem('primaryOutcomeRatingFrequencyDescription', function (primaryOutcomeRatingFrequencyDescription) {
			$scope.primaryOutcomeRatingFrequencyDescription = primaryOutcomeRatingFrequencyDescription ? primaryOutcomeRatingFrequencyDescription : "daily";
			if($rootScope.isIOS){
				if($scope.primaryOutcomeRatingFrequencyDescription !== 'hour' &&
					$scope.primaryOutcomeRatingFrequencyDescription !== 'day' &&
					$scope.primaryOutcomeRatingFrequencyDescription !== 'never'
				) {
					$scope.primaryOutcomeRatingFrequencyDescription = 'day';
					localStorageService.setItem('primaryOutcomeRatingFrequencyDescription', 'day');
				}
			}
		});
		// load rating popover
		$ionicPopover.fromTemplateUrl('templates/settings/ask-for-a-rating.html', {
			scope: $scope
		}).then(function(popover) {
			$scope.ratingPopover = popover;
		});
		// when interval is updated
		$scope.saveRatingInterval = function(interval){
			//schedule notification
			//TODO we can pass callback function to check the status of scheduling
			$scope.saveInterval(interval);
			localStorageService.setItem('primaryOutcomeRatingFrequencyDescription', interval);
			$scope.primaryOutcomeRatingFrequencyDescription = interval;
			// hide popover
			$scope.ratingPopover.hide();
		};
		
        // when login is tapped
	    $scope.loginFromSettings = function(){
			$state.go('app.login');
	    };

		function sendWithMailTo(subjectLine, emailBody){
                    var emailUrl = 'mailto:?subject=' + subjectLine + '&body=' + emailBody;
                    if($rootScope.isChromeExtension){
                        console.debug('isChromeExtension so sending to website to share data');
                        var url = config.getURL("api/v2/account/applications", true);
                        var newTab = window.open(url,'_blank');
                        if(!newTab){
                            alert("Please unblock popups and refresh to access the Data Sharing page.");
                        }
                        $rootScope.hideNavigationMenu = false;
                        $state.go(config.appSettings.defaultState);
        
                    } else {
                        console.debug('window.plugins.emailComposer not found!  Generating email normal way.');
						window.location.href = emailUrl;
                    }
                }

		function sendWithEmailComposer(subjectLine, emailBody){
                    document.addEventListener('deviceready', function () {
                        console.debug('deviceready');
                        cordova.plugins.email.isAvailable(
                            function (isAvailable) {
                                if(isAvailable){
                                    if(window.plugins && window.plugins.emailComposer) {
                                        console.debug('Generating email with cordova-plugin-email-composer');
                                        window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                                                console.log("Response -> " + result);
                                            },
                                            subjectLine, // Subject
                                            emailBody,                      // Body
                                            null,    // To
                                            'info@quantimo.do',                    // CC
                                            null,                    // BCC
                                            true,                   // isHTML
                                            null,                    // Attachments
                                            null);                   // Attachment Data
                                    } else {
                                        console.error('window.plugins.emailComposer not available!');
										sendWithMailTo(subjectLine, emailBody);
                                    }
                                } else {
                                    console.error('Email has not been configured for this device!');
									sendWithMailTo(subjectLine, emailBody);
                                }
                            }
                        );
        
                    }, false);
                }

		$scope.sendSharingInvitation= function() {
			var subjectLine = "I%27d%20like%20to%20share%20my%20data%20with%20you";
			var emailBody = "Hi!%20%20%0A%0AI%27m%20tracking%20my%20health%20and%20happiness%20with%20an%20app%20and%20I%27d%20like%20to%20share%20my%20data%20with%20you.%20%20%0A%0APlease%20generate%20a%20data%20authorization%20URL%20at%20https%3A%2F%2Fapp.quantimo.do%2Fapi%2Fv2%2Fphysicians%20and%20email%20it%20to%20me.%20%0A%0AThanks!%20%3AD";

			if($rootScope.isMobile){
				sendWithEmailComposer(subjectLine, emailBody);
			} else {
				sendWithMailTo(subjectLine, emailBody);

			}
		};


        
		$scope.init = function(){
			Bugsnag.context = "settings";
			if (typeof analytics !== 'undefined')  { analytics.trackView("Settings Controller"); }
			$scope.shouldWeCombineNotifications();
			$scope.shouldWeTrackLocation();
	    };

		$scope.contactUs = function(){
			$scope.hideLoader();
			if ($rootScope.isChromeApp) {
				window.location = 'mailto:help@quantimo.do';
			}
			else {
				window.location = '#app/feedback';
			}
		};
		
		$scope.postIdea = function() {
			$scope.hideLoader();
			if ($rootScope.isChromeApp) {
				window.location = 'mailto:help@quantimo.do';
			}
			else {
				window.open('http://help.quantimo.do/forums/211661-general', '_blank');
			}
		};

		$scope.combineNotificationChange = function() {
			
			console.log('Combine Notification Change', $scope.state.combineNotifications);
			$rootScope.combineNotifications = $scope.state.combineNotifications;
			localStorageService.setItem('combineNotifications', $scope.state.combineNotifications);
			if($scope.state.combineNotifications){
				$ionicPopup.alert({
					title: 'Disable Multiple Notifications',
					template: 'You will only get one notification at a time instead of a separate notification for each reminder that you create.'
				});

				notificationService.cancelAllNotifications().then(function() {

					localStorageService.getItem('primaryOutcomeRatingFrequencyDescription', function (primaryOutcomeRatingFrequencyDescription) {
						console.debug("Cancelled individual notifications and now scheduling combined one with interval: " + primaryOutcomeRatingFrequencyDescription);
						$scope.primaryOutcomeRatingFrequencyDescription = primaryOutcomeRatingFrequencyDescription ? primaryOutcomeRatingFrequencyDescription : "daily";
						$scope.saveInterval($scope.primaryOutcomeRatingFrequencyDescription);
					});
				});
			} else {
				$ionicPopup.alert({
					title: 'Enable Multiple Notifications',
					template: 'You will get a separate notification for each reminder that you create.'
				});

				notificationService.cancelAllNotifications().then(function() {
					console.debug("Cancelled combined notification and now scheduling individual ones");
					reminderService.refreshTrackingRemindersAndScheduleAlarms();
				});
			}
			
		};

		$scope.trackLocationChange = function() {

			console.log('trackLocation', $scope.state.trackLocation);
			$rootScope.trackLocation = $scope.state.trackLocation;
			localStorageService.setItem('trackLocation', $scope.state.trackLocation);
			if($scope.state.trackLocation){
				$scope.getLocation();
			} else {
				console.debug("Do not track location");
			}

		};

        $scope.logout = function(){

            var startLogout = function(){
                console.log('Logging out...');
                $scope.hideLoader();
                $rootScope.user = null;
                $rootScope.isMobile = window.cordova;
                $rootScope.isBrowser = ionic.Platform.platforms[0] === "browser";
                if($rootScope.isMobile || !$rootScope.isBrowser){
                    console.log('startLogout: Open the auth window via inAppBrowser.  Platform is ' + ionic.Platform.platforms[0]);
                    var ref = window.open(config.getApiUrl() + '/api/v2/auth/logout','_blank', 'location=no,toolbar=yes');

                    console.log('startLogout: listen to its event when the page changes');

                    ref.addEventListener('loadstart', function(event) {
                        ref.close();
                        $scope.showDataClearPopup();
                    });
                } else {
                    $scope.showDataClearPopup();
                }
            };

            function refreshTrackingPageAndGoToWelcome() {
                localStorageService.setItem('isWelcomed', false);
				//hard reload
				$state.go(config.appSettings.welcomeState, {}, {
					reload: true
				});
            }

            $scope.showDataClearPopup = function(){
                $ionicPopup.show({
                    title:'Clear local storage?',
                    subTitle: 'Do you want do delete all data from local storage?',
                    scope: $scope,
                    buttons:[
                        {
                            text: 'No',
                            type: 'button-assertive',
                            onTap : afterLogoutDoNotDeleteMeasurements
                        },
                        {
                            text: 'Yes',
                            type: 'button-positive',
                            onTap: completelyResetAppState
                        }
                    ]

                });
            };
            
            var completelyResetAppState = function(){
                $rootScope.user = null;
                localStorageService.clear();
                notificationService.cancelAllNotifications();
              	logoutOfApi();
                //TODO: Fix this
                //QuantiModo.logoutOfApi();
				//hard reload
				$state.go(config.appSettings.welcomeState, {}, {
					reload: true
				});
            };
            
            var afterLogoutDoNotDeleteMeasurements = function(){
                $rootScope.user = null;
                clearTokensFromLocalStorage();
                logoutOfApi();
                //TODO: Fix this
                //QuantiModo.logoutOfApi();
                refreshTrackingPageAndGoToWelcome();
            };

            startLogout();
        };

        // when user is logging out
        function clearTokensFromLocalStorage() {
            //Set out local storage flag for welcome screen variables
            localStorageService.setItem('isLoggedIn', false);

            localStorageService.setItem('primaryOutcomeVariableReportedWelcomeScreen', true);
            localStorageService.deleteItem('accessToken');
            localStorageService.deleteItem('refreshToken');
            localStorageService.deleteItem('expiresAt');
        }

		// when user is logging out
        function logoutOfApi() {
			var logoutUrl = config.getURL("api/v2/auth/logout");
			window.open(logoutUrl,'_blank');
        }

	    // Convert all data Array to a CSV object
	    var convertToCSV = function(objArray) {
	        var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
	        var str = '';
	        for (var i = 0; i < array.length; i++) {
	            var line = '';
	            for (var index in array[i]) {
	                if (line != '') {
						line += ',';
					}
	                line += array[i][index];
	            }
	            str += line + '\r\n';
	        }
	        return str;
	    };
		

		// When Export is tapped
		$scope.exportCsv = function(){
			$ionicPopup.alert({
				title: 'Export Request Sent!',
				template: 'Your data will be emailed to you.  Enjoy your life! So do we!'
			});

			QuantiModo.postMeasurementsCsvExport(function(response){
				if(response.success) {

				} else {
					alert("Could not export measurements.");
					console.log("error", response);
				}
			}, function(response){
				alert("Could not export measurements.");
				console.log("error", response);
			});
		};

		// When Export is tapped
		$scope.exportPdf = function(){
			$ionicPopup.alert({
				title: 'Export Request Sent!',
				template: 'Your data will be emailed to you.  Enjoy your life! So do we!'
			});

			QuantiModo.postMeasurementsPdfExport(function(response){
				if(response.success) {

				} else {
					alert("Could not export measurements.");
					console.log("error", response);
				}
			}, function(response){
				alert("Could not export measurements.");
				console.log("error", response);
			});
		};

		// When Export is tapped
		$scope.exportXls = function(){
			$ionicPopup.alert({
				title: 'Export Request Sent!',
				template: 'Your data will be emailed to you.  Enjoy your life! So do we!'
			});
			
			QuantiModo.postMeasurementsXlsExport(function(response){
				if(response.success) {


				} else {
					alert("Could not export measurements.");
					console.log("error", response);
				}
			}, function(response){
				alert("Could not export measurements.");
				console.log("error", response);
			});
		};

		// when view is changed
		$scope.$on('$ionicView.enter', function(e) {
			$scope.state.trackLocation = $rootScope.trackLocation;
		});
/*

	    // When Export is tapped
	    $scope.export = function(){

	    	localStorageService.getItem('allMeasurements', function(allMeasurements){
		    	// get all data 
		        var arr = allMeasurements? JSON.parse(allMeasurements) : [];
		        
		        // convert JSon to CSV
		        var csv = convertToCSV(arr);

		        // write it on storage
		        $cordovaFile.writeFile(cordova.file.dataDirectory, "csv.csv", csv, true)
				.then(function (success) {

		         	// when done, open the file opener / chooser
					$cordovaFileOpener2.open(cordova.file.dataDirectory+'csv.csv','application/csv');

		        }, function (error) {
					Bugsnag.notify(error, JSON.stringify(error), {}, "error");
					utilsService.showAlert('Please generate CSV later!');
				});
	    	});
	    };
*/

	    // call constructor
	    $scope.init();
	});