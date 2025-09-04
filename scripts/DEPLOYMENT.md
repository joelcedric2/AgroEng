# Deployment Guide

This guide will walk you through deploying the AgroEng authentication and subscription system to a production environment.

## Prerequisites

1. Node.js 16+ and npm/yarn installed
2. Supabase CLI installed (`npm install -g supabase`)
3. A Supabase project created at [Supabase Dashboard](https://app.supabase.com)
4. Stripe account for payment processing

## Environment Setup

1. Copy the example environment file and update with your values:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

2. Update the following environment variables in `.env`:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Expo / EAS Configuration
EXPO_PUBLIC_EAS_PROJECT_ID=your_eas_project_id
EXPO_PUBLIC_APP_VARIANT=production
```

## Database Setup

1. Apply database migrations:

```bash
# Apply all migrations
npx supabase db push

# Or apply a specific migration
npx supabase migration up
```

2. Verify the following tables and RLS policies are created:
   - `profiles`
   - `scans`
   - `subscriptions`

## Edge Functions Deployment

Deploy the Edge Functions using the deployment script:

```bash
# Install dependencies
npm install

# Run the deployment script
npx ts-node scripts/deploy-supabase.ts
```

Or deploy manually:

```bash
# Deploy each function individually
npx supabase functions deploy create-guest --project-ref your-project-ref
npx supabase functions deploy stripe-webhook --project-ref your-project-ref

# Set environment variables
npx supabase secrets set --env-file ./apps/mobile/.env STRIPE_SECRET_KEY --project-ref your-project-ref
npx supabase secrets set --env-file ./apps/mobile/.env STRIPE_WEBHOOK_SECRET --project-ref your-project-ref
npx supabase secrets set --env-file ./apps/mobile/.env SUPABASE_SERVICE_ROLE_KEY --project-ref your-project-ref
```

## Stripe Webhook Setup

1. In the Stripe Dashboard, go to Developers > Webhooks
2. Add a new endpoint with the URL: `https://[your-project-ref].supabase.co/functions/v1/stripe-webhook`
3. Add these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Testing the Deployment

1. **Guest Flow**:
   - Open the app
   - Verify a guest session is created automatically
   - Perform guest actions (limited)

2. **Authentication**:
   - Sign up with a new email
   - Verify email confirmation (if enabled)
   - Sign in with the new account
   - Test password reset flow

3. **Subscription Flow**:
   - Navigate to upgrade options
   - Select a plan
   - Complete the Stripe checkout
   - Verify plan upgrade in the app
   - Test subscription cancellation

## Monitoring

1. **Supabase Dashboard**:
   - Monitor database queries
   - Check Edge Function logs
   - Review authentication logs

2. **Stripe Dashboard**:
   - Monitor subscription status
   - Check for failed payments
   - Review webhook deliveries

## Troubleshooting

### Common Issues

1. **Authentication Failures**:
   - Verify JWT secret in Supabase matches your project
   - Check if email confirmations are required
   - Verify RLS policies on the profiles table

2. **Subscription Not Updating**:
   - Check Stripe webhook logs in Supabase
   - Verify webhook secret matches
   - Check for errors in the browser console

3. **Edge Function Errors**:
   - Check function logs in Supabase Dashboard
   - Verify all environment variables are set
   - Test functions locally with `supabase functions serve`

## Rollback Plan

1. **Database Rollback**:
   ```bash
   # Revert to a previous migration
   npx supabase migration down
   ```

2. **Function Rollback**:
   ```bash
   # Redeploy a previous version of a function
   git checkout <commit-hash> -- supabase/functions/function-name
   npx supabase functions deploy function-name --project-ref your-project-ref
   ```

## Maintenance

1. **Backup Database**:
   - Set up automated backups in Supabase
   - Test restore process regularly

2. **Update Dependencies**:
   ```bash
   # Update npm packages
   npm update
   
   # Update Supabase CLI
   npm install -g supabase@latest
   ```

3. **Monitor Usage**:
   - Track API usage in Supabase
   - Monitor Stripe for failed payments
   - Set up alerts for critical errors
