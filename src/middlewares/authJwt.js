import jwt from "jsonwebtoken";
import persistence from "../persistence/daos/factory.js";
const { userManager } = persistence;
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY_JWT;

export const checkAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, SECRET_KEY);
    console.log("TOKEN DECODIFICADO");
    console.log(decode);
    const user = await userManager.getById(decode.userId);

    if (!user) return res.status(400).json({ msg: "Unauthorized" });
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Unauthorized" });
  }
};