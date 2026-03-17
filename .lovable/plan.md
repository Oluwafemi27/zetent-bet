
# NaijaBet — Sports Betting Web Application

## Overview
A full-featured sports betting platform with dark green theme, mobile-first design, live odds, casino games, virtual sports, and Supabase-powered backend.

## Design System
- **Dark theme** with primary green `#00A550`, white accents, dark backgrounds (`#0D1117`, `#161B22`)
- **Mobile-first** responsive layout with bottom navigation (Home, Live, Virtuals, Casino, My Account)
- **Top header**: Logo left, balance center, Login/Register right
- Smooth animations, loading skeletons, toast notifications throughout

## Pages & Features

### 1. Homepage
- Sliding hero banner with promo cards
- Today's fixtures from API-Football displayed as match cards with team logos (TheSportsDB) and odds
- Top league filter tabs: All | EPL | La Liga | UCL | NPFL | NBA
- Live scores ticker with red "Live" badge on in-play matches
- Clicking odds adds selection to bet slip

### 2. Sports Page
- All available sports/fixtures with odds from The Odds API
- Filter by sport, league, and search by team/league name

### 3. Live Betting Page
- In-play matches with odds auto-refreshing every 10 seconds
- Live badge indicators, match timer display

### 4. Virtuals Page
- Virtual sports game cards with thumbnails and "Play" buttons opening iFrame modals

### 5. Casino Page
- Game cards for demo slots (Sweet Bonanza, Gates of Olympus, Big Bass Bonanza, Spaceman)
- "Play Demo" button opens SlotCatalog iFrame in a modal

### 6. Aviator Page
- Full-page Spribe Aviator demo embed via iFrame

### 7. Auth (Register & Login)
- Supabase Auth with email/password
- Register: full name, phone, email, password, optional referral code
- On signup: create profile with ₦0 balance + ₦500 bonus
- Login: email/phone + password, forgot password link
- Protected routes redirect to login if unauthenticated

### 8. My Account Page
- Balance & bonus balance display
- Bet history, transaction history
- Deposit (Paystack test mode) and withdrawal request buttons
- Dark/light mode toggle
- Unique referral code display

### 9. Bet Slip
- Slide-up drawer (mobile) / side panel (desktop)
- Single & accumulator bets (up to 15 selections)
- Stake input → dynamic potential win calculation
- Place Bet deducts from balance, saves to DB
- Booking code: generate 6-char code to share/load selections

### 10. Promotions Page
- Welcome bonus, free bet, cashback promo cards
- Data-driven from Supabase promotions table

### 11. Admin Dashboard (`/admin`)
- View all users, bets, transactions
- Toggle promotions on/off
- Protected admin-only route

## Backend (Lovable Cloud / Supabase)

### Database Tables
- **profiles**: id (FK auth.users), full_name, phone, balance, bonus_balance, referral_code, kyc_verified, created_at
- **user_roles**: id, user_id (FK auth.users), role (admin/user)
- **bets**: id, user_id, selections (JSON), stake, potential_win, status, booking_code, created_at
- **transactions**: id, user_id, type, amount, status, reference, created_at
- **promotions**: id, title, description, image_url, is_active, created_at

### RLS Policies
- Users can only read/update their own profiles, bets, and transactions
- Admin access via `has_role()` security definer function
- Promotions: public read, admin write

### Edge Functions
- **process-deposit**: Verify Paystack webhook callback, credit user balance
- **place-bet**: Validate stake, deduct balance, record bet atomically
- **referral-bonus**: Credit ₦200 to both users on valid referral signup

## API Integrations (keys stored as secrets)
- **The Odds API**: Fetch sports, fixtures, odds (h2h/totals/spreads), live odds refresh
- **API-Football (RapidAPI)**: Fixtures, standings, teams for EPL/La Liga/UCL/NPFL/NBA
- **TheSportsDB**: Team badges, league logos, player photos (free, no key needed)

## Payments
- Paystack test mode for deposits (user provides their own public key via secrets)
- Withdrawal requests saved as pending transactions

## Extra Features
- Search bar for teams/leagues
- Refer & Earn with unique codes
- Dark/light mode toggle
- Loading skeletons on all data sections
- Toast notifications for all key actions
