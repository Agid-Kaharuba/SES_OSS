const db = require('../database');
require('dotenv').config();
console.log("Created database with errors: \n" + db.createSchema());