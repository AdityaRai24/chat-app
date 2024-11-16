import Message from "../models/Message.js";

export const getUsersChat = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).send("Both user id's are required...");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({timestamp : 1});

    return res.status(200).json({messages})
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
};
