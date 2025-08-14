# SMS Frontend

A modern React-based frontend application for Student Management System built with TypeScript, Tailwind CSS, and Redux Toolkit.

## Features

- 🎨 **Modern UI/UX** - Built with Tailwind CSS for beautiful, responsive design
- 🔐 **Authentication System** - Complete login/logout functionality with JWT tokens
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🚀 **Fast Development** - Vite for lightning-fast development and building
- 🎯 **Type Safety** - Full TypeScript support for better development experience
- 🗃️ **State Management** - Redux Toolkit for efficient state management
- 🔄 **Routing** - React Router for seamless navigation
- 📝 **Form Handling** - Built-in form validation and error handling
- 🔔 **Notifications** - Toast notifications for user feedback

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Form Validation**: Yup
- **Utilities**: clsx, js-cookie

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SMS-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/                 # API configuration and instances
├── components/          # Reusable UI components
│   └── student/        # Student-specific components
├── constant/           # Constants and configuration
├── interface/          # TypeScript interfaces
├── Pages/              # Page components
│   └── student/        # Student pages
├── redux/              # Redux store and slices
│   └── slice/          # Redux slices
├── routes/             # Routing configuration
│   └── student/        # Student routes
├── services/           # Business logic services
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind
```

## Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.cjs` - ESLint configuration

## Features

### Authentication
- Student login with email/password
- JWT token management
- Automatic token refresh
- Protected routes

### UI Components
- Responsive login form
- Modern card layouts
- Custom button styles
- Form input components
- Loading states
- Error handling

### State Management
- Redux Toolkit for global state
- Async thunks for API calls
- Loading and error states
- User authentication state

## Customization

### Colors
The primary color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... more shades
  }
}
```

### Components
Custom component classes are defined in `src/index.css`:

```css
@layer components {
  .btn-primary { /* ... */ }
  .input-field { /* ... */ }
  .card { /* ... */ }
}
```

## API Integration

The application is configured to work with a backend API. Update the `VITE_API_BASE_URL` environment variable to point to your backend server.

## Development

### Adding New Components
1. Create component file in appropriate directory
2. Export component as default
3. Import and use in parent components

### Adding New Routes
1. Update routing configuration in `src/routes/`
2. Create corresponding page components
3. Add navigation links

### State Management
1. Create new slices in `src/redux/slice/`
2. Add to store configuration
3. Use in components with `useSelector` and `useDispatch`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
