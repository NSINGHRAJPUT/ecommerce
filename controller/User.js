const EcUser = require("../modal/user");

exports.fetchUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await EcUser.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    const users = await EcUser.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const user = await EcUser.findByIdAndUpdate(id, req.body, { new: true });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const response = EcUser.findByIdAndDelete(id).exec();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};
