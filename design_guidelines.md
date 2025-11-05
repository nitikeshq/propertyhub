# Design Guidelines: Multi-Portal Property Listing Platform

## Design Approach

**Hybrid Approach:**
- **Public Property Pages**: Airbnb-inspired aesthetic for property browsing and search
- **Broker & Admin Portals**: Linear-inspired clean dashboard design for productivity

This dual approach balances the need for an inviting, trust-building public experience with efficient, functional workspace portals.

## Core Design Principles

1. **Professional Credibility**: International, premium aesthetic that builds trust in high-value transactions
2. **Clarity Over Complexity**: Information hierarchy that makes property details and lead management instantly scannable
3. **Spatial Confidence**: Generous whitespace that reflects premium positioning

## Typography System

**Font Stack:**
- Primary: Inter (400, 500, 600) - body text, UI elements
- Headings: Cal Sans or similar display font (600, 700) - property titles, hero headlines

**Hierarchy:**
- Hero Headlines: text-5xl to text-7xl, display font
- Property Titles: text-2xl to text-3xl, display font
- Section Headers: text-xl to text-2xl, semibold
- Body Text: text-base, regular
- Metadata/Labels: text-sm, medium
- Captions: text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8

**Grid Systems:**
- Property Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard Stats: grid-cols-2 lg:grid-cols-4
- Filter Sidebar: Fixed left panel (w-64 to w-80) + main content area

**Container Widths:**
- Public pages: max-w-7xl
- Dashboard content: max-w-full with px-6 to px-8
- Property detail: max-w-6xl

## Component Library

### Public Property Search Pages

**Hero Section** (Homepage):
- Full-width immersive hero with large property image
- Height: min-h-[600px] to min-h-[700px]
- Centered search bar overlay with backdrop blur
- Search bar: Large input (h-14 to h-16) with location, property type dropdowns, prominent search button

**Property Grid**:
- Card-based layout with 3-column grid on desktop
- Property cards: Rounded corners (rounded-xl), subtle shadow, hover lift effect
- Image aspect ratio: 4:3 or 16:9
- Card content: Property image, title, location, price (prominent), key features (beds/baths/sqft), "View Details" CTA

**Filter Panel**:
- Sticky sidebar on desktop (lg:sticky lg:top-24)
- Mobile: Collapsible drawer
- Filter groups: Price range slider, Property type checkboxes, Location select, Size range, Amenities
- Clear filters button at bottom

**Property Detail Page**:
- Image gallery: Primary large image (aspect-[16/9]) + thumbnail grid below
- Two-column layout: Main content (property details, description) + sticky inquiry form
- Breadcrumb navigation at top
- Property specs grid: 2-3 columns with icons
- Map integration: Full-width section with embedded location

### Broker Portal

**Dashboard Layout**:
- Top navigation bar: Logo left, broker name/avatar right
- Sidebar navigation: Dashboard, My Listings, Add Property, Profile
- Main content: Stats cards row (Total Listings, Active, Views, Leads) + property management table

**Property Listing Form**:
- Step indicator at top for multi-step form
- Organized sections: Basic Info, Property Details, Pricing, Photos, Location
- Photo uploader: Drag-and-drop zone with preview grid
- Form inputs: Consistent height (h-12), rounded-lg borders
- Action buttons: Fixed bottom bar with Save Draft + Publish

### Super Admin Dashboard

**Lead Management Interface**:
- Top filters bar: Status tabs, date range picker, search input
- Lead table: Expandable rows with status badges, action dropdown
- Lead detail modal: Full contact info, property reference, status update dropdown, notes section
- Status badges: Rounded-full pills with status-specific styling

**Stats Overview**:
- KPI cards: 4-column grid with number emphasis, trend indicators
- Charts section: Lead funnel, property type distribution, timeline graph

## Interaction Patterns

**Navigation**:
- Public: Transparent header that becomes solid on scroll, sticky behavior
- Portals: Fixed sidebar (desktop) or bottom tab bar (mobile)

**Forms**:
- Single-column layouts with clear section grouping
- Input focus states with border emphasis
- Inline validation messaging
- File uploads with progress indicators

**Modals & Overlays**:
- Centered modal with backdrop blur
- Lead detail modal: max-w-2xl with overflow scroll
- Image lightbox for property galleries

**Loading States**:
- Skeleton screens for property cards
- Inline spinners for form submissions
- Progress bars for file uploads

## Images Section

**Hero Image** (Homepage):
- Large, high-quality architectural/interior photograph showcasing luxury property
- Dimensions: Minimum 1920x1080, optimized for web
- Treatment: Slight gradient overlay for text legibility
- Placement: Full-width hero section, behind search interface

**Property Listings**:
- Professional property photography for each listing card
- Multiple images per property detail page (5-10 images)
- Interior shots, exterior views, amenity photos

**Dashboard/Admin**:
- No hero images
- Icon-based UI with minimal decorative imagery
- User avatars for broker/admin profiles

## Accessibility Standards

- Form inputs: Clear labels, visible focus states, ARIA attributes
- Color contrast: Maintain WCAG AA compliance for all text
- Keyboard navigation: Full support across all interfaces
- Screen reader: Semantic HTML with proper heading hierarchy