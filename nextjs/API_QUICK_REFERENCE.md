# 🚀 API Quick Reference & Testing Guide

## Base URL
```
http://localhost:3000/api
```

## Authentication Header
All protected endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## 🔐 Authentication Endpoints

### 1. Sign Up
```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response (201):
{
  "success": true,
  "data": {
    "message": "User registered successfully",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2026-05-12T00:00:00.000Z"
    }
  }
}
```

### 2. Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Login successful",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User
```
GET /auth/me
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "User fetched successfully",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2026-05-12T00:00:00.000Z",
      "updatedAt": "2026-05-12T00:00:00.000Z"
    }
  }
}
```

### 4. Forgot Password
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "If an account with that email exists, a password reset link has been sent.",
    "resetToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"  // For testing only
  }
}
```

### 5. Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "password": "newpassword123",
  "passwordConfirmation": "newpassword123"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Password has been reset successfully"
  }
}
```

### 6. Logout
```
POST /auth/logout
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## 🏢 Workspace Endpoints

### 1. List All Workspaces
```
GET /workspaces
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Workspaces fetched successfully",
    "workspaces": [
      {
        "id": "1",
        "name": "Personal",
        "ownerId": "1",
        "createdAt": "2026-05-12T00:00:00.000Z",
        "updatedAt": "2026-05-12T00:00:00.000Z",
        "_count": {
          "boards": 3
        }
      }
    ]
  }
}
```

### 2. Create Workspace
```
POST /workspaces
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "name": "Personal"
}

Response (201):
{
  "success": true,
  "data": {
    "message": "Workspace created successfully",
    "workspace": {
      "id": "1",
      "name": "Personal",
      "ownerId": "1",
      "createdAt": "2026-05-12T00:00:00.000Z",
      "updatedAt": "2026-05-12T00:00:00.000Z"
    }
  }
}
```

### 3. Get Workspace Details
```
GET /workspaces/1
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Workspace fetched successfully",
    "workspace": { ... }
  }
}
```

### 4. Update Workspace
```
PUT /workspaces/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "name": "Work"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Workspace updated successfully",
    "workspace": { ... }
  }
}
```

### 5. Delete Workspace
```
DELETE /workspaces/1
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Workspace deleted successfully"
  }
}
```

---

## 📊 Board Endpoints

### 1. List All Boards in Workspace
```
GET /workspaces/1/boards
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Boards fetched successfully",
    "boards": [
      {
        "id": "1",
        "title": "Project Alpha",
        "description": "Q2 Planning",
        "ownerId": "1",
        "workspaceId": "1",
        "createdAt": "2026-05-12T00:00:00.000Z",
        "updatedAt": "2026-05-12T00:00:00.000Z",
        "lists": [
          {
            "id": "1",
            "title": "To Do",
            "position": 0,
            "_count": { "cards": 5 }
          }
        ]
      }
    ]
  }
}
```

### 2. Create Board
```
POST /workspaces/1/boards
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "title": "Project Alpha",
  "description": "Q2 Planning"
}

Response (201):
{
  "success": true,
  "data": {
    "message": "Board created successfully",
    "board": { ... }
  }
}
```

### 3. Get Board Details
```
GET /workspaces/1/boards/1
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Board fetched successfully",
    "board": {
      "id": "1",
      "title": "Project Alpha",
      "description": "Q2 Planning",
      "ownerId": "1",
      "createdAt": "2026-05-12T00:00:00.000Z",
      "updatedAt": "2026-05-12T00:00:00.000Z",
      "lists": [
        {
          "id": "1",
          "title": "To Do",
          "position": 0,
          "cards": [
            {
              "id": "1",
              "title": "Task 1",
              "description": "First task",
              "position": 0,
              "assigneeUserId": null,
              "createdBy": "1"
            }
          ]
        }
      ]
    }
  }
}
```

### 4. Update Board
```
PUT /workspaces/1/boards/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "title": "Project Alpha v2",
  "description": "Q2 & Q3 Planning"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Board updated successfully",
    "board": { ... }
  }
}
```

### 5. Delete Board
```
DELETE /workspaces/1/boards/1
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Board deleted successfully"
  }
}
```

---

## 📝 List Endpoints

### 1. Get All Lists
```
GET /workspaces/1/boards/1/lists
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Lists fetched successfully",
    "lists": [
      {
        "id": "1",
        "title": "To Do",
        "position": 0,
        "createdAt": "2026-05-12T00:00:00.000Z",
        "updatedAt": "2026-05-12T00:00:00.000Z",
        "cards": [
          {
            "id": "1",
            "title": "Task 1",
            "description": "Description",
            "position": 0
          }
        ]
      }
    ]
  }
}
```

### 2. Create List
```
POST /workspaces/1/boards/1/lists
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "title": "In Progress",
  "position": 1
}

Response (201):
{
  "success": true,
  "data": {
    "message": "List created successfully",
    "list": { ... }
  }
}
```

### 3. Update List
```
PUT /workspaces/1/boards/1/lists/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "title": "To Do (Updated)",
  "position": 0
}

Response (200):
{
  "success": true,
  "data": {
    "message": "List updated successfully",
    "list": { ... }
  }
}
```

### 4. Delete List
```
DELETE /workspaces/1/boards/1/lists/1
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "List deleted successfully"
  }
}
```

---

## 🎴 Card Endpoints

### 1. Get Cards in List
```
GET /workspaces/1/boards/1/lists/1/cards
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Cards fetched successfully",
    "cards": [
      {
        "id": "1",
        "title": "Task 1",
        "description": "Description",
        "position": 0,
        "assigneeUserId": null,
        "createdBy": "1",
        "createdAt": "2026-05-12T00:00:00.000Z",
        "updatedAt": "2026-05-12T00:00:00.000Z",
        "assignee": null,
        "creator": {
          "id": "1",
          "email": "user@example.com",
          "fullName": "John Doe"
        }
      }
    ]
  }
}
```

### 2. Create Card
```
POST /workspaces/1/boards/1/lists/1/cards
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "title": "Task 1",
  "description": "First task",
  "position": 0,
  "assigneeUserId": null
}

Response (201):
{
  "success": true,
  "data": {
    "message": "Card created successfully",
    "card": { ... }
  }
}
```

### 3. Get Card Details
```
GET /workspaces/1/boards/1/cards/1
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Card fetched successfully",
    "card": { ... }
  }
}
```

### 4. Update Card
```
PUT /workspaces/1/boards/1/cards/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "title": "Task 1 Updated",
  "description": "Updated description",
  "assigneeUserId": null
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Card updated successfully",
    "card": { ... }
  }
}
```

### 5. Move Card
```
PATCH /workspaces/1/boards/1/cards/1/move
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "listId": "2",
  "position": 0
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Card moved successfully",
    "card": { ... }
  }
}
```

### 6. Delete Card
```
DELETE /workspaces/1/boards/1/cards/1
Authorization: Bearer {TOKEN}

Response (200):
{
  "success": true,
  "data": {
    "message": "Card deleted successfully"
  }
}
```

---

## ❌ Common Error Responses

### 401 - Unauthorized (Missing Token)
```json
{
  "success": false,
  "error": "Unauthorized - missing token"
}
```

### 403 - Forbidden (Not Owner)
```json
{
  "success": false,
  "error": "Forbidden - not the workspace owner"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": "Workspace not found"
}
```

### 409 - Conflict (Email Already Exists)
```json
{
  "success": false,
  "error": "Email already in use"
}
```

### 400 - Bad Request (Validation Error)
```json
{
  "success": false,
  "error": "Workspace name is required"
}
```

---

## 📋 Testing Checklist

- [ ] Sign up new user
- [ ] Login with user credentials
- [ ] Get current user info with token
- [ ] Create workspace
- [ ] List workspaces
- [ ] Get workspace details
- [ ] Update workspace
- [ ] Create board in workspace
- [ ] List boards
- [ ] Get board details
- [ ] Create list in board
- [ ] Create card in list
- [ ] Move card to different list
- [ ] Update card
- [ ] Delete card
- [ ] Delete list
- [ ] Delete board
- [ ] Delete workspace
- [ ] Test forgot password flow
- [ ] Test reset password
- [ ] Test logout
- [ ] Verify 401 on protected endpoints without token
- [ ] Verify 403 when accessing other users' resources

---

## 🔑 Important Notes

1. **Token Expiration**: JWT tokens expire after 1 day (86400 seconds)
2. **Password Reset**: Tokens expire after 1 hour
3. **ID Format**: All IDs are returned as strings (BigInt conversion)
4. **Cascade Delete**: Deleting workspace deletes all boards and nested data
5. **Authorization**: All operations are owner-based (users can only access their own resources)

---

*Last Updated: May 12, 2026*
