import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import axios from "axios";
// import request from "request";

export const isAuthenticated = jwt({
  algorithms: ["RS256"],
  audience: "https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/",
  issuer: `https://dev-0rubju8i61qqpmgv.us.auth0.com/`,
  secret: "RXn0GvIfMUKVcW2WuOXMNazcuKuNFjLrKNOt2OkUFDRPPaBP_A4wYvhm_Ku_r4tY",

  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-0rubju8i61qqpmgv.us.auth0.com/.well-known/jwks.json",
  }),
});

const AuthMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }
  const token = authorization.replace("Bearer ", "");
  const response = axios
    .get("https://dev-0rubju8i61qqpmgv.us.auth0.com/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      req.user = response.data;
      next();
    })
    .catch((err) => {
      return res.status(401).json({ error: "You must be logged in." });
    });
  req.user = response.data;
};
