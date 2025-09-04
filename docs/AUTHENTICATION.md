# Authentication & Subscription Flow

This document outlines the guest-first authentication and subscription system implemented in the AgroEng mobile app.

## Overview

The app uses a guest-first approach where users can start using the app immediately without creating an account. Guest users have limited access to features and can upgrade to a full account at any time.

## Features

- Guest accounts with limited functionality
- Email/password authentication
- Seamless guest to registered user conversion
- Subscription management with Stripe integration
- Feature gating based on user entitlements
- Secure storage of authentication state

## Database Schema

### Tables

#### `profiles`
- `id` (UUID, primary key): References `auth.users.id`
- `is_guest` (boolean): Whether the user is a guest
- `plan` (enum: 'free' | 'premium' | 'pro'): User's subscription plan
- `scan_credits` (integer): Number of available scan credits
- `created_at` (timestamp): When the profile was created

#### `scans`
- `id` (bigserial, primary key)
- `user_id` (UUID): References `auth.users.id`
- `crop` (text): Type of crop scanned
- `diagnosis` (text): Diagnosis result
- `created_at` (timestamp): When the scan was performed

## Edge Functions

### `create-guest`
Creates a new guest user with a random email and password.

**Endpoint**: `/functions/v1/create-guest`
**Method**: POST
**Response**:
```json
{
  "session": {
    "access_token": "...",
    "refresh_token": "...",
    "user": {
      "id": "...",
      "email": "guest_...@example.com",
      "user_metadata": {
        "is_guest": true
      }
    }
  }
}
```

### `stripe-webhook`
Handles Stripe webhook events for subscription management.

**Endpoint**: `/functions/v1/stripe-webhook`
**Method**: POST

## Client-Side Implementation

### Authentication Flow

1. **Initial Launch**:
   - Check for existing session
   - If no session exists, create a guest session
   - Redirect to onboarding or main app based on auth state

2. **Guest Experience**:
   - Limited access to features
   - Prompts to create an account for full access
   - Seamless conversion to full account

3. **Authentication Methods**:
   - Email/password sign up
   - Email/password sign in
   - Guest conversion to full account

### Subscription Flow

1. **Plan Selection**:
   - User selects a plan (Premium or Pro)
   - Redirects to Stripe Checkout
   - On successful payment, updates user's plan in Supabase

2. **Feature Gating**:
   - Components use `FeatureGate` to check entitlements
   - Unauthorized features show upgrade prompts

## Environment Variables

See `.env.example` for all required environment variables.

## Security Considerations

- Service role key is only used in Edge Functions
- Row Level Security (RLS) is enabled on all tables
- Guest users have restricted permissions
- Sensitive keys are not exposed to the client

## Testing

### Guest Flow
1. Fresh install the app
2. Verify guest user is created automatically
3. Test limited functionality
4. Convert to full account
5. Verify full access

### Authentication
1. Test sign up with email/password
2. Test sign in with existing account
3. Test password reset flow

### Subscriptions
1. Test plan selection
2. Test successful subscription
3. Test subscription cancellation
4. Verify feature access based on subscription level

## Troubleshooting

### Common Issues

1. **Guest session not persisting**
   - Verify SecureStore is properly configured
   - Check for errors in the auth state change listener

2. **Subscription not updating**
   - Check Stripe webhook logs
   - Verify webhook secret matches
   - Check RLS policies on the profiles table

3. **Feature gates not working**
   - Verify entitlements query is returning correct data
   - Check for errors in the console
   - Ensure the user's plan is being updated correctly

## Future Improvements

- Social login (Google, Apple)
- Passwordless authentication
- Family sharing for subscriptions
- Offline-first support for core features
