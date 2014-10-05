var Metrics = require('metrics');
var Express = require('metrics-express');
var getMetricGoogle = require('./getMetricGoogle.js');

var mrrEnt = 'MRR_Enterprise_Actual';
var mrrEntGoal = 'MRR_Enterprise_Target';
var STARTING_MRR_ENT = 5000;

var ROW = 1;
var COL = 2;


var geckoboard = require('geckoboard')('98af3d737632bc25debc97cafd58aa72');

var setGoal = function (val){
	metrics.set(mrrEntGoal, val);
	};

var metrics = Metrics()
				.every('24h', function (){
					getMetricGoogle.getMetric(ROW, COL, setGoal);
				});



metrics.on(mrrEnt, mrrEntGoal, function (ent, target){
  var payload = { item: ent, 
  				  min: {value: 0, text: ""}, 
  				  max: {value: target, text: "Target"} 
  				  };

  geckoboard('111516-b550f8e5-bb78-4fca-a38b-1ac96985ec9b').push(payload);
  console.log(JSON.stringify(payload));
});



metrics.set(mrrEnt, STARTING_MRR_ENT);

Express(metrics)
  .listen(7002);