module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getChars(res, mysql, context, complete){
    	mysql.pool.query("SELECT * FROM characters;", function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.character = results;
    		complete();
    	});
    }

    router.get('/', function(req, res){
    	var callbackCount = 0;
    	var context = {};
    	var mysql = req.app.get('mysql');
    	getChars(res, mysql, context, complete);
    	function complete(){
    		callbackCount++;
    		if(callbackCount >= 2){
    			res.render('character', context);
    		}
    	}
    });


    return router;
}();
