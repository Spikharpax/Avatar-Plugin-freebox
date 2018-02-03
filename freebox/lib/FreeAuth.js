require('colors');

var path = require('path');
var fs = require('fs-extra');
var extend  = require('extend');

var Config =  {};
var ROOT   = path.normalize(__dirname +'/..');
var PROP = path.normalize(ROOT+'/freebox.prop');

var loadProp = function(){
	
	console.log('Plugin properties:', PROP);
	try {
		var load   =  fs.readFileSync(PROP,'utf8');
		var prop = JSON.parse(load);
		extend(true, Config, prop);
	} catch(ex){ console.log('Error in %s: %s', PROP, ex.message); }
	
}


var authorizationRequest = function(callback) {
	
	var app_name = Config.modules.freebox.auth.app_name || '';
	var device_name = Config.modules.freebox.auth.device_name || '';
	var app_id = Config.modules.freebox.auth.app_id || '';
	var app_version = Config.modules.freebox.auth.app_version || '';
	
	var token = require('./authent')();
	token.PlayerRequest(app_id, app_name, app_version, device_name, function(state) { 
		callback (state);
	});
}



var authorizationAccept = function(callback) {

	var token = require('./authent')();
	token.PlayerAccept(function(state) { 
		callback(state);
	});
	
}



var authorizationStart = function() {

	var flagAuth;
	loadProp();
	var app_name = Config.modules.freebox.auth.app_name || '';
	var device_name = Config.modules.freebox.auth.device_name || '';
	var app_id = Config.modules.freebox.auth.app_id || '';
	var app_version = Config.modules.freebox.auth.app_version || '';
	
	if ( !app_id || !app_version || !app_name || !device_name ) {
		console.log("Les paramètres d'authentification sont manquants".red);
		console.log("\n");
		process.exit();
		return;
	}
	// -- Console
	console.log('********************************************************'.yellow);
	console.log('********* '.yellow, "Création d'un accès à la Freebox".green, ' ***********'.yellow);
	console.log('********************************************************'.yellow);
	console.log('\n');

	console.log("La création d'un accès se fait en 2 étapes:");
	console.log("Etape 1: Vous devez d'abord effectuer une demande d'accès auprès de votre Freebox. Si elle est approuvée, vous devrez la valider en cliquant sur l'écran LCD de la Freebox.");
	console.log("Etape 2: Ensuite, vous devez effectuer une vérification d'accès.");
	console.log('\n');
	console.log("Appuyez sur " + "1".yellow + " pour la demande d'accès");
	console.log("Appuyez sur " + "2".yellow + " pour la vérification d'accès");
	console.log("Appuyez sur " + "3".yellow + " pour sortir de l'application");
	console.log('Votre choix [1]:');
	
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', (text) => {
	  switch (text) {
		case '\r\n' :
		case '1\r\n' :
				authorizationRequest( function (state) { 
					switch (state) {
						case false:
							console.log("La demande a échouée. Voir le message d'erreur sur le console Freebox".red);
							process.exit();
							break;
						case true:
							console.log("\nLa demande est acceptée par la Freebox.");
							console.log("Validez maintenant la demande sur l\'écran LCD de la Freebox avec la flêche de droite. L'écran doit ensuite afficher l'heure.");
							console.log("\nAppuyez ensuite sur 2 pour passer à l'étape suivante...");	
							break;
					}
				});
			    break;
		case '2\r\n' :
				authorizationAccept(function (state) {
					switch (state) {
						case -1:
							console.log('\n');
							console.log("Appuyez sur 1 pour la demande d'accès");
							console.log("Appuyez sur 2 pour la vérification de l'accès");
							console.log("Appuyez sur 3 pour sortir de l'application");
							console.log('Votre choix [1]:');
							break;
						case false:
							console.log("La demande a échouée. Voir le message d'erreur sur le console Freebox".red);
							console.log("\n");
							process.exit();
							break;
						case true: 
							console.log("\nFélicitations !! L'enregistrement est valide. Redémarrez Avatar pour que les valeurs soient prises en compte".yellow);
							console.log("\n");
							process.exit();
							break;
						}
				});
			break;
		case '3\r\n' :
			console.log('\nbye bye!');	
			console.log("\n");
			process.exit();
			break;
		default: 
			console.log('\n');
			console.log("Appuyez sur 1 pour la demande d'accès");
			console.log("Appuyez sur 2 pour la vérification de l'accès");
			console.log("Appuyez sur 3 pour sortir de l'application");
			console.log('Votre choix [1]:');
			break;
	  }
	});
	
}

authorizationStart();