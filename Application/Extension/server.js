var express = require('express');
	var app = express();
	var assert = require('assert');
	var bodyParser = require('body-parser');
	var rand = require('csprng');
	var sjcl = require('sjcl');
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
		extended: true
	})); 





	/*
	Creates DB instance
	*/

	var MongoClient = require('mongodb').MongoClient
	var url = "mongodb://fromo:1234asdf@from1991-shard-00-00-qraju.mongodb.net:27017,from1991-shard-00-01-qraju.mongodb.net:27017,from1991-shard-00-02-qraju.mongodb.net:27017/from1991?ssl=true&replicaSet=From1991-shard-0&authSource=admin"


	/*
	Running the server
	*/
	var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Server up and running!! Listening on port "+port, host, port)
	})
	/*
	Connecting to mongo db
	*/

	MongoClient.connect(url, function(err, db) {
		 assert.equal(null, err);
		

		/*
		Server request handeling
		*/
		app.post('/', function (req, res) {
			
			console.log("request is: "+req);
			/*
				REGISTER REQUEST
				returns "exist" or "succes"
			*/
			if(req.body.type == 'register'){
				console.log("");
				console.log("REGISTER request reviced");
				//hashing the passwords
				var salt = rand(60,36);
				var user = req.body.user;
				var hhPass0 = sjcl.hash.sha256.hash(req.body.hPass0+salt);
				hhPass0 = sjcl.codec.base64.fromBits(hhPass0);
				var result = dbRegister(user,salt,hhPass0,res);
			}

			/*
				LOGIN REQUEST
				returns "noUser" or "noPass" or "succes"
			*/
			else if(req.body.type == 'login'){
				console.log("");
				console.log("LOGIN request recived");
					//checks if the user exist
				var user = req.body.user;
				findUser( function handleUserAfterFind(array){
					if(array == undefined){
					 	res.send("undefined");
					 	return;
					 }
					//if exist, hashes the password and salt and checks equality
					else if(array.length > 0){
						var userInfo = array[0];
						var hhPass0 = sjcl.hash.sha256.hash(req.body.hPass0+userInfo.salt);
						hhPass0 = sjcl.codec.base64.fromBits(hhPass0);
						if(hhPass0 == userInfo.password){ //if passwords match
							console.log("user "+userInfo.username +" connected succesfuly");
							res.send("success");
						}
					 	else{//if wrong password
					 		console.log("user "+userInfo.username +" inserted wrong password");
							res.send("noPass");
					 	}
					 }
					else{//if username not in database
						console.log("username "+user +" was not found");
					 	res.send("noUser");
					 }
				}
				,user)
			}
      
  		    /*
				GET PASSWORDS & TAG REQUEST
				returns 'passwords and tag' or 'failed'
			*/
			else if(req.body.type == 'getPasswordsAndTag'){
				var user = req.body.user;
				console.log("");
				console.log("GET PASSWORDS & TAG request reviced");
				findUserPassAndTag(function(array){
					if(array.length > 0){
						var passwordsString = array[0].passwords;
						var tag = array[0].tag;
						res.send({passwords: passwordsString, tag: tag});
					}
					else{
						res.send("failed");
					}

				}, user)
			}

  		    /*
				STORE PASSWORDS request
				returns 'passwords and tag' or 'failed'
			*/

			else if(req.body.type == 'storePasswordsAndTag'){
				var user = req.body.user;
				var passwordsString = req.body.passwordsString;
				var tag = req.body.tag;
				console.log("");
				console.log(" Store PASSWORDS & TAG request reviced");
				        console.log("stag to store = " +tag);

				storePassAndTag(user,passwordsString,tag,function(response){
					if(response !== null){
						res.send("store passwords succeed");
					}
					else{
						res.send("failed");
					}

				}, user)
			}


		})



		function dbRegister(user,salt,hhPass0,res){
			console.log("registering user: "+user);

			findUser( function regHandleUserFind(array){
				 if(array == undefined){
				 	res.send("undefined");
				 	return;
				 }

				 else if(array.length > 0){
				 	res.send("exist");
				 }

				 else{
				 	insertUser(user,salt,hhPass0);
				 	res.send("success");
				 }
			 }, user, res);


		}


		var findUser = function( callback, user) {
			console.log("serching for user: "+user);
			var user =db.collection('users').find({username:user}).toArray(function(err, array){ 
				console.log(array);
				callback(array)
				});
		}

	    var findUserPassAndTag = function( callback, user) {
				console.log("serching for passwords for user: "+user);
				var user =db.collection(user).find().toArray(function(err, array){ 
					console.log(array);
					callback(array)
				});
		}


//[{hostname: "www.sadas.com ", username :"asdasd", password: "asdasd"}]

		var insertUser = function(user,salt,hhPass0) {
			 var insert = { username: user, password: hhPass0, salt: salt };
	 		 db.collection("users").insertOne(insert, function(err, res) {
			 		 if (err) throw err;
					 });

	 	 	var insert2 = { passwords: "" , tag: "" };

	 		 db.collection(user).insertOne(insert2, function(err, res) {
			 		 if (err) throw err;
			  		 console.log("user: "+user+" inserted succecfully");
			 });

		};


		var storePassAndTag = function(user,passwordsString,tag,callback) {
			console.log("user: "+user+" store passwords");
							        console.log("storing tag = " +tag);

			var update = {passwords : passwordsString , tag : tag };
			db.collection(user).replaceOne({},update, function(err, res) {
			 		 if (err) throw err;
			  		 callback(res);
			 });

		}

	});