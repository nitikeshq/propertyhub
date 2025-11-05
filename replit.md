# PropertyHub - Real Estate Platform

## Overview
A multi-portal property listing platform connecting brokers with buyers. Features include property listings, lead management, and interior design services.

## Project Status
MVP complete with enhanced landing page and INR currency support

## Architecture
- **Frontend**: React with TypeScript, Wouter for routing, TanStack Query for data fetching
- **Backend**: Express.js with PostgreSQL database
- **Authentication**: Session-based with bcrypt password hashing, PostgreSQL session store for persistence
- **File Storage**: Replit Object Storage for property images
- **Notifications**: Email (Gmail SMTP via nodemailer) and SMS (Twilio) for lead notifications

## Key Features
1. **Find Properties**: Browse residential, commercial properties, and land with advanced search, filters, and sorting
2. **Property Details**: Detailed property pages with SEO-friendly slugs and lead capture forms
3. **Broker Portal**: Property listing management with image uploads
4. **Admin Dashboard**: Lead management with status tracking
5. **Interior Design**: Consultation request form
6. **Notifications**: Email and SMS alerts for new leads

## Database Schema
- **users**: Broker, owner, and admin accounts with email/password auth
- **properties**: Property listings with images, videos, amenities, facilities, nearby places, pricing, location details
- **leads**: Inquiries from buyers for properties or interior design

## Environment Variables Required
- DATABASE_URL (PostgreSQL - auto-configured)
- OBJECT_STORAGE vars (auto-configured)
- SESSION_SECRET (auto-configured)
- GMAIL_USER, GMAIL_APP_PASSWORD (required for email notifications via Gmail SMTP)
- ADMIN_EMAIL (required - email address to receive lead notifications)
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER (optional - for SMS)
- ADMIN_PHONE (optional - phone number to receive SMS notifications)

## Tech Stack
- React + TypeScript
- Express.js
- PostgreSQL with Drizzle ORM
- Shadcn UI components
- Tailwind CSS
- Replit Object Storage
- Nodemailer with Gmail SMTP (email)
- Twilio (SMS)

## Recent Updates (November 2025)
- **Session Persistence**: Upgraded from in-memory sessions to PostgreSQL-backed session store (connect-pg-simple)
  - Sessions now persist across server restarts
  - 30-day cookie lifetime for extended user sessions
  - Automatic session table creation in PostgreSQL
  - Uses DATABASE_URL for session storage
- **Property Detail Enhancements**:
  - Full image gallery with thumbnail navigation
  - Full-screen lightbox modal with prev/next controls and wrap-around
  - Video display section with native controls
  - All property fields properly displayed
- **Dashboard Completeness**: Verified all property detail fields are available in broker dashboard form
- **Navigation**: Conditionally shows Dashboard/Logout (authenticated) or Login/Sign Up (not authenticated)
- **Find Properties Page**: New dedicated page at /properties with search, filter by type/price, and sort functionality
- **Property Details with Slugs**: SEO-friendly URLs with format /property/title-slug-id
- **Enterprise Login/Signup**: Modern split-screen design for authentication pages
- **User Registration Enhancement**: Sign-up now offers "Property Broker" and "Property Owner" account types instead of allowing super admin registration
- **Currency Localization**: All prices changed from USD to INR with proper Indian locale formatting (₹ symbol, comma separators)
- **Email Notifications**: Configured with Gmail SMTP (nodemailer), uses INR format and Indian timezone for lead notifications
- **Admin Account**: Created super admin account for viewing all leads and managing the platform
- **Database Schema Update**: Changed price fields from integer to bigint to support large Indian real estate prices (up to ₹900 crore+)
- **Landing Page Enhancement**: 
  - Hero section with professional background image and gradient overlay
  - Property category showcase cards with stock images (Residential, Commercial, Land)
  - Features section highlighting platform benefits
  - Enhanced call-to-action sections with improved design
  - All interactive elements have proper accessibility attributes
  - Property type selection shows all options directly (no dropdown)
  - Property cards navigate to detail pages when clicked
- **Stock Images**: Added professional real estate images stored in attached_assets/stock_images/

## Notes
- Notifications (email/SMS) are configured - email via Gmail SMTP (nodemailer), SMS via Twilio (optional)
- Email notifications use INR currency format and Indian timezone
- Images are stored in Replit Object Storage
- Lead notifications are sent asynchronously to ADMIN_EMAIL and ADMIN_PHONE
- Landing page features creative design with images, not simple text-only layout
- Sessions persist across server restarts using PostgreSQL session store
- **Demo credentials:**
  - **Admin:** admin@propertyhub.com / admin123 (access admin dashboard to view all leads)
  - **Broker:** broker@demo.com / demo123 (access broker dashboard to manage properties)
- DATABASE_URL must be set in deployed environments for session persistence
- **Security Note:** Change admin password for production deployment
