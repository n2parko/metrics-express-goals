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
var BULLET_ID = '111516-301e11a4-c5e9-4068-8ca7-06813d435e7a';
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

metrics.on(mrrEnt, mrrEntGoal, function (actual, target){
  var payloadGeckometer = { item: actual, 
  				  			min: {value: 0, text: "Start"}, 
  				  			max: {value: target, text: "Target"} 
  				 		 };
  				 		 
var payloadBullet = setBulletPayload(actual, target);
  				 	

  geckoboard(GECKOMETER_ID).push(payloadGeckometer);
  geckoboard(BULLET_ID).push(payloadBullet);

});


/**
* Launch the server app
*/

Express(metrics)
  .listen(PORT);

/**
* Sets the payload for bullet chart
*/

function setBulletPayload(actual, target) {
  
  var today = new Date().getDate();
  var dayCount = new Date(2014, 10, 0).getDate();
  
  
  var payload = { orientation: "horizontal",
  item: {
    label: "New Enterprise MRR",
    sublabel: "Current: " + actual + "  Target: " + target,
    axis: {
      point: ["0", "20000", "40000", "60000", "80000", "100000", target * 1.25]
    },
    range: [
      {
        color: "red",
        start: 0,
        end: target * .5
      },
      {
        color: "amber",
        start: target * .5,
        end: target
      },
      {
        color: "green",
        start: target,
        end: target * 1.25
      }
    ],
    measure: {
      current: {
        start: "0",
        end: actual
      },
      projected: {
        start: "10000",
        end: target * 1.25
      }
    },
    comparative: {
      point: target * (today / dayCount)
    }
  }
}
return payload;
}
  