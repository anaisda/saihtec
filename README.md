# SAIHTEC AB — Website + Custom CMS

Full-stack Next.js website with a built-in admin panel. 100% free. No external CMS services.

---

## Stack (all free)
- **Next.js 14** — framework
- **JSON files** — content storage (no database needed)
- **bcryptjs + JWT** — secure admin authentication
- **Resend** — email (free: 3,000/month) — optional
- **Vercel** — hosting (free)

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — change JWT_SECRET to a long random string

# 3. Run
npm run dev
# Website: http://localhost:3000
# Admin:   http://localhost:3000/admin/login
```

### Default admin credentials
- **Email:** admin@saihtec.com
- **Password:** admin123
- ⚠️ Change password immediately after first login → Admin → Change Password

---

## Admin Panel Features

| Section | What you can edit |
|---------|------------------|
| **Dashboard** | Overview, quick stats, link to live site |
| **Site Settings** | Hero video URL, tagline, title, stats bar, SEO, contact email |
| **About** | Title, quote, body text, certifications list |
| **Technology** | All science cards (add/edit/delete/reorder) |
| **Pipeline** | Programs, phases (slider), indications, status |
| **Team** | Members, bios, photos, LinkedIn, accent color picker |
| **Publications** | Papers, journals, DOI links (add/edit/delete) |
| **News** | Articles with full body text, categories, slugs |
| **Messages** | Contact form submissions inbox (view/delete) |
| **Change Password** | Secure password update |

---

## Deployment on Vercel (free)

```bash
npm install -g vercel
vercel

# In Vercel dashboard → Settings → Environment Variables:
# JWT_SECRET = your-long-random-secret
# RESEND_API_KEY = re_xxxx (optional, from resend.com)
```

⚠️ **Important for Vercel:** Vercel is serverless — JSON files reset on each deploy.
For production persistence, use one of:
- **Option A:** Vercel KV (free tier) — replace JSON reads/writes with KV calls
- **Option B:** PlanetScale / Railway (free PostgreSQL) — 30 min setup
- **Option C:** Deploy on a real VPS (DigitalOcean $4/mo, Hetzner €3.79/mo) — JSON files persist normally ✓

**Recommended for this project: VPS or one.com with Node.js** — JSON files work perfectly, zero extra config.

---

## Deployment on one.com / VPS

```bash
# Build
npm run build

# Start (keep running with PM2)
npm install -g pm2
pm2 start npm --name "saihtec" -- start
pm2 save
pm2 startup
```

---

## Changing the hero video
1. Go to **Admin → Site Settings → Background Video URL**
2. Paste any direct `.mp4` URL
3. **Free sources:**
   - Pexels: `https://videos.pexels.com/video-files/3195440/3195440-uhd_2560_1440_25fps.mp4`
   - Pixabay: pixabay.com/videos — search "laboratory"
   - Your own: upload to Cloudinary (free) → get direct URL

---

## Project Structure
```
saihtec-v2/
├── pages/
│   ├── index.tsx              # Public website (all sections)
│   ├── _app.tsx / _document.tsx
│   ├── api/
│   │   ├── auth/              # login, logout, me, change-password
│   │   ├── cms/               # content CRUD + messages (auth-protected)
│   │   ├── public/content.ts  # public read-only content API
│   │   └── contact.ts         # contact form handler
│   └── admin/
│       ├── index.tsx          # Dashboard
│       ├── login.tsx          # Login page
│       ├── settings.tsx       # Site settings editor
│       ├── about.tsx
│       ├── technology.tsx
│       ├── pipeline.tsx
│       ├── team.tsx
│       ├── publications.tsx
│       ├── news.tsx
│       ├── messages.tsx
│       └── settings/password.tsx
├── components/
│   └── admin/
│       ├── AdminLayout.tsx    # Sidebar + topbar layout
│       └── FormComponents.tsx # Input, Label, Card, SaveButton, etc.
├── lib/
│   ├── db.ts                  # JSON file read/write
│   └── auth.ts                # JWT sign/verify, cookie helpers, withAuth HOC
├── data/
│   ├── content.json           # All website content (editable via admin)
│   ├── admin.json             # Admin users + hashed passwords (auto-created)
│   └── messages.json          # Contact form submissions (auto-created)
├── styles/globals.css
├── .env.example
└── README.md
```

---

Built by **SARL Baina Agency** for **SAIHTEC AB** · © 2026
