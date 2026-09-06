# Cloudinary Image Upload Setup

## Environment Variables for Render

Add these environment variables to your Render deployment settings:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Getting Your Cloudinary Credentials

1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to Account Settings → API Keys
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

⚠️ **SECURITY IMPORTANT**: 
- Never commit these keys to your repository
- Always use environment variables
- If you accidentally expose a key, regenerate it immediately in the Cloudinary dashboard
- The key you shared earlier should be regenerated in your dashboard

## Django Settings Configuration

Add this to your `settings.py`:

```python
import cloudinary
from decouple import config

# Cloudinary Configuration
cloudinary.config(
    cloud_name=config('CLOUDINARY_CLOUD_NAME'),
    api_key=config('CLOUDINARY_API_KEY'),
    api_secret=config('CLOUDINARY_API_SECRET')
)

# Add cloudinary_storage to INSTALLED_APPS
INSTALLED_APPS = [
    # ... other apps ...
    'cloudinary_storage',
    'cloudinary',
    'uploads',
]

# Optional: Configure default storage
# DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

## URL Configuration

Add this to your main `urls.py`:

```python
from django.urls import path, include

urlpatterns = [
    # ... other urls ...
    path('api/uploads/', include('uploads.urls')),
]
```

## API Usage

### Upload Image
**POST** `/api/uploads/upload/`

```bash
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/image.jpg" \
  http://localhost:8000/api/uploads/upload/
```

**Response:**
```json
{
  "success": true,
  "image_url": "https://res.cloudinary.com/...",
  "public_id": "preciousplastic/abc123",
  "size": 102400,
  "width": 1280,
  "height": 720
}
```

### Delete Image
**DELETE** `/api/uploads/delete/`

```bash
curl -X DELETE \
  -H "Content-Type: application/json" \
  -d '{"public_id": "preciousplastic/abc123"}' \
  http://localhost:8000/api/uploads/delete/
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Features

✅ Image upload to Cloudinary with automatic optimization
✅ File size validation (max 5MB)
✅ File type validation (JPEG, PNG, WebP, GIF)
✅ Automatic quality and format optimization
✅ Image deletion support
✅ Error handling and validation

## Installation Steps

1. **Install dependencies:**
```bash
pip install cloudinary django-cloudinary-storage
```

2. **Create uploads app (if not exists):**
```bash
python manage.py startapp uploads
```

3. **Update settings.py** with the configuration above

4. **Add to urls.py** as shown above

5. **Set environment variables** on Render:
   - Go to your Render service dashboard
   - Environment → Add Environment Variable
   - Add each variable one by one

6. **Deploy** and test the endpoints

## Security Notes

- Never hardcode API keys
- Always use environment variables
- Regenerate any exposed keys immediately
- Use HTTPS in production (Render does this automatically)
- Validate file uploads on the backend
- Limit file size to prevent abuse
