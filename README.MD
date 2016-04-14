#HouseMart Webapp

##Business Idea:
This project is the web-module of a real estate advertisement posting/browsing solution, which includes a web server, a website and a REST API-consumming Android native app.  

This project includes the web server and the website.

##Training purpose:
An experimental SEAN  web application (**S**ql Server, **E**xpress.js, **A**ngularJS, **N**ode.js). This project is my first attemmpt to approach full-stack development, as well as to build a JavaScript (semi-)full-stack, with Sql Server, Express.js, AngularJS, and Node.js at it's core.  

The secondary target is to learn as many different techniques and technologies by integrating them into the project as possible.

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
`http://(host)[:(port)]/api/posts (PUT)`

#####Supported params:
######Required:  
  * address (String(150))
  * districtID (Integer)
  * title (String(50))
  * type (Integer)

######Not required:
  * ownerName: (String(60))
  * phone (String(20))
  * description (String(1000))
  * area (Decimal(19, 3))
  * price (Decimal(19, 3))
  * latitude (Decimal(9, 6))
  * longitude (Decimal(9, 6))
  * isPublic (Boolean): Only Admin is allowed to set

####  Get/search all posts with general infos (Guest/User/Admin)  
`http://(host)[:(port)]/api/posts[?[creatorID=(creatorID)][&][districtID=(districtID)][&][provinceID=(provinceID)][&][minPrice=(minPrice)][&][maxPrice=(maxPrice)][&][minArea=(minArea)][&][maxArea=(maxArea)][&][isDetailed=(isDetailed)]] (GET)`

#####Supported query params:  
  * creatorID (Integer): If equals userID, then allow viewing setting isDetailed flag.
  * districtID (Integer)
  * provinceID (Integer)
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
`http://(host)[:(port)]/api/posts/(postID) (PATCH)`

#####Supported params:
######Required:  
  * address (String(150))
  * districtID (Integer)
  * title (String(50))
  * type (Integer)

######Not required:
  * ownerName: (String(60))
  * phone (String(20))
  * description (String(1000))
  * area (Decimal(19, 3))
  * price (Decimal(19, 3))
  * latitude (Decimal(9, 6))
  * longitude (Decimal(9, 6))
  * image1 (Boolean)
  * image2 (Boolean)
  * image3 (Boolean)
  * isPublic (Boolean): Only Admin is allowed to set

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
  
#### Get province list (Guest/User/Admin)  
`http://(host)[:(port)]/api/provinces (GET)`
#####Returned json file structure:
```javascript
[
    {
        "provinceID": (Integer),
        "provinceName": (String)
    },
    ...
]
```
  
#### Get district list (Guest/User/Admin)  
`http://(host)[:(port)]/api/districts (GET)`
#####Returned json file structure:
```javascript
[
    {
        "districtID": (Integer),
        "districtName": (String),
        "provinceID": (Integer),
        "provinceName": (String)
    },
    ...
]
```
  
#### Authenticate non-web user (Guest):  
`http://(host)[:(port)]/api/authenticate) (POST)`
