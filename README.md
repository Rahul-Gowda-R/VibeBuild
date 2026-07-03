## 🚀 SiteSculptor

**Build Stunning Websites with AI Assistance**
Transform your ideas into fully functional websites using cutting-edge AI technology. This project leverages **Next.js, Tailwind CSS, and OpenAI GPT** to streamline web development.

---

## 🌟 Features

### 🤖 AI-Powered Assistance

* **Content Generation**: Automatically generate SEO-friendly text, images, and code snippets using AI.
* **Code Synthesis**: Convert natural language prompts into React components with real-time previews.
* **Smart Recommendations**: Get AI-driven suggestions for layout improvements and design enhancements.

### 🎨 Design & Collaboration

* **Theme Customization**: Switch between light/dark modes and customize themes effortlessly.
* **Real-Time Collaboration**: Multiple users can edit simultaneously using [Convex](https://convex.dev) backend.
* **Export Options**: Download generated code as ZIP files for seamless integration into other projects.

### ⚡ Modern Tech Stack

* **Next.js 14**: Server-side rendering, API routes, and optimized performance.
* **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
* **AI Integration**: Powered by OpenAI GPT for intelligent content generation.

---

## 🛠️ Getting Started

### Prerequisites

* Node.js v18+
* npm, yarn, or pnpm
* OpenAI API key (for AI features)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sagarbj3245/SiteSculptor.git
   cd SiteSculptor
   ```

2. Install Dependencies

   ```bash
   npm install  # or yarn/pnpm
   ```

3. Set Up Environment Variables
   Create a `.env.local` file in the root directory and add the following:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```

4. Start the Development Server

   ```bash
   npm run dev
   ```

5. Visit the Application
   Open your browser and go to:

   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```bash
.
├── app/           # Next.js page routes and layouts
├── components/    # Reusable React components (Header, AI Chat, etc.)
├── config/        # AI model configurations and API settings
├── context/       # React context providers (Theme, User, AI State)
├── convex/        # Convex backend functions and database schema
├── data/          # Static data and prompt templates
├── lib/           # Utilities (API clients, theme handlers)
├── public/        # Static assets (images, fonts)
├── styles/        # Global CSS and Tailwind configurations
```

---

## 🔧 Tech Stack

| Technology         | Purpose                      |
| ------------------ | ---------------------------- |
| **Next.js**        | Framework for SSR & Routing  |
| **Tailwind CSS**   | Styling & Responsive Design  |
| **Convex**         | Real-time Database & Backend |
| **OpenAI API**     | AI Content Generation        |
| **React Markdown** | Render AI-generated Markdown |

---

## 📚 Documentation

* **[Next.js: Official Guide](https://nextjs.org/docs)**
* **[Tailwind CSS: Documentation](https://tailwindcss.com/docs)**
* **[Convex Setup: Getting Started](https://docs.convex.dev/quickstart)**
* **[OpenAI API: API Reference](https://platform.openai.com/docs)**

---

## 🚀 Deployment

Deploy to Vercel in one click:

[![Deploy](https://vercel.com/button)](https://vercel.com/new)

### Required Environment Variables:

* `OPENAI_API_KEY`
* `NEXT_PUBLIC_CONVEX_URL`

---

## 🙌 Acknowledgements

* **OpenAI GPT** for advanced language models
* **Vercel** for hosting support
* **Convex** for real-time backend infrastructure

---
