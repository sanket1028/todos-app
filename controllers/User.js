const UserModel = require("../models/User");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function authRequestValidation(req) {
  const requiredAuthBody = z
    .object({
      email: z.string().min(5).max(30).email(),
      password: z.string().min(8).max(20),
    })
    .strict();

  return requiredAuthBody.safeParse(req.body);
}

exports.signup = async (req, res) => {
  try {
    const safeParseBody = authRequestValidation(req);
    if (!safeParseBody.success) {
      return res.status(400).json({
        message: safeParseBody.error.flatten(),
      });
    }
    const { email, password } = req.body;

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
      message: "Internal Server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const safeParseBody = authRequestValidation(req);
    if (!safeParseBody.success) {
      return res.status(400).json({
        message: safeParseBody.error.flatten(),
      });
    }

    const user = await UserModel.findOne({ email: safeParseBody.data.email });
    if (!user) {
      return res.status(404).json({
        message: `User does't exists`,
      });
    }
    const isPasswordValid = await bcrypt.compare(
      safeParseBody.data.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    return res.status(200).json({
      token,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};
