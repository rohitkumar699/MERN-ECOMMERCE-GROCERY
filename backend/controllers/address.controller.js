import Address from "../models/address.model.js";
import User from "../models/user.model.js";
export const addAddress = async (req, res) => {
  try {
    console.log("hy");
    const { name, email, city, country, zipCode, state } = req.body;
    const { id } = req.user;

    const newAddress = await Address.create({
      user: id,
      name,
      email,
      city,
      country,
      zipCode,
      state,
    });
    await User.findByIdAndUpdate(id, {
      $push: { addresses: newAddress._id },
    });
    res
      .status(201)
      .json({ success: true, message: "Address added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const { id } = req.user;
    const addresses = await Address.find({ user: id });
    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
