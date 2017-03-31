var Promise = require('q').Promise;
var request = require('request');

require('colors');

exports.action = function(data, callback){
	
	if (!Config.modules.freebox.remoteController_code) {
		error("Le code télécomande de la Freebox est manquant".red);
		return callback();
	}
	
	var tblCommand = {
		freeboxOn: function() {freebox_OnOff('on',data.client)},	
		freeboxOff: function() {freebox_OnOff('off',data.client, (data.action.noSpeak) ? data.action.noSpeak : null)},
		setChannel: function() {send_key(data.action.key.split('').join('|'));},
		favourites: function() {free_favourites(data.client, (data.action.noSpeak) ? data.action.noSpeak : null);},
		records: function() {free_records(data.client);},
		recordProgram: function() {free_recordProgram(data.action.hour, data.action.duration, data.action.ID, data.action.afterRecord)},
		allChannels: function() {free_allChannels(data.client);},
		videos: function() {free_videos(data.client);},
		home:  function() {send_key('home|red');},
		soundUpLight: function() { if (!data.action.noSpeak) {
										Avatar.speak('d\'accord', data.client, function(){ 
											multi_keys('vol_inc*10', function(){
												send_key('mute');	
												Avatar.Speech.end(data.client);
											}); 
										});
									} else {
										multi_keys('vol_inc*10');
									}
								 },
		soundDownLight: function() {  if (!data.action.noSpeak) {
										Avatar.speak('d\'accord', data.client, function(){ 
											multi_keys('vol_dec*10', function(){ 
												send_key('mute');
												Avatar.Speech.end(data.client);
											}); 
										  });
										} else {
											multi_keys('vol_dec*10');
										}
								   },
		soundUp: function() { Avatar.speak('d\'accord', data.client, function(){ 
									multi_keys('vol_inc*20', function(){ 
										send_key('mute');
										Avatar.Speech.end(data.client);
									}); 
							   });
							},
		soundDown: function() { Avatar.speak('d\'accord', data.client, function(){ 
									multi_keys('vol_dec*20', function(){ 
										send_key('mute');
										Avatar.Speech.end(data.client);
									}); 
							   });
							  },
		mute: function() {send_key('mute')},
		previousChannel : function() {send_key('down|down|ok')},
		nextChannel : function() {send_key('down|up|ok')},
		goBack : function() {send_key('red')}
	};
	
	info("Freebox command:", data.action.command.yellow, "From:", data.client.yellow);
	tblCommand[data.action.command]();
	
	callback();
}


function multi_keys(keys,callback) {
	
	keys.replace(/([a-z_]+)(\*[0-9]+)(\|)?/g,function(all,a,b,c) {
		  var i=1*b.slice(1),str=a,c=c||"";
		  while (i>1) {
			str+="|"+a;
			i--;
		  }
		  send_key(str+c, callback);
	}); 
	
}


function send_key(key, callback) {
	
	buildURL([{key:key}],0)
	.then(function(){
		if (callback) callback();
	})
	.catch(err => error(err.red));
	
}


function freebox_OnOff (to,client,noSpeak){
	
	player_status()
	.then(state => player_started(to, state, client))
	.then(record => buildURL(record,0))
	.then(function() { 
		if (!noSpeak)
			Avatar.speak('c\'est fait', client, function(){ 
				Avatar.Speech.end(client);
		   });
	})
	.catch(function(err) {
		error(err.red);
		if (!noSpeak)
			Avatar.Speech.end(client);
	});
}


function player_started(to, state, client) {
	
	return new Promise(function (resolve, reject) {
		switch (state) {
			case false:
				if (to == 'on')  return resolve([{key : 'power'}]);
				
				Avatar.speak('La friboxe est déjà éteinte', client, function(){ 
						Avatar.Speech.end(client);
				});	
				break;
			case true:
				if (to == 'off')  return resolve([{key : 'power'}]);
				
				Avatar.speak('La friboxe est déjà allumé', client, function(){ 
						Avatar.Speech.end(client);
				});	
				break;
		}
	});
}


function  free_videos(client){
	
	player_status()
	.then(state => set_videos(state)) 
	.then(record => buildURL(record,0))
	.then(function() { 
		Avatar.speak('c\'est fait', client, function(){ 
			Avatar.Speech.end(client);
	   });
	})
	.catch(function(err) {
		error(err.red);
		Avatar.Speech.end(client);
	});

}


function set_videos(state) {
	
	return new Promise(function (resolve, reject) {
		var record = []; 
		
		if (state == false) { record.push({key : 'power', delay: 8000}); };
		record.push({key : 'home', delay: 1500});
		record.push({key : 'home', delay: 1500});
		record.push({key : 'right', delay: 1500});
		record.push({key : 'ok'});
		resolve(record);
	});
	
}

// Toutes les chaines
function  free_allChannels(client){
	
	player_status()
	.then(state => set_allChannels(state)) 
	.then(record => buildURL(record,0))
	.then(function() { 
		Avatar.speak('c\'est fait', client, function(){ 
			Avatar.Speech.end(client);
	   });
	})
	.catch(function(err) {
		error(err.red);
		Avatar.Speech.end(client);
	});

}

function set_allChannels(state) {
	
	return new Promise(function (resolve, reject) {
		var record = []; 
		
		if (state == false) { record.push({key : 'power', delay: 8000}); };
		record.push({key : 'home', delay: 1500});
		record.push({key : 'home', delay: 1500});
		record.push({key: 'ok'});
		resolve(record);
	});
	
}
// Fin Toutes les chaines


// Enregistrement
function free_records (client){
	
	player_status()
	.then(state => set_records(state)) 
	.then(record => buildURL(record,0))
	.then(function() { 
		Avatar.speak('c\'est fait', client, function(){ 
			Avatar.Speech.end(client);
	   });
	})
	.catch(function(err) {
		error(err.red);
		Avatar.Speech.end(client);
	});

}

function set_records(state) {
	
	return new Promise(function (resolve, reject) {
		var record = []; 
		
		if (state == false) { record.push({key : 'power', delay: 8000}); };
		record.push({key : 'home', delay: 1500});
		record.push({key : 'home', delay: 1500});
		record.push({key: 'up|ok'});
		resolve(record);
	});
	
}
// Fin enregistrement


// Favoris
function free_favourites (client, noSpeak){
	
	player_status()
	.then(state => set_favourites(state)) 
	.then(record => buildURL(record,0))
	.then(function() { 
		if (!noSpeak)
			Avatar.speak('c\'est fait', client, function(){ 
				Avatar.Speech.end(client);
		   });
	})
	.catch(function(err) {
		error(err.red);
		if (!noSpeak)
			Avatar.Speech.end(client);
	});

}

function set_favourites(state) {
	
	return new Promise(function (resolve, reject) {
		var record = []; 
		
		if (state == false) { record.push({key : 'power', delay: 8000}); };
		record.push({key : 'home', delay: 1500});
		record.push({key : 'home', delay: 1500});
		record.push({key : 'up|up|up', delay: 1500});
		record.push({key : 'ok'});
		resolve(record);
	});
	
}
// Fin Favoris



// Prépare les requetes http
function buildURL(record, pos, resolve, reject){

	if (!record) return;
	if (pos == record.length) return resolve();

	var keys = record[pos].key.split('|');
	if (keys.length> 0) {
		var rUrl = [];
		for (var i=0; i<keys.length; i++) {
			rUrl.push('&key='+keys[i]);
		}
	} else
		var rUrl = ['&key='+record[pos].key];

	function _request(resolve, reject) {
		freeboxRequest(rUrl,0,reject,function () {
			setTimeout(function() {
				buildURL(record, ++pos, resolve, reject);
			}, record[pos].delay||1000);
		});
	};
	
	if (!resolve) {
		return new Promise(function (resolve, reject) {
			_request(resolve, reject);
		});
	}
	
	_request(resolve, reject);
	
}



// Requete freebox HTTP 
function freeboxRequest(key,pos,reject,callback){
	
	if (pos == key.length) return callback();
	
	var url = 'http://hd1.freebox.fr/pub/remote_control?code='+Config.modules.freebox.remoteController_code+key[pos];
	info(url);
	
	request({ 'uri': url }, function (err, response, json){
		if (err || response.statusCode != 200) {
		  return reject('la commande Freebox a échouée');
		}
	
		freeboxRequest(key,++pos,reject,callback);
	});
	
}


// Status de la freebox
function player_status () {
	
	return new Promise(function (resolve, reject) {
	
		var token = require('./node_modules/token/token')();
		token.PlayerOn(Config.modules.freebox.app_token, Config.modules.freebox.app_id, Config.modules.freebox.app_version, function(state) {  
			if (state == -1) return reject('il n\'y a pas de jeton pour la freebox');
			resolve(state);
		});
	});
	
}


var free_recordProgram = function( hour, duration, channelID, afterRecord){
	
	if (!channelID || !hour) {
		 return info(msg.err_localized('no_parameter'));
	}
	
	// Just to confirm, 2h30 by default if duration is null, but it should not appear... 
	if (!duration) duration = "02:30";
	player_status()
	.then(function (state) {
		return new Promise(function (resolve, reject) {
			var flagPowerOn = false,
				i = 7,
				record = [];
			switch (state) {
			case false:
				flagPowerOn = true;
				i = 8;
				record.push({key : 'power', delay: 12000});
			case true:
				record.push({key : 'home', delay: 3000});
				record.push({key : 'home', delay: 3000});
				record.push({key : 'up|ok', delay: 6000});
				record.push({key : 'yellow', delay: 1000});
				record.push({key : 'rec', delay: 3000});
				record.push({key : 'green', delay: 1000});
				record.push({key : 'down|down|down|down|down|ok', delay: 3000});
				record.push({key: 'up|up|up|up|up|up|channelID', delay: 3000 });
				record.push({key: 'right|hour|mns', delay: 3000 });
				record.push({key: 'down|hourduration|mnsduration', delay: 3000 });
				record.push({key: 'down|down|ok', delay: 3000 });
				record.push({key: 'home', delay: 3000});
				record.push({key: 'home', delay: 3000});
				if (afterRecord && afterRecord == true && flagPowerOn == false) {
					var keyAfter = Config.modules.freebox.afterRecord;
					if (keyAfter && keyAfter != '')
						record.push({key: keyAfter});
				}
				
				if (flagPowerOn == true)
					record.push({key: 'power' });

				info('ici channelID',channelID)
				record[i].key = record[i].key.replace('channelID',channelID.toString().split('').join('|'));
				i++;
				record[i].key = record[i].key.replace('hour',hour.split(':').shift().split('').join('|'));
				record[i].key = record[i].key.replace('mns',hour.split(':').pop().split('').join('|'));
				i++;	
				record[i].key = record[i].key.replace('hourduration',duration.split(':').shift().split('').join('|'));
				record[i].key = record[i].key.replace('mnsduration',duration.split(':').pop().split('').join('|'));
				
				buildURL(record,0,resolve, reject);
				break;
			default:
				info(msg.err_localized('no_token'));
				break;
			}
		});
	})
	.then(function() { 
		info('Enregistrement effectué'.yellow);
	})
	.catch(function(err) {
		error(err.red);
	});
		
}