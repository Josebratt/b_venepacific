const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/** Get All*/
const getUsers = async (req, res) => {
  const list = await userModel.find();
  if (!list) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(list);
};

/** Get by Id */
const getUser = async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(500).json({ message: "El Id del usuario no se ha encontrado" });
  }
  res.status(200).send(user);
};

/** create User && register User */
const createUser = async (req, res) => {
  let user = new userModel({
    firstNames: req.body.firstNames,
    lastNames: req.body.lastNames,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    address: req.body.address,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  
  user = await user.save();

  if (!user) return res.status(400).send("El usuario no pudo ser creado!");

  res.send(user);
};

/** update User */
const updateUser = async (req, res) => {
  const userExist = await userModel.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.password;
  }

  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      firstNames: req.body.firstNames,
      lastNames: req.body.lastNames,
      email: req.body.email,
      password: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      address: req.body.address,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) {
    return res.status(400).send("El usuario no puede ser creado!");
  }
  res.send(user);
};

/** detele User */
const deleteUser = async (req, res) => {
  userModel
    .findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "El usuario ha sido borrado!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

/** login User */
const loginUser = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  const secret = process.env.SECRET;

  if (!user) {
    return res.status(400).send("Usuario no encontrado!");
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("La constraseña es incorrecta!");
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};
