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

	// Datafields allowed to retrieve through API calls based on authorization
	dataFields: {
		post: {
			guest: 'posts.id, ownerName, address, district, province, phone, description, area, price, type, dateCreate, dateUpdate',
			authorizedUser: 'posts.id, ownerName, address, province, city, phone, description, area, price, type, dateCreate, dateUpdate, creatorID, Creators.username AS creatorName, updatorID, Updators.username AS updatorName'
		},
		posts: {
			guest: 'posts.id, ownerName, address, district, province, phone, description, area, price, type, dateCreate, dateUpdate',
			authorizedUser: 'posts.id, ownerName, address, province, city, phone, description, area, price, type, dateCreate, dateUpdate, creatorID, Creators.username AS creatorName, updatorID, Updators.username AS updatorName'
		}
	},

	// Secret for authentication
	secret: 'Izunadaisuki'
};