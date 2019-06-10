module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*For getting all realms*/
    function getRealms(res, mysql, context, complete){
        mysql.pool.query("SELECT R.id as id, R.name, COUNT(P.name) as planet_count FROM realms R LEFT JOIN planets P ON P.realm=R.id GROUP BY R.name ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.realm = results;
            complete();
        });
    }

    /*To get ID for a realm*/
    function getOneRealm(res, mysql, context, id, complete){
        var sql = "SELECT id, name FROM realms WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.selectRealm = results[0];
            complete();
        });
    }

    //Search function for realms
    function getRealmWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT R.id as id, R.name, COUNT(P.name) as planet_count FROM realms R LEFT JOIN planets P ON P.realm=R.id WHERE R.name LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
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
        context.jsscripts = ["deleterealm.js", "searchRealms.js"];
    	var mysql = req.app.get('mysql');
    	getRealms(res, mysql, context, complete);
    	function complete(){
    		callbackCount++;
    		if(callbackCount >= 1){
    			res.render('realms', context);
    		}
    	}
    });


    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleterealm.js", "searchrealms.js"];
        var mysql = req.app.get('mysql');
        getRealmWithNameLike(req, res, mysql, context, complete);
        //getRealms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('realms', context);
            }
        }
    });
    



    /*Display one realm for the specific purpose of updating*/
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updaterealm.js"];
        var mysql = req.app.get('mysql');
        getOneRealm(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-realm', context);
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

    /*Updates a realm*/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE realms SET name=? WHERE id=?";
        var inserts = [req.body.name, req.params.id];
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

    /*Delete a realm*/
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM realms WHERE id = ?";
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
