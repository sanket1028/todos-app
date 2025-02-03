const UserModel = require("../models/User");
const { z } = require("zod");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const requiredBody = z
      .object({
        email: z.string().min(5).max(30).email(),
        password: z.string().min(8).max(20),
      })
      .strict();

    const safeParseBody = requiredBody.safeParse(req.body);

    if (!safeParseBody.success) {
      return res.status(400).json({
        message: safeParseBody.error.flatten(),
      });
    }

    const { email, password } = safeParseBody.data;

    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({ email, password: hashedPassword });
    return res.status(201).json({
      message: "Successful Signup",
    });
  } catch (e) {
    // Mongoose throws a MongoError with code: 11000 when a unique constraint is violated.
    if (e?.code === 11000) {
      return res.status(400).json({
        message: "email already been used",
      });
    }

    return res.status(500).json({
      message: "Internal Serever error",
    });
  }
};
