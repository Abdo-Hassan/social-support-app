# Social Support Portal - Government Financial Assistance Application

A production-ready, accessible, and multilingual 3-step application wizard for citizens to apply for government financial assistance, featuring AI-powered writing assistance.

## 🚀 Features

### Core Functionality
- **3-Step Application Wizard** with intuitive progress tracking
- **AI Writing Assistance** powered by OpenAI GPT-3.5 for situation descriptions
- **Bilingual Support** (English/Arabic) with full RTL layout support
- **Accessibility First** - WCAG AA compliant with comprehensive keyboard navigation
- **Auto-save Progress** - Local storage prevents data loss
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### Technical Highlights
- **React 18** with TypeScript for type safety
- **Material-UI + Tailwind CSS** for professional government portal styling
- **React Hook Form + Zod** for robust form validation
- **Context API** for predictable state management
- **react-i18next** for internationalization
- **Axios** for OpenAI API integration

## 📋 Application Steps

### Step 1: Personal Information
- Full name, National ID, Date of Birth, Gender
- Complete address information
- Contact details (phone, email)

### Step 2: Family & Financial Information
- Marital status and dependents
- Employment status and monthly income
- Housing situation

### Step 3: Situation Descriptions (AI-Assisted)
- **Current Financial Situation** - Describe financial challenges
- **Employment Circumstances** - Explain employment status and barriers
- **Reason for Applying** - Articulate need for assistance

Each textarea in Step 3 features a "Help Me Write" button that provides personalized AI suggestions based on the applicant's information from previous steps.

## 🛠️ Setup and Installation

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (optional - falls back to mock responses)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd social-support-portal

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env
# Add your OpenAI API key to .env:
# OPENAI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

### Environment Variables

```bash
# .env
OPENAI_API_KEY=your_openai_api_key_here  # Optional - uses mock data if not provided
```

**Note**: The application gracefully falls back to mock AI responses if no OpenAI API key is provided, making it fully functional for demonstration purposes.

## 🌐 Usage

1. **Language Selection**: Toggle between English and Arabic in the header
2. **Form Navigation**: Complete each step sequentially with validation
3. **AI Assistance**: In Step 3, click "Help Me Write" for AI-generated content suggestions
4. **Auto-save**: Your progress is automatically saved to local storage
5. **Submission**: Review and submit your complete application

### AI Writing Assistant

The AI assistant uses contextual information from your application to generate personalized suggestions:

- Considers your employment status, income, and family situation
- Provides different suggestions for each text field
- Allows you to accept, edit, or discard suggestions
- Maintains professional, empathetic tone appropriate for government applications

## 🎨 Design System

The application uses a professional government portal design system featuring:

- **Trustworthy Color Palette**: Professional blues, greens, and neutrals
- **Accessible Contrast**: WCAG AA compliant color combinations
- **Semantic Tokens**: HSL-based design system for consistent theming
- **Component Variants**: Professional form elements and buttons
- **Responsive Grid**: Mobile-first approach with breakpoints
- **RTL Support**: Full right-to-left layout for Arabic users

## ♿ Accessibility Features

- **Keyboard Navigation**: Full tab order and focus management
- **Screen Reader Support**: ARIA labels, roles, and descriptions
- **Focus Management**: Logical tab order and visible focus indicators
- **Error Handling**: Clear validation messages and error states
- **Modal Accessibility**: Focus trapping and escape key handling
- **Semantic HTML**: Proper landmark roles and heading hierarchy

## 🌍 Internationalization

- **English**: Complete interface and validation messages
- **Arabic**: Full translation with RTL layout support
- **Dynamic Direction**: Automatic layout mirroring for RTL languages
- **Number Formatting**: Locale-appropriate formatting for dates and numbers

## 🔧 Architecture

### State Management
- **Context API**: Centralized application state management
- **Local Storage**: Automatic progress persistence
- **Form State**: React Hook Form for robust form handling

### Validation
- **Zod Schemas**: Type-safe validation schemas
- **Real-time Validation**: Immediate feedback on form changes
- **Step Validation**: Prevents progression with invalid data

### AI Integration
- **OpenAI GPT-3.5**: Contextual content generation
- **Fallback System**: Mock responses when API unavailable
- **Error Handling**: Graceful failure with retry options
- **Rate Limiting**: Built-in timeout and retry logic

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security & Privacy

- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Sanitized user inputs
- **Local Storage**: Sensitive data handled appropriately
- **API Security**: Secure OpenAI API integration

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The application can be deployed to any static hosting service (Vercel, Netlify, AWS S3, etc.).

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run accessibility audit
npm run test:a11y

# Run linting
npm run lint
```

## 📈 Performance Optimization

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Efficient browser caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For technical support or questions:
- 📧 Email: support@socialservices.gov
- 📞 Phone: 1-800-SUPPORT
- 🌐 Documentation: [Government Services Portal](https://gov.example.com)

---

**Note**: This application includes AI-powered features that require an OpenAI API key for full functionality. The application will work with mock data if no API key is provided, making it perfect for demonstration and development purposes.