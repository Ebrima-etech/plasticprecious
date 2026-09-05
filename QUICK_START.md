# 🚀 Quick Start Guide - Local Development

Everything is **hardcoded** for easy local development. No environment files needed!

## Prerequisites

- Python 3.12
- Node.js 20.x
- PostgreSQL (or SQLite for demo)
- npm

## Backend Setup (Django)

```bash
cd preciousback

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com
# Password: admin123

# Start server
python manage.py runserver

# Django Admin: http://localhost:8000/admin
# API: http://localhost:8000/api
```

## Frontend Setup (Next.js)

```bash
cd plasticprecious

# Install dependencies
npm install

# Start dev server
npm run dev

# Open: http://localhost:3000
```

## 🔌 Hardcoded Configuration

### Backend
- **Database**: PostgreSQL on localhost:5432
  - Database: `plasticprecious`
  - User: `postgres`
  - Password: `postgres`
- **Debug**: `True`
- **Allowed Hosts**: `*` (all)
- **CORS**: Allows `localhost:3000` and `localhost:3001`
- **Secret Key**: `django-insecure-plasticprecious-demo-key-12345`
- **Stripe**: Test keys (demo mode)
- **Email**: Console backend (prints to terminal)

### Frontend
- **API URL**: `http://localhost:8000/api`
- **Environment**: Development

## 📱 Using the Application

### 1. Create Admin Account
```bash
# In Django admin (http://localhost:8000/admin)
# Login with superuser credentials
```

### 2. Add Products
```bash
# Via Django Admin:
# 1. Go to http://localhost:8000/admin
# 2. Click "Products"
# 3. Click "Add Product"
# 4. Fill in details and save
```

### 3. Add CMS Content
```bash
# Via Django Admin (http://localhost:8000/admin):
# - Add Pages (About, Terms, etc.)
# - Add Testimonials
# - Add Blog Posts
# - Add FAQ
# - Add Services
# - Add Banners
# - Add Contact Info
# - Add Features
# - Configure Site Settings
```

### 4. Browse Frontend
```
http://localhost:3000/
- Home page
- Products page (from database)
- About page (from CMS)
- Services page (from CMS)
- Blog page (from CMS)
- FAQ page (from CMS)
- Contact page (with form)
- Cart (add/remove items)
- Checkout
```

### 5. User Features
```
- Register: http://localhost:3000/auth/register
- Login: http://localhost:3000/auth/login
- Shopping: Browse products, add to cart
- Checkout: Fill shipping address
- Orders: View order history
```

## 🗄️ Database Configuration

### Option 1: PostgreSQL (Recommended)
```bash
# Install PostgreSQL
# Create database
createdb plasticprecious

# Or via pgAdmin GUI
```

### Option 2: SQLite (Demo)
Update `preciousback/config/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

## 📊 Admin Dashboard

Access at: `http://localhost:8000/admin`

**Login credentials:**
- Username: `admin`
- Password: (whatever you set during creation)

**Manage:**
- Products & Categories
- Orders & Order Items
- Payments
- Users & Addresses
- Pages & Blog Posts
- Testimonials
- FAQ
- Banners
- Services
- Contact Messages
- Site Settings
- Newsletter Subscribers

## 🔍 API Testing

Use Postman or curl:

```bash
# Get all products
curl http://localhost:8000/api/products/

# Get all blog posts
curl http://localhost:8000/api/blog/

# Get FAQ
curl http://localhost:8000/api/faqs/

# Get services
curl http://localhost:8000/api/services/

# Get contact info
curl http://localhost:8000/api/contact-info/

# Get site settings
curl http://localhost:8000/api/site-settings/

# Get testimonials
curl http://localhost:8000/api/testimonials/

# Submit contact form
curl -X POST http://localhost:8000/api/contact-messages/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "subject": "Question",
    "message": "Hello"
  }'
```

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.12+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check database connection
python manage.py shell
>>> from django.db import connection
>>> connection.ensure_connection()
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 20.x

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### CORS errors
```
✓ Already configured for localhost:3000
✓ Update preciousback/config/settings.py if needed:
  CORS_ALLOWED_ORIGINS = ['http://localhost:3000', ...]
```

### API not responding
```bash
# Check if backend is running
curl http://localhost:8000/api/health/

# Check backend logs
# Should see: "Starting development server at..."
```

### Database errors
```bash
# Reset database (WARNING: loses all data)
python manage.py reset_db

# Or manually:
dropdb plasticprecious
createdb plasticprecious
python manage.py migrate
```

## 🛠️ Development Tips

### Auto-reload servers
- **Backend**: Django auto-reloads on code changes
- **Frontend**: Next.js auto-reloads on code changes

### Database shell
```bash
python manage.py shell
>>> from products.models import Product
>>> Product.objects.all()
```

### Create test data
```bash
python manage.py shell
>>> from products.models import Category, Product
>>> cat = Category.objects.create(name="Electronics")
>>> Product.objects.create(name="Test", price=99.99, category=cat, stock=10)
```

### Clear cache
```bash
python manage.py shell
>>> from django.core.cache import cache
>>> cache.clear()
```

## 📝 Make Changes

### Backend
1. Edit Django files
2. Django auto-reloads
3. Test via API: http://localhost:8000/api

### Frontend
1. Edit React/TypeScript files
2. Next.js auto-reloads
3. See changes at http://localhost:3000

## 🎯 Next Steps

1. **Start backend**: `python manage.py runserver`
2. **Start frontend**: `npm run dev`
3. **Create admin**: `python manage.py createsuperuser`
4. **Add content**: Go to http://localhost:8000/admin
5. **View site**: Go to http://localhost:3000

**That's it! 🎉 Happy developing!**
