// Constants.js
let prod = '';

let dev = 'http://localhost:5000';

export const serverUrl = process.env.REACT_APP_NODE_ENV === 'development' ? dev: prod;

let prodRedirectUri = "https://www.surveymaker.app/dashboard"

let devRedirectUri = "http://localhost:3000/dashboard"

export const redirectUri = process.env.REACT_APP_NODE_ENV === 'development' ? devRedirectUri: prodRedirectUri;

let prodLogoutUrl = 'https://www.surveymaker.app';

let devLogoutUrl = 'http://localhost:3000';

export const logoutUrl = process.env.REACT_APP_NODE_ENV === 'development' ? devLogoutUrl: prodLogoutUrl;