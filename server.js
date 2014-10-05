
var assert = require('assert');
var Metrics = require('metrics');
var Express = require('metrics-express');

var metrics = Metrics();

var geckoboard = require('geckoboard')('98af3d737632bc25debc97cafd58aa72');
  
var geckOMeter = GeckOMeter('111516-b550f8e5-bb78-4fca-a38b-1ac96985ec9b');
geckOMeter.setCurrent( "10");
geckOMeter.setMax( "Max", "20" );
geckOMeter.setMin( "Min", "1" );
geckoboard.push( geckOMeter );

module.exports = function (metrics) {
  metrics.on('b', geckoboard('111516-b550f8e5-bb78-4fca-a38b-1ac96985ec9b').number);
}

var setCrapData = function(){
	
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	for(i = 0; i < alphabet.length; i++){
		console.log(alphabet.charAt(i));
		metrics.set(alphabet.charAt(i), i);
	};	
};

setCrapData();
Express(metrics)
  .listen(7002);