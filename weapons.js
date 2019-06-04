module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    /*For getting all weapons*/
    function getWeapons(res, mysql, context, complete){
    	mysql.pool.query("SELECT W.name as name, W.description as description, C.name as wielder FROM weapons W LEFT JOIN characters C ON C.id=W.wielder", function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.weapon = results;
    		complete();
    	});
    }

    /*Main route to display all weapons*/
    router.get('/', function(req, res){
    	var callbackCount = 0;
    	var context = {};
        //context.jsscripts = ["deleteplanet.js","searchchar.js"];
    	var mysql = req.app.get('mysql');
    	getChars(res, mysql, context, complete);
        getWeapons(res, mysql, context, complete);
    	function complete(){
    		callbackCount++;
    		if(callbackCount >= 2){
    			res.render('weapons', context);
    		}
    	}
    });

    /*Adds a weapon*/
    router.post('/', function(req, res){
        console.log(req.body.wielder)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        if(req.body.wielder=="none"){
            var sql = "INSERT INTO weapons (name, description) VALUES (?,?)";
        }
        else{
            var sql = "INSERT INTO weapons (name, description, wielder) VALUES (?,?,?)";
        }
        
        var inserts = [req.body.name, req.body.description, req.body.wielder];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/weapons');
            }
        });
    });


    return router;
}();
