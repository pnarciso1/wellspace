# Wellspace

A comprehensive health and wellness management platform built with Next.js and Supabase.

## Environment Variables Setup

To set up your environment variables:

1. Copy the `.env.example` file in the project root and rename it to `.env.local`

   ```
   cp .env.example .env.local
   ```

2. Open the `.env.local` file and replace the placeholder values with your actual credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   STRIPE_SECRET_KEY=your_actual_stripe_secret_key
   STRIPE_PREMIUM_PLAN_PRICE_ID=your_actual_stripe_premium_plan_price_id
   ```

3. Save the `.env.local` file

4. Restart your development server if it's running

IMPORTANT: Never commit the `.env.local` file to version control. It contains sensitive information and should remain on your local machine.

For production deployment, set these environment variables in your hosting platform's dashboard (e.g., Vercel, Netlify).

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wellspace.git
   cd wellspace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables as described above

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **User Authentication**
  - Email/password authentication
  - Password reset functionality
  - Email verification
  
- **Health Profile Management**
  - Personal health information storage
  - Customizable health metrics
  - Secure data handling

- **Premium Subscription**
  - Stripe integration for payments
  - Premium feature access
  - Subscription management

- **Responsive Design**
  - Mobile-friendly interface
  - Persistent sidebar navigation
  - Adaptive layout

## Recent Updates

### Sidebar Persistence Fix (January 2024)

#### Problem Resolved
Fixed an issue where the sidebar would disappear when users:
- Navigated away from the application
- Returned to the application
- Refreshed the page

#### Implementation Details
Location: `contexts/authContext.tsx`

Key Features:
- Session state persistence using sessionStorage
- Page visibility monitoring
- Window focus event handling
- Robust authentication state management

#### Technical Implementation
```typescript
// Session state management with automatic initialization
const [isAuthenticated, setIsAuthenticated] = useState(() => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('isAuthenticated') === 'true'
  }
  return false
})

// Comprehensive auth status checking
const checkAuthStatus = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const session = await supabase.auth.getSession()
    
    if (user && session.data.session) {
      setUser(user)
      setIsAuthenticated(true)
      setShowSidebar(true)
      sessionStorage.setItem('isAuthenticated', 'true')
    }
  } catch (error) {
    handleLogout()
  }
}
```

#### Testing Checklist
- [x] User authentication flow
- [x] Sidebar persistence across page navigation
- [x] Sidebar persistence across browser tab switches
- [x] Sidebar persistence across page refreshes
- [x] Proper cleanup on logout

## Tech Stack

- **Frontend**
  - Next.js 13+
  - React
  - TypeScript
  - Tailwind CSS

- **Backend**
  - Supabase
  - PostgreSQL
  - Stripe API

- **Authentication**
  - Supabase Auth
  - JWT tokens
  - Session management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.