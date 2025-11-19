# GymFlow Web

This is the frontend for the GymFlow class booking platform.  
Built with React + Vite + TypeScript.

The backend API is available at: https://github.com/vslbak/gymflow-api \
Live demo: https://gymflow.codebshift.dev/

**Disclaimer**: this is a demo project for learning purposes only.\
No real payments or bookings are processed.\
Signup at the demo website is disabled to prevent abuse. A Non-admin pre-seeded user can be used to book classes. \
Stripe test card number: `4242 4242 4242 4242` with any future date and any CVC.

## Tech Stack
- React
- Vite
- TypeScript
- lucide-react
- Docker

## Features
- Modern UI
- Class list & details
- Live seat availability
- Booking flow with Stripe Checkout
- Login/signup
- Admin panel
- Mock API for FE-only dev
- Http API client implementation

## Future improvements
- Google SSO
- "Remember me" option
## Local Development
```
npm install
npm run dev
```
Default: http://localhost:5173

## API Configuration
`.env`:
```
VITE_API_URL=http://localhost:8080
```
