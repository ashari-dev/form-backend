import Users from "../models/Users.js";

const emailExists = async (email) => {
  const user = await Users.findOne({ email });
  if (user) {
    return true;
  }
  return false;
};

export default emailExists;
