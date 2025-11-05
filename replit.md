# PropertyHub - Real Estate Platform

## Overview
A multi-portal property listing platform connecting brokers with buyers. Features include property listings, lead management, and interior design services.

## Project Status
MVP complete with enhanced landing page and INR currency support

## Architecture
- **Frontend**: React with TypeScript, Wouter for routing, TanStack Query for data fetching
- **Backend**: Express.js with PostgreSQL database
- **Authentication**: Session-based with bcrypt password hashing
- **File Storage**: Replit Object Storage for property images
- **Notifications**: Email (Resend) and SMS (Twilio) for lead notifications

## Key Features
1. **Public Property Search**: Browse residential, commercial properties, and land with advanced filters
2. **Broker Portal**: Property listing management with image uploads
3. **Admin Dashboard**: Lead management with status tracking
4. **Interior Design**: Consultation request form
5. **Notifications**: Email and SMS alerts for new leads

## Database Schema
- **users**: Broker, owner, and admin accounts with email/password auth
- **properties**: Property listings with images, pricing, location details
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
- **User Registration Enhancement**: Sign-up now offers "Property Broker" and "Property Owner" account types instead of allowing super admin registration
- **Currency Localization**: All prices changed from USD to INR with proper Indian locale formatting (₹ symbol, comma separators)
- **Landing Page Enhancement**: 
  - Hero section with professional background image and gradient overlay
  - Property category showcase cards with stock images (Residential, Commercial, Land)
  - Features section highlighting platform benefits
  - Enhanced call-to-action sections with improved design
  - All interactive elements have proper accessibility attributes
- **Stock Images**: Added professional real estate images stored in attached_assets/stock_images/

## Notes
- Notifications (email/SMS) are optional - app works without credentials
- Images are stored in Replit Object Storage
- Lead notifications are sent asynchronously
- Resend integration was dismissed - using API key approach instead
- Landing page features creative design with images, not simple text-only layout
