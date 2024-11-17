import Message from "../models/Message.js";

export const getUsersChat = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.body.id;
    if (!senderId || !receiverId) {
      return res.status(400).send("Both user id's are required...");
    }

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ timestamp: 1 })
      .populate("sender", "id email firstName lastName profilePic")
      .populate("receiver", "id email firstName lastName profilePic");

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
