# Camera AI Blog Backend API

A comprehensive RESTful API for managing blog posts built with Node.js, Express, and MongoDB Atlas.

## Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete blog posts
- ✅ **MongoDB Atlas Integration** - Cloud database with Mongoose ODM
- ✅ **Advanced Filtering & Search** - Filter by author, tags, published status, and full-text search
- ✅ **Pagination** - Efficient pagination for large datasets
- ✅ **Sorting Options** - Sort by date, popularity, likes, or title
- ✅ **Input Validation** - Comprehensive validation using express-validator
- ✅ **SEO-Friendly URLs** - Auto-generated slugs for blog posts
- ✅ **Like System** - Like/unlike functionality for blog posts
- ✅ **Statistics API** - Get blog statistics and analytics
- ✅ **Security** - Helmet for security headers, CORS configuration
- ✅ **Logging** - Morgan for request logging
- ✅ **Error Handling** - Centralized error handling middleware

## Project Structure

```
src/
├── config/
│   └── database.js         # MongoDB connection configuration
├── controllers/
│   └── blogController.js   # Blog route handlers
├── middleware/
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Input validation middleware
├── models/
│   └── Blog.js            # Blog schema and model
├── routes/
│   ├── index.js           # Main router
│   └── blogRoutes.js      # Blog-specific routes
├── scripts/
│   └── seed.js            # Database seeding script
├── utils/
│   └── responseUtils.js   # Response formatting utilities
└── server.js              # Main server file
```

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd cameraAI_be
npm install
```

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string

### 3. Environment Configuration

Copy `.env.example` to `.env` and update with your MongoDB Atlas connection string:

```bash
cp .env.example .env
```

Update `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/camera_ai_blog?retryWrites=true&w=majority
PORT=3001
NODE_ENV=development
API_VERSION=v1
```

### 4. Seed Database (Optional)

Populate your database with sample data:

```bash
npm run seed
```

### 5. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Base URL: `http://localhost:3001`

### Health Check
- **GET** `/` - API information
- **GET** `/api/health` - Health check

### Blog Posts

#### Get All Posts
- **GET** `/api/blogs`
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `published` - Filter by published status (true/false)
  - `author` - Filter by author name
  - `tags` - Filter by tags (comma-separated)
  - `search` - Full-text search in title and content
  - `sort` - Sort by: `newest`, `oldest`, `popular`, `liked`, `title`

#### Get Single Post
- **GET** `/api/blogs/:id` - Get by ID
- **GET** `/api/blogs/slug/:slug` - Get by slug

#### Create Post
- **POST** `/api/blogs`
- **Body:**
```json
{
  "title": "Blog Title",
  "content": "Blog content...",
  "author": "Author Name",
  "tags": ["tag1", "tag2"],
  "published": true,
  "featured": false
}
```

#### Update Post
- **PUT** `/api/blogs/:id`
- **Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "author": "Updated Author",
  "tags": ["updated", "tags"],
  "published": true,
  "featured": true
}
```

#### Delete Post
- **DELETE** `/api/blogs/:id`

#### Like Post
- **PATCH** `/api/blogs/:id/like`

#### Get Statistics
- **GET** `/api/blogs/stats`

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  },
  "timestamp": "2025-08-09T10:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...],
  "timestamp": "2025-08-09T10:00:00.000Z"
}
```

## Blog Post Schema

```json
{
  "id": "ObjectId",
  "title": "Blog Title",
  "content": "Blog content...",
  "author": "Author Name",
  "tags": ["tag1", "tag2"],
  "published": true,
  "featured": false,
  "slug": "blog-title",
  "views": 0,
  "likes": 0,
  "excerpt": "Auto-generated excerpt...",
  "createdAt": "2025-08-09T10:00:00.000Z",
  "updatedAt": "2025-08-09T10:00:00.000Z"
}
```

## Example Usage

### Using curl

```bash
# Get all published posts with pagination
curl "http://localhost:3001/api/blogs?published=true&page=1&limit=5"

# Search for posts
curl "http://localhost:3001/api/blogs?search=camera%20ai"

# Filter by tags
curl "http://localhost:3001/api/blogs?tags=ai,machine-learning"

# Create a new post
curl -X POST http://localhost:3001/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post about camera AI technology.",
    "author": "John Doe",
    "tags": ["introduction", "ai", "camera"],
    "featured": true
  }'

# Get a specific post by slug
curl http://localhost:3001/api/blogs/slug/my-first-blog-post

# Like a post
curl -X PATCH http://localhost:3001/api/blogs/{post-id}/like

# Get statistics
curl http://localhost:3001/api/blogs/stats
```

### Using JavaScript (Frontend)

```javascript
// Fetch all blogs with pagination
const response = await fetch('/api/blogs?page=1&limit=10');
const { data, pagination } = await response.json();

// Create a new blog post
const newPost = await fetch('/api/blogs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Blog Post',
    content: 'Blog content here...',
    author: 'Author Name',
    tags: ['tag1', 'tag2']
  })
});
```

## Validation Rules

- **Title**: Required, 3-200 characters
- **Content**: Required, minimum 10 characters
- **Author**: Optional, 2-100 characters (defaults to "Anonymous")
- **Tags**: Optional array, each tag 1-30 characters, alphanumeric with hyphens/underscores
- **Published**: Optional boolean (defaults to true)
- **Featured**: Optional boolean (defaults to false)

## Database Indexes

For optimal performance, the following indexes are created:
- Text index on `title` and `content` for search
- Index on `slug` for URL-based queries
- Index on `published` for filtering
- Index on `createdAt` for sorting

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Database connection issues
- Invalid ObjectIds
- Duplicate entries
- Server errors

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Prevents injection attacks
- **Error Sanitization**: Prevents information leakage

## Development

### Environment Variables
Make sure to set up your environment variables in `.env` file.

### Database Seeding
Run `npm run seed` to populate your database with sample blog posts.

### Logging
In development mode, detailed request logs are shown using Morgan.

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Update CORS origins in server configuration
3. Ensure MongoDB Atlas network access is configured
4. Use a process manager like PM2 for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
