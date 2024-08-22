# ChatSystem

## Overview

This project is a text/video chat system built using the MEAN stack (MongoDB, Express, Angular, Node) along with sockets.io and Peer.js. 

## Git Repository Organization

- **Branching strategy:**
  - `'main':` Contains stable, production-ready code.
  - `'dev':` For ongoing development and features.
  - `Feature Branches:` For individual features and bug fixes.
- `Update frequency:`
  - Commits are made regularly.
  - Push updates are performed after significant changes.
- **Structure:**
  - `'chatclient/':` Contains the Angular frontend application.
  - `'chatserver/':` Contains the Node.js backend server.

## Data Structures

### Client-Side
- **User:**
  - `username` (string): Unique identifier for the user.
  - `email` (string): User's email address.
  - `id` (string): Unique user ID.
  - `roles[]` (array): Array of roles assigned to the user (e.g., Super Admin, Group Admin).
  - `groups[]` (array): Array of groups the user is a member of.

- **Group:**
  - `groupName` (string): Name of the group.
  - `admin[]` (array): Array of user IDs who are admins of the group.
  - `members[]` (array): Array of user IDs who are members of the group.
  - `channels[]` (array): Array of channel names within the group.

### Server-Side
- **User Model:**
  - Schema includes fields for username, email, password hash, roles, and group memberships.

- **Group Model:**
  - Schema includes fields for group name, admins, members, and channels.

## Angular Architecture
- **Components:**
  - `LoginComponent`: Handles user authentication.
  - `DashboardComponent`: Displays the user's groups and channels.
  - `GroupManagementComponent`: Allows group and channel management for admins.
  - `ChatComponent`: Handles real-time chat interactions.

- **Services:**
  - `AuthService`: Manages user authentication and authorization.
  - `GroupService`: Handles operations related to groups and channels.
  - `ChatService`: Manages real-time chat communication using sockets.

- **Models:**
  - `User`: Represents the user data.
  - `Group`: Represents group data.
  - `Channel`: Represents channel data within a group.

- **Routes:**
  - `/login`: Route for user login.
  - `/dashboard`: Route for displaying user dashboard.
  - `/group-management`: Route for managing groups and channels.
  - `/chat/:channelId`: Route for real-time chat within a specific channel.

## Node Server Architecture
- **Modules:**
  - `express`: Web framework for Node.js.
  - `mongoose`: ODM for MongoDB.
  - `sockets.io`: Library for real-time communication.
  - `peer`: Library for video chat functionality.

- **Functions:**
  - `authenticateUser()`: Handles user login and authentication.
  - `manageGroups()`: Manages group creation, deletion, and updates.
  - `manageChannels()`: Handles channel creation and management.
  - `handleChatMessages()`: Manages real-time chat messages using sockets.

- **Files:**
  - `server.js`: Main entry point for the server application.
  - `routes/`: Directory containing route handlers for various API endpoints.
  - `models/`: Directory for models representing data structures.
  - `controllers/`: Directory for controllers handling request logic.

- **Global Variables:**
  - `PORT`: Port number for the server.
  - `MONGODB_URI`: URI for connecting to the MongoDB database.

## Server-Side Routes
- **`POST /api/login`**
  - **Parameters:** `username`, `password`
  - **Return Values:** `authToken`, `userData`
  - **Purpose:** Authenticate the user and provide an access token.

- **`GET /api/groups`**
  - **Parameters:** `userId`
  - **Return Values:** `groups[]`
  - **Purpose:** Retrieve groups the user is a member of.

- **`POST /api/groups`**
  - **Parameters:** `groupName`, `adminId`
  - **Return Values:** `groupId`
  - **Purpose:** Create a new group and assign an admin.

- **`POST /api/channels`**
  - **Parameters:** `channelName`, `groupId`
  - **Return Values:** `channelId`
  - **Purpose:** Create a new channel within a group.

- **`POST /api/messages`**
  - **Parameters:** `channelId`, `message`
  - **Return Values:** `messageId`, `timestamp`
  - **Purpose:** Send a new chat message to a specific channel.

## Client-Server Interaction
- **User Authentication:**
  - **Client-side:** 
    - **Component: 'LoginComponent'**
    - **Action:** User enters their credentials and clicks 'Login'.
    - **Request:** An HTTP Post request is sent with username and password.
  - **Server-Side:**
    - **Processing:** The server verifies the credentials against the database.

- **Group Management:**
  - **Client-side:** 
    - **Component: 'GroupManagementComponent'**
    - **Action:** Admin creates a new group using a form.
    - **Request:** An HTTP Post request is sent with group details.
  - **Server-Side:**
    - **Processing:** The server validates the request and creates a new group in the database.
  - **Client-Side:**
    - **UI Update:** The 'GroupListComponent' displays the newly created group in the list.

## Getting Started
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/chatsystem.git
   cd chatsystem
