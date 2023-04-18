const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const User = require('../models/User');
const registerUser = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.confirmPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }
  const token = user.createJWT();
  return res.status(StatusCodes.OK).send({ user: { name: user.name }, token });
};

module.exports = { registerUser, loginUser };
