# Tracker App API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## User Routes (`/users`)

### 1. Register User
- **POST** `/users/register`
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here"
}
```

### 2. Login User
- **POST** `/users/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 3. Get All Users (Admin Only)
- **GET** `/users`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  ]
}
```

### 4. Get User by ID
- **GET** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 5. Update User (Admin Only)
- **PATCH** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "username": "updated_username",
  "email": "updated@example.com",
  "role": "admin"
}
```

### 6. Delete User (Admin Only)
- **DELETE** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## Project Routes (`/projects`)

### 1. Create Project
- **POST** `/projects`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Project Name",
  "description": "Project description here",
  "members": ["user_id_1", "user_id_2"]
}
```

### 2. Get All Projects
- **GET** `/projects`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "message": "Projects fetched successfully",
  "data": [
    {
      "_id": "project_id",
      "name": "Project Name",
      "description": "Project description",
      "status": "active",
      "createdBy": {
        "_id": "user_id",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "members": [
        {
          "_id": "user_id",
          "username": "john_doe",
          "email": "john@example.com"
        }
      ]
    }
  ]
}
```

### 3. Get Project by ID
- **GET** `/projects/:id`
- **Headers:** `Authorization: Bearer <token>`

### 4. Update Project
- **PATCH** `/projects/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "completed",
  "members": ["user_id_1", "user_id_2"]
}
```

### 5. Delete Project
- **DELETE** `/projects/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## Task Routes (`/tasks`)

### 1. Create Task
- **POST** `/tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "project": "project_id",
  "assignedTo": "user_id",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

### 2. Get All Tasks
- **GET** `/tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `project`: Filter by project ID
  - `status`: Filter by status (pending, in-progress, completed, cancelled)
  - `assignedTo`: Filter by assigned user ID

### 3. Get Task by ID
- **GET** `/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`

### 4. Update Task
- **PATCH** `/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

### 5. Delete Task
- **DELETE** `/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`

### 6. Get Tasks by Project
- **GET** `/tasks/project/:projectId`
- **Headers:** `Authorization: Bearer <token>`

### 7. Assign Task to User
- **PATCH** `/tasks/:id/assign`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "assignedTo": "user_id"
}
```
- **Response:**
```json
{
  "message": "Task assigned successfully",
  "data": {
    "_id": "task_id",
    "title": "Task Title",
    "assignedTo": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### 8. Assign Multiple Tasks to User
- **POST** `/tasks/assign-multiple`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "taskIds": ["task_id_1", "task_id_2", "task_id_3"],
  "assignedTo": "user_id"
}
```
- **Response:**
```json
{
  "message": "3 tasks assigned successfully",
  "data": [
    {
      "_id": "task_id_1",
      "title": "Task 1",
      "assignedTo": {
        "_id": "user_id",
        "username": "john_doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### 9. Get Tasks by User
- **GET** `/tasks/user/:userId`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status`: Filter by status (optional)
- **Response:**
```json
{
  "message": "User tasks fetched successfully",
  "data": [
    {
      "_id": "task_id",
      "title": "Task Title",
      "status": "pending",
      "priority": "high",
      "assignedTo": {
        "_id": "user_id",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "project": {
        "_id": "project_id",
        "name": "Project Name"
      }
    }
  ]
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Models

### User
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "user | admin"
}
```

### Project
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "createdBy": "ObjectId (ref: User)",
  "members": ["ObjectId (ref: User)"],
  "status": "active | completed | archived"
}
```

### Task
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "project": "ObjectId (ref: Project)",
  "assignedTo": "ObjectId (ref: User)",
  "createdBy": "ObjectId (ref: User)",
  "status": "pending | in-progress | completed | cancelled",
  "priority": "low | medium | high | urgent",
  "dueDate": "Date",
  "completedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables

3. Start the server:
```bash
npm start
```

4. The API will be available at `http://localhost:8000`

---

## Task Assignment Workflow

### Single Task Assignment
1. Create a task with initial assignment: `POST /tasks`
2. Reassign task to different user: `PATCH /tasks/:id/assign`

### Bulk Task Assignment
1. Create multiple tasks
2. Assign multiple tasks to one user: `POST /tasks/assign-multiple`

### View User's Tasks
- Get all tasks assigned to a specific user: `GET /tasks/user/:userId`
- Filter by status: `GET /tasks/user/:userId?status=pending` 