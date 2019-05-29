module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getChars(res, mysql, context, complete){
    	mysql.pool.query("SELECT C.name, H.name, P.name, A.alignment FROM characters C INNER JOIN characters_powers CP ON CP.cid = C.id INNER JOIN powers P ON P.id = CP.pid INNER JOIN planets H ON H.id = C.homeplanet INNER JOIN alignment A ON A.id = C.alignment ORDER BY C.name ASC;", function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.characters = results;
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
    		if(callbackCount >= 1){
    			res.render('character', context);
    		}
    	}
    });


    return router;
}();
