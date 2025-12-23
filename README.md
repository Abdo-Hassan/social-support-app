# Social Support Application Portal

A modern, AI-powered multilingual React application for government financial assistance. Built with TypeScript, Material-UI, and React Hook Form, featuring full RTL (Right-to-Left) support for the Arabic language.

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
   Create a `.env` file in the root directory for the serverless function:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Important:** The API key is now used by the Netlify serverless function (not exposed to the frontend).

4. **Start development server**

   ```bash
   npm run dev:netlify
   ```

   This will start both the Vite dev server and Netlify Functions locally.

5. **Open in browser**
   Navigate to `http://localhost:8080`

## Available Scripts

### Development

```bash
npm run dev             # Start Vite dev server only
npm run dev:netlify     # Start with Netlify Functions (recommended)
npm run build           # Build for production
npm run build:dev       # Build for development
npm run preview         # Preview production build
npm run deploy          # Deploy to Netlify
```

### Testing

```bash
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

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

- **Secure** OpenAI integration via serverless proxy
- API key never exposed to the frontend
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
- **Netlify Functions** for secure API proxy
- **OpenAI API** for AI assistance (via secure proxy)

### Code Quality

```bash
npm run lint         # Run ESLint
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

### 🚀 Secure Deployment with Netlify

This application uses **Netlify Functions** as a secure proxy to protect your OpenAI API key.

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deploy

```bash
# Install dependencies
npm install

# Login to Netlify
npx netlify login

# Deploy to production
npm run deploy
```

### Environment Variables

Set this environment variable in your **Netlify dashboard** (not in your code):

- `OPENAI_API_KEY` - Your OpenAI API key (server-side only)

**Security Note:** The API key is now stored server-side in Netlify Functions and is NEVER exposed to the frontend. This prevents API key theft and unauthorized usage.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Debug Mode

Enable debug mode by setting:

```env
NODE_ENV=development
```
