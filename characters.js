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

    /*For getting all characters*/
    function getChars(res, mysql, context, complete){
    	mysql.pool.query("SELECT C.id, C.name as name, H.name as planet, A.alignment as alignment FROM characters C INNER JOIN planets H ON H.id = C.homeplanet INNER JOIN alignment A ON A.id = C.alignment ORDER BY C.name ASC", function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.character = results;
    		complete();
    	});
    }


    /*For filtering by planet*/
/*    function getCharbyPlanet(req, res, mysql, context, complete){
      var query = "SELECT C.name as name, H.name as planet, A.alignment as alignment FROM characters C INNER JOIN planets H ON H.id = C.homeplanet INNER JOIN alignment A ON A.id = C.alignment WHERE H.name = ?";
      console.log(req.params)
      var inserts = [req.params.homeworld]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results;
            complete();
        });
    }*/

    /*To get ID to update or delete character*/
    function getCharacter(res, mysql, context, id, complete){
        var sql = "SELECT C.id, C.name as name, H.name as planet, A.alignment as alignment FROM characters C INNER JOIN planets H ON H.id = C.homeplanet INNER JOIN alignment A ON A.id = C.alignment WHERE character_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results[0];
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
        getPlanets(res, mysql, context, complete);
    	function complete(){
    		callbackCount++;
    		if(callbackCount >= 2){
    			res.render('characters', context);
    		}
    	}
    });

    /*Adds a character*/
    router.post('/', function(req, res){
        console.log(req.body.homeplanet)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO characters (name, homeplanet, alignment) VALUES (?,?,?)";
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


    /*Display one character for the specific purpose of updating*/
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updatechar.js"];
        var mysql = req.app.get('mysql');
        getChars(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-character', context);
            }

        }
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


    return router;
}();
