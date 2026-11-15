# AARANYA — Production-Ready MERN Indian Jewellery Website

**AARANYA** is a full-stack MERN (MongoDB Atlas, Express.js, React.js + Vite + Tailwind CSS, Node.js) catalogue, WhatsApp enquiry platform, and protected Admin CMS built for an Indian fine jewellery showroom.

---

## 1. Visual & Architectural Highlights

- **Strict Light Luxury Palette**:
  - Main Background: `#FAF8F4` | Secondary Background: `#F4EEE5` | Card Surface: `#F7F2EA`
  - Primary Champagne Gold: `#C89B5C` | Secondary Gold: `#D8B982`
  - Main Text: `#3C2B20` | Secondary Text: `#827466` | Borders: `#E9DED0` | White: `#FFFFFF`
- **Photography & Licensing Compliance (Zero AI Jewellery Images)**:
  - All development/seeded product images use legally licensed reference photography from Wikimedia Commons (`CC0` / `CC-BY-SA`) and Unsplash (`Unsplash License`).
  - Every reference image is explicitly tagged with `isDemo: true` and accompanied by a **1-Click "Replace Demo Images"** admin workflow so the store owner can upload genuine showroom photography via **Cloudinary** before launch.
- **13 Mongoose Models**:
  `Admin`, `Product`, `Category`, `Collection`, `Enquiry`, `ContactMessage`, `Testimonial`, `Banner`, `WebsiteSettings`, `VisitorAnalytics`, `ProductView`, `AdminActivityLog`, `FAQ`.
- **Complete 20-Point Production Readiness Checklist**:
  Custom 404 page, dynamic page titles & meta descriptions, above-the-fold CTAs, complete SVG/ICO/WebManifest favicon suite, `robots.txt`, dynamic `/sitemap.xml`, Open Graph tags, descriptive image `alt` text, responsive mobile/tablet/desktop breakpoints, sticky mobile product CTA bar, loading skeletons, field-level form validation, dedicated `/thank-you` confirmation page, Privacy Policy, Terms & Conditions, GDPR/DPDP Cookie Consent banner gating GA4, real event analytics, configurable contact placeholders, and responsive lazy-loaded WebP/AVIF Cloudinary images.

---

## 2. Project Directory Structure

```text
aaranya-mern/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB Atlas connection pool
│   │   └── cloudinary.js          # Cloudinary SDK & f_auto,q_auto transformation helper
│   ├── controllers/
│   │   ├── authController.js      # JWT + HTTP-Only cookie login/logout/me
│   │   ├── productController.js   # Full CRUD + Multer/Cloudinary multi-image upload & cleanup
│   │   ├── categoryController.js  # 13 Indian jewellery categories CRUD & ordering
│   │   ├── collectionController.js# Curated collections CRUD
│   │   ├── enquiryController.js   # WhatsApp click logging & lead status pipeline
│   │   ├── contactController.js   # Validated contact submissions & resolution workflow
│   │   ├── analyticsController.js # Real visitor, product view & enquiry metrics
│   │   └── cmsController.js       # Banners, Testimonials, FAQs, Settings & Activity Logs
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT cookie/Bearer verification & role guard
│   │   ├── uploadMiddleware.js    # Multer memoryStorage, 5MB limit & MIME filter
│   │   └── errorMiddleware.js     # ObjectId validator, 404 & centralised error handler
│   ├── models/                    # All 13 Mongoose schemas with indexes & validation
│   ├── routes/                    # Modular Express routers + dynamic /sitemap.xml
│   ├── scripts/
│   │   ├── seedAdmin.js           # Creates initial superadmin from environment variables
│   │   └── seedData.js            # Seeds categories, collections, licensed demo products & FAQs
│   ├── utils/
│   │   ├── cloudinaryHelper.js    # Stream upload & safe orphan image cleanup
│   │   └── activityLogger.js      # Immutable AdminActivityLog recorder
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   ├── robots.txt
    │   └── site.webmanifest
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   ├── utils/
    │   └── App.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

---

## 3. Installation & Local Development Setup

### Prerequisites
- **Node.js** `>= 18.x`
- **MongoDB Atlas** cluster URI
- **Cloudinary** account (`Cloud Name`, `API Key`, `API Secret`)

### Step 1: Configure Backend Environment
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas URI, JWT_SECRET, Cloudinary keys, and initial admin credentials
npm install
```

### Step 2: Seed Initial Admin & Reference Catalogue
```bash
npm run seed:admin
npm run seed
```

### Step 3: Start Backend Server
```bash
npm run dev
# Runs on http://localhost:5000
```

### Step 4: Configure & Start Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 4. Pre-Launch Store Owner Checklist
1. Log in to `/admin` using the credentials seeded via `seedAdmin.js`.
2. Open **Admin → Products → "Replace Demo Images Mode"** and replace every temporary Wikimedia/Unsplash reference image with genuine photographs of jewellery physically sold by AARANYA.
3. Open **Admin → Website Settings** and replace the `[DEMO PLACEHOLDER]` address, phone number, WhatsApp number, email, and Google Maps link with your verified showroom details.
4. Configure production HTTPS, set `NODE_ENV=production` so cookies use `Secure` + `SameSite=Strict`, and verify `/sitemap.xml` and `/robots.txt`.
