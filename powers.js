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

    //For filtering powers by char
    function getPowerByCharacter(req, res, mysql, context, complete){
      var query = "SELECT P.name as name, C.name as charName FROM powers P INNER JOIN characters_powers CP ON CP.pid=P.id INNER JOIN characters C ON C.id=CP.cid WHERE C.id = ?";
      console.log(req.params)
      var inserts = [req.params.character]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.powerChar = results;
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

    /*To get ID for a power*/
    function getOnePower(res, mysql, context, id, complete){
        var sql = "SELECT id, name, description FROM powers WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.selectPower = results[0];
            complete();
        });
    }

    /*Main route to display all powers*/
    router.get('/', function(req, res){
    	var callbackCount = 0;
    	var context = {};
        context.jsscripts = ["deletepowers.js","searchchar.js", "filterpowers.js"];
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

    router.get('/filter/:character', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepowers.js","searchchar.js", "filterpowers.js"];
        var mysql = req.app.get('mysql');
        getPowerByCharacter(req,res, mysql, context, complete);
        getChars(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('powers', context);
            }

        }
    });


    /*Display one power for the specific purpose of updating*/
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatepower.js"];
        var mysql = req.app.get('mysql');
        getOnePower(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-power', context);
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

    /*Updates a power*/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE powers SET name=?, description=? WHERE id=?";
        var inserts = [req.body.name, req.body.description, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM powers WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });


    return router;
}();
