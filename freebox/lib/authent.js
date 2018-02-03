/*
	Author: Stéphane Bascher
	Freebox token
	Date: May--2015 - Version: 1.0 - Creation of the module
*/

var request = require('request');
var fs = require('fs-extra');
var path = require('path');

var ROOT   = path.normalize(__dirname +'/..');
var PROP = path.normalize(ROOT+'/freebox.prop');

require('colors');

var request_version;
var request_id;
var request_track_id;
var request_token;

// Init js
var authent = module.exports = function () {
	
	//Dirty hack
	tokenobj = this;
	
	if (!(this instanceof authent)) {
		return new authent();
	}
			
	this.PlayerRequest = function (id, name, version, device, callback) {
									request_version = version;
									request_id = id;
									this.authRequest(id, name, version, device, function (state) { 
											callback(state);	
									})};					
	this.PlayerAccept = function (callback) {
									this.authAccept(function(state) {
										if (state == true)
											tokenobj.sessionRequest(function (state) { 
												callback(state);	
											});
										else
											callback(state);
									})};					
}	




// A faire 1 fois pour récupérer l'app_token
authent.prototype.authRequest = function (id,name,version,device,callback) {
	
	//Asking for an app token
	var options = {
		url    : "http://mafreebox.freebox.fr/api/v1/login/authorize/",
		method : 'POST',
		json   : {
			   "app_id"      : id,
			   "app_name"    : name,
			   "app_version" : version,
			   "device_name" : device
			},
		encode : 'utf-8'
	};
	
	request(options, function (err, response, body) {
            if (err || response.statusCode != 200) {
                error(err.red); 
				return callback(false);
			}
			
			request_track_id = body.result.track_id;
			request_token = body.result.app_token;
			
			console.log ('\nToken:', body.result.app_token);
			console.log ('Track_id:', body.result.track_id);
         
			// Récupération du token pour le mettre dans le .prop
			var Xml  = fs.readFileSync(PROP,'utf8');
			
			var tokenSize = (Xml.substring(Xml.indexOf('"app_token": "') + ('"app_token": "').length)).split('"')[0].length;
			var replaceXml =   Xml.substring(0,Xml.indexOf('"app_token": "') + ('"app_token": "').length)
					  + body.result.app_token
					  + Xml.substring(Xml.indexOf('"app_token": "') + ('"app_token": "').length + tokenSize);
	
			var idSize = (replaceXml.substring(replaceXml.indexOf('"track_id": "') + ('"track_id": "').length)).split('"')[0].length;
			var replaceXml =   replaceXml.substring(0,replaceXml.indexOf('"track_id": "') + ('"track_id": "').length)
					  + body.result.track_id
					  + replaceXml.substring(replaceXml.indexOf('"track_id": "') + ('"track_id": "').length + idSize);
			
			fs.writeFileSync(PROP, replaceXml, 'utf8');
			callback(true);
	
		});
}



// Etape nécessaire une fois authentification validée physiquement sur freebox
// Permet de récupérer de quoi générer le password (ne faire qu'une fois)
authent.prototype.authAccept = function (callback) {
	
	if (!request_track_id || request_track_id.length == 0) {
		console.log("Demandez d'abord l'accès puis recommencez".yellow);
		return callback(-1);
	}
	
	// ACCEPT AUTH
	request("http://mafreebox.freebox.fr/api/v1/login/authorize/"+ request_track_id, function (error, response, body) {
		if (!error && response.statusCode == 200){
			body = JSON.parse(body);
		} else {
			console.log("acceptAuth() -> erreur lors de la requete : http://mafreebox.freebox.fr/api/v1/login/authorize/", request_track_id);
			return callback(false);
		}

		//On refait la meme requete pour verifier le changement de status
		request("http://mafreebox.freebox.fr/api/v1/login/authorize/"+ request_track_id, function (error, response, body) {

			if (!error && response.statusCode == 200) 
			{
				body = JSON.parse(body);
				
				if(body.result.status == 'granted') { //La demande est OK
					return callback(true);
				} else if (body.result.status != 'pending') {
					console.log("Demandez d'abord l'accès puis recommencez".yellow);
					return callback(-1);
				} else {
					console.log('Validez d\'abord la demande sur la FreeBox Revolution, via l\'ecran LCD avec la fleche de droite pour indiquer "OUI" et recommencez.'.yellow);
					return callback(-1);
				}
			} else {
				console.log("acceptAuth() -> erreur lors de la requete : http://mafreebox.freebox.fr/api/v1/login/authorize/".red, request_track_id.red);
				return callback(false);
			}
		});
	});
}



authent.prototype.sessionRequest = function (callback) {
	
	var crypto  = require('crypto');
	
	request('http://mafreebox.freebox.fr/api/v1/login/', function (error, response, body) {

		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
		
			var password = crypto.createHmac('sha1', request_token).update(body.result.challenge).digest('hex'); 
			
			if (!body.result.logged_in){
				var options = {
					url    : 'http://mafreebox.freebox.fr/api/v1/login/session/',
					method : 'POST',
					json   : {
					   "app_id"      : request_id,
					   "app_version" : request_version,
					   "password"    : password
					},
					encode : 'utf-8'
				};

				request(options, function (error, response, body) {
					if ( !error && (response.statusCode == 200 || response.statusCode == 403)) {
						
						if (response.statusCode == 200) { 
							callback(true);
						} else if(response.statusCode == 403) { 
							console.log((body.msg + ': ' + body.error_code).red);
							callback(false);
						}
					} else {
						console.log("Une erreur est survenue dans la requête de recherche du jeton FreeBox.".red);
						callback(false);
					}
				});
			} else
				callback(true);
		} else {
			console.log("Une erreur est survenue dans la requête de recherche du jeton FreeBox.".red);
			callback(false);
		}
	});
}

