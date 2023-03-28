export const isAuthenticated = function (req, res, next) {
  console.log(req.session.userId);
  if (!req.session.userId)
    return res.status(401).json({
      error: "You are not authenticated.",
    });
  next();
};
