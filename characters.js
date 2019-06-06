module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*For populating world selection list*/
    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM planets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets = results;
            complete();
        });
    }

    /*For populating world selection list*/
    function getPowers(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM powers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.power = results;
            complete();
        });
    }

    /*For getting all characters*/
    function getChars(res, mysql, context, complete){
    	mysql.pool.query("SELECT C.id as id, C.name as name, H.name as planet, A.alignment as alignment FROM characters C LEFT JOIN planets H ON H.id = C.homeplanet LEFT JOIN alignment A ON A.id = C.alignment ORDER BY C.name ASC", function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.character = results;
    		complete();
    	});
    }


    /*For filtering by planet*/
    function getCharByPlanet(req, res, mysql, context, complete){
      var query = "SELECT C.name as name, P.name as planet, A.alignment as alignment FROM characters C INNER JOIN planets P ON P.id = C.homeplanet INNER JOIN alignment A ON A.id = C.alignment WHERE P.id = ?;";
      console.log(req.params)
      var inserts = [req.params.homeplanet]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results;
            complete();
        });
    }

    /*To get ID for a character*/
    function getOneChar(res, mysql, context, id, complete){
        var sql = "SELECT C.id as id, C.name as name, H.name as planet, A.alignment as alignment FROM characters C LEFT JOIN planets H ON H.id = C.homeplanet LEFT JOIN alignment A ON A.id = C.alignment WHERE C.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.selectChar = results[0];
            complete();
        });
    }

    /*Main route to display all characters*/
    router.get('/', function(req, res){
    	var callbackCount = 0;
    	var context = {};
        context.jsscripts = ["deletechar.js","filterchar.js","searchchar.js"];
    	var mysql = req.app.get('mysql');
    	getChars(res, mysql, context, complete);
        getPowers(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
    	function complete(){
    		callbackCount++;
    		if(callbackCount >= 3){
    			res.render('characters', context);
    		}
    	}
    });

    router.get('/filter/:homeplanet', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletechar.js","filterchar.js","searchchar.js"];
        var mysql = req.app.get('mysql');
        getCharByPlanet(req,res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('characters', context);
            }

        }
    });


    /*Display one character for the specific purpose of updating*/
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updatechar.js"];
        var mysql = req.app.get('mysql');
        getOneChar(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-character', context);
            }

        }
    });




    /*Adds a character*/
    router.post('/', function(req, res){
        console.log(req.body.homeplanet)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO characters (name, homeplanet, alignment) VALUES (?, NULLIF(?,'none'), ?)";
        var inserts = [req.body.name, req.body.homeplanet, req.body.alignment];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/characters');
            }
        });
    });

    /*Updates a character*/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE characters SET name=?, homeplanet=?, alignment=? WHERE id=?";
        var inserts = [req.body.name, req.body.homeplanet, req.body.alignment, req.params.id];
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
        var sql = "DELETE FROM characters WHERE id = ?";
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
