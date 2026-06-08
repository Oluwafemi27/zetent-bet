# 🔴 CRITICAL: SQL Commands to Run Now

**Status**: Pages are functional but will show database errors until these tables exist

Run these in your Supabase SQL Editor immediately.

---

## 1. User Settings Table (CRITICAL for Settings.tsx)

```sql
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  bet_reminders BOOLEAN DEFAULT TRUE,
  odd_changes BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'auto')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 2. Notifications Table (CRITICAL for Notifications.tsx)

```sql
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'support', 'reply', 'broadcast', 'promotion', 'alert')),
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 3. Support Tickets Table (CRITICAL for Support.tsx)

```sql
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'account', 'payment', 'technical', 'complaint', 'other')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID DEFAULT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON public.support_tickets(created_at DESC);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## How to Run

1. Open [Supabase Dashboard](https://supabase.com)
2. Select your NaijaBet project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy **Table 1** above (user_settings)
6. Paste and click **Run**
7. Wait for success ✅
8. Click **New Query** again
9. Copy **Table 2** above (notifications)
10. Paste and click **Run**
11. Wait for success ✅
12. Click **New Query** again
13. Copy **Table 3** above (support_tickets)
14. Paste and click **Run**
15. Wait for success ✅

---

## Verify Setup

Go to **Database → Tables** and verify you see:
- ✅ user_settings
- ✅ notifications  
- ✅ support_tickets

---

## What Happens When You Run These

| Table | Pages Fixed |
|-------|------------|
| user_settings | Settings.tsx - Loading and saving preferences |
| notifications | Notifications.tsx - Viewing/managing notifications |
| support_tickets | Support.tsx - Submitting and viewing tickets |

---

## After Running SQL

Test these pages:
1. `/settings` - Should load without errors
2. `/notifications` - Should load without errors
3. `/support` - Should load without errors

---

## Optional: Additional Tables

For complete functionality, also run the full `SQL_SETUP_COMMANDS.md` which includes:
- bets
- transactions
- user_messages
- admin_replies
- promotions
- And more...

---

**⏰ Time to complete**: 2 minutes
**⚠️ Required**: YES - Pages will error without these tables
**Status**: Ready to copy/paste

---

## If You Get Errors

**Error**: "relation already exists"
- Solution: You already have this table (good!)

**Error**: "column does not exist"
- Solution: Make sure you're copying the entire SQL block

**Error**: "permission denied"
- Solution: Check you have the right role in Supabase (should be owner)

---

**Now run these 3 SQL blocks in Supabase! 🚀**
