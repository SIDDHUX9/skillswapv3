# 🎓 SkillSwap - Community Skill Sharing Platform

A modern, feature-rich platform for community members to share, learn, and collaborate through skill exchange. Built with Next.js 15, TypeScript, and cutting-edge web technologies.

## 🚀 Quick Start (Backend Setup First!)

### Prerequisites
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control
- **Modern web browser** - Chrome, Firefox, Safari, or Edge

### Step 1: Clone & Install
```bash
git clone https://github.com/your-username/skillswap.git
cd skillswap
npm install
```

### Step 2: Backend Database Setup
```bash
# Generate Prisma client (REQUIRED)
npx prisma generate

# Initialize database (REQUIRED)
npm run db:push

# (Optional) Seed demo data for testing
npm run db:seed
```

### Step 3: Environment Variables
```bash
# Create environment file
cp .env.example .env.local

# Edit with your configuration
nano .env.local
```

**Add these required variables to `.env.local`:**
```env
# Database (REQUIRED)
DATABASE_URL="file:./dev.db"

# Authentication (REQUIRED)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Application (REQUIRED)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Access Application
```
http://localhost:3000
```

---

## ✅ Feature Implementation Checklist

| Feature | Status | Implementation Details |
|---------|--------|----------------------|
| 🔐 **User Authentication & Verification** | ✅ **Complete** | Secure JWT auth, signup/login, ID verification badges |
| 🌍 **Geo-Location Matching** | ✅ **Complete** | Interactive maps, radius search, location filters |
| 📅 **Booking & Scheduling** | ✅ **Complete** | Calendar integration, time slots, conflict detection |
| ⭐ **Reputation System** | ✅ **Complete** | Ratings, testimonials, skill endorsements, karma |
| 🤝 **Community Projects** | ✅ **Complete** | Project creation, volunteer management, collaboration |
| 💰 **Incentive Mechanism** | ✅ **Complete** | Credit system, wallet, transactions, donations |
| ♿ **Accessibility & Inclusivity** | ✅ **Complete** | Keyboard navigation, high-contrast modes, voice commands |

---

## 🔐 1. User Authentication & Verification

### ✅ **Fully Implemented Features:**

#### **Secure Authentication System**
- **JWT-based Authentication**: Secure token-based authentication with automatic refresh
- **Password Security**: bcryptjs hashing for secure password storage
- **Session Management**: Persistent login with localStorage integration
- **User Registration**: Complete signup flow with email validation
- **Login System**: Secure login with error handling and rate limiting

#### **Identity Verification**
- **ID Verification System**: Optional identity verification with document upload
- **Verified Badges**: Visual indicators for verified users and instructors
- **Profile Completion**: Multi-step profile setup with verification status
- **Trust Indicators**: Verification status displayed throughout the platform

#### **Skill Validation & Reviews**
- **Peer Review System**: Users can review and rate skills they've learned
- **Digital Badges**: Achievement badges for completed skills and milestones
- **Skill Endorsements**: Users can endorse specific skills of others
- **Quality Assurance**: Flagging system for inappropriate content

**Files**: `src/app/api/auth/`, `src/components/auth/`, `src/stores/auth.ts`

---

## 🌍 2. Geo-Location Matching

### ✅ **Fully Implemented Features:**

#### **Location-Based Discovery**
- **Interactive Maps**: Real-time map visualization using Leaflet and React-Leaflet
- **Geocoding Integration**: Address to coordinates conversion with autocomplete
- **Location Services**: Browser-based location detection with user permission
- **Skill Mapping**: Visual representation of available skills on map

#### **Advanced Search & Filtering**
- **Radius Search**: Customizable search radius (1-50 miles/km)
- **Location Filters**: Filter skills by distance, city, or region
- **Category Filtering**: Multi-category filtering with location context
- **Availability Filters**: Search for skills available in specific timeframes

#### **Smart Matching**
- **Proximity Algorithm**: Intelligent matching based on location and preferences
- **Distance Calculation**: Accurate distance calculations between users
- **Location-Based Recommendations**: Personalized skill suggestions based on location

**Files**: `src/app/api/geocoding/`, `src/components/location/`, `src/components/interactive-map.tsx`

---

## 📅 3. Booking & Scheduling

### ✅ **Fully Implemented Features:**

#### **Smart Calendar System**
- **Built-in Calendar**: Interactive calendar with date/time selection
- **Time Slot Management**: Configurable available time slots (9 AM - 8 PM)
- **Recurring Sessions**: Support for recurring bookings and sessions
- **Calendar Integration**: Sync with external calendars (Google Calendar, Outlook)

#### **Automated Scheduling**
- **Conflict Detection**: Prevents double-booking and scheduling conflicts
- **Availability Management**: Instructor availability tracking and management
- **Time Zone Support**: Automatic time zone detection and conversion
- **Buffer Times**: Configurable buffer times between sessions

#### **Booking Management**
- **Instant Booking**: Real-time booking confirmation with details
- **Booking History**: Complete booking history for users and instructors
- **Cancellation System**: Flexible cancellation with refund policies
- **Rescheduling**: Easy rescheduling with automatic notifications

#### **Reminders & Notifications**
- **Automated Reminders**: Email and in-app reminders for upcoming sessions
- **Session Notifications**: Real-time notifications for booking changes
- **Follow-up Messages**: Automated follow-up after session completion

**Files**: `src/app/api/bookings/`, `src/app/bookings/[id]/page.tsx`, `src/components/ui/calendar.tsx`

---

## ⭐ 4. Reputation System

### ✅ **Fully Implemented Features:**

#### **Rating & Review System**
- **5-Star Rating**: Comprehensive rating system for skills and users
- **Written Reviews**: Detailed review system with text feedback
- **Review Moderation**: Automated and manual review moderation
- **Rating Analytics**: Detailed rating statistics and trends

#### **Testimonials & Endorsements**
- **Testimonial System**: Written testimonials for successful skill exchanges
- **Skill Endorsements**: Peer endorsements for specific skills and expertise
- **Endorsement Badges**: Visual badges for endorsed skills
- **Testimonial Display**: Featured testimonials on user profiles

#### **Reputation Levels**
- **Progressive Tiers**: Reputation levels from Beginner to Master
- **Karma System**: Karma points earned through positive interactions
- **Trust Score**: Algorithmic trust score based on various factors
- **Reputation Badges**: Visual indicators of reputation level

#### **Quality Assurance**
- **Flagging System**: Users can flag inappropriate content or behavior
- **Dispute Resolution**: Built-in dispute resolution system
- **Quality Metrics**: Quality scores based on completion rates and reviews

**Files**: `src/app/api/reviews/`, `src/components/reviews/`, `src/components/reputation/`

---

## 🤝 5. Community Projects

### ✅ **Fully Implemented Features:**

#### **Project Creation & Management**
- **Project Proposals**: Users can propose community projects and initiatives
- **Project Categories**: Various project types (community garden, coding, workshops)
- **Project Templates**: Pre-defined templates for common project types
- **Project Lifecycle**: Complete project lifecycle from proposal to completion

#### **Volunteer System**
- **Volunteer Recruitment**: Join and manage project volunteers
- **Role Assignment**: Different roles and permissions within projects
- **Volunteer Tracking**: Track volunteer hours and contributions
- **Volunteer Recognition**: Recognition system for active volunteers

#### **Collaboration Tools**
- **Project Chat**: Dedicated chat rooms for project collaboration
- **Task Management**: Built-in task assignment and tracking
- **File Sharing**: Share documents and resources within projects
- **Progress Tracking**: Monitor project milestones and completion status

#### **Community Impact**
- **Impact Metrics**: Track community contribution statistics
- **Success Stories**: Showcase successful community projects
- **Community Reports**: Generate reports on community impact
- **Project Gallery**: Visual gallery of completed projects

**Files**: `src/app/api/projects/`, `src/app/community/page.tsx`

---

## 💰 6. Incentive Mechanism

### ✅ **Fully Implemented Features:**

#### **Credit System**
- **Token Economy**: Complete credit-based economy for skill exchange
- **Credit Earning**: Multiple ways to earn credits (teaching, helping, projects)
- **Credit Spending**: Use credits to book sessions and services
- **Credit Conversion**: Flexible credit conversion rates for different services

#### **Wallet Management**
- **Digital Wallet**: Complete wallet system with transaction history
- **Balance Tracking**: Real-time balance updates and notifications
- **Transaction History**: Detailed transaction logging and categorization
- **Financial Reports**: Generate spending and earning reports

#### **Donation System**
- **Community Donations**: Donate credits to community causes and projects
- **Charity Integration**: Integration with local charities and non-profits
- **Donation Tracking**: Track donation impact and community benefits
- **Tax Benefits**: Generate donation receipts for tax purposes

#### **Incentive Programs**
- **Referral System**: Earn credits by referring new users
- **Bonus Credits**: Bonus credits for active participation
- **Seasonal Promotions**: Special credit promotions and events
- **Loyalty Rewards**: Rewards for long-term active users

**Files**: `src/app/api/credits/`, `src/components/wallet/`, `src/app/api/bookings/route.ts`

---

## ♿ 7. Accessibility & Inclusivity

### ✅ **Fully Implemented Features:**

#### **Keyboard Navigation**
- **Full Keyboard Support**: Complete keyboard navigation throughout the platform
- **Keyboard Shortcuts**: Customizable keyboard shortcuts for power users
- **Focus Management**: Proper focus management for screen readers
- **Skip Links**: Skip links for easy navigation to main content

#### **Visual Accessibility**
- **High Contrast Modes**: Multiple high contrast themes for better visibility
- **Text Scaling**: Adjustable text sizes without breaking layout
- **Color Blind Support**: Color-blind friendly design and color schemes
- **Dark/Light Mode**: Complete dark and light theme support

#### **Voice Navigation & Screen Readers**
- **Voice Commands**: Voice navigation support for hands-free operation
- **Screen Reader Support**: Full support for popular screen readers
- **ARIA Labels**: Comprehensive ARIA labels and descriptions
- **Alt Text**: Descriptive alt text for all images and graphics

#### **Language & Localization**
- **Multi-language Support**: Support for multiple languages
- **Language Detection**: Automatic language detection and switching
- **RTL Support**: Right-to-left language support
- **Cultural Adaptation**: Culturally appropriate design and content

#### **Inclusive Design**
- **Cognitive Accessibility**: Simple, clear interface for users with cognitive disabilities
- **Motor Accessibility**: Large click targets and simple interactions
- **Seizure Safety**: No flashing or strobing content
- **Accessibility Testing**: Regular accessibility audits and improvements

**Files**: `src/components/accessibility/`, `src/app/globals.css`, `src/components/ui/` (all components include accessibility features)

---

## 🗄️ Backend & Database Setup

### Database Schema Overview

#### **Core Models**

**User Model**
```typescript
- id: string (Primary Key)
- email: string (Unique)
- password: string (Hashed)
- name: string (Optional)
- avatar: string (Profile picture)
- credits: number (Credit balance)
- karma: number (Reputation points)
- isIdVerified: boolean (Verification status)
- location: string (User location)
- lat/lng: float (Coordinates)
- bio: string (User biography)
- createdAt/updatedAt: DateTime
```

**Skill Model**
```typescript
- id: string (Primary Key)
- ownerId: string (Foreign Key to User)
- title: string (Skill name)
- description: string (Skill description)
- category: SkillCategory (Skill type)
- priceCredits: number (Cost in credits)
- lat/lng: float (Location coordinates)
- avgRating: float (Average rating)
- isActive: boolean (Availability status)
- createdAt/updatedAt: DateTime
```

**Booking Model**
```typescript
- id: string (Primary Key)
- skillId: string (Foreign Key to Skill)
- learnerId: string (Foreign Key to User)
- startTime/endTime: DateTime (Session times)
- status: BookingStatus (Booking state)
- createdAt/updatedAt: DateTime
```

**Review Model**
```typescript
- id: string (Primary Key)
- skillId: string (Foreign Key to Skill)
- reviewerId: string (Foreign Key to User)
- bookingId: string (Foreign Key to Booking)
- stars: number (Rating 1-5)
- comment: string (Review text)
- isFlagged: boolean (Content moderation)
- createdAt: DateTime
```

**CommunityProject Model**
```typescript
- id: string (Primary Key)
- creatorId: string (Foreign Key to User)
- title: string (Project name)
- description: string (Project details)
- maxVolunteers: number (Volunteer limit)
- currentVolunteers: number (Current count)
- isActive: boolean (Project status)
- createdAt/updatedAt: DateTime
```

**CreditTxn Model**
```typescript
- id: string (Primary Key)
- userId: string (Foreign Key to User)
- amount: number (Credit amount)
- type: CreditType (EARNED/SPENT/DONATED)
- refId: string (Reference ID)
- message: string (Transaction description)
- createdAt: DateTime
```

### API Endpoints

#### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user

#### **Skills**
- `GET /api/skills` - Get all skills with filtering
- `GET /api/skills/[id]` - Get specific skill
- `POST /api/skills` - Create new skill
- `PUT /api/skills/[id]` - Update skill
- `DELETE /api/skills/[id]` - Delete skill
- `GET /api/skills/nearby` - Get nearby skills

#### **Bookings**
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings` - Update booking status

#### **Reviews**
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/[id]` - Update review

#### **Community Projects**
- `GET /api/projects` - Get projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project

#### **Credits**
- `GET /api/credits` - Get user credits
- `POST /api/credits` - Add credits
- `GET /api/credits/transactions` - Get transaction history

#### **Chat**
- `GET /api/chat/rooms` - Get chat rooms
- `POST /api/chat/rooms` - Create chat room
- `GET /api/chat/rooms/[id]/messages` - Get messages
- `POST /api/chat/rooms/[id]/messages` - Send message

#### **Location**
- `GET /api/geocoding/search` - Geocoding search

---

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database Operations
npm run db:push          # Push schema to database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:reset         # Reset database
npm run db:seed          # Seed demo data

# Utilities
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
```

---

## 🏗️ Project Structure

```
skillswap/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes (Backend)
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── bookings/      # Booking management
│   │   │   ├── skills/        # Skill CRUD operations
│   │   │   ├── projects/      # Community projects
│   │   │   ├── chat/          # Real-time chat
│   │   │   ├── reviews/       # Rating system
│   │   │   ├── credits/       # Credit system
│   │   │   └── geocoding/     # Location services
│   │   ├── bookings/          # Booking pages
│   │   ├── skills/            # Skill pages
│   │   ├── community/         # Community projects
│   │   ├── dashboard/         # User dashboard
│   │   ├── profile/           # User profile
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   ├── chat/             # Chat components
│   │   ├── location/         # Location-based features
│   │   ├── reputation/       # Reputation system
│   │   ├── wallet/           # Credit system
│   │   ├── reviews/          # Review components
│   │   ├── accessibility/    # Accessibility features
│   │   └── 3d/               # 3D animations
│   ├── lib/                  # Utility libraries
│   │   ├── db.ts            # Database client
│   │   ├── utils.ts         # Helper functions
│   │   ├── prisma.ts        # Prisma configuration
│   │   └── socket.ts        # WebSocket configuration
│   ├── stores/              # State management
│   │   └── auth.ts          # Authentication store
│   └── styles/              # Global styles
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts             # Database seeding
├── public/                 # Static assets
├── docs/                   # Documentation
└── README.md              # This file
```

---

## 🔧 Technology Stack

### Frontend Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics and animations
- **React Hook Form** - Form management
- **Zustand** - State management
- **React Leaflet** - Interactive maps
- **React Query** - Server state management

### Backend Technologies
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database management
- **SQLite** - Database (development & production)
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Zod** - Schema validation
- **JWT** - Authentication tokens

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static typing
- **Prisma Studio** - Database GUI
- **Nodemon** - Development auto-restart
- **Prettier** - Code formatting

---

## 🚀 Deployment Options

### Development Deployment
```bash
# Local development
npm run dev

# Production build
npm run build
npm run start
```

### Production Deployment (Alternatives to Vercel)

#### **Docker Deployment**
```bash
# Build Docker image
docker build -t skillswap .

# Run container
docker run -p 3000:3000 skillswap
```

#### **Traditional VPS Deployment**
```bash
# Build application
npm run build

# Start with PM2
pm2 start npm --name "skillswap" -- start
```

#### **Cloud Platform Deployment**
- **AWS EC2**: Deploy on Amazon Web Services
- **DigitalOcean**: Deploy on DigitalOcean droplets
- **Heroku**: Deploy on Heroku platform
- **Railway**: Modern deployment platform

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🎉 Thank you for checking out SkillSwap! Together, we're building a more connected and skilled community.**

---

*Last updated: December 2024*