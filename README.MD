#HouseMart Webapp

###GOALS:

####Archieved:
* Interact with sqlserver database on express app (mssql)
* Use bootstrap3 with angular directive (angular ui-bootstrap)
* Implement angular nested state/view (angular ui-router)
* Implement authentication using Json Web Token
* Replace callbacks in favour of promises

####Unfulfilled:
* Implement google map
* Separation of dev/test/dist environment
* Automatic testing
* Fine-tune dist environment
  * Uglifiy, minify, compressing resources

###API ROUTES:

#### Create post (User/Admin)  
`http://(host)[:(port)]/api/posts (POST)`
####  Get/search all posts with general infos (Guest/User/Admin)  
`http://(host)[:(port)]/api/posts[?[creatorID=(creatorID)][&][province=(province)][&][district=(district)][&][minPrice=(minPrice)][&][maxPrice=(maxPrice)][&][minArea=(minArea)][&][maxArea=(maxArea)][&][isDetailed=(isDetailed)]] (GET)`
Supported query params include:  
| Keyword       | Expected Type   | Note            |
| ------------- | --------------- | --------------- |
| creatorID     | Integer         | If equals userID, then allow viewing setting isDetailed flag |
| province      | String          |                 |
| district      | String          |                 |
| minPrice      | Float           |                 |
| maxPrice      | Float           |                 |
| minArea       | Float           |                 |
| maxArea       | Float           |                 |
| isDetailed    | Boolean         | Default is false. If allowed to set and is setted to true, then show hidden details |
####  Get 1 post with detailed infos (Guest/User/Admin)  
`http://(host)[:(port)]/api/posts/(postID) (GET)`
####  Update 1 post (User/Admin)  
`http://(host)[:(port)]/api/posts/(postID) (POST)`
#### Delete 1 post (User/Admin)  
`http://(host)[:(port)]/api/posts/(postID) (DELETE)`
  
#### Get all users  
`http://(host)[:(port)]/api/users (GET)`
#### Create user (Guest)  
`http://(host)[:(port)]/api/users (POST)`
#### Get 1 user info (User)  
`http://(host)[:(port)]/api/users/(UserID) (GET)`
#### Update user info (User)  
`http://(host)[:(port)]/api/users/(UserID) (POST)`
#### Delete 1 user (Admin)  
`http://(host)[:(port)]/api/users/(userID) (DELETE)`
  
#### Get all post of a user with general infos (User/Admin)  
`http://(host)[:(port)]/api/users/(userID)/posts (GET)`
  
#### Authenticate non-web user (Guest):  
`http://(host)[:(port)]/api/authenticate) (POST)`
