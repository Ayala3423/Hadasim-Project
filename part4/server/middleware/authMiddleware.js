const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const hashPassword = (password) => bcrypt.hash(password, 10);

const comparePassword = (inputPassword, storedPassword) => bcrypt.compare(inputPassword, storedPassword);

const generateToken = (id, name) => jwt.sign({ id, name }, JWT_SECRET, { expiresIn: "1h" });

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "אין טוקן" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded:", decoded);
    
    req.user = decoded;  // שמור את המידע של המשתמש ב-req.user
    next();  // תמשיך לפונקציה הבאה בקונטרולר
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "הטוקן לא תקין" });
  }
};

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };