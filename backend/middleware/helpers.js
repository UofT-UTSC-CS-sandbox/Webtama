import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import axios from "axios";

export const isAuthenticated = jwt({
  algorithms: ["RS256"],
  audience: "https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/",
  issuer: `https://dev-0rubju8i61qqpmgv.us.auth0.com/`,
  // secret: "RXn0GvIfMUKVcW2WuOXMNazcuKuNFjLrKNOt2OkUFDRPPaBP_A4wYvhm_Ku_r4tY",

  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-0rubju8i61qqpmgv.us.auth0.com/.well-known/jwks.json",
  }),

  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
  },
});

export const userInfo = async (req, res, next) => {
  try {
    const user = await getUserInfo(req);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const getAccessToken = async (req, res, next) => {
  const option = {
    method: "POST",
    url: "https://dev-0rubju8i61qqpmgv.us.auth0.com/oauth/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "JrGMWEt5X5zaA95E7OoTCllPcWOLlpvu",
      client_secret:
        "VzeYEN6nSzeXnTfvY8DPb8QWawRi-b7-ST9PVV2pmpGSzsUY1EIFApjLvBTzJMwF",
      audience: "https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/",
    }),
  };
  const response = await axios(option);
  // console.log(response.data);
  return response.data;
};

const getUserInfo = async (req, res, next) => {
  const userInfoUrl =
    "https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/users/" + req.auth.sub;
  const accessToken = await getAccessToken();
  const response = await axios.get(userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken.access_token}`,
    },
  });
  // console.log(response.data);
  return response.data;
};
