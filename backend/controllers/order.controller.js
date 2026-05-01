import Order from "../models/order.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { items, address, totalAmount, paymentMethod } = req.body;

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items in order" });
    }

    const formattedItems = items.map((item) => ({
      product: item._id,
      quantity: item.quantity,
      price: item.offerPrice || item.price,
    }));

    const order = await Order.create({
      user: id,
      items: formattedItems,
      address,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
    });

    res
      .status(201)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Order error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;
    const orders = await Order.find({ user: id })
      .populate("items.product", "name price image")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .populate("address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
