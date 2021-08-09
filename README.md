# REST API for Time Capsule
Rest API untuk Test Backend/Sinarmastest

**Base URL** : [`http://localhost:3000`]

## Setup the project on cd /Sinarmastest 
1. npm install
2. setup mysql server on your own db server || Create DBName: 'movieapp_development' 
3. setup database connection in config/config.json with your database privilage
4. run migration database : npx sequelize db:migrate
5. move/copy .env-example to .env
6. update value .env 
7. create uploads dir on cd api/uploads

### Run mode 
1. npm run migrate
2. npm run pretest
3. npm run test
4. npm run dev  

API Auth:
* [loginUser](#loginUser)
* [registerUser](#registerUser)  

## loginUser

Returns user info and token jwt

**URL** : [`http://localhost:3000/loginUser`]
(http://localhost:3000/loginUser)

**Method** : `POST`

### Success Response

```json
{
    "status": 200,
    "data": {
        "id": 2,
        "email": "aku@aku.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJlbWFpbCI6ImFrdUBha3UuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkRU92Y2NzLmdDLlZWN3VPNVFkTXZaZU9nNVVEMExvVTFQUk8vTi5udXRzM094cTNWai54Sy4iLCJjcmVhdGVkQXQiOiIyMDIxLTA2LTIwVDA4OjAxOjEyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTA2LTIwVDA4OjAxOjEyLjAwMFoifSwiaWF0IjoxNjI0MTc4NzY2fQ.UtmTwYFTntPmX2H3ZXM0C-lX75km8H8ZfkKVlVoGNcg"
    }
}
```

## registerUser

Returns registered User

**URL** : [`http://localhost:3000/registerUser`]
(http://localhost:3000/registerUser)
 
**Method** : `POST`

**Header** : `Content-Type: application/json`

**Body Param** :
```json
{
    "email": "example@example.com",
    "password": "1234" 
}
```
### Success Response

```json
{
    "status": 200,
    "message": "success registered"
}
```

All API Movie:

https://www.getpostman.com/collections/637673c7ed4bc897eb9b
 