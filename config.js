var config = require('config');
var db = require('db')


var dbConfig = config.get('config.db');
db.connect(dbConfig);
