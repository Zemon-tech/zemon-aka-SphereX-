# Backend Implementation Log

#Topic: News Page API Implementation

#### Overview
Implemented a comprehensive News API with MongoDB for storage and Redis for caching.

#### Features Implemented
1. MongoDB Schema
   - Created News model with fields for title, content, excerpt, author, category, image, tags, views, likes, and comments
   - Implemented proper validation and relationships
   - Added view count tracking for articles

2. Express.js Routes
   - POST `/news` - Create new article
   - GET `/news` - List articles with pagination
   - GET `/news/:id` - Get single article with view tracking
   - PUT `/news/:id` - Update article
   - DELETE `/news/:id` - Delete article
   - POST `/news/:id/like` - Like/Unlike article
   - POST `/news/:id/comments` - Add comment

3. Redis Caching
   - Implemented caching for article listings and single article views
   - Cache invalidation on updates, deletes, likes, and comments
   - Cache expiration set to 1 hour
   - Separate cache keys for list and detail views
   - Automatic cache clearing on content updates

4. Security & Performance
   - Authentication middleware for protected routes (temporarily disabled for testing)
   - Input validation and error handling
   - Proper error responses with status codes
   - Optimized database queries with lean()
   - View count tracking with atomic updates
   - Default author data handling for testing phase

5. API Response Format
```json
{
  "success": true,
  "data": {
    // For list endpoint
    "news": [
      {
        "_id": "string",
        "title": "string",
        "content": "string",
        "excerpt": "string",
        "category": "string",
        "image": "string",
        "tags": ["string"],
        "author": {
          "name": "string",
          "avatar": "string"
        },
        "createdAt": "string",
        "views": "number",
        "likes": ["string"]
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
}
```

#### Dependencies Added
- express
- mongoose
- redis
- dotenv
- cors
- body-parser

#### Cache Strategy
1. List Cache:
   - Key format: `news:all:{page}:{limit}`
   - Includes pagination data
   - Invalidated on any news update/create/delete

2. Detail Cache:
   - Key format: `news:{id}`
   - Includes full article data with author
   - View count updated and cached
   - Invalidated on article update/delete

#### Next Steps
- Implement search functionality
- Add categories and tags filtering
- Add pagination for comments
- Implement comment moderation
- Add proper user authentication
- Implement proper author data handling
- Add rate limiting for view counting 


###Topic: Repository API Implementation

#### Overview
Implemented a comprehensive Repository API with GitHub integration, MongoDB storage, and Redis caching.

#### Features Implemented
1. MongoDB Schema
   - Created Repo model with fields for GitHub repository data
   - Added support for likes, comments, and metadata
   - Implemented proper validation and relationships
   - Added indexes for text search

2. GitHub Integration
   - Created GitHub utility for fetching repository data
   - Implemented repository validation and URL parsing
   - Added support for fetching contributors and branches
   - Automatic syncing of repository data

3. Express.js Routes
   - GET `/repos` - List repositories with pagination
   - GET `/repos/:id` - Get repository details
   - POST `/repos` - Add new repository
   - PUT `/repos/:id` - Update repository (sync with GitHub)
   - DELETE `/repos/:id` - Delete repository
   - POST `/repos/:id/like` - Like/Unlike repository
   - POST `/repos/:id/comments` - Add comment

4. Redis Caching
   - Implemented caching for repository listings
   - Cache invalidation on updates and deletes
   - Cache expiration set to 1 hour
   - Separate cache keys for list and detail views

5. Security & Performance
   - Authentication middleware for protected routes
   - Input validation and error handling
   - Proper error responses with status codes
   - Optimized database queries with lean()
   - GitHub API rate limit handling

#### Dependencies Added
- @octokit/rest - GitHub API client
- mongoose - MongoDB ODM
- redis - Caching layer
- express - Web framework

#### Cache Strategy
1. List Cache:
   - Key format: `repos:all:{page}:{limit}`
   - Includes pagination data
   - Invalidated on any repo update/create/delete

2. Detail Cache:
   - Key format: `repos:{id}`
   - Includes full repo data with GitHub info
   - Invalidated on update/delete/like/comment

#### Next Steps
- Implement repository search functionality
- Add repository categories and tags
- Add rate limiting for GitHub API calls
- Implement webhook for GitHub updates
- Add repository analytics tracking
- Implement proper error handling for GitHub API limits

### Store Implementation (2024-03-19)

1. Created MongoDB model for web store items (`store.model.ts`)
   - Added schema for store items with fields for name, description, thumbnail, URL, etc.
   - Implemented review system with ratings and comments
   - Added automatic average rating calculation
   - Added text indexing for search functionality

2. Created store controller (`store.controller.ts`)
   - Implemented CRUD operations for store items
   - Added Redis caching for better performance
   - Added review system functionality
   - Implemented proper error handling and validation
   - Added authorization checks for delete operations

3. Added API routes (`store.routes.ts`)
   - GET `/store` - List all store items (cached)
   - GET `/store/:id` - Get store item details
   - POST `/store` - Add new store item (authenticated)
   - POST `/store/:id/review` - Add review to store item (authenticated)
   - DELETE `/store/:id` - Delete store item (authenticated)
   - Added authorization check to ensure only tool owners or admins can delete

4. Added validation (`store.validator.ts`)
   - Created Zod schemas for store items and reviews
   - Added input validation for all POST requests
   - Added validation for delete operations

### Features
- ✅ MongoDB integration for storing tool data
- ✅ Redis caching for improved performance
- ✅ Rating and review system
- ✅ Authentication for protected routes
- ✅ Input validation using Zod
- ✅ Proper error handling and logging
- ✅ Tool ownership and deletion management

### API Endpoints

#### DELETE /api/store/:id
Delete a store item. Requires authentication and authorization.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tool deleted successfully"
}
```

**Error Responses:**
- 401 Unauthorized: User not authenticated
- 403 Forbidden: User not authorized to delete this tool
- 404 Not Found: Tool not found

**Notes:**
- Only the tool owner or admin users can delete a tool
- Deleting a tool also removes associated reviews and ratings
- Cache is automatically invalidated after deletion

### Next Steps
1. Add search functionality
2. Implement sorting and filtering
3. Add image upload support
4. Add user favorites/bookmarks
5. Add bulk delete for admin users
6. Add tool restoration capability

# Backend Documentation

## Events API

### Models

#### Event Model
- `title` (String, required): Event title
- `description` (String, required): Event description
- `date` (Date, required): Event date
- `time` (String, required): Event time
- `location` (String, required): Event location
- `mode` (String, enum: ['online', 'in-person', 'hybrid']): Event mode
- `type` (String, enum: ['hackathon', 'workshop', 'conference', 'meetup', 'webinar']): Event type
- `capacity` (Number, optional): Maximum number of attendees
- `registrationUrl` (String, optional): External registration URL
- `rewards` (String, optional): Event rewards/prizes
- `image` (String, required): Event image URL
- `tags` (Array of Strings): Event tags for filtering
- `organizer` (ObjectId, ref: 'User'): Event organizer
- `attendees` (Array of ObjectIds, ref: 'User'): Registered attendees
- `clicks` (Number): Number of event page views
- `registrations` (Number): Number of registrations
- `analytics`: Event analytics data
  - `dailyViews`: Array of { date: Date, count: Number }
  - `registrationDates`: Array of { date: Date, count: Number }

### Endpoints

#### GET /api/events
Get all events with filtering and pagination
- Query Parameters:
  - `page` (Number): Page number
  - `limit` (Number): Items per page
  - `city` (String): Filter by city
  - `type` (String): Filter by event type
  - `rewards` (String): Filter by rewards
  - `startDate` (Date): Filter events after this date
  - `endDate` (Date): Filter events before this date
- Response: List of events with pagination info
- Uses Redis caching for optimized performance

#### GET /api/events/:id
Get single event details
- Parameters:
  - `id`: Event ID
- Response: Detailed event information
- Updates view count and analytics
- Uses Redis caching

#### POST /api/events
Create a new event
- Authentication required
- Body: Event details
- Response: Created event object

#### PUT /api/events/:id
Update an existing event
- Authentication required
- Parameters:
  - `id`: Event ID
- Body: Updated event details
- Response: Updated event object

#### DELETE /api/events/:id
Delete an event
- Authentication required
- Parameters:
  - `id`: Event ID
- Response: Success message

#### POST /api/events/:id/register
Register for an event
- Authentication required
- Parameters:
  - `id`: Event ID
- Response: Registration confirmation
- Updates registration count and analytics

#### GET /api/events/export/excel
Export events data to Excel
- Authentication required
- Response: Excel file with event data
- Includes:
  - Event details
  - Registration statistics
  - Analytics data

### Caching Strategy

- Redis is used for caching frequently accessed data
- Cache keys:
  - List cache: `events:{page}:{limit}:{filters}`
  - Detail cache: `events:{id}`
- Cache expiration: 1 hour
- Cache is cleared on updates/deletes

### Analytics Tracking

- Tracks:
  - Page views (clicks)
  - Registrations
  - Daily view counts
  - Registration dates
- Data can be exported to Excel for analysis

### Best Practices

- Input validation using TypeScript interfaces
- Error handling with custom AppError class
- Redis caching for performance optimization
- MongoDB indexes for faster queries
- Authentication middleware for protected routes
- Rate limiting for API endpoints
- CORS configuration for security

## Authentication Implementation

### Overview
Implemented a comprehensive authentication system with both traditional email/password and GitHub OAuth support, using MongoDB for storage and Redis for caching.

### Features Implemented

1. User Model (`user.model.ts`)
   - Basic fields: name, email, password (hashed), avatar
   - Profile fields: company, role, education details
   - Social links: GitHub, LinkedIn, personal website
   - Password hashing using bcrypt
   - Methods for password comparison

2. Authentication Routes
   - POST `/api/auth/signup` - User registration
   - POST `/api/auth/login` - Email/password login
   - GET `/api/auth/me` - Get current user
   - POST `/api/auth/logout` - User logout
   - GET `/api/auth/verify` - Verify auth token
   - POST `/api/auth/github/sync` - GitHub OAuth sync
   - PUT `/api/auth/profile` - Update user profile

3. Profile Management
   - Update basic information (name, role, company)
   - Update education details (university, graduation year)
   - Update social links (GitHub, LinkedIn, website)
   - Password management with bcrypt hashing
   - Profile data caching with Redis

4. Security Features
   - JWT-based authentication
   - Password hashing with bcrypt
   - Token expiration (7 days)
   - Redis-based session caching
   - Protected route middleware

### API Endpoints

#### POST /api/auth/signup
Register a new user
```json
Request:
{
  "name": "string",
  "email": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string",
      "role": "string"
    }
  }
}
```

#### POST /api/auth/login
Login with email/password
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response: Same as signup
```

#### GET /api/auth/me
Get current user profile
```json
Response:
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string",
    "role": "string",
    "password": "string", // Hashed (development only)
    "company": "string",
    "github": "string",
    "linkedin": "string",
    "personalWebsite": "string",
    "education": {
      "university": "string",
      "graduationYear": number
    }
  }
}
```

#### PUT /api/auth/profile
Update user profile
```json
Request:
{
  "name": "string",              // Optional
  "company": "string",           // Optional
  "role": "string",             // Optional
  "github": "string",           // Optional
  "linkedin": "string",         // Optional
  "personalWebsite": "string",  // Optional
  "education": {                // Optional
    "university": "string",
    "graduationYear": number
  },
  "newPassword": "string"       // Optional: For password update
}

Response:
{
  "success": true,
  "data": {
    // Updated user data (same as GET /me response)
  }
}
```

### Cache Strategy
1. User Cache:
   - Key format: `user:{id}`
   - Stores user data without sensitive information
   - Expiration: 1 hour
   - Invalidated on profile updates and logout

2. Session Cache:
   - Stores active user sessions
   - Cleared on logout
   - Used for quick token validation

### Security Notes
- Passwords are hashed using bcrypt with salt factor 10
- JWT tokens expire after 7 days
- Sensitive data is excluded from cache storage
- Development mode shows hashed passwords for testing
- GitHub OAuth integration with secure state handling

### Next Steps
- Add email verification
- Implement password reset functionality
- Add two-factor authentication
- Enhance session management
- Add rate limiting for auth endpoints
- Remove password visibility in production

## Community Features

### Ideas Section
- `GET /api/community/ideas` - Get all ideas (cached)
- `POST /api/community/ideas` - Create a new idea (requires auth)
- `PUT /api/community/ideas/:id/like` - Like/unlike an idea (requires auth)

### Comments Section
- `GET /api/community/ideas/:ideaId/comments` - Get all comments for an idea (cached)
- `POST /api/community/ideas/:ideaId/comments` - Add a comment to an idea (requires auth)

### Resources Section
- `GET /api/community/resources` - Get all resources (cached)
- `POST /api/community/resources` - Add a new resource (requires auth)
- `PUT /api/community/resources/:id/like` - Like/unlike a resource (requires auth)

## Models

### Idea Model
```typescript
{
  title: string;          // Title of the idea
  description: string;    // Description of the idea
  author: ObjectId;       // Reference to User model
  likes: ObjectId[];      // Array of User IDs who liked
  comments: ObjectId[];   // Array of Comment IDs
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last update timestamp
}
```

### Comment Model
```typescript
{
  text: string;          // Comment text
  author: ObjectId;      // Reference to User model
  idea: ObjectId;        // Reference to Idea model
  likes: ObjectId[];     // Array of User IDs who liked
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last update timestamp
}
```

### Resource Model
```typescript
{
  title: string;          // Resource title
  description: string;    // Resource description
  resourceType: enum;     // PDF, VIDEO, or TOOL
  url: string;           // Resource URL
  addedBy: ObjectId;     // Reference to User model
  likes: ObjectId[];     // Array of User IDs who liked
  views: number;         // View count
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last update timestamp
}
```

## Caching Strategy

The backend uses Redis for caching frequently accessed data:

- Ideas list is cached with prefix 'ideas'
- Comments are cached with prefix 'comments'
- Resources are cached with prefix 'resources'
- Cache TTL is set to 1 hour by default
- Cache is invalidated when related data is modified

## Authentication

All write operations require authentication using JWT tokens:
- Token should be included in the Authorization header
- Format: `Bearer <token>`

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/community
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

Each error response includes a message field explaining the error.

## Implemented Author Name for Ideas & Resources
### Changes:
- Updated MongoDB schema to properly use author references for ideas and resources
- Added authentication middleware to idea and resource creation routes
- Modified backend API to use authenticated user's ID as author/addedBy
- Updated API responses to populate author name in ideas and resources
- Added proper error handling for authentication failures
- Ensured backward compatibility with existing data
- Verified seamless integration with frontend components

### API Updates:
1. Ideas API
   - POST `/api/community/ideas` now requires authentication
   - Author field is automatically set to the authenticated user
   - Response includes populated author name

2. Resources API
   - POST `/api/community/resources` now requires authentication
   - AddedBy field is automatically set to the authenticated user
   - Response includes populated author name

### Security
- Added token-based authentication for creating ideas and resources
- Proper validation of user tokens
- Secure handling of user data

### Data Structure
- Ideas: author field references User model
- Resources: addedBy field references User model
- Both include populated author name in responses

## Enhanced Authentication Flow for Community Features
### Changes:
- Added client-side authentication checks for sharing ideas and resources
- Implemented redirection to login page for unauthenticated users
- Enhanced error handling for authentication failures
- Added proper user feedback through toast notifications

### Frontend Updates:
1. Community Page
   - Added authentication check before showing share modals
   - Implemented redirection to login page for unauthenticated users
   - Added user feedback through toast notifications
   - Unified share button behavior for both ideas and resources

### Security Enhancements:
- Client-side token validation before attempting protected operations
- Proper error messages for authentication failures
- Secure redirection to login page
- Protected routes properly handle unauthenticated access

### User Experience:
- Clear feedback when authentication is required
- Seamless redirection to login page
- Consistent behavior across ideas and resources sections
- Improved error messaging for better user understanding

### Rating System Implementation

#### Overview
Implemented a comprehensive rating and review system for store items with MongoDB storage and Redis caching.

#### Features Implemented
1. MongoDB Schema Enhancement
   - Added review schema with fields:
     - `user_name` (String, required)
     - `rating` (Number, required, min: 1, max: 5)
     - `comment` (String, optional)
     - `createdAt` (Date, auto-generated)
   - Added to store item schema:
     - `reviews` (Array of review schema)
     - `average_rating` (Number, auto-calculated)
     - `total_reviews` (Number, auto-updated)
   - Implemented pre-save middleware for automatic rating calculations

2. API Endpoints
   - POST `/api/store/:id/review` - Add or update review (authenticated)
     - Validates user authentication
     - Prevents duplicate reviews from same user
     - Updates existing review if user has already reviewed
     - Handles optional comments
     - Auto-calculates average rating

3. Frontend Integration
   - Interactive star rating component
   - Review form with validation
   - Dynamic review list display
   - Real-time rating updates
   - User-specific review management
     - View own review
     - Update existing review
     - Toggle between view and edit modes

4. Security & Validation
   - JWT authentication required for reviews
   - Input validation for ratings (1-5)
   - Optional comment validation (10-500 chars)
   - User-specific review access control
   - Proper error handling and messages

5. Redis Caching
   - Cache invalidation on review updates
   - Automatic recalculation of average ratings
   - Cache key format: `store:item:{id}`
   - Cache cleared on new reviews/updates

#### Dependencies Used
- mongoose - MongoDB ODM
- redis - Caching layer
- jsonwebtoken - Authentication
- zod - Input validation

#### Cache Strategy
1. Store Item Cache:
   - Key format: `store:item:{id}`
   - Includes full item data with reviews
   - Invalidated on review add/update
   - Auto-updates average rating

2. Review Management:
   - User reviews tracked by username
   - Single review per user per item
   - Automatic update of existing reviews
   - Real-time frontend updates

#### Next Steps
1. Add review moderation system
2. Implement review sorting options
3. Add review helpfulness voting
4. Add review reporting functionality
5. Implement review analytics
6. Add review notifications
7. Add review response system for store owners

#### API Response Format
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "reviews": [
      {
        "user_name": "string",
        "rating": "number",
        "comment": "string",
        "createdAt": "date"
      }
    ],
    "average_rating": "number",
    "total_reviews": "number"
  }
}
```

#### Best Practices Implemented
- Proper error handling with custom messages
- Input validation for all fields
- Authentication middleware for protected routes
- Redis caching for performance
- MongoDB indexes for efficient queries
- User-specific review management
- Real-time rating calculations
- Frontend state management
- Optimistic UI updates

## Profile Update Endpoint

### PUT /api/auth/profile

Updates the user's profile information. Requires authentication.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",              // Username
  "company": "string",          // Optional: Company name
  "role": "string",            // Optional: Professional role
  "github": "string",          // Optional: GitHub username
  "linkedin": "string",        // Optional: LinkedIn profile URL
  "personalWebsite": "string", // Optional: Personal website URL
  "education": {               // Optional: Education details
    "university": "string",    // University/College name
    "graduationYear": number   // Graduation year (between 1900 and current year + 10)
  },
  "currentPassword": "string", // Optional: Required only when updating password
  "newPassword": "string"      // Optional: New password (min 6 characters)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "fullName": "string",
    "email": "string",
    "avatar": "string",
    "role": "string",
    "company": "string",
    "github": "string",
    "linkedin": "string",
    "personalWebsite": "string",
    "education": {
      "university": "string",
      "graduationYear": number
    }
  }
}
```

**Error Responses:**
- 401 Unauthorized: User not authenticated or invalid current password
- 404 Not Found: User not found
- 400 Bad Request: Invalid input data

**Notes:**
- All fields except `name` and `email` are optional
- Password update requires both `currentPassword` and `newPassword`
- `graduationYear` must be between 1900 and current year + 10
- The endpoint updates the user cache after successful update 

## Password Management

### GET /api/auth/me (Updated)
Now includes the hashed password in the response for development purposes. The password is not stored in the cache but is fetched fresh from the database each time.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string",
    "role": "string",
    "password": "string", // Hashed password (development only)
    "company": "string",
    "github": "string",
    "linkedin": "string",
    "personalWebsite": "string",
    "education": {
      "university": "string",
      "graduationYear": number
    }
  }
}
```

### PUT /api/auth/profile (Password Update)
The profile update endpoint now supports direct password updates without requiring the current password (for development purposes).

**Request Body for Password Update:**
```json
{
  "newPassword": "string" // Minimum 6 characters
}
```

**Notes:**
- The new password will be automatically hashed before storage using bcrypt
- Password must be at least 6 characters long
- For development purposes, the current hashed password is visible in the Account tab
- In production, this should be modified to require the current password for verification

**Security Considerations:**
- Passwords are hashed using bcrypt with a salt factor of 10
- The hashed password is only included in the response for development purposes and should be removed in production
- The frontend stores the hashed password only temporarily for display purposes 