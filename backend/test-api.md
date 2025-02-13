# Testing News API Endpoints

## Prerequisites
1. Make sure MongoDB is running and configured in `.env`
2. Make sure Redis is running and configured in `.env`
3. Start the backend server

## Test Commands

### Create News Article
```bash
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test News Article",
    "content": "This is a test news article content",
    "excerpt": "Test excerpt",
    "category": "Technology",
    "image": "https://example.com/image.jpg",
    "tags": ["test", "api"]
  }'
```

### Get All News Articles
```bash
curl http://localhost:5000/api/news?page=1&limit=10
```

### Get Single News Article
```bash
curl http://localhost:5000/api/news/YOUR_NEWS_ID
```

### Update News Article
```bash
curl -X PUT http://localhost:5000/api/news/YOUR_NEWS_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Test News Article",
    "content": "Updated content"
  }'
```

### Delete News Article
```bash
curl -X DELETE http://localhost:5000/api/news/YOUR_NEWS_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Like/Unlike News Article
```bash
curl -X POST http://localhost:5000/api/news/YOUR_NEWS_ID/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Comment
```bash
curl -X POST http://localhost:5000/api/news/YOUR_NEWS_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "This is a test comment"
  }'
```

## Notes
1. Replace `YOUR_JWT_TOKEN` with a valid JWT token from your authentication system
2. Replace `YOUR_NEWS_ID` with an actual news article ID after creating one
3. The server must be running on port 5000 (default) for these commands to work
4. Make sure to handle CORS if testing from a different domain 