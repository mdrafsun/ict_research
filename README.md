# Edusity

A modern educational platform built with React and Vite, featuring user authentication and a responsive design.

## 📋 Prerequisites

Before running this project, make sure you have the following installed on your machine:

- **Node.js** (version 18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Check version: `node --version`
- **npm** (comes with Node.js) or **yarn**
  - Check npm version: `npm --version`
  - Or install yarn: `npm install -g yarn`
- **Git** (for cloning the repository)
  - Download from [git-scm.com](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd edusity
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Start the Development Server

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

The application will start and be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## 🛠️ Built With

- **React** (v19.1.0) - Frontend library
- **Vite** (v7.0.4) - Build tool and development server
- **React Router DOM** (v7.7.0) - Client-side routing
- **React Icons** (v5.5.0) - Icon library
- **ESLint** - Code linting and formatting

## 🏗️ Project Structure

```
edusity/
├── public/           # Static assets
├── src/
│   ├── Components/   # Reusable React components
│   ├── pages/        # Page components (Login, Signup, etc.)
│   ├── assets/       # Images, fonts, and other assets
│   ├── App.jsx       # Main application component
│   ├── main.jsx      # Application entry point
│   └── index.css     # Global styles
├── package.json      # Project dependencies and scripts
├── vite.config.js    # Vite configuration
└── README.md         # This file
```

## 🌐 Running on Different Machines

### For Development:
1. Ensure all prerequisites are installed
2. Clone the repository
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. Open `http://localhost:5173` in your browser

### For Production:
1. Build the application: `npm run build`
2. The build files will be in the `dist/` directory
3. Serve the `dist/` directory using any static file server

## 🔧 Environment Setup

### Node.js Version Management
If you need to manage multiple Node.js versions, consider using:
- **nvm** (Node Version Manager) for Linux/macOS
- **nvm-windows** for Windows

### IDE Recommendations
- **Visual Studio Code** with the following extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag

## 🚨 Troubleshooting

### Common Issues:

1. **Port already in use**: If port 5173 is occupied, Vite will automatically use the next available port.

2. **Node version issues**: Make sure you're using Node.js version 18 or higher.

3. **Permission errors**: On Linux/macOS, you might need to use `sudo` for global npm installations.

4. **Cache issues**: Clear npm cache with `npm cache clean --force`

### Platform-Specific Notes:

**Windows:**
- Use Command Prompt or PowerShell
- Consider using Windows Subsystem for Linux (WSL) for better compatibility

**macOS:**
- Xcode Command Line Tools might be required: `xcode-select --install`

**Linux:**
- Some distributions might require additional packages for native dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

---

**Happy coding! 🎓**