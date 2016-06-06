angular.module('starter')
	// returns high chart compatible Stubs for line and Bar charts
	.factory('chartService', function(ratingService){
	    var chartService = {

	    	// generate bar chart stub with data
	        configureBarChart : function(data){
	            return {
	                options: {
	                    chart: {
	                        height : 400,
	                        type : 'column',
	                        renderTo : 'BarContainer',
	                        animation: {
	                            duration: 1000
	                        }
	                    },
	                    title : {
	                        text : config.appSettings.primaryOutcomeVariable+ ' Distribution'
	                    },
	                    xAxis : {
	                        categories : ratingService.getPrimaryOutcomeVariableOptionLabels()
	                    },
	                    yAxis : {
	                        title : {
	                            text : 'Number of ratings'
	                        },
	                        min : 0
	                    },
	                    lang: {
	                        loading: ''
	                    },
	                    loading: {
	                        style: {
	                            background: 'url(/res/loading3.gif) no-repeat center'
	                        },
	                        hideDuration: 10,
	                        showDuration: 10
	                    },
	                    legend : {
	                        enabled : false
	                    },

	                    plotOptions : {
	                        column : {
	                            pointPadding : 0.2,
	                            borderWidth : 0,
	                            pointWidth : 40,
	                            enableMouseTracking : false,
	                            colorByPoint : true
	                        }
	                    },
	                    credits: {
	                        enabled: false
	                    },

	                    colors : [ "#000000", "#5D83FF", "#68B107", "#ffbd40", "#CB0000" ]
	                },
	                series: [{
	                    name : config.appSettings.primaryOutcomeVariable,
	                    data: data
	                }]
	            };
	        },

	        // generate stock chart
	        configureLineChart : function(data){

				data = data.sort(function(a, b){
					return a[0] - b[0];
				});

	        	return {
	        		useHighStocks: true,
	        		options : {
	        			legend : {
	        			    enabled : false
	        			},
	        			title: {
	        			    text: config.appSettings.primaryOutcomeVariable + ' Over Time'
	        			},
	        			xAxis : {
	        				type: 'datetime',
							dateTimeLabelFormats : {
                    	        millisecond : '%I:%M %p',
                    	        second : '%I:%M %p',
                    	        minute: '%I:%M %p',
                    	        hour: '%I %p',
                	        	day: '%e. %b',
                	        	week: '%e. %b',
                	        	month: '%b \'%y',
                	        	year: '%Y'
                    	    },
                    	    min: data[0][0],
                    	    max: data[data.length-1][0]
	        			},
	                    credits: {
	                        enabled: false
	                    },
	                    rangeSelector: {
                            enabled: true
                        },
                        navigator: {
                            enabled: true,
                            xAxis: {
                            	type : 'datetime',
                            	dateTimeLabelFormats : {
	                    	        millisecond : '%I:%M %p',
	                    	        second : '%I:%M %p',
	                    	        minute: '%I:%M %p',
	                    	        hour: '%I %p',
	                	        	day: '%e. %b',
	                	        	week: '%e. %b',
	                	        	month: '%b \'%y',
	                	        	year: '%Y'
	                    	    }
							}
                        }
	        		},
	        		series :[{
			            name : config.appSettings.primaryOutcomeVariable,
			            data : data,
			            tooltip: {
			                valueDecimals: 2
			            }
			        }]
	        	};
	        }
	    };

	    return chartService;
	});