module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*For populating realm selection list*/
    function getRealms(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM realms", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.realm = results;
            complete();
        });
    }

    /*For getting all planets*/
    function getPlanets(res, mysql, context, complete){
    	mysql.pool.query("SELECT P.id, P.name as name, R.name as realm FROM planets P INNER JOIN realms R ON P.realm=R.id ORDER BY P.name ASC", function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.planet = results;
    		complete();
    	});
    }

    /*Main route to display all planets*/
    router.get('/', function(req, res){
    	var callbackCount = 0;
    	var context = {};
        //context.jsscripts = ["deleteplanet.js","searchchar.js"];
    	var mysql = req.app.get('mysql');
    	getRealms(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
    	function complete(){
    		callbackCount++;
    		if(callbackCount >= 2){
    			res.render('planets', context);
    		}
    	}
    });

    /*Adds a planet*/
    router.post('/', function(req, res){
        console.log(req.body.homeplanet)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO planet (name, realm) VALUES (?,?)";
        var inserts = [req.body.name, req.body.realm, req.body.alignment];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/planets');
            }
        });
    });


    return router;
}();
