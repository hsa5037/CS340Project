module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*For getting power list*/
    function getPowers(res, mysql, context, complete){
        mysql.pool.query("SELECT P.id as id, P.name as name, P.description as description, COUNT(C.name) as numChars FROM powers P LEFT JOIN characters_powers CP ON CP.pid=P.id LEFT JOIN characters C ON C.id=CP.pid GROUP BY P.name ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.power = results;
            complete();
        });
    }

    /*For populating character selection list*/
    function getChars(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name as name FROM characters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results;
            complete();
        });
    }

    /*For getting powers with characters attached*/
    function getPowerChar(res, mysql, context, complete){
        mysql.pool.query("SELECT P.name as name, C.name as charName FROM powers P INNER JOIN characters_powers CP ON CP.pid=P.id INNER JOIN characters C ON C.id=CP.cid ORDER BY P.name ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.powerChar = results;
            complete();
        });
    }

    /*Main route to display all powers*/
    router.get('/', function(req, res){
    	var callbackCount = 0;
    	var context = {};
        //context.jsscripts = ["deleteplanet.js","searchchar.js"];
    	var mysql = req.app.get('mysql');
    	getPowers(res, mysql, context, complete);
        getChars(res, mysql, context, complete);
        getPowerChar(res, mysql, context, complete);
    	function complete(){
    		callbackCount++;
    		if(callbackCount >= 3){
    			res.render('powers', context);
    		}
    	}
    });

    /*Adds a power*/
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO powers (name, description) VALUES (?,?)";
        var inserts = [req.body.name, req.body.description];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/powers');
            }
        });
    });


    return router;
}();
