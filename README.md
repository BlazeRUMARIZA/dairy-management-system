# Dairy Management System

A comprehensive, modern full-stack web application for managing dairy business operations including production tracking, inventory management, order processing, client relations, invoicing, and analytics.

![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.6-cyan) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Express](https://img.shields.io/badge/Express-4.18-lightgrey) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## 📦 Project Structure

This project consists of two main parts:

- **Frontend** - React + TypeScript + Vite + Tailwind CSS (in root directory)
- **Backend** - Node.js + Express + MySQL + Sequelize + TypeScript (in `backend/` directory)

Both are fully integrated and production-ready!

## 🚀 Quick Start

### **[📘 Guide de Démarrage Rapide (Français)](DEMARRAGE_RAPIDE.md)**
Pour démarrer rapidement avec XAMPP, suivez le guide complet en français!

### Prérequis
- Node.js 18+
- XAMPP (pour MySQL)
- npm ou yarn

### Installation Rapide
```bash
# 1. Installer les dépendances backend
cd backend
npm install

# 2. Démarrer XAMPP MySQL (via Control Panel)

# 3. Créer la base de données via phpMyAdmin
# http://localhost/phpmyadmin → Créer base "dairy_management"

# 4. Configurer l'environnement
cp .env.example .env

# 5. Initialiser la base de données
npm run db:init
npm run db:seed

# 6. Démarrer le backend
npm run dev

# 7. Dans un nouveau terminal, démarrer le frontend
cd ..
npm install
npm run dev
```

🎉 **Application disponible sur http://localhost:5173**  
🔑 **Connexion:** admin@dairy.com / password123

---

## 🌟 Features

### 🔐 Authentication & Security
- Secure login system
- Password recovery (3-step process)
- Employee account management
- Role-based access control

### 📊 Dashboard
- Real-time production metrics
- Pending orders overview
- Critical stock alerts
- Monthly revenue tracking
- Interactive charts and visualizations
- Today's tasks management
- Weekly production trends
- Top 5 clients analytics

### 🥛 Production Module
- Real-time production line monitoring
- Batch entry and tracking
- Quality control management
- Recipe formulation system
- Production yield tracking
- Operator assignment

### 📦 Stock & Inventory
- Global stock overview
- Product detail tracking
- Expiration date management
- Multi-location storage tracking
- Low stock alerts
- Physical inventory interface
- Barcode/QR code support

### 🚚 Orders & Deliveries
- Order calendar view
- Multi-step order creation
- Delivery tracking
- Driver/courier management
- Route optimization
- Electronic signature capture
- Real-time status updates

### 👥 Client Management
- Client directory
- Detailed client profiles
- Order history tracking
- Payment management
- Client segmentation
- Loyalty program
- Satisfaction ratings

### 💰 Invoicing & Finance
- Professional invoice generation
- Automated payment reminders
- Cash flow monitoring
- Accounts receivable tracking
- Financial dashboards
- Multi-format exports (PDF, Excel, CSV)

### 📈 Reports & Analytics
- Commercial performance metrics
- Production efficiency reports
- Logistics performance tracking
- Customizable date ranges
- Exportable reports
- Visual data representations

### ⚙️ Administration
- User management
- Product configuration
- System settings
- Permission management
- Email template configuration
- Delivery zone setup

## 🎨 Design System

### Themes
- **Light Theme** (Primary) - Clean and professional
- **Dark Theme** - Easy on the eyes
- **Fresh Theme** - Blue/green tones for a dairy-fresh feel

### Color Palette
```css
Primary (Dairy Blue): #4A90E2
Fresh Green: #50C878
Cream White: #F8F8F8
Success: #28A745
Warning: #FFC107
Danger: #DC3545
Info: #17A2B8
```

### Typography
- Font Family: Inter
- Headings: 16-24px, 600 weight
- Body: 14-16px, 400 weight

### Components
- Cards with hover effects
- Responsive tables
- Form inputs with validation states
- Modals (3 sizes)
- Badges and status indicators
- Loading skeletons
- Empty states

## 🚀 Tech Stack

- **Frontend Framework:** React 18.2.0
- **Language:** TypeScript 5.3.3
- **Build Tool:** Vite 4.5.0
- **Styling:** Tailwind CSS 3.3.6
- **Routing:** React Router DOM 6.20.0
- **Charts:** Recharts 2.10.3
- **Icons:** Lucide React 0.294.0
- **Date Utilities:** date-fns 2.30.0

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## 🛠️ Installation

1. Clone the repository:
```bash
cd dairy-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 📱 Responsive Design

- **Desktop:** Optimized for screens > 1024px
- **Tablet:** Responsive layout for 768px - 1024px
- **Mobile:** Simplified version for < 768px (future enhancement)

## 🔑 Demo Credentials

For demonstration purposes, you can log in with any email/password combination.

**Example:**
- Email: admin@dairy.com
- Password: any password

## 📂 Project Structure

```
dairy-management-system/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Layout/
│   │   └── UI/
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Production/
│   │   ├── Inventory/
│   │   ├── Orders/
│   │   ├── Clients/
│   │   ├── Invoicing/
│   │   ├── Reports/
│   │   └── Settings/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎯 Key Features Implementation

### Dairy-Specific Capabilities
- ✅ **Traceability:** Complete batch tracking from production to delivery
- ✅ **Expiration Management:** Proactive alerts for products nearing expiration
- ✅ **Temperature Tracking:** Monitor storage and transport conditions
- ✅ **Regulatory Compliance:** HACCP and traceability standards

### Production Features
- Multi-line production monitoring
- Real-time capacity tracking
- Yield percentage calculation
- Quality control checkpoints
- Batch number generation

### Inventory Features
- Multi-location management
- Automatic reorder alerts
- FIFO/FEFO rotation tracking
- Barcode scanning support

### Order Processing
- Drag-and-drop calendar
- Available stock validation
- Automatic pricing
- Delivery route optimization
- Electronic proof of delivery

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - feel free to use this project for your dairy business!

## 🆘 Support

For issues and questions, please check the in-app Support section or refer to the documentation.

## 🔄 Future Enhancements

- Mobile app version
- Real-time notifications
- Advanced analytics with AI
- Integration with accounting software
- Multi-language support
- API for third-party integrations
- Progressive Web App (PWA) capabilities

---

**Built with ❤️ for modern dairy businesses**
