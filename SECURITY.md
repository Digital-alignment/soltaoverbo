# Security Configuration

## Supabase Auth Security Settings

### Leaked Password Protection (REQUIRED ACTION)

**Status:** ⚠️ Requires Manual Configuration

The application's security analysis has identified that Leaked Password Protection is currently disabled. This feature prevents users from using passwords that have been compromised in data breaches by checking them against the HaveIBeenPwned.org database.

#### How to Enable:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Providers** → **Email**
4. Scroll down to **Security Settings**
5. Enable **"Leaked Password Protection"**
6. Click **Save**

#### What This Does:

- Checks user passwords against the HaveIBeenPwned database during registration
- Prevents users from setting passwords that have been exposed in known data breaches
- Enhances overall platform security without impacting user experience
- Does not store or send actual passwords to third parties (uses k-anonymity model)

#### Benefits:

- Protects users from credential stuffing attacks
- Reduces the risk of account takeovers
- Demonstrates security best practices
- No performance impact on authentication

---

## Database Security Status

### ✅ Completed Security Fixes

All database security issues have been resolved:

1. **Foreign Key Indexes** - Added 6 missing indexes for optimal query performance
2. **RLS Policy Optimization** - All 32 policies optimized using SELECT pattern for auth.uid()
3. **Unused Indexes Removed** - Cleaned up 3 unused indexes
4. **Multiple Permissive Policies Fixed** - Consolidated overlapping policies
5. **Function Search Path** - Set immutable search_path for update_updated_at_column

### Index Status

The following indexes were recently created and may show as "unused" in initial scans. These are critical for performance and should NOT be removed:

- `idx_comments_user_id`
- `idx_community_posts_user_id`
- `idx_community_posts_writing_exercise_id`
- `idx_courses_created_by`
- `idx_post_likes_user_id`
- `idx_user_subscriptions_user_id`

These indexes will be utilized once the application runs queries against the respective foreign key columns.

---

## Security Best Practices

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- User data is isolated and protected
- Admin actions are properly restricted
- All auth.uid() calls are optimized with SELECT wrapper
- Policies follow principle of least privilege

### Authentication

- Email/password authentication via Supabase Auth
- Google OAuth integration available
- Session management handled securely
- Password reset flows properly implemented

### Data Protection

- All sensitive operations require authentication
- Foreign key relationships properly indexed
- No exposed API keys in client-side code
- Environment variables properly configured

---

## Monitoring & Maintenance

### Regular Security Checks

Periodically review:

1. Supabase Dashboard Security Advisor
2. Database Performance Insights
3. RLS Policy Effectiveness
4. Index Usage Statistics

### Updates

Keep dependencies up to date:

```bash
npm update
```

Check for Supabase client library updates regularly.

---

## Contact

For security concerns or questions, contact the development team through the application's contact page.

Last Updated: December 2025
