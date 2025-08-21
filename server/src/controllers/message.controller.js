const { uploadImage } = require("../helpers/cloudinary-helpers");
const Message = require("../models/Message");
const User = require("../models/User");

const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error on getUserForSidebar controller");
    res.status(500).json({ message: "Internal Server Error " + error });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._ud;

    const messages = await Message.find({
      $or: [
        {
          senderId: senderId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: senderId,
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error on getMessage controller");
    res.status(500).json({ message: "Internal Server Error " + error });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const { public_id, secure_url } = await uploadImage(image);
      imageUrl = secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // todo: realtime feature using socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error on sendMessage controller");
    res.status(500).json({ message: "Internal Server Error " + error });
  }
};
module.exports = { getUserForSidebar, getMessage, sendMessage };
