# Frontend App

A modern Vue 3 + TypeScript frontend including chat, drawing, voice and knowledge modules.

## ✨ Features

- 🤖 **ChatGPT Conversations** - Multi-turn dialogues with intelligent responses
- 🎨 **Midjourney Drawing** - AI image generation and editing
- 🎵 **Voice Features** - Speech recognition and text-to-speech
- 📱 **Responsive Design** - Desktop and mobile support
- 🌍 **Internationalization** - Multi-language support
- 🎨 **Theme Switching** - Light and dark theme toggle

## 🛠️ Tech Stack

- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Naive UI + Element Plus
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: TailwindCSS + Less
- **Icons**: Iconify
- **PWA**: Vite PWA Plugin

## 📋 Requirements

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 (or use pnpm/yarn)

## 🚀 Quick Start

### Download Project

```bash
git clone <your_repo>
cd <your_repo_dir>
```

### Install Dependencies

```bash
npm install
```

### Run Project

```bash
npm run dev
```

The project will start at `http://localhost:1002`

### Build for Production

```bash
npm run build
```

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint

# Auto-fix code formatting
npm run lint:fix

# Documentation development
npm run docs:dev

# Build documentation
npm run docs:build
```

## 🔧 Configuration

The project uses environment variables for configuration. Create a `.env` file as needed:

```env
# API base URL
VITE_APP_API_BASE_URL=your_api_url

# Enable PWA
VITE_GLOB_APP_PWA=true
```

## 📁 Project Structure

```
app-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # Request wrappers
│   ├── assets/            # Asset files
│   ├── components/        # Common components
│   ├── hooks/             # Composition functions
│   ├── locales/           # Internationalization
│   ├── router/            # Router configuration
│   ├── store/             # State management
│   ├── styles/            # Style files
│   ├── utils/             # Utility functions
│   ├── views/             # Page components
│   └── main.ts            # Entry file
├── docs/                  # Screenshots
└── package.json
```

## 🤝 Contributing

Issues and Pull Requests are welcome to improve the project.

## 📄 License

This project is open source under the MIT License.

<!-- Author info removed -->
