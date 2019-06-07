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
    	mysql.pool.query("SELECT W.id as id, W.name as name, W.description as description, C.name as wielder FROM weapons W LEFT JOIN characters C ON C.id=W.wielder", function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.weapon = results;
    		complete();
    	});
    }

    //filter weapons by wielder

    function getWeaponByChar(req, res, mysql, context, complete){
      var query = "SELECT W.id as id, W.name as name, W.description as description, C.name as wielder FROM weapons W LEFT JOIN characters C ON C.id=W.wielder WHERE C.id = ?";
      console.log(req.params)
      var inserts = [req.params.character]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.weapon = results;
            complete();
        });
    }

    /*To get ID for a weapon*/
    function getOneWeapon(res, mysql, context, id, complete){
        var sql = "SELECT W.id as id, W.name as name, W.description as description, C.name as wielder FROM weapons W LEFT JOIN characters C ON C.id=W.wielder WHERE W.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.selectWeapon = results[0];
            complete();
        });
    }

    /*Main route to display all weapons*/
    router.get('/', function(req, res){
    	var callbackCount = 0;
    	var context = {};
        context.jsscripts = ["deleteweapons.js","searchchar.js", "filterweapons.js"];
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


    router.get('/filter/:character', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteweapons.js","searchchar.js", "filterweapons.js"];
        var mysql = req.app.get('mysql');
        getWeaponByChar(req,res, mysql, context, complete);
        getChars(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('weapons', context);
            }

        }
    });


    /*Display one weapon for the specific purpose of updating*/
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedchar.js", "updateweapon.js"];
        var mysql = req.app.get('mysql');
        getOneWeapon(res, mysql, context, req.params.id, complete);
        getChars(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-weapon', context);
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

    /*Updates a weapon*/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body.wielder)
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE weapons SET name=?, description=?, wielder=NULLIF(?, 'none') WHERE id=?";
        var inserts = [req.body.name, req.body.description, req.body.wielder, req.params.id];
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
        var sql = "DELETE FROM weapons WHERE id = ?";
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
