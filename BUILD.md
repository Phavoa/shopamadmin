# Build Instructions for ShopAm Admin Slot Management

## Prerequisites

Before building the ShopAm Admin application, ensure you have the following installed:

- **Node.js**: Version 18.17.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For version control

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd shopam_admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required dependencies including:
   - Next.js 15.5.5
   - React 19.1.0
   - TypeScript
   - Tailwind CSS
   - Framer Motion
   - Radix UI components
   - Testing libraries (Jest, React Testing Library)

## Development

### Start Development Server

```bash
npm run dev
```

This starts the Next.js development server with Turbopack enabled for faster builds. The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Production Build

### Build the Application

```bash
npm run build
```

This command:
1. Type-checks TypeScript code
2. Runs ESLint for code quality
3. Builds the application for production
4. Optimizes assets and bundles

### Start Production Server

```bash
npm run start
```

The production server will start on port 3000 by default.

## Testing

### Run Unit Tests

```bash
npm run test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

### Test Structure

- **Unit Tests**: Located in `src/__tests__/components/slots/`
  - `FiltersBar.test.tsx` - Tests filter functionality
  - `CalendarBoard.test.tsx` - Tests calendar interactions
  - `SlotDetailsPanel.test.tsx` - Tests slot details display

- **Integration Tests**: Located in `src/__tests__/integration/`
  - `SlotManagement.integration.test.tsx` - Tests component integration

## Environment Configuration

The application uses design tokens defined in `src/app/globals.css`. These tokens are programmatically consumed throughout the application and include:

- Color palette
- Typography scales
- Spacing system
- Component-specific tokens

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure build settings
3. Deploy with `npm run build` command

### Manual Deployment

1. Build the application: `npm run build`
2. Serve the `.next` directory with a Node.js server
3. Configure your web server to serve static assets from `.next/static`

## Performance Optimization

The application includes several performance optimizations:

- **Next.js 15**: Latest version with improved performance
- **Turbopack**: Faster development builds
- **Tailwind CSS**: Utility-first CSS with purging
- **Framer Motion**: Optimized animations with reduced motion support
- **Code Splitting**: Automatic route-based code splitting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

1. **Build fails with TypeScript errors**
   - Run `npm run lint` to check for code quality issues
   - Ensure all dependencies are installed: `npm install`

2. **Tests fail**
   - Ensure Jest is properly configured
   - Check that all test dependencies are installed
   - Run `npm run test:coverage` for detailed error information

3. **Styling issues**
   - Verify Tailwind CSS is properly configured
   - Check that design tokens in `globals.css` are correctly defined

### Performance Issues

- Use `npm run build` to create an optimized production build
- Enable gzip compression on your server
- Use a CDN for static assets

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## Support

For support or questions:
- Check the README.md for detailed documentation
- Review the design tokens in `src/app/globals.css`
- Examine existing components for implementation patterns