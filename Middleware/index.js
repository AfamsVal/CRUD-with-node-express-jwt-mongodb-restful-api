const jwt = require("jsonwebtoken");

function jwtMiddleware(req, res, next) {
  const token = req.header("authorization");
  if (!token) res.json({ msg: "Authorization failed" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.json({ msg: "Authorization failed" });
  }
}

module.exports = jwtMiddleware;
