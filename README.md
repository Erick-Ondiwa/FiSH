# FiSH — Farmers Intelligent Support Hub

FiSH (Farmers Intelligent Support Hub) is an AI-powered aquaculture advisory platform designed to help fish farmers optimize feeding, monitor fish growth, detect diseases early, and improve overall farm productivity through intelligent digital solutions.

The platform combines machine learning, real-time farm analytics, and modern web technologies to support sustainable aquaculture practices aligned with SDG 14 — Life Below Water.

---

# Features

## Smart Feeding Management
- Intelligent feeding schedules
- Automated feeding session tracking
- Feeding history analytics
- Missed feeding detection
- Feed recommendation system

## Growth Monitoring
- Fish growth tracking
- Pond performance analytics
- Weight and growth trend monitoring
- Progress visualization

## Disease Detection
- AI-assisted disease prediction
- Symptom-based disease analysis
- Disease history timeline
- Recommended treatment actions
- Severity classification

## Notifications System
- Real-time feeding alerts
- Missed session notifications
- Advisory updates
- System alerts

## Farm Management
- Pond registration and management
- Water condition monitoring
- Farm data organization

## Authentication & Security
- JWT Authentication
- Role-based access
- Secure API endpoints
- Token refresh and blacklist support

---

# Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React

## Backend
- Django
- Django REST Framework
- Django Channels
- Daphne ASGI Server
- Simple JWT Authentication

## Database
- PostgreSQL (Supabase)

## Deployment
- Frontend → Vercel
- Backend → Render
- Database → Supabase

## Machine Learning
- Scikit-learn
- Pandas
- NumPy

---

# Project Architecture

```plaintext
FiSH/
│
├── frontend/                 # React Frontend
│
├── backend/                  # Django Backend
│   ├── accounts/
│   ├── feeding/
│   ├── farm/
│   ├── notifications/
│   ├── advisory/
│   ├── ML/
│   └── config/
│
└── README.md