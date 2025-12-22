# Figma AI Design Prompt - Dairy Management System

## 🎨 Complete Design Brief for Figma AI

---

## Project Overview

Design a comprehensive web application interface for a **modern dairy business management system**. The application helps dairy businesses manage production, inventory, orders, clients, and analytics. The design should be professional, clean, and optimized for daily business operations.

---

## 🎯 Design Requirements

### **Application Type**
- **Platform**: Web Application (Desktop-first, responsive for tablets)
- **Industry**: Food Production & Distribution (Dairy Business)
- **Users**: Business managers, production staff, warehouse operators, sales teams
- **Usage Context**: Daily operational tasks, real-time monitoring, data entry, analytics

---

## 🎨 Design System Specifications

### **Color Palette**

**Primary Colors:**
- Primary Blue: `#4A90E2` (Main actions, navigation highlights)
- Primary Hover: `#357ABD` (Interactive states)
- Primary Light: `#E3F2FD` (Backgrounds, subtle accents)

**Semantic Colors:**
- Success Green: `#50C878` (Completed, active, positive states)
- Warning Yellow: `#FFC107` (Alerts, pending, caution states)
- Danger Red: `#DC3545` (Critical, errors, delete actions)
- Info Blue: `#17A2B8` (Informational messages)

**Fresh Theme (Alternative):**
- Fresh Green: `#86C232` (Clean, organic feel)
- Cream: `#FCF5E5` (Warm backgrounds)
- Sage: `#6B8E23` (Natural accents)

**Neutral Colors:**
- Gray 50: `#F9FAFB` (Light backgrounds)
- Gray 100: `#F3F4F6` (Card backgrounds)
- Gray 200: `#E5E7EB` (Borders)
- Gray 300: `#D1D5DB` (Disabled states)
- Gray 600: `#4B5563` (Secondary text)
- Gray 900: `#111827` (Primary text)

**Dark Mode Support:**
- Dark Background: `#1F2937`
- Dark Surface: `#374151`
- Dark Border: `#4B5563`
- Dark Text: `#F9FAFB`

### **Typography**

**Font Family:** Inter (Clean, modern, highly readable)

**Font Sizes:**
- Heading 1: 36px / Bold (Page titles)
- Heading 2: 24px / Semibold (Section headers)
- Heading 3: 18px / Semibold (Card titles)
- Body Large: 16px / Regular (Main content)
- Body: 14px / Regular (Standard text)
- Small: 12px / Regular (Labels, captions)
- Tiny: 10px / Medium (Badges, tags)

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### **Spacing System**
- Base Unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Card Padding: 24px
- Section Spacing: 32px
- Grid Gap: 24px

### **Border Radius**
- Small: 4px (Badges, tags)
- Medium: 8px (Buttons, inputs)
- Large: 12px (Cards)
- XL: 16px (Modals, large containers)
- Full: 9999px (Avatars, pills)

### **Shadows**
- Small: `0 1px 3px rgba(0,0,0,0.1)`
- Medium: `0 4px 6px rgba(0,0,0,0.1)`
- Large: `0 10px 15px rgba(0,0,0,0.1)`
- XL: `0 20px 25px rgba(0,0,0,0.15)`

---

## 📐 Layout Structure

### **Main Layout Components**

1. **Sidebar Navigation (Left, 280px width)**
   - Company logo at top (60px height)
   - Main navigation menu items with icons
   - Active state highlighting
   - Collapsible on mobile
   - Fixed positioning

2. **Top Header Bar (Full width, 64px height)**
   - Search bar (center-left, 400px width)
   - Notification bell icon (with red badge)
   - Theme switcher (Light/Dark/Fresh)
   - User profile avatar with dropdown
   - Breadcrumb navigation

3. **Main Content Area**
   - Max width: 1440px
   - Padding: 32px
   - White/Light gray background
   - Responsive grid system

4. **Footer (Optional)**
   - Copyright info
   - Quick links
   - Version number

---

## 🖥️ Screen Designs Required

### **1. Login Page**

**Layout:**
- Centered card (480px width)
- Left side: Illustration/image of dairy farm (optional)
- Right side: Login form

**Elements:**
- Logo and app name
- Email input field (with icon)
- Password input field (with show/hide toggle)
- "Remember me" checkbox
- "Forgot password?" link
- Primary "Sign In" button (full width)
- Demo credentials hint box

**Visual Style:**
- Clean, minimal design
- Soft gradient background
- Subtle shadows on card
- Welcoming imagery

---

### **2. Dashboard (Homepage)**

**Layout Grid:** 4 columns

**Top Section - KPI Cards (4 across):**
- Card 1: Today's Production (500L) - Package icon, blue accent
- Card 2: Pending Orders (12) - Shopping cart icon, orange accent
- Card 3: Low Stock Items (3) - Alert icon, red accent
- Card 4: Active Clients (48) - Users icon, green accent

Each card includes:
- Icon (40px, colored)
- Metric number (large, bold)
- Label (small text)
- Trend indicator (+5% with arrow)

**Middle Section - Charts (2 columns):**

Left Column (60%):
- **Production Trends Chart**
  - Line chart showing last 6 months
  - X-axis: Months
  - Y-axis: Liters
  - Legend
  - Gradient fill under line
  - Tooltips on hover

Right Column (40%):
- **Client Distribution Chart**
  - Donut/Pie chart
  - Color-coded segments (Restaurants, Groceries, Hotels, etc.)
  - Percentage labels
  - Legend with counts

**Bottom Section:**

Left (60%):
- **Stock Rotation Table**
  - Headers: Product | Quantity | Expiry | Status
  - 5 rows of data
  - Color-coded status badges
  - Alternating row colors

Right (40%):
- **Recent Tasks List**
  - Checkboxes
  - Task text
  - Priority badges
  - Due dates
  - "View all" link

**Visual Style:**
- White cards with shadows
- Ample whitespace
- Consistent spacing
- Clear data hierarchy

---

### **3. Production Management Page**

**Top Bar:**
- Page title: "Production Management"
- Subtitle: "Monitor and control production operations"
- "New Batch" button (primary, with + icon)

**Statistics Cards (4 across):**
- Total Production: 1,250L
- Active Batches: 3
- Completed Today: 5
- Average Yield: 95%

**Main Content - Production Table:**

**Table Layout:**
- Full width card
- Sticky header
- Columns: Batch ID | Product | Quantity | Operator | Status | Actions
- 8-10 rows visible
- Pagination at bottom

**Table Features:**
- Batch ID: Monospace font (B-2025-XXX)
- Product: Product name with type
- Quantity: Number + unit (L/kg)
- Operator: Name
- Status: Colored badge (Pending/In Progress/Completed)
- Actions: Icon buttons (Start, Complete, View, Edit, Delete)

**Batch Status Badges:**
- Pending: Yellow background, dark yellow text
- In Progress: Blue background, white text
- Completed: Green background, white text

**Action Buttons:**
- Start: Play icon, green
- Complete: Check icon, primary
- View: Eye icon, secondary
- Edit: Pencil icon, secondary
- Delete: Trash icon, red

**Modal - Create/Edit Batch:**
- Title: "Create New Batch" or "Edit Batch"
- Form fields:
  - Product Name (text input)
  - Product Type (dropdown: Milk, Yogurt, Cheese)
  - Quantity (number input with unit)
  - Operator (text input)
  - Temperature (optional, number)
  - pH Level (optional, number)
  - Notes (textarea)
- Buttons: "Create/Update" (primary) | "Cancel" (secondary)

---

### **4. Orders & Deliveries Page**

**Top Bar:**
- Page title: "Orders & Deliveries"
- "New Order" button

**Statistics Cards (4 across):**
- Total Orders: 45
- In Transit: 8
- Delivered: 32
- Pending: 5

**Main Content - Orders Table:**

**Columns:**
- Order # (ORD-XXXX)
- Client (name)
- Items (count)
- Total (€ amount)
- Delivery Date
- Status (badge)
- Actions (Track, View, Edit, Delete icons)

**Status Badges:**
- Pending: Yellow
- Preparing: Light blue
- In-Transit: Blue with truck icon
- Delivered: Green with checkmark
- Cancelled: Red

**Modal - Order Tracking:**
- Order number at top
- Current status badge (large)
- Status update buttons (Start Preparing, Dispatch, Mark Delivered)
- Timeline view:
  - Vertical line with dots
  - Each event shows: Status, Location, Time, Notes
  - Most recent at top
- Driver information card (if in transit)

**Modal - Create Order:**
- Client selection (searchable dropdown)
- Delivery date and time pickers
- Items section:
  - Product dropdown + Quantity input
  - "Add Item" button
  - Remove buttons for each item
- Estimated total display (highlighted)
- Special instructions textarea
- "Create Order" button

---

### **5. Clients Directory Page**

**Top Bar:**
- Page title: "Clients Directory"
- "New Client" button

**Statistics Cards (4 across):**
- Total Clients: 52
- Active: 48
- Total Revenue: €125,450
- Avg Rating: 4.6/5

**Main Content - Client Cards Grid:**

**Grid Layout:** 3 columns

**Each Client Card:**
- Client name (header)
- Business type (Restaurant/Grocery/Hotel)
- Status badge (Active/Inactive)
- Contact person name
- Email (blue, clickable)
- Phone number
- Star rating (visual stars, 1-5)
- Statistics row:
  - Total Orders: 24
  - Revenue: €5,200
- Action buttons: View | Edit | Delete

**Card Visual:**
- White background
- Border on hover
- Shadow on hover
- Icon for business type
- Color-coded status badge

**Modal - Client Details:**
- Large modal (800px width)
- Tabs: Profile | Order History | Preferences
- Profile tab:
  - Name, Type, Status, Rating
  - Contact information section
  - Address details
  - Business statistics (cards)
- Delivery Preferences:
  - Delivery days (day pills: Mon, Tue, Wed...)
  - Preferred time slot
  - Payment terms
- Favorite products (badge list)
- Notes section

---

### **6. Inventory Management Page**

**Top Bar:**
- Page title: "Inventory Management"
- "Add Product" button

**Statistics Cards (4 across):**
- Total Products: 24
- Low Stock Alert: 3 (red)
- Total Stock Value: €45,280
- Categories: 4

**Filters Bar:**
- Search box (with magnifying glass icon)
- Category filter dropdown (All/Milk/Yogurt/Cheese/Cream)
- Status filter (All/Low Stock)

**Low Stock Alert Section (if applicable):**
- Warning banner (yellow background)
- Alert icon
- Title: "Low Stock Alert (3 items)"
- Grid of low stock products (3 columns)
- Each item: Product name, Stock level, "Restock" button

**Main Content - Products Table:**

**Columns:**
- Product (with description)
- Category
- SKU (monospace)
- Stock (with threshold indicator)
- Price (per unit)
- Location
- Status (badge)
- Actions (Add Stock, Remove Stock, View, Edit, Delete)

**Stock Indicators:**
- Green checkmark: Normal stock
- Yellow warning: Low stock
- Red alert: Critical stock

**Modal - Stock Adjustment:**
- Product name (header)
- Current stock display
- Operation selector (Add/Remove radio buttons)
- Quantity input
- New stock level preview (highlighted)
- "Confirm" button

**Modal - Add/Edit Product:**
- Form sections:
  - Basic Info: Name, Category, Unit
  - Identification: SKU, Barcode
  - Stock Levels: Current, Min Threshold, Max Capacity
  - Pricing: Unit Price, Cost Price
  - Storage: Location, Temperature, Shelf Life
  - Supplier information
- "Save Product" button

---

### **7. Reports & Analytics Page**

**Top Bar:**
- Page title: "Reports & Analytics"
- Time range selector (This Month/Quarter/Year)
- "Export Report" button (with download icon)

**KPI Cards (4 across):**
- Total Production: 12,500L
- Total Revenue: €48,320
- Active Clients: 48
- Avg Order Value: €875

**Production Performance Section:**

**Left (60%) - Production by Type (Pie Chart):**
- Chart title
- Donut chart with segments:
  - Milk: 45% (blue)
  - Yogurt: 30% (green)
  - Cheese: 15% (yellow)
  - Cream: 10% (orange)
- Legend with values
- Center shows total

**Right (40%) - Batch Status Cards:**
- Completed: 28 (green card)
- In Progress: 5 (blue card)
- Pending: 3 (yellow card)
- Average Yield: 94.5% (highlighted)

**Sales Analytics Section:**

**Left (60%) - Revenue by Product (Bar Chart):**
- Horizontal or vertical bars
- X-axis: Products
- Y-axis: Revenue (€)
- Color-coded bars
- Value labels on bars

**Right (40%) - Order Status Breakdown:**
- List of status cards:
  - Each shows: Status name, Order count, Revenue
  - Color-coded indicator dot
  - Percentage bar

**Top Clients Table:**
- Full width
- Columns: Client | Type | Orders | Revenue | Monthly | Rating
- Top 10 clients
- Sortable columns
- Star ratings

**Inventory Status Section:**
- 3 stat cards:
  - Total Products
  - Low Stock Items
  - Total Stock Value
- Low stock alert list (expandable)

---

### **8. Settings Page**

**Sidebar Navigation (Left 25%):**
- Profile
- Company Settings
- Users & Permissions
- Products Configuration
- Notifications
- System Preferences

**Main Content (Right 75%):**

**Profile Section:**
- Avatar upload area
- Name, Email, Phone fields
- Password change section
- Two-factor authentication toggle

**Company Settings:**
- Company name
- Logo upload
- Business address
- Contact information
- Tax/VAT number

**Theme Preferences:**
- Theme selector cards:
  - Light theme (preview)
  - Dark theme (preview)
  - Fresh theme (preview)
- Color customization options

---

## 🎨 Component Library to Design

### **Buttons**

**Variants:**
1. **Primary Button**
   - Blue background (#4A90E2)
   - White text
   - 8px border radius
   - Medium shadow
   - Hover: Darker blue, larger shadow
   - Sizes: Small (32px), Medium (40px), Large (48px)

2. **Secondary Button**
   - Gray border
   - Gray text
   - Transparent background
   - Same radius and sizes

3. **Success Button**
   - Green background
   - White text

4. **Danger Button**
   - Red background
   - White text

**Icon Buttons:**
- Square (32x32px, 40x40px)
- Icon centered
- Colored on hover

### **Input Fields**

**Text Input:**
- Height: 40px
- Border: 1px solid gray-300
- Border radius: 8px
- Padding: 12px 16px
- Focus: Blue border, subtle shadow
- Error state: Red border
- Disabled: Gray background

**With Label:**
- Label above (12px text, gray-700)
- 4px spacing
- Optional asterisk for required

**With Icon:**
- Icon inside (left or right)
- 40px square icon area
- Proper text padding

**Dropdown/Select:**
- Same styling as text input
- Chevron down icon on right
- Dropdown menu with shadow
- Hover state on options

**Date Picker:**
- Calendar icon
- Popup calendar interface
- Month/year navigation
- Selected date highlighting

**Textarea:**
- Similar to text input
- Minimum 3 rows
- Resizable

### **Cards**

**Standard Card:**
- White background
- Border radius: 12px
- Shadow: Medium
- Padding: 24px
- Border on dark mode

**Stat Card:**
- Icon area (top-left or right)
- Large number (24-36px)
- Label (small text)
- Optional trend indicator
- Hover effect

**Client Card:**
- Header with name and badge
- Content area with details
- Footer with actions
- Consistent spacing

### **Badges**

**Status Badge:**
- Pill shape (full border radius)
- Padding: 4px 12px
- Small text (12px)
- Variants:
  - Success: Green bg, dark green text
  - Warning: Yellow bg, dark yellow text
  - Danger: Red bg, white text
  - Info: Blue bg, white text
  - Default: Gray bg, dark gray text

### **Tables**

**Table Structure:**
- Header row: Gray background, bold text
- Body rows: Alternating white/very light gray
- Borders: Subtle gray lines
- Padding: 12px 16px per cell
- Hover: Slight background change

**Features:**
- Sortable columns (arrows in header)
- Fixed header on scroll
- Action column (right-aligned)
- Pagination controls

### **Modals**

**Modal Overlay:**
- Semi-transparent black backdrop
- Modal centered
- White modal box
- Border radius: 16px
- Large shadow

**Modal Structure:**
- Header: Title, close button (X)
- Body: Form or content (scrollable)
- Footer: Action buttons (right-aligned)

**Sizes:**
- Small: 400px
- Medium: 600px
- Large: 800px

### **Navigation**

**Sidebar Menu Item:**
- Height: 48px
- Icon (24px) + Text
- Padding: 12px 16px
- Hover: Light background
- Active: Blue accent, blue icon, bold text
- Border-left indicator for active

**Tabs:**
- Horizontal tabs
- Border-bottom on active
- Blue text on active
- Gray text on inactive
- Hover effect

### **Charts & Graphs**

**Bar Chart:**
- Gridlines (light gray)
- Colored bars
- Axis labels
- Tooltips on hover
- Legend

**Line Chart:**
- Smooth lines
- Gradient fill (optional)
- Data points (circles)
- Tooltips
- Grid background

**Pie/Donut Chart:**
- Color-coded segments
- Percentage labels
- Legend with values
- Center text (for donut)

**Data Cards:**
- Number + label
- Trend arrow
- Mini sparkline (optional)

### **Icons**

**Icon Set to Include:**
- Dashboard: Layout grid
- Production: Package/Box
- Inventory: Archive/Stack
- Orders: Shopping cart
- Clients: Users/People
- Invoicing: File text/Receipt
- Reports: Bar chart
- Settings: Gear/Cog
- Plus: Add new
- Edit: Pencil
- Delete: Trash
- View: Eye
- Search: Magnifying glass
- Filter: Funnel
- Download: Arrow down
- Upload: Arrow up
- Calendar: Calendar
- Clock: Clock
- Star: Star (for ratings)
- Alert: Triangle warning
- Check: Checkmark
- Close: X
- Menu: Hamburger
- Notifications: Bell
- User: User circle
- Logout: Log out arrow

**Icon Style:**
- Line icons (not filled)
- 24px standard size
- 1.5px stroke width
- Rounded corners

---

## 📱 Responsive Considerations

**Breakpoints:**
- Desktop: 1440px+
- Laptop: 1024px - 1439px
- Tablet: 768px - 1023px
- Mobile: < 768px (simplified layout)

**Mobile Adaptations:**
- Collapsible sidebar (hamburger menu)
- Stacked cards (1 column)
- Simplified tables (card view)
- Bottom navigation bar
- Larger touch targets (48px minimum)

---

## 🎭 Visual Style Guidelines

### **Overall Aesthetic**
- **Professional**: Clean, organized, business-appropriate
- **Modern**: Current design trends, subtle animations
- **Functional**: Form follows function, minimal decoration
- **Trustworthy**: Stable, reliable appearance
- **Efficient**: Easy to scan, clear hierarchy

### **Visual Hierarchy**
- Primary actions: Most prominent (size, color, position)
- Secondary info: Subdued but accessible
- Tertiary details: Available on demand

### **Consistency**
- Consistent spacing throughout
- Aligned elements
- Predictable patterns
- Reusable components

### **Whitespace**
- Generous padding in cards
- Clear section separation
- Breathing room around elements
- Not cluttered or cramped

### **Imagery**
- Use dairy-themed illustrations where appropriate
- Icons for all actions
- Product placeholder images
- Charts and data visualizations
- Minimal decorative elements

---

## 🌗 Dark Mode Specifications

**Background Colors:**
- Page: #1F2937
- Cards: #374151
- Input fields: #4B5563

**Text Colors:**
- Primary: #F9FAFB
- Secondary: #D1D5DB
- Disabled: #6B7280

**Borders:**
- Default: #4B5563
- Focus: #60A5FA

**Maintain:**
- Same button colors (sufficient contrast)
- Same badge colors
- Chart colors
- Status indicators

**Adjust:**
- Shadows (lighter, more subtle)
- Icons (lighter stroke)
- Backgrounds (darker alternatives)

---

## ✨ Micro-interactions & Animations

**Hover States:**
- Buttons: Scale slightly, darker shade, shadow increase
- Cards: Lift (shadow), border highlight
- Table rows: Background color change
- Links: Underline, color change

**Click/Active States:**
- Button press: Slight scale down
- Form focus: Border color, subtle glow
- Active nav: Border accent, background

**Loading States:**
- Skeleton screens for content loading
- Spinner for actions (button disabled state)
- Progress bars for long operations

**Transitions:**
- Modal open/close: Fade in/out with scale
- Dropdown: Slide down with fade
- Toast notifications: Slide in from top
- Tab switching: Crossfade

**Duration:**
- Fast: 150ms (micro-interactions)
- Medium: 300ms (modals, dropdowns)
- Slow: 500ms (page transitions)

---

## 📋 Design Deliverables Checklist

Create the following in Figma:

- [ ] Complete color palette (with swatches)
- [ ] Typography styles (text styles)
- [ ] Component library (all buttons, inputs, cards, etc.)
- [ ] Icon set (24px, consistent style)
- [ ] 8 main screens (desktop view)
- [ ] Responsive layouts (tablet view for key screens)
- [ ] Modal dialogs (at least 5 different types)
- [ ] Light mode designs
- [ ] Dark mode designs (at least 2 key screens)
- [ ] Component states (hover, active, disabled)
- [ ] Empty states (no data illustrations)
- [ ] Loading states
- [ ] Error states
- [ ] Interactive prototype (click-through navigation)
- [ ] Style guide page
- [ ] Design documentation

---

## 🎯 Success Criteria

The design should:
1. **Look Professional**: Suitable for daily business use
2. **Be Functional**: Clear workflows, logical layouts
3. **Feel Modern**: Current design trends, not dated
4. **Scale Well**: Works at different screen sizes
5. **Be Consistent**: Reusable patterns throughout
6. **Guide Users**: Clear CTAs, intuitive navigation
7. **Handle Data**: Display tables, charts effectively
8. **Support Actions**: Easy CRUD operations
9. **Show Status**: Clear visual feedback
10. **Be Accessible**: Sufficient contrast, readable text

---

## 💡 Additional Notes

- Use real dairy product names where possible (Fresh Milk, Greek Yogurt, Cheddar Cheese, etc.)
- Include realistic data in tables and charts
- Client names should sound like real businesses (Restaurant La Belle, SuperMarket Plus, etc.)
- Orders should have realistic amounts and dates
- Production batches should have plausible quantities
- All text should be in English
- Currency symbol: € (Euro)
- Date format: Dec 19, 2025 (Month Day, Year)
- Time format: 24-hour (14:30)

---

## 🚀 Getting Started with This Prompt

1. Copy this entire prompt
2. Paste into Figma AI or your preferred AI design tool
3. Review the generated design
4. Iterate on specific sections as needed
5. Request variations for different themes
6. Export assets when satisfied

---

**Design Version**: 1.0  
**Last Updated**: December 19, 2025  
**Project**: Dairy Management System  
**Designer**: AI-Generated Design

---

## Example Prompt for Quick Start

**Quick version for Figma AI:**

"Design a professional dairy business management web application with the following specs:

**Color Scheme**: Primary Blue (#4A90E2), Success Green (#50C878), Warning Yellow (#FFC107), Danger Red (#DC3545)

**Pages Needed**:
1. Login page with centered form
2. Dashboard with KPI cards, charts, and task list
3. Production page with batch table and CRUD modals
4. Orders page with order tracking timeline
5. Clients page with card grid layout
6. Inventory page with stock management table
7. Reports page with analytics charts
8. Settings page

**Design Style**: Modern, clean, professional, with white cards, subtle shadows, rounded corners (8-12px), Inter font, generous spacing. Include dark mode variations.

**Components**: Tables, modals, buttons (primary/secondary/success/danger), input fields, dropdown menus, status badges, stat cards, charts (bar/line/pie), icons (line style).

Create a complete design system with all screens in desktop view (1440px width) with consistent spacing and professional business aesthetic."

---

This comprehensive prompt gives AI design tools all the context needed to create a complete, professional design for your dairy management system!
