module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*For getting power list*/
    function getPowers(res, mysql, context, complete){
        mysql.pool.query("SELECT P.id as pid, P.name as name, P.description as description, COUNT(C.name) as numChars FROM powers P LEFT JOIN characters_powers CP ON CP.pid=P.id LEFT JOIN characters C ON C.id=CP.pid GROUP BY P.name ASC", function(error, results, fields){
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
        mysql.pool.query("SELECT id as cid, name as name FROM characters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results;
            complete();
        });
    }

    /*For filtering powers by character*/
    function getPowerByCharacter(req, res, mysql, context, complete){
      var query = "SELECT P.id as pid, P.name as name, C.id as cid, C.name as charName FROM powers P INNER JOIN characters_powers CP ON CP.pid=P.id INNER JOIN characters C ON C.id=CP.cid WHERE C.id = ?";
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
        mysql.pool.query("SELECT P.id as pid, P.name as name, C.id as cid, C.name as charName FROM powers P INNER JOIN characters_powers CP ON CP.pid=P.id INNER JOIN characters C ON C.id=CP.cid ORDER BY P.name ASC", function(error, results, fields){
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
        context.jsscripts = ["deletechar.js", "deletepowers.js","searchchar.js", "filterpowers.js"];
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

    /*Displays power by character filter*/
    router.get('/filter/:character', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletechar.js", "deletepowers.js","searchchar.js", "filterpowers.js"];
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

    /*Deletes a power*/
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

    /*Associate power with a character*/
    router.post('/connect', function(req, res){
        console.log("We get the multi-select power dropdown as ", req.body.pows)
        var mysql = req.app.get('mysql');
        // let's get out the powers from the array that was submitted by the form 
        var powers = req.body.pows
        var thisChar = req.body.cid
        for (let pow of powers) {
          console.log("Processing power id " + pow)
          var sql = "INSERT INTO characters_powers (cid, pid) VALUES (?,?)";
          var inserts = [thisChar, pow];
          sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                //TODO: send error messages to frontend as the following doesn't work
                /* 
                res.write(JSON.stringify(error));
                res.end();
                */
                console.log(error)
            }
          });
        } //for loop ends here 
        res.redirect('/powers');
    });

    /* Delete a character/power relationship */
    /* This route will accept a HTTP DELETE request in the form
     * /cid/{{cid}}/pow/{{pid}} -- which is sent by the AJAX form 
     */
    router.delete('/cid/:cid/pow/:pid', function(req, res){
        //console.log(req) //I used this to figure out where did cid and pid go in the request
        console.log(req.params.cid)
        console.log(req.params.pid)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM characters_powers WHERE cid = ? AND pid = ?";
        var inserts = [req.params.cid, req.params.pid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400); 
                res.end(); 
            }else{
                res.status(202).end();
            }
        })
    })


    return router;
}();
