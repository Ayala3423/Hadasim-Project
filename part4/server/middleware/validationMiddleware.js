const validateFields = (requiredFields) => {
  return (req, res, next) => {
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `חסר שדה: ${field}` });
      }
    }
    next();
  };
};

module.exports = { validateFields };