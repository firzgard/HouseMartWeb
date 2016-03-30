#HouseMart Webapp

####API ROUTES:

* Create post (User/Admin)
`http://(host)[:(port)]/api/posts (POST)`
* Get all posts with general infos (Guest/User/Admin)
`http://(host)[:(port)]/api/posts (GET)`
* Get 1 post with detailed infos (Guest/User/Admin)
`http://(host)[:(port)]/api/posts/(postID) (GET)`
* Update 1 post (User/Admin)
`http://(host)[:(port)]/api/posts/(postID) (POST)`
* Delete 1 post (User/Admin)
`http://(host)[:(port)]/api/posts/(postID) (DELETE)`

* Get all users
`http://(host)[:(port)]/api/users (GET)`
* Create user (Guest)
`http://(host)[:(port)]/api/users (POST)`
* Get 1 user info (User)
`http://(host)[:(port)]/api/users/(UserID) (GET)`
* Update user info (User)
`http://(host)[:(port)]/api/users/(UserID) (POST)`
* Delete 1 user (Admin)
`http://(host)[:(port)]/api/users/(userID) (DELETE)`

* Get all post of a user with general infos (User/Admin)
 `http://(host)[:(port)]/api/users/(userID)/posts (GET)`

* Authenticate non-web user (Guest):
`http://(host)[:(port)]/api/authenticate) (POST)`
