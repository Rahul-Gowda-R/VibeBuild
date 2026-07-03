export default {
  SUGGSTIONS: [
    "Develop a Real-Time Weather App",
    "Create an E-commerce Platform",
    "Build a Social Media Dashboard",
    "Develop a Recipe Recommendation App",
    "Create a Movie Booking System",
    "Build a Personal Portfolio Website",
    "Develop a Task Automation Tool",
    "Create a Meditation and Mindfulness App",
    "Build a Travel Planner App",
    "Develop an Online Quiz Platform",
    "Create a Health & Fitness Tracker",
    "Build a Collaborative Note-Taking App"
  ],

  DEFAULT_FILE: {
    '/public/index.html': {
      code: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>`
    },
    '/App.css': {
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    '/tailwind.config.js': {
      code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
    },
    '/postcss.config.js': {
      code: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
`
    }
  },

  DEPENDANCY: {
    "@google/generative-ai": "^0.21.0",
    "@heroicons/react": "^1.0.6",
    "@headlessui/react": "^1.7.17",
    "autoprefixer": "^10.0.0",
    "firebase": "^11.1.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "latest",
    "postcss": "^8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.0.0",
    "react-router-dom": "latest",
    "react-toastify": "^10.0.0",
    "tailwind-merge": "^2.4.0",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "uuid4": "^2.0.3",
    "uuidv4": "^6.2.13",
    "uuid": "^11.1.0",
    "@mui/material": "^6.4.6"
  }
};
