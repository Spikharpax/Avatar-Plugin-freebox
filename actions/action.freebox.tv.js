'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../node_modules/ava-ia/lib/helpers');

exports.default = function (state) {
	
	return new Promise(function (resolve, reject) {

		for (var rule in Config.modules.freebox.channels) {
			var match = (0, _helpers.syntax)(state.sentence, Config.modules.freebox.channels[rule]); 
			if (match) break;
		}
		
		 setTimeout(function(){ 			
			if (match) {
					if (state.debug) info('ActionFreebox'.bold.yellow, 'channel:', rule.yellow);
				
					state.action = {
						module: 'freebox',
						command: 'setChannel',
						key: rule,
						value: Config.modules.freebox.tts_action[rule] ? Config.modules.freebox.tts_action[rule] : 'je met ' + rule,
						tts: true		
					};
					resolve(state);
			}
		}, 500);
	});
};
