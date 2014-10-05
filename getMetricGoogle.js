var spreadsheets = require('google-spreadsheets');

var USERNAME = 'segment.test.8970@gmail.com';
var PASSWORD = 'kevinkevin1';
var SEGMENT_METRICS_KEY = '0AoEIVvKwwgSFdFJ6dzlPZC1DZGxnME9hbUh2VjYtUFE';
var metric;


this.getMetric = function(row, col, callback) {
      spreadsheets()
         .login(USERNAME, PASSWORD)
         .key(SEGMENT_METRICS_KEY)
         .open(function(err, spreadsheet) {

            var worksheets = spreadsheet.worksheets;
            var worksheet = spreadsheet.select(worksheets[0].id);
            var query = worksheet
               			.query()
               			.cell(row, col)
               			.get(function(err, cells) {
                  metric = cells[0].value;
                  callback(metric);
               });

         });
                  
      };