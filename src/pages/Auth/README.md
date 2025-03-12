# Authentication System

This directory contains the consolidated authentication system for the QuantumAutomate application. It follows a structured approach to handle user authentication, registration, verification, and password management.

## Components Structure

- `AuthLayout/` - Common layout wrapper for all auth pages
- `SignIn/` - Login page
- `Register/` - User registration page
- `OTPVerification/` - Email verification with OTP
- `ForgotPassword/` - Password recovery request
- `ResetPassword/` - Password reset form

## Integration with Backend

The authentication system is integrated with the backend API through `services/authService.js`. The API endpoints used include:

- `/api/auth/login/` - User login
- `/api/auth/register/` - User registration
- `/api/auth/verify-email/` - Email verification with OTP
- `/api/auth/resend-verification/` - Resend verification email
- `/api/auth/password/reset/` - Request password reset
- `/api/auth/password/reset/confirm/` - Confirm password reset

## Required User Fields

The backend expects the following fields for user registration:

- `email` (required) - User's email address
- `password` (required) - User's password
- `password2` (required) - Password confirmation
- `name` (optional) - User's full name
- `business_type` (optional) - Type of business (ecommerce, service, retail, saas, other)
- `phone` (optional) - User's phone number

## Authentication Flow

1. **Registration**: User registers with email, password, and optional profile information.
2. **Email Verification**: After registration, an OTP is sent to the user's email for verification.
3. **Login**: Once verified, users can log in with their email and password.
4. **Token Management**: The system stores access and refresh tokens for authenticated API requests.
5. **Protected Routes**: Routes requiring authentication are protected through the `ProtectedRoute` component.

## Context & State Management

The application uses React Context for auth state management through the `AuthContext`. This provides:

- Current user state
- Loading state for authentication checks
- User update and logout functions

## Usage

Import the components from the auth directory:

```jsx
import { SignIn, Register, OTPVerification } from '../pages/Auth';
```

Routes are configured in `App.jsx` with appropriate protection:

```jsx
<Route path="/signin" element={
    <GuestRoute>
        <SignIn />
    </GuestRoute>
} />

<Route path="/dashboard" element={
    <ProtectedRoute>
        <Dashboard />
    </ProtectedRoute>
} />
``` 