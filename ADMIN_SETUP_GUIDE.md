# Admin System Setup Guide

## How to Test the Admin System

### 1. **Current User Role System**

The system now uses a proper database-driven role system instead of user metadata:

- **User roles table**: Stores user roles (admin, moderator, user)
- **Security functions**: `has_role()`, `get_user_role()`, `is_admin()`
- **Automatic role assignment**: New users get 'user' role by default
- **Admin-only navigation**: The "Crops" tab only shows for admin users

### 2. **Admin Features**

**Admin-only navigation:**
- The "Crops" tab in the bottom navigation only appears for admin users
- Non-admin users won't see this tab at all

**Admin-only pages:**
- `/crop-database` - Protected with `AdminProtectedRoute`
- Non-admin users see an "Access Denied" page if they try to access it

**Admin controls in Settings:**
- Admin users see an "Admin Controls" section in Settings
- Can assign admin role to other users by email address

### 3. **How to Assign Admin Role**

**Option 1: Using the Settings Page (for existing admins)**
1. Login as an admin user
2. Go to Settings
3. Scroll down to "Admin Controls" section
4. Enter the email address of the user you want to make admin
5. Click "Assign" button

**Option 2: Using the Database (for first admin)**
Since you need at least one admin to start, you can manually assign the first admin role in the database:

```sql
-- Replace 'your-email@example.com' with your actual email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'your-email@example.com';
```

### 4. **Security Features**

✅ **Row Level Security (RLS)** enabled on all tables
✅ **Admin-only policies** for crop database management
✅ **Protected routes** that show access denied for non-admins
✅ **Dynamic navigation** that hides admin features from regular users
✅ **Database functions** with proper security definer access

### 5. **Testing Steps**

1. **Create two user accounts**: One for admin, one for regular user
2. **Assign admin role** to one account using the database query above
3. **Login as admin**: You should see the "Crops" tab in navigation
4. **Login as regular user**: You should NOT see the "Crops" tab
5. **Try accessing `/crop-database` as regular user**: Should show "Access Denied"
6. **Test role assignment**: Admin can assign admin role to the regular user via Settings

### 6. **Admin Capabilities**

When logged in as admin, you can:
- ✅ Access the crop database at `/crop-database`
- ✅ Upload crop data (CSV, JSON, manual entry)
- ✅ Upload and analyze images with AI
- ✅ Assign admin roles to other users
- ✅ Manage all crops, diseases, and images
- ✅ See admin controls in Settings

### 7. **Security Notes**

- Admin role is stored in database, not in JWT tokens
- All admin checks use secure database functions
- File uploads are restricted to admin users only
- Non-admin users cannot access any admin functionality
- Role checking happens on both frontend and backend

The system is now fully secured with proper admin authentication and authorization!