var Metrics = require('metrics');
var Express = require('metrics-express');
var getMetricGoogle = require('./getMetricGoogle.js');

var mrrEnt = 'MRR_Enterprise_Actual';
var mrrEntGoal = 'MRR_Enterprise_Target';
var STARTING_MRR_ENT = 5000;

var ROW = 1;
var COL = 2;

var PORT = 7002;

var GECKOMETER_ID = '111516-b550f8e5-bb78-4fca-a38b-1ac96985ec9b';
var GECKOBOARD_API_KEY = '98af3d737632bc25debc97cafd58aa72';
var geckoboard = require('geckoboard')(GECKOBOARD_API_KEY);


/**
* Callback to set goal once the metric is retreived
*/

var setGoal = function (val){
	metrics.set(mrrEntGoal, val);
	};


/**
* Initialize Metrics & refresh target every 10 seconds
*/

var metrics = Metrics()
				.every('10s', function (){
					getMetricGoogle.getMetric(ROW, COL, setGoal);
				});
				
/**
* Refresh target every 24 hours
*/

metrics.set(mrrEnt, STARTING_MRR_ENT);


/**
* When metric becomes available, push update to geckoboard
*/

metrics.on(mrrEnt, mrrEntGoal, function (ent, target){
  var payload = { item: ent, 
  				  min: {value: 0, text: ""}, 
  				  max: {value: target, text: "Target"} 
  				  };

  geckoboard(GECKOMETER_ID).push(payload);
});


/**
* Launch the server app
*/

Express(metrics)
  .listen(PORT);
  
  
  