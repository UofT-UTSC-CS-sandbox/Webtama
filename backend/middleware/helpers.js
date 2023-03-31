import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export const isAuthenticated = jwt({
  algorithms: ['RS256'],
  audience: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/',
  issuer: `https://dev-0rubju8i61qqpmgv.us.auth0.com/`,
  secret: 'RXn0GvIfMUKVcW2WuOXMNazcuKuNFjLrKNOt2OkUFDRPPaBP_A4wYvhm_Ku_r4tY',
  
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-0rubju8i61qqpmgv.us.auth0.com/.well-known/jwks.json'
  }),

});