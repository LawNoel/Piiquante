const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header et le split autour de l'espace
    const token = req.headers.authorization.split(" ")[1];
    // Décodage du token
    const decodedToken = jwt.verify(token, process.env.JWT);
    // Récupération de l'userId
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
