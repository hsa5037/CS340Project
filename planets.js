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
    	mysql.pool.query("SELECT P.id, P.name as name, R.name as realm FROM planets P LEFT JOIN realms R ON P.realm=R.id ORDER BY P.name ASC", function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.planet = results;
    		complete();
    	});
    }

    /*To get ID for a planet*/
    function getOnePlanet(res, mysql, context, id, complete){
        var sql = "SELECT P.id as id, P.name as name, R.name as realm FROM planets P LEFT JOIN realms R ON P.realm=R.id WHERE P.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.selectPlanet = results[0];
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


    /*Display one character for the specific purpose of updating*/
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedrealm.js", "updateplanet.js"];
        var mysql = req.app.get('mysql');
        getOnePlanet(res, mysql, context, req.params.id, complete);
        getRealms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-planet', context);
            }

        }
    });


    /*Adds a planet*/
    router.post('/', function(req, res){
        console.log(req.body.realm)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        if(req.body.realm=="none"){
            var sql = "INSERT INTO planets (name) VALUES (?)";
        }
        else{
            var sql = "INSERT INTO planets (name, realm) VALUES (?,?)";
        }
        var inserts = [req.body.name, req.body.realm];
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

    /*Updates a realm*/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE planets SET name=?, realm=? WHERE id=?";
        var inserts = [req.body.name, req.body.realm, req.params.id];
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
