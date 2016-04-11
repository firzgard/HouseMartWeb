#HouseMart Webapp

##Business Idea:
This project is the web-module of a real estate advertisement posting/browsing solution, which includes a web server, a website and a REST API-consumming Android native app.  

This project includes the web server and the website.

##Training purpose:
An experimental SEAN  web application (**S**ql Server, **E**xpress.js, **A**ngularJS, **N**ode.js). This project is my attemmpt to approach JavaScript (semi-)full-stack development, with Sql Server, Express.js, AngularJS, and Node.js at it's core.  

The secondary target is to learn by integrating as many different techniques and technologies into the project as possible.

###Goals:
#### - Archieved:
* Interact with sqlserver database from express app (mssql)
* Use bootstrap3 with angular directive (angular ui-bootstrap)
* Implement angular nested state/view (angular ui-router)
* Implement authentication using Json Web Token
* Replace callbacks in favour of promises

#### - Unfulfilled:
* Implement google map
* Server-side pagination
* File uploading
* Apply CSS preprocessor
* Separation of dev/test/dist environment
* Automatic testing
* Fine-tune dist environment
  * Uglifiy, minify, compressing resources
  * Server Logging

##Usage Guideline:

###API ROUTES:

#### Create post (User/Admin)  
`http://(host)[:(port)]/api/posts (POST)`

####  Get/search all posts with general infos (Guest/User/Admin)  
`http://(host)[:(port)]/api/posts[?[creatorID=(creatorID)][&][districtID=(districtID)][&][minPrice=(minPrice)][&][maxPrice=(maxPrice)][&][minArea=(minArea)][&][maxArea=(maxArea)][&][isDetailed=(isDetailed)]] (GET)`

#####Supported query params:  
  * creatorID (Integer): If equals userID, then allow viewing setting isDetailed flag.
  * districtID (Integer)
  * minPrice (Float)
  * maxPrice (Float)
  * minArea (Float)
  * maxArea (Float)
  * isDetailed (Boolean): Default is false. If allowed to set and is setted to true, then show hidden details.

#####Returned json file structure:
######*Without* flagged isDetailed:
```javascript
[
    {
        "postID": (Integer),
        "address": (String),
        "districtID": (Integer),
        "districtName": (String),
        "provinceID": (Integer),
        "provinceName": (String),
        "title": (String),
        "area": (Float),
        "price": (Float),
        "type": (Integer),
        "image1": (String),
        "image2": (String),
        "image3": (String),
        "dateCreate": (UTC Date),
        "dateUpdate": (UTC Date)
    },
    ...
]
```

######*With* flagged isDetailed:
```javascript
[
    {
        "postID": (Integer),
        "address": (String),
        "districtID": (Integer),
        "districtName": (String),
        "provinceID": (Integer),
        "provinceName": (String),
        "title": (String),
        "area": (Float),
        "price": (Float),
        "type": (Integer),
        "image1": (String),
        "image2": (String),
        "image3": (String),
        "isPublic": (Boolean),
        "dateCreate": (UTC Date),
        "dateUpdate": (UTC Date),
        "creatorID": (Integer),
        "creatorName": (String),
        "updatorID": (Integer),
        "updatorName": (String)
    },
    ...
]
```
  
####  Get 1 post with detailed infos (Guest/User/Admin)  
`http://(host)[:(port)]/api/posts/(postID)[?isDetailed=(isDetailed)] (GET)`

#####Supported query params:  
  * isDetailed (Boolean): Default is false. If allowed to set and is setted to true, then show hidden details.

#####Returned json file structure:
######*Without* flagged isDetailed:
```javascript
{
    "postID": (Integer),
    "ownerName": (String),
    "address": (String),
    "districtID": (Integer),
    "districtName": (String),
    "provinceID": (Integer),
    "provinceName": (String),
    "title": (String),
    "phone": (String),
    "description": (String),
    "area": (Float),
    "price": (Float),
    "type": (Integer),
    "latitude": (Float),
    "longitude": (Float),
    "image1": (String),
    "image2": (String),
    "image3": (String),
    "dateCreate": (UTC Date),
    "dateUpdate": (UTC Date)
}
```

######*With* flagged isDetailed:
```javascript
{
    "postID": (Integer),
    "ownerName": (String),
    "address": (String),
    "districtID": (Integer),
    "districtName": (String),
    "provinceID": (Integer),
    "provinceName": (String),
    "title": (String),
    "phone": (String),
    "description": (String),
    "area": (Float),
    "price": (Float),
    "type": (Integer),
    "latitude": (Float),
    "longitude": (Float),
    "image1": (String),
    "image2": (String),
    "image3": (String),
    "isPublic": (Boolean),
    "dateCreate": (UTC Date),
    "dateUpdate": (UTC Date),
    "creatorID": (Integer),
    "creatorName": (String),
    "updatorID": (Integer),
    "updatorName": (String)
}
```

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
