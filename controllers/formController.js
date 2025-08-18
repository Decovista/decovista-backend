const Order = require('../models/Order');

exports.submitForm = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    const order = new Order({
      name: req.body.name,
      phone: req.body.phone,
      propertyName: req.body.propertyName,
      city: req.body.city,
      best_time: req.body.best_time,
      message: req.body.message,
    });
    await order.save();
    res.json({ success: true, message: 'Submitted successfully!' });
  } catch (err) {
    console.error('Error saving form:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ submitted_at: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
