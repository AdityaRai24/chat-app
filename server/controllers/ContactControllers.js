import User from "../models/User.js";
import Message from "../models/Message.js";

export const getSearchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("Search term is required...");
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        {
          _id: { $ne: req.userId },
        },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};

export const getChatList = async (req, res) => {
  try {
    const receiverOnly = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }],
    }).distinct("receiver");

    const senderOnly = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }],
    }).distinct("sender");

    const conversations = [receiverOnly, senderOnly];

    const userIds = [...new Set(conversations.flat())].filter(
      (id) => id.toString() !== req.userId.toString()
    );

    const userData = await User.find(
      {
        _id: { $in: userIds },
      },
      "-password"
    );

    const chatListWithLastMessage = await Promise.all(
      userData.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.userId, receiver: user._id },
            { sender: user._id, receiver: req.userId },
          ],
        })
          .sort({ timestamp: -1 })
          .limit(1);

        return {
          ...user.toObject(),
          lastMessage: lastMessage ? lastMessage.content : null,
          lastMessageTime: lastMessage ? lastMessage.timestamp : null,
        };
      })
    );

    chatListWithLastMessage.sort(
      (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
    );

    return res.status(200).json(chatListWithLastMessage);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
