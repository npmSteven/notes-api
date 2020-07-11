## API

Domain: `http://localhost:8080`

### Register

Method: `POST` 

Endpoint: `/api/auth/register`

Content-Type: `application/json`

Expected data (body):
```json
{
	"username": "username",
	"email": "example@domain.com",
	"password": "password"
}
```
Response data:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNmNTBjN2ZlLWRhZWItNDkzOS05ODU2LWY2NTIxOGI4YTUzZSIsImlhdCI6MTU5NDUxMDI3OCwiZXhwIjoxNTk0NTk2Njc4fQ.dCJgzjT4FMvGr8LOrMzZUxhd3_Jnt3Kr7ifSGi0Ogjg",
  "user": {
    "id": "cf50c7fe-daeb-4939-9856-f65218b8a53e",
    "username": "username",
    "email": "example@domain.com",
    "createdAt": "2020-07-11 23:31:18.774 +00:00",
    "updatedAt": "2020-07-11 23:31:18.774 +00:00"
  }
}
```

### Login

Method: `POST` 

Endpoint: `/api/auth/login`

Content-Type: `application/json`

Expected data:
```json
{
  "username": "username",
  "password": "password"
}
```
Response data (body):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwNWQ2MGFmLTRjN2UtNDExMi04MDQ3LWVhN2U1MWI3OWVkMiIsImlhdCI6MTU5NDUwOTkzMCwiZXhwIjoxNTk0NTk2MzMwfQ.ptv9yIbaGo1abyLp-TBtNfVa3dqhpKSWMYqdMwpD8-w",
  "user": {
    "id": "805d60af-4c7e-4112-8047-ea7e51b79ed2",
    "username": "username",
    "email": "username@dsa.com",
    "createdAt": "2020-06-24 14:43:21.933 +00:00",
    "updatedAt": "2020-06-24 14:43:21.933 +00:00"
  }
}
```

### User

Method: `GET` 

Endpoint: `/api/auth/user`

Expected data (header): `x-auth-token`: `token-here`

Response data:
```json
{
  "success": true,
  "user": {
    "id": "cf50c7fe-daeb-4939-9856-f65218b8a53e",
    "username": "usernamed",
    "email": "example@domain.com",
    "createdAt": "2020-07-11 23:31:18.774 +00:00",
    "updatedAt": "2020-07-11 23:31:18.774 +00:00"
  }
}
```
