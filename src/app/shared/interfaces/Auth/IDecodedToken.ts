export interface IDecodedToken {
  // Common JWT claims (optional)
  exp?: number;
  iat?: number;

  // Microsoft role claim (as in your current code)
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;

  // NameIdentifier claim
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
}


