const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function auth(req, res, next) {
  const token = req.headers["x-admin-token"];

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  next();
}
module.exports = auth;
