import { signout } from './auth-api.js';

const auth = {
  isAuthenticated() {
    if (typeof window == 'undefined') return false;

    if (sessionStorage.getItem('jwt'))
      return JSON.parse(sessionStorage.getItem('jwt'));
    else return false;
  },
  authenticate(jwt, cb) {
    if (typeof window !== 'undefined')
      sessionStorage.setItem('jwt', JSON.stringify(jwt));
    cb();
  },
  clearJWT(cb) {
    if (typeof window !== 'undefined') sessionStorage.removeItem('jwt');
    cb();
    signout().then((data) => {
      document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
  },
};

//  This clearJWT  removes the JWT credential from sessionStorage. 
//The passed in cb() function allows the component initiating
// the signout functionality to dictate what should happen after a successful sign-out. 
// The clearJWT method also uses the signout method we defined earlier in api-auth.js to call the signout API in
// the backend. If we had used cookies to store the credentials 
// of sessionStorage, the response to this API call would be where
// we clear the cookie, as shown in the preceding code. Using the signout API call is
// optional since this is dependent on whether cookies are used as the credential storage
// mechanism

export default auth;
