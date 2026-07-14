# SmartBiz OS 🚀

Welcome to **SmartBiz OS**, a premium, futuristic 3D business operating system designed to redefine enterprise software for Indian MSMEs. We've abandoned flat, traditional dashboards in favor of an immersive, interactive, and spatial digital command center.

## 🌌 Core Philosophy
SmartBiz OS feels like a modern operating system rather than a standard web app. It utilizes responsive 3D workspaces, multi-layered floating panels, and dynamic background geometry. Every module feels like an application inside a high-tech enterprise cockpit.

## 🛠️ Technology Stack

Our stack is built on the bleeding edge of modern web development:

### **Frontend & Rendering**
- **Next.js 15 (App Router)**: For robust Server Components, Server Actions, and lightning-fast API Routes.
- **React 19**: Utilizing the latest hooks and concurrent rendering features.
- **Three.js & React Three Fiber (R3F)**: Powering the interactive 3D backgrounds, floating geometry, and spatial interfaces.
- **React Postprocessing**: Delivering cinematic visual effects like Bloom, Vignette, and Chromatic Aberration.
- **Framer Motion 12**: Driving liquid-smooth micro-animations, draggable OS windows, and layout transitions.
- **Tailwind CSS v4**: For utility-first, rapid, and precise styling.

### **Backend & Database**
- **Supabase**: Our backend-as-a-service providing a highly scalable PostgreSQL 15 database.
- **Supabase Auth (SSR)**: Secure server-side authentication, session management, and Row Level Security (RLS).
- **Direct SQL Migrations**: We manage our schema securely without heavy ORMs.

### **Artificial Intelligence & OCR**
- **Vercel AI SDK (`ai@7`)**: For seamless, streaming conversational interfaces.
- **OpenAI (`gpt-4o-mini`)**: Powering the intelligent core of the operating system and structured data extraction.
- **OCR.space API**: Extracting text from uploaded invoice PDFs and images.

---

## 💻 Systems & Features

### 1. Futuristic 3D Landing Page
A high-end entry point featuring floating geometry, glowing particles, dramatic lighting, and drop-shadow enhanced typography for maximum readability against a pulsing volumetric orb.

### 2. Interactive 3D Workspace (OS)
The entire application runs inside a digital environment. 
- **Draggable Windows**: Every business module opens in a modular, draggable, and interactive glassmorphic window. 
- **Depth & Perspective**: UI elements exist on multiple visual layers, creating true depth.

### 3. Comprehensive Modules
A macOS-style floating dock that provides quick, animated navigation to all system applications:
- **Customers (CRM)**: Track client relationships and LTV.
- **Inventory & Warehousing**: Manage products, stock levels, suppliers, and multi-warehouse locations.
- **Invoicing & Billing**: Generate invoices, track payments, and calculate taxes.
- **Employees**: Manage staff roles and departments.

### 4. OCR Invoice Processing
Upload images or PDFs of supplier invoices, and SmartBiz OS automatically extracts line items, quantities, and pricing using OCR and AI, preparing them for one-click inventory integration.

### 5. JARVIS-like AI Command Center
The crown jewel of SmartBiz OS. A fully integrated AI assistant that doesn't just chat—it *thinks* and *acts*.
- **Volumetric AI Brain**: A pulsing 3D core that visually reacts when the AI is processing data.
- **Live Database Tools**: The AI is equipped with native tools to read your Supabase database in real time. You can ask it natural language questions like:
  - *"Do we have any low stock items?"* (Queries `products` table)
  - *"What is our total outstanding invoice amount?"* (Queries `invoices` table)
  - *"Give me customer metrics."* (Queries `customers` table)

### 6. Ironclad Security Architecture
- **Default-Deny Middleware**: All routes are protected by default. Unauthenticated users are strictly blocked.
- **Row Level Security (RLS)**: Every single table enforces strict access policies. A user can only read, write, or modify data containing their specific `user_id`.
- **API Rate Limiting**: AI and OCR endpoints are protected by in-memory rate limiting to prevent abuse.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- Supabase Account & Project (Free tier works)
- OpenAI API Key
- OCR.space API Key (Free tier works)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Joyceson71/smart_biz.git
   cd smart_biz
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy `.env.example` to `.env.local` and populate:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   OCRSPACE_API_KEY=your_ocrspace_api_key
   ```

4. **Database Setup:**
   Run the SQL migrations located in the `supabase/migrations/` folder in order using the Supabase SQL Editor. See `supabase/MIGRATIONS.md` for our strict migration guidelines.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

6. **Run Tests (Optional):**
   ```bash
   npm test             # Unit tests
   npm run test:e2e     # E2E tests (Playwright)
   ```

7. **Explore the OS:**
   Open [http://localhost:3000](http://localhost:3000) in your browser and enter the digital command center.

## 📖 Documentation
- [Architecture & Design](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
