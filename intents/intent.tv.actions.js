'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../node_modules/ava-ia/lib/helpers');

exports.default = function (state, actions) {
	  
	if (state.isIntent) return (0, _helpers.resolve)(state);
	 
	for (var rule in Config.modules.freebox.rules) {
		var match = (0, _helpers.syntax)(state.sentence, Config.modules.freebox.rules[rule]); 
		if (match) break;
	}

	if (match) {
		if (state.debug) info('IntentFreeboxRules'.bold.green, 'syntax:',((match) ? 'true'.green : 'false'.green));
		state.isIntent = true;
		return (0, _helpers.factoryActions)(state, actions);
	} else 
		return (0, _helpers.resolve)(state);
	
  
};