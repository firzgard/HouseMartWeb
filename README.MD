#HouseMart Webapp
An university assignment project.

##Business Idea:
This project is the web-module of a real estate advertisement posting/browsing solution, which includes a web server, a website and a REST API-consumming Android native app.  

This repo includes the web server and the website.

##Training purpose:
This project is my first attemmpt to full-stack development, as well as to build an experimental JavaScript semi-full-stack, with **Sql Server**, **Express.js**, **Angular.js**, and **Node.js** as it's basic skeleton.

The secondary target is to learn as many different techniques and technologies by integrating them into the stack as possible.

##Technology Stack Overview:
* Database: Microsoft SQL Server
* Microsoft SQL Server - Node.js connecting driver: mssql(tedios)
* Server Runtime Environment: Node.js
* Webapp Server Framework: Express.js
* Templating Engine: Jade
* Webapp Client MVC Framework: Angular.js
* Webapp UI Framework: Bootstrap3 + angular-ui
...

## Usage Guideline:
### Database:
A Microsoft SQL Server databate backup file named **HouseMart.bak** is stored at root folder.
### API ROUTES:
#### Create post:
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

####  Get/search all posts with general infos:
`http://(host)[:(port)]/api/posts[?[creatorID=(creatorID)][&][districtID=(districtID)][&][provinceID=(provinceID)][&][minPrice=(minPrice)][&][maxPrice=(maxPrice)][&][minArea=(minArea)][&][maxArea=(maxArea)][&][isDetailed=(isDetailed)]] (GET)`

#####Supported query params:  
  * creatorID (Integer): If equals userID, then allow viewing setting isDetailed flag.
  * districtID (Integer)
  * provinceID (Integer)
  * minPrice (Float)
  * maxPrice (Float)
  * minArea (Float)
  * maxArea (Float)
  * getAuthorizedPosts (Boolean): Default is false. If setted to true, then return all post that this user is allowed to modify.
  * isDetailed (Boolean): Default is false. If setted to true, then show hidden post details.

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
  
####  Get 1 post with detailed infos: 
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

####  Update 1 post:
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

#### Delete 1 post:  
`http://(host)[:(port)]/api/posts/(postID) (DELETE)`
  
#### ~~Get all users:~~
`http://(host)[:(port)]/api/users (GET)`
#### ~~Create user:~~
`http://(host)[:(port)]/api/users (POST)`
#### ~~Get 1 user info:~~
`http://(host)[:(port)]/api/users/(UserID) (GET)`
#### ~~Update user info:~~
`http://(host)[:(port)]/api/users/(UserID) (POST)`
#### ~~Delete 1 user~~
`http://(host)[:(port)]/api/users/(userID) (DELETE)`
  
#### Get province list:
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
  
#### Get district list:
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
  
#### Authenticate user and return access token:  
`http://(host)[:(port)]/api/authenticate) (POST)`
