# Social Support Application Portal

A modern, multilingual React application for government financial assistance applications. Built with TypeScript, Material-UI, and React Hook Form, featuring full RTL (Right-to-Left) support for Arabic language.

## Features

### 🌐 Multilingual Support

- **English** and **Arabic** localization
- Full RTL layout support for Arabic
- Seamless language switching
- Persistent language preference

### 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Modern Material-UI components
- Consistent design system

### 🔐 Form Validation

- Comprehensive form validation with Zod
- Real-time validation feedback
- Multilingual error messages
- Accessibility-compliant form fields

### 💾 Auto-Save Functionality

- Automatic progress saving to localStorage
- Resume applications from where you left off
- Data persistence across browser sessions
- Smart loading states

### 🤖 AI Assistance

- OpenAI integration for application descriptions
- Context-aware suggestions
- Multilingual AI responses
- Editable AI-generated content

### 🧪 Testing & Quality

- Jest unit tests for core functionality
- React Testing Library for component tests
- Form validation testing
- Mock API testing

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **React Hook Form** with Zod validation
- **React Router** for navigation
- **i18next** for internationalization

### Development

- **Vite** for fast development and building
- **ESLint** for code quality
- **Jest** for testing
- **TypeScript** for type safety

### Services

- **Axios** for API calls
- **Axios Mock Adapter** for development
- **OpenAI API** for AI assistance

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd social-support-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
```

### Testing

```bash
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Code Quality

```bash
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AI/             # AI assistance components
│   ├── Layout/         # Layout components (Header, ProgressBar)
│   ├── Steps/          # Form step components
│   └── UI/             # Basic UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization setup
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API and external services
├── theme/              # Material-UI theme configuration
└── types/              # TypeScript type definitions

public/
├── locales/           # Translation files
│   ├── en/           # English translations
│   └── ar/           # Arabic translations
└── assets/           # Static assets
```

## Application Flow

### Step 1: Personal Information

- Full name, national ID, date of birth
- Contact information (phone, email)
- Address details
- Gender selection

### Step 2: Family & Financial Information

- Marital status and dependents
- Employment status and monthly income
- Housing situation

### Step 3: Situation Descriptions

- Financial situation description
- Employment circumstances
- Reason for applying
- AI assistance for writing descriptions

### Step 4: Success/Confirmation

- Application reference number
- Submission confirmation
- Next steps information

## API Integration

### Mock API

The application includes a mock API adapter for development:

```javascript
// Force success responses (useful for testing)
window.mockAPI.forceSuccess();

// Force error responses
window.mockAPI.forceError();

// Random mode (80% success, 20% error)
window.mockAPI.randomMode();

// Test the API directly
window.mockAPI.testSubmit();
```

### Real API Integration

To integrate with a real backend API:

1. Set `VITE_API_BASE_URL` in your environment variables
2. Remove or modify the mock service import in `main.tsx`
3. Update API endpoints in `services/api.ts` as needed

## Internationalization

### Adding New Languages

1. Create translation files in `public/locales/{lang}/`
2. Update supported languages in `src/i18n/i18n.ts`
3. Add language option in header component

### Translation Keys Structure

```
common.json     # Common UI elements, navigation, validation
personal.json   # Personal information step
family.json     # Family & financial step
situation.json  # Situation descriptions step
success.json    # Success/confirmation step
```

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow React functional components pattern
- Use custom hooks for reusable logic
- Implement proper error boundaries

### Form Validation

- Define schemas in `types/form.ts` using Zod
- Use consistent validation patterns
- Provide meaningful error messages
- Support multilingual validation

### Testing

- Write tests for new components
- Test form validation logic
- Mock external dependencies
- Maintain good test coverage

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Set these environment variables in your deployment platform:

- `VITE_OPENAI_API_KEY` - Your OpenAI API key
- `VITE_API_BASE_URL` - Your backend API URL

### Static Hosting

The built application can be deployed to any static hosting service:

- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

### Setting Up for Development

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Review Process

- All changes require review
- Tests must pass
- Code must follow project conventions
- Documentation should be updated

## Troubleshooting

### Common Issues

**Translation flash on page load**

- Ensure all translation files are properly loaded
- Check browser console for missing translation keys

**Form data not persisting**

- Check localStorage is enabled in browser
- Verify no localStorage quota exceeded
- Look for console errors during save operations

**Mock API not working**

- Ensure `services/mock.ts` is imported in `main.tsx`
- Check browser console for network errors
- Verify localStorage flags for forced responses

### Debug Mode

Enable debug mode by setting:

```env
NODE_ENV=development
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review test files for usage examples

---

Built with ❤️ for social support accessibility
