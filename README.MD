# Razorpay Vercel App

A minimal Razorpay integration deployed on Vercel.

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables in Vercel dashboard:
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret

## API Endpoints

### GET /
- Health check endpoint
- Returns app status

### POST /api/create-order
- Creates a new Razorpay order
- Body: `{ "amount": 100, "currency": "INR" }`
- Returns order details with order_id

### POST /api/verify-payment
- Verifies payment signature
- Body: `{ "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }`
- Returns verification status

### GET /health
- Simple health check

## Local Development

1. Create `.env` file with your Razorpay credentials
2. Run `npm run dev`
3. Server will start on port 3000

## Deployment

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## Environment Variables

Set these in your Vercel deployment dashboard:

- `RAZORPAY_KEY_ID`: Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
