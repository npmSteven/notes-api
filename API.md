# API

Domain: `http://localhost:8080`

## Auth Routes

### Register
Registers a user to the database

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
Authenticate on the website

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
Get the current users data

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

## Note Routes

### Get Notes
Get all of the notes for the authenticated user

Method: `GET` 

Endpoint: `/api/note`

Expected data (header): `x-auth-token`: `token-here`

Response data:
```json
{
  "success": true,
  "notes": [
    {
      "id": "2c70630c-9920-4e0a-92f6-c45a56193088",
      "userId": "805d60af-4c7e-4112-8047-ea7e51b79ed2",
      "title": "hello world",
      "content": "whats going on",
      "createdAt": "2020-06-24 14:46:38.607 +00:00",
      "updatedAt": "2020-06-24 14:46:38.607 +00:00"
    }
  ]
}
```

### Get Note
Get a specific note for the authenticated user

Method: `GET` 

Endpoint: `/api/note/:id`

Expected data (header): `x-auth-token`: `token-here`

Response data:
```json
{
  "success": true,
  "note": {
    "id": "26888a38-9703-46c2-9300-25b43210b8e7",
    "userId": "805d60af-4c7e-4112-8047-ea7e51b79ed2",
    "title": "title here",
    "content": "content here",
    "createdAt": "2020-07-11 23:56:39.869 +00:00",
    "updatedAt": "2020-07-11 23:56:39.869 +00:00"
  }
}
```

### Add note
Add a new note for the authenticated user

Method: `POST` 

Endpoint: `/api/note`

Content-Type: `application/json`

Expected data (header): `x-auth-token`: `token-here`

Expected data (json):
```json
{
	"title": "title here",
	"content": "content here"
}
```

Response data:
```json
{
  "success": true,
  "note": {
    "id": "26888a38-9703-46c2-9300-25b43210b8e7",
    "userId": "805d60af-4c7e-4112-8047-ea7e51b79ed2",
    "title": "title here",
    "content": "content here",
    "updatedAt": "2020-07-11 23:56:39.869 +00:00",
    "createdAt": "2020-07-11 23:56:39.869 +00:00"
  }
}
```

### Update Note
Update a note for the authenticated user

Method: `PATCH` 

Endpoint: `/api/note/:id`

Content-Type: `application/json`

Expected data (header): `x-auth-token`: `token-here`

Expected data (json):
```json
{
	"title": "title here",
	"content": "content here"
}
```

Response data:
```json
{
  "success": true,
  "note": {
    "id": "26888a38-9703-46c2-9300-25b43210b8e7",
    "userId": "805d60af-4c7e-4112-8047-ea7e51b79ed2",
    "title": "title here",
    "content": "content here",
    "createdAt": "2020-07-11 23:56:39.869 +00:00",
    "updatedAt": "2020-07-11 23:56:39.869 +00:00"
  }
}
```

### Delete Note
Delete a note for the authenticated user

Method: `DELETE` 

Endpoint: `/api/note/:id`

Content-Type: `application/json`

Expected data (header): `x-auth-token`: `token-here`

Response data:
```json
{
  "success": true,
  "note": {
    "id": "26888a38-9703-46c2-9300-25b43210b8e7",
    "userId": "805d60af-4c7e-4112-8047-ea7e51b79ed2",
    "title": "title here",
    "content": "content here",
    "createdAt": "2020-07-11 23:56:39.869 +00:00",
    "updatedAt": "2020-07-11 23:56:39.869 +00:00"
  }
}
```