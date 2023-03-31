// import { auth } from 'express-oauth2-jwt-bearer';
// import { OAuth2Bearer as OAuth2 } from 'express-oauth2-bearer';
// import axios from 'axios';
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export const isAuthenticated = jwt({
  algorithms: ['RS256'],
  audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/',
  issuer: `https://dev-0rubju8i61qqpmgv.us.auth0.com/`,
  secret: 'RXn0GvIfMUKVcW2WuOXMNazcuKuNFjLrKNOt2OkUFDRPPaBP_A4wYvhm_Ku_r4tY',
  // audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/',
  // issuer: `https://dev-0rubju8i61qqpmgv.us.auth0.com/`,
  // secret: 'RXn0GvIfMUKVcW2WuOXMNazcuKuNFjLrKNOt2OkUFDRPPaBP_A4wYvhm_Ku_r4tY',
  // getToken: function(req) {
  //   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  //       return req.headers.authorization.split(' ')[1];
  //   }
  //   return null;
  // }
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/.well-known/jwks.json'
  }),

  // Validate the audience and the issuer.
  // audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/',
  // issuer: `https://dev-0rubju8i61qqpmgv.us.auth0.com/`,
  // algorithms: ['RS256']
});

// // Authorization middleware. When used, the Access Token must
// // exist and be verified against the Auth0 JSON Web Key Set.

// export const isAuthenticated = auth({
//   // audience: 'dev-0rubju8i61qqpmgv.us.auth0.com',
//   audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/',
//   // audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/userinfo',
//   issuerBaseURL: `https://dev-0rubju8i61qqpmgv.us.auth0.com`,
//   algorithms: ['RS256'], // specify the algorithm(s) used for token verification
//   jwks: {                 // provide the public key(s) of the issuer
//     url: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/.well-known/jwks.json',
//     cache: true,
//     rateLimit: true
//   }
//   // clientId: 'dibFRURk5XSOdzcA66JIBCs4n38zwein',
//   // cookie: '_legacy_auth0.dibFRURk5XSOdzcA66JIBCs4n38zwein.is.authenticated',

// });

// import { auth } from 'express-oauth2-jwt-bearer';

// // Authorization middleware. When used, the Access Token must
// // exist and be verified against the Auth0 JSON Web Key Set.

// export const isAuthenticated = auth({
//   // audience: 'dev-0rubju8i61qqpmgv.us.auth0.com',
//   audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/',
//   // audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/userinfo',
//   issuerBaseURL: `https://dev-0rubju8i61qqpmgv.us.auth0.com`,
//   algorithms: ['RS256'], // specify the algorithm(s) used for token verification
//   introspectionEndpoint: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/oauth2/introspect',
//   clientID: 'dibFRURk5XSOdzcA66JIBCs4n38zwein',
//   clientSecret: 'RXn0GvIfMUKVcW2WuOXMNazcuKuNFjLrKNOt2OkUFDRPPaBP_A4wYvhm_Ku_r4tY'
// });



// // Authorization middleware. When used, the Access Token must
// // exist and be verified against the Auth0 JSON Web Key Set.

// export const isAuthenticated = OAuth2Bearer({
//   introspect: async (token) => {
//     const introspectionEndpoint = 'https://dev-0rubju8i61qqpmgv.us.auth0.com/oauth2/introspect';

//     const response = await axios.post(introspectionEndpoint, {
//       token: token,
//     });

//     if (response.data.active) {
//       return response.data;
//     } else {
//       throw new Error('Token is not active');
//     }
//   },
// });


