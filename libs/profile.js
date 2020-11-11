const profiles = require('../config.profile');

module.exports = function(who) {
	return who ? profiles[who] : Object.values(profiles)[0];
};