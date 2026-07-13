# SmartBiz OS 🚀

Welcome to **SmartBiz OS**, a premium, futuristic 3D business operating system designed to redefine enterprise software. We've abandoned flat, traditional dashboards in favor of an immersive, interactive, and spatial digital command center.

## 🌌 Core Philosophy
SmartBiz OS feels like a modern operating system rather than a standard web app. It utilizes responsive 3D workspaces, multi-layered floating panels, and dynamic background geometry. Every module feels like an application inside a high-tech enterprise cockpit.

## 🛠️ Technology Stack

Our stack is built on the bleeding edge of modern web development:

### **Frontend & Rendering**
- **Next.js 15 (App Router)**: For robust Server Components, Server Actions, and lightning-fast API Routes.
- **React 19**: Utilizing the latest hooks and concurrent rendering features.
- **Three.js & React Three Fiber (R3F)**: Powering the interactive 3D backgrounds, floating geometry, and spatial interfaces.
- **React Postprocessing**: Delivering cinematic visual effects like Bloom, Vignette, and Chromatic Aberration.
- **Framer Motion**: Driving liquid-smooth micro-animations, draggable OS windows, and layout transitions.
- **Tailwind CSS**: For utility-first, rapid, and precise styling.

### **Backend & Database**
- **Supabase**: Our backend-as-a-service providing a highly scalable PostgreSQL database.
- **Supabase Auth (SSR)**: Secure server-side authentication, session management, and Row Level Security (RLS).
- **Vercel**: Optimized for seamless, edge-ready deployments.

### **Artificial Intelligence**
- **Vercel AI SDK**: For seamless, streaming conversational interfaces.
- **OpenAI (`gpt-4o-mini`)**: Powering the intelligent core of the operating system.

---

## 💻 Systems & Features

### 1. Futuristic 3D Landing Page
A high-end entry point featuring floating geometry, glowing particles, dramatic lighting, and drop-shadow enhanced typography for maximum readability against a pulsing volumetric orb.

### 2. Interactive 3D Workspace (OS)
The entire application runs inside a digital environment. 
- **Draggable Windows**: Every business module opens in a modular, draggable, and interactive glassmorphic window. 
- **Depth & Perspective**: UI elements exist on multiple visual layers, creating true depth.

### 3. Central Command Dock
A macOS-style floating dock that provides quick, animated navigation to all system applications (Overview, Organization, Inventory, Billing, and the AI Core).

### 4. Real-Time Customer Module
A fully functional Customer Relationship Management (CRM) module. 
- Built with **Supabase Server Actions** for real-time CRUD (Create, Read, Update, Delete) operations.
- Data flows instantly from the server to the 3D client components.

### 5. JARVIS-like AI Command Center
The crown jewel of SmartBiz OS. A fully integrated AI assistant that doesn't just chat—it *thinks* and *acts*.
- **Volumetric AI Brain**: A pulsing 3D core that visually reacts when the AI is processing data.
- **Live Database Tools**: The AI is equipped with native tools to read your Supabase database in real time. You can ask it natural language questions like:
  - *"Do we have any low stock items?"* (Queries `Products` table)
  - *"What is our total outstanding invoice amount?"* (Queries `Invoices` table)
  - *"Give me customer metrics."* (Queries `Customers` table for LTV and active status)

### 6. Secure Authentication Flow
A custom authentication flow fully integrated with Supabase SSR, ensuring that all data is protected via strict Row Level Security (RLS) policies. Only authenticated users can access their personalized 3D workspace.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Supabase Account & Project
- OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/smart_biz.git
   cd smart_biz
   ```

2. **Install dependencies:**
   *(Note: SmartBiz OS utilizes `--legacy-peer-deps` for Vercel AI SDK compatibility with React 19)*
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Explore the OS:**
   Open [http://localhost:3000](http://localhost:3000) in your browser and enter the digital command center.
