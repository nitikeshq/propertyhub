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
- **Notifications**: Email (Resend) and SMS (Twilio) for lead notifications

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
- RESEND_API_KEY (optional - for email notifications)
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER (optional - for SMS)
- ADMIN_EMAIL, ADMIN_PHONE (optional - notification recipients)

## Tech Stack
- React + TypeScript
- Express.js
- PostgreSQL with Drizzle ORM
- Shadcn UI components
- Tailwind CSS
- Replit Object Storage
- Resend (email)
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
- Notifications (email/SMS) are optional - app works without credentials
- Images are stored in Replit Object Storage
- Lead notifications are sent asynchronously
- Resend integration was dismissed - using API key approach instead
- Landing page features creative design with images, not simple text-only layout
- Sessions persist across server restarts using PostgreSQL session store
- Demo credentials: broker@demo.com / demo123
- DATABASE_URL must be set in deployed environments for session persistence
