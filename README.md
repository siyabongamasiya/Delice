# Delice

Delice is a React Native (Expo) food ordering app powered by Supabase (Auth + Database + Storage) and Paystack card payments via Supabase Edge Functions.

## App download (for testing on a real Android phone)

- **Android (EAS Build)**: https://expo.dev/accounts/siyabonga_khanyile/projects/delice/builds/cdb673ac-77b7-46c7-a45c-df9a99aa6655

### Install on device

1. Open the link on your Android phone.
2. Download and install the APK / build.
3. If prompted, allow installing from the browser ("Install unknown apps").

## Testing checklist (device)

- **Auth**
  - Sign up / login
  - Google sign-in
- **Menu + cart**
  - Browse menu items
  - Add to cart
- **Checkout + Paystack**
  - Pay using Paystack Hosted Checkout
  - App should return automatically and verify payment
- **Tracking**
  - Tracking shows only your orders
- **Admin**
  - Admin users can manage menu items and orders

## Tech stack

- **Mobile**: Expo + React Native
- **Navigation**: React Navigation
- **State**: Redux Toolkit + redux-persist
- **Backend**: Supabase
- **Payments**: Paystack Hosted Checkout (card)

## Local development (optional)

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3) Run

```bash
npx expo start
```

## Paystack payments (Supabase Edge Functions)

Payments are implemented using Paystack hosted checkout.

- **Init**: `supabase/functions/paystack-init`
- **Verify**: `supabase/functions/paystack-verify`

The functions expect a Paystack secret key stored in Supabase secrets as:

- `PAYSTACK_SECRET_KEY`

Deployment examples:

```bash
npx supabase functions deploy paystack-init --no-verify-jwt
npx supabase functions deploy paystack-verify --no-verify-jwt
```

## Deep linking

The Paystack callback uses deep linking:

- **Scheme**: `delice://`
- **Callback route**: `delice://paystack/callback`

Linking configuration:

- `src/navigation/linking.ts`

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
```
