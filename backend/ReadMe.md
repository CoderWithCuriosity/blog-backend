
## 🔐 Authentication
All protected routes require a Bearer token in the Authorization header.

**Format:**
```
Authorization: Bearer <your_jwt_token>
```

**How to get token:**
1. Register/Login user
2. Copy token from response
3. Use in all protected requests

---

## 📤 POST Endpoints

### **1. Create Post** `POST /api/posts`
Creates a new blog post with optional images.

**Headers:**
```http
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Body (form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | text | ✅ | Post title |
| content | text | ✅ | Post content |
| images[] | file | ❌ | Image files (max 10) |

**Example Request (cURL):**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "title=My First Blog Post" \
  -F "content=This is the content of my amazing blog post." \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.png"
```

**Example Request (JavaScript - Fetch):**
```javascript
const formData = new FormData();
formData.append('title', 'My First Blog Post');
formData.append('content', 'This is the content...');

// Add images
const imageInput = document.querySelector('input[type="file"]');
formData.append('images', imageInput.files[0]);
formData.append('images', imageInput.files[1]);

const response = await fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  },
  body: formData
});
```

**Example Request (Postman):**
1. Select **POST** method
2. URL: `http://localhost:5000/api/posts`
3. Headers:
   - `Authorization: Bearer <token>`
4. Body → **form-data**:
   - `title`: `My First Blog Post` (Text)
   - `content`: `This is the content...` (Text)
   - `images`: `Select Files` (File - repeat for multiple)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "This is the content...",
    "images": [
      "uploads/images-1634567890123.jpg",
      "uploads/images-1634567890456.png"
    ],
    "userId": 1,
    "createdAt": "2023-10-20T10:30:00.000Z",
    "updatedAt": "2023-10-20T10:30:00.000Z",
    "images": [
      {
        "id": 1,
        "image": "uploads/images-1634567890123.jpg",
        "postId": 1
      },
      {
        "id": 2,
        "image": "uploads/images-1634567890456.png",
        "postId": 1
      }
    ]
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - No token provided
- `413` - File too large (>5MB)
- `415` - Invalid file type
- `500` - Server error

---

### **2. Update Post** `PUT /api/posts/:id`
Updates an existing post. Can add new images and delete existing ones.

**Headers:**
```http
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Body (form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | text | ❌ | New title |
| content | text | ❌ | New content |
| deleteImages | text | ❌ | JSON array of image IDs to delete |
| images[] | file | ❌ | New images to add |

**Example Request (cURL):**
```bash
curl -X PUT http://localhost:5000/api/posts/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "title=Updated Title" \
  -F "deleteImages=[1,2]" \
  -F "images=@/path/to/new-image.jpg"
```

**Example Request (JavaScript):**
```javascript
const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('deleteImages', JSON.stringify([1, 2]));
formData.append('images', newImageFile);

const response = await fetch('http://localhost:5000/api/posts/1', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  },
  body: formData
});
```

---

### **3. Delete Post** `DELETE /api/posts/:id`
Deletes a post and all associated images.

**Headers:**
```http
Authorization: Bearer <token>
```

**Example Request (cURL):**
```bash
curl -X DELETE http://localhost:5000/api/posts/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## 📥 GET Endpoints (No Authentication Required)

### **4. Get All Posts** `GET /api/posts`
Returns all posts with their images.

**Example Request:**
```bash
curl http://localhost:5000/api/posts
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "First Post",
      "slug": "first-post",
      "content": "Content...",
      "images": [
        {
          "id": 1,
          "image": "uploads/image1.jpg",
          "postId": 1
        }
      ],
      "userId": 1,
      "createdAt": "2023-10-20T10:30:00.000Z"
    }
  ]
}
```

---

### **5. Get Single Post** `GET /api/posts/:slug`
Returns a single post by its slug.

**Example Request:**
```bash
curl http://localhost:5000/api/posts/my-first-blog-post
```

---

## 🗂️ File Upload Details

### **Supported File Types:**
- JPEG/JPG
- PNG
- GIF
- WebP

### **File Limits:**
- Maximum size: 5MB per file
- Maximum files: 10 per request
- Storage: Local `uploads/` directory

### **File Paths:**
Uploaded files are stored as:
```
uploads/images-1634567890123.jpg
```
Where:
- `images-` = Field name prefix
- `1634567890123` = Timestamp
- `.jpg` = Original extension

---

## 🛠️ How to Add New Routes

### **Step 1: Create Controller**
Create a new controller file in `controllers/`:

```typescript
// controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User';

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Your logic here
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};
```

### **Step 2: Create Route File**
Create a new route file in `routes/`:

```typescript
// routes/userRoutes.ts
import express from 'express';
import { getProfile } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/profile', authenticate, getProfile);

export default router;
```

### **Step 3: Register Route in Main App**
Update `app.ts`:

```typescript
// app.ts
import express from 'express';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes'; // Import new route

const app = express();

// Existing routes
app.use('/api/posts', postRoutes);

// Add new route
app.use('/api/users', userRoutes); // Register new route

// ... rest of app setup
```

### **Step 4: Add Multer if Needed**
If your new route needs file uploads:

```typescript
// routes/userRoutes.ts
import upload from '../config/multer';

router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);
```

---

## 🔄 CRUD Operations Cheat Sheet

| Operation | Method | Route | Auth | Multer | Description |
|-----------|--------|-------|------|--------|-------------|
| Create | POST | `/api/posts` | ✅ | `array('images', 10)` | Create post with images |
| Read All | GET | `/api/posts` | ❌ | ❌ | Get all posts |
| Read One | GET | `/api/posts/:slug` | ❌ | ❌ | Get single post |
| Update | PUT | `/api/posts/:id` | ✅ | `array('images', 10)` | Update post & images |
| Delete | DELETE | `/api/posts/:id` | ✅ | ❌ | Delete post & images |

---

## 🎯 Best Practices for Testing

### **1. Using Postman:**
- Save requests in collections
- Use environment variables for base URL and tokens
- Test error scenarios (large files, wrong types)

### **2. Using cURL:**
```bash
# Save token to variable
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Use in requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/posts
```

### **3. Using JavaScript/TypeScript:**
```typescript
// Create reusable API client
class BlogAPI {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async createPost(data: FormData) {
    const response = await fetch(`${this.baseURL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: data
    });
    return response.json();
  }
}
```

---

## 🚨 Common Issues & Solutions

### **Issue 1: "Cannot read property 'path' of undefined"**
**Solution:** Check if `req.files` exists before accessing:
```typescript
if (req.files && Array.isArray(req.files)) {
  // Process files
}
```

### **Issue 2: "Request entity too large"**
**Solution:** Increase limit in multer config:
```typescript
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB
}
```

### **Issue 3: Images not displaying**
**Solution:** Serve static files in `app.ts`:
```typescript
app.use('/uploads', express.static('uploads'));
```
Access via: `http://localhost:5000/uploads/filename.jpg`

### **Issue 4: Database not syncing**
**Solution:** Check associations are correctly defined:
```typescript
// Must match exactly
Post.hasMany(PostImage, { foreignKey: "postId", as: 'images' });
```

---

## 📝 Example: Complete User Flow

### **Scenario:** User creates a blog post with images

1. **Login to get token:**
```bash
POST /api/auth/login
Response: { "token": "eyJ..." }
```

2. **Create post with images:**
```bash
POST /api/posts
Headers: Authorization: Bearer eyJ...
Body: form-data with title, content, and 2 images
```

3. **View the post:**
```bash
GET /api/posts/my-first-blog-post
No authentication needed
```

4. **Update to remove one image:**
```bash
PUT /api/posts/1
Headers: Authorization: Bearer eyJ...
Body: deleteImages=[2]  # Remove second image
```

5. **Delete the post:**
```bash
DELETE /api/posts/1
Headers: Authorization: Bearer eyJ...
```

---

## 🔗 Related Resources

1. [Multer Documentation](https://github.com/expressjs/multer)
2. [Cloudinary Node SDK](https://cloudinary.com/documentation/node_integration)
3. [Sequelize Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)
4. [Express File Uploads](https://expressjs.com/en/resources/middleware/multer.html)

---

## 📞 Support

For issues:
1. Check the console logs
2. Verify file permissions on `uploads/` directory
3. Ensure database is running
4. Check all environment variables are set

**Example Debug Command:**
```bash
# Check if uploads directory exists
ls -la uploads/

# Check server logs
npm run dev 2>&1 | grep -i error
```

---

## 🎉 Congratulations!
You now have a fully functional blog API with image upload capabilities. The structure is modular, so you can easily add new routes and features following the same pattern!