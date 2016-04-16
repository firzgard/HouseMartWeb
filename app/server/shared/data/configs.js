"use strict";

// Keep all commonly used constants here.

module.exports = {
	// The default port used to run this app on.
	port: 3000,

	// Config for msslq connection
	dbConfig: {
		"server": "localhost\\MEGAFIRZEN",
		"database": "HouseMart",
		"user": "HouseMart_Admin",
		"password": "123456",
		"port": "1433"
	},

	// User Roles
	roles: {
		guest: 0,
		admin: 1,
		user: 2
	},

	// Secret for authentication
	secret: 'IzunaDaisuki'
};