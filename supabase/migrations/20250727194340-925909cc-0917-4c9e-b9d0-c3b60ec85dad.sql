
-- First, let's check if the user exists and confirm their email manually
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email = 'joelcedric237@gmail.com';

-- If the user doesn't exist yet, we'll need to wait for them to sign up first
-- Then we can run this query to confirm their email
