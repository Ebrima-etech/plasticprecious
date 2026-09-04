# Plasticprecious Frontend

Next.js + Tailwind CSS + TypeScript frontend for the Plasticprecious eCommerce platform.

## Setup

### Prerequisites
- Node.js 18.17+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create .env.local file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in browser.

## Project Structure

```
plasticprecious/
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── config/            # Configuration files
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript types
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
├── .env.local            # Environment variables
└── package.json
```

## Features

- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add/remove items, manage quantities
- **User Authentication**: Register, login, profile management
- **Checkout**: Secure payment with Stripe
- **Order Tracking**: View order history and status
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Available Scripts

### `npm run dev`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `.next` folder

### `npm run start`
Runs the production build

### `npm run lint`
Runs ESLint to check code quality

## Technologies

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Payment**: Stripe
- **Auth**: JWT

## Environment Variables

Create a `.env.local` file with these variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

## Development Tips

1. Component locations:
   - Reusable components: `src/components/`
   - Page-specific components: within `src/app/[route]/`

2. API calls:
   - Use `src/config/api.ts` for API endpoints
   - Use `src/lib/auth.ts` for authentication utilities

3. Type safety:
   - Define types in `src/types/index.ts`
   - Use TypeScript for all components

## Building for Production

```bash
npm run build
npm run start
```

The app will be available at [http://localhost:3000](http://localhost:3000)
