const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Razorpay Vercel App is running!',
    status: 'success'
  });
});

// Create Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency: currency,
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
});

// Verify Payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    
    if (generated_signature === razorpay_signature) {
      res.json({ 
        success: true, 
        message: 'Payment verified successfully' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed' 
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      error: 'Payment verification failed',
      message: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
