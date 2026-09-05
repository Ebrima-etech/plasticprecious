# Plasticprecious - Production Ready

Complete full-stack eCommerce platform with CMS, ready for production deployment.

## 🚀 Quick Start - Production Deployment

### Frontend (Vercel)
```bash
# 1. Push to GitHub
cd plasticprecious
git push origin main

# 2. Deploy to Vercel
# Go to vercel.com, connect GitHub, authorize deployment

# 3. Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

### Backend (Render)
```bash
# 1. Push to GitHub
cd preciousback
git push origin main

# 2. Deploy to Render
# Go to render.com, create new web service, connect GitHub

# 3. Set environment variables
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<random_key>
DATABASE_URL=<postgres_url>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_xxxxx
```

## 📋 What's Included

### Backend Features
✅ Complete Django REST API  
✅ PostgreSQL database with migrations  
✅ JWT authentication with refresh tokens  
✅ 11 CMS models for dynamic content  
✅ Stripe payment integration  
✅ Product catalog with filtering & search  
✅ Shopping cart & order management  
✅ Admin dashboard for content management  
✅ Email notifications  
✅ Health check endpoint  
✅ Production security settings  
✅ Gunicorn WSGI server  
✅ Redis caching (optional)  
✅ Sentry error tracking (optional)  

### Frontend Features
✅ Next.js 16 with TypeScript  
✅ Tailwind CSS responsive design  
✅ JWT authentication with localStorage  
✅ API integration with axios  
✅ Dynamic pages from CMS  
✅ Product browsing & filtering  
✅ Shopping cart functionality  
✅ Checkout process with address form  
✅ User registration & login  
✅ About, Services, Blog, FAQ, Contact pages  
✅ Newsletter subscription  
✅ Contact form with message tracking  
✅ Image optimization  
✅ Security headers  
✅ Performance optimization  

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Frontend (Next.js + Tailwind)     │
│   Deployed on Vercel                │
│   - Product Pages                   │
│   - Shopping Cart                   │
│   - Checkout                        │
│   - User Auth                       │
│   - CMS Pages                       │
└────────────────┬────────────────────┘
                 │ REST API
                 ↓
┌─────────────────────────────────────┐
│   Backend (Django + DRF)            │
│   Deployed on Render                │
│   - PostgreSQL Database             │
│   - JWT Auth                        │
│   - REST API Endpoints              │
│   - Admin Dashboard                 │
│   - Stripe Integration              │
│   - CMS Management                  │
└─────────────────────────────────────┘
```

## 📁 Project Structure

### Frontend
```
plasticprecious/
├── src/
│   ├── app/
│   │   ├── page.tsx (Home)
│   │   ├── products/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── auth/ (login, register)
│   │   └── layout.tsx
│   ├── components/ (Reusable components)
│   ├── config/api.ts (API configuration)
│   ├── lib/auth.ts (Auth utilities)
│   ├── types/index.ts (TypeScript types)
│   └── hooks/useApi.ts (API hook)
├── public/ (Static assets)
├── next.config.ts (Production config)
├── vercel.json (Vercel deployment)
├── tsconfig.json (TypeScript config)
├── tailwind.config.ts (Tailwind config)
└── package.json (Dependencies)
```

### Backend
```
preciousback/
├── config/ (Django settings)
│   ├── settings.py (Production-ready)
│   ├── urls.py
│   ├── wsgi.py
│   └── health.py (Health check)
├── api_urls.py (API routes)
├── products/ (Product models & APIs)
├── orders/ (Orders, cart, items)
├── accounts/ (User auth, addresses)
├── payments/ (Stripe integration)
├── cms/ (Content management)
├── manage.py
├── render.yaml (Render deployment)
├── Procfile (Process file)
├── requirements.txt (Python dependencies)
├── .env.example (Environment template)
└── DEPLOYMENT.md (Deployment guide)
```

## 🔐 Security Features

### Enabled by Default
- HTTPS/SSL enforcement
- Secure headers (CSP, X-Frame-Options, etc.)
- CSRF protection
- XSS protection
- CORS configured
- JWT token rotation
- Password hashing
- SQL injection prevention
- Database connection pooling
- Rate limiting
- Debug mode disabled in production

### Optional Security Features
- Sentry error tracking
- AWS S3 for media storage
- Redis caching
- Two-factor authentication (ready to implement)

## 🚀 Deployment Checklist

### Before Production

- [ ] Update `.env.example` with all required variables
- [ ] Generate strong SECRET_KEY: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`
- [ ] Set up Stripe account and get API keys
- [ ] Configure email service (Gmail, SendGrid, etc.)
- [ ] Set up Sentry for error tracking
- [ ] Review security settings in settings.py
- [ ] Test with production domain
- [ ] Set up SSL certificate (automatic on Vercel/Render)
- [ ] Configure backups for database
- [ ] Set up monitoring and alerts

### Frontend (Vercel)

1. Connect GitHub repository
2. Set environment variables
3. Configure custom domain (if using)
4. Enable Preview Deployments
5. Set up Analytics
6. Configure error tracking

### Backend (Render)

1. Create PostgreSQL database
2. Connect GitHub repository
3. Set environment variables
4. Configure custom domain (if using)
5. Set up health checks: `GET /api/health/`
6. Enable auto-deploy on push
7. Configure backups

## 📊 Database Schema

### CMS Models (11)
- Page
- Testimonial
- Banner
- FAQ
- BlogPost
- Service
- ContactInformation
- Newsletter
- ContactMessage
- Feature
- SiteSettings

### eCommerce Models (13)
- Product
- Category
- ProductReview
- Order
- OrderItem
- Cart
- CartItem
- Payment
- User
- Address
- ContactMessage (shared)

**Total: 24 models**

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
```

### Products
```
GET    /api/products/                    (List with filters)
GET    /api/products/{id}/               (Detail)
POST   /api/products/{id}/add_review/    (Add review)
GET    /api/categories/
```

### Orders & Cart
```
GET    /api/orders/                      (List user orders)
POST   /api/orders/                      (Create order)
GET    /api/cart/
POST   /api/cart/add_item/
PATCH  /api/cart/update_item/
DELETE /api/cart/remove_item/
```

### Payments
```
POST   /api/payments/create_payment_intent/
POST   /api/payments/{id}/confirm_payment/
POST   /api/payments/{id}/refund/
```

### CMS
```
GET    /api/pages/                       (Website pages)
GET    /api/blog/                        (Blog posts)
GET    /api/faqs/                        (FAQ)
GET    /api/services/                    (Services)
GET    /api/testimonials/                (Testimonials)
GET    /api/banners/                     (Banners)
GET    /api/contact-info/                (Contact info)
POST   /api/contact-messages/            (Contact form)
POST   /api/newsletter/                  (Newsletter signup)
GET    /api/site-settings/               (Site config)
```

### Health & Admin
```
GET    /api/health/                      (Health check)
GET    /admin/                           (Django admin)
```

## 📈 Performance Optimization

### Frontend
- Image optimization (WebP/AVIF)
- Code splitting by route
- Lazy loading components
- Static generation where possible
- CSS-in-JS with Tailwind
- Minimized bundle size

### Backend
- Database connection pooling
- Redis caching (optional)
- Query optimization
- Pagination (20 items per page)
- Gzip compression
- Static file compression

## 🔍 Monitoring

### Vercel Analytics
- Core Web Vitals (LCP, FID, CLS)
- Page performance
- Error rates
- User engagement

### Backend Monitoring
- Sentry error tracking
- Request/response logging
- Database performance
- API rate limiting

### Health Checks
- Frontend: Vercel health endpoint
- Backend: `/api/health/` endpoint

## 🛠️ Local Development

### Backend
```bash
cd preciousback
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd plasticprecious
npm install
npm run dev
# Open http://localhost:3000
```

## 📚 Documentation

- [Backend Deployment Guide](preciousback/DEPLOYMENT.md)
- [Frontend Deployment Guide](plasticprecious/DEPLOYMENT.md)
- [Backend README](preciousback/README.md)
- [Frontend README](plasticprecious/README.md)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request
5. Vercel preview deployment created automatically
6. After review and tests pass, merge to main
7. Vercel automatically deploys to production

## 📞 Support

- Check deployment guides for troubleshooting
- Review logs in Render/Vercel dashboards
- Enable Sentry for error tracking
- Check health endpoint: `/api/health/`

## 🎉 Next Steps

1. **Customize Content**: Edit pages in Django admin
2. **Add Products**: Add products via admin
3. **Configure Email**: Set up email notifications
4. **Add Payment Processing**: Configure Stripe
5. **Monitor Performance**: Set up Sentry
6. **Scale**: Upgrade resources as needed

## 📄 License

MIT License - Feel free to use for your projects

---

**Ready for production! Deploy now with confidence.** 🚀
