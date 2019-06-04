module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*For getting all realms*/
    function getRealms(res, mysql, context, complete){
        mysql.pool.query("SELECT R.name, COUNT(P.name) as planet_count FROM realms R LEFT JOIN planets P ON P.realm=R.id GROUP BY R.name ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.realm = results;
            complete();
        });
    }

    /*Main route to display all realms*/
    router.get('/', function(req, res){
    	var callbackCount = 0;
    	var context = {};
        //context.jsscripts = ["deleteplanet.js","searchchar.js"];
    	var mysql = req.app.get('mysql');
    	getRealms(res, mysql, context, complete);
    	function complete(){
    		callbackCount++;
    		if(callbackCount >= 1){
    			res.render('realms', context);
    		}
    	}
    });

    /*Adds a realm*/
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO realms (name) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/realms');
            }
        });
    });


    return router;
}();
