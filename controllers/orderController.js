const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { name, phone, propertyName, city, best_time, message } = req.body;

    if (!name || !phone || !propertyName) {
      return res.status(400).json({ success: false, message: 'Name, phone, and property name are required.' });
    }

    const newOrder = new Order({ name, phone, propertyName, city, best_time, message });
    await newOrder.save();

    res.json({ success: true, message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ submitted_at: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
