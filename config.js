var config = require('config');
//...
var dbConfig = config.get('asset.dbConfig');
db.connect(dbConfig);
