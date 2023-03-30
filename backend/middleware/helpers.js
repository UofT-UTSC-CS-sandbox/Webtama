import { auth } from 'express-oauth2-jwt-bearer';

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.

export const isAuthenticated = function (req, res, next) {
  // verify authentication with checkJwt
  console.log(req.headers['authorization']);
  try {
    auth({
      // audience: 'dev-0rubju8i61qqpmgv.us.auth0.com',
      // audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/',
      audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/userinfo',
      issuerBaseURL: `http://localhost:4200/`,
      // cookie: '_legacy_auth0.dibFRURk5XSOdzcA66JIBCs4n38zwein.is.authenticated',
    })(req, res, next);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Not authorized' });
  }

};
