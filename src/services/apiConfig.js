// api/apiConfig.js

// Define your API base URL
export const API_BASE_URL = 'https://fabkw.com/';

// If your API requires authentication, you can define the authentication token here
// Replace 'YOUR_AUTH_TOKEN' with the actual token value


// TWILIO 
const ACCOUNT_SID = 'AC8f370cf9162a357dcdcc6b26e8cae742';
const AUTH_TOKEN = 'f39deb38d648e60679f8b03eab841ccf';
const SERVICE_SID = 'VA9965ca3fc61a7cfb7db003c6ffe74682';

export {
    ACCOUNT_SID,
    AUTH_TOKEN,
    SERVICE_SID
}


// Other common configurations can be defined here as well, for example:
// export const API_TIMEOUT = 10000; // Set a timeout for API requests
// export const API_VERSION = 'v1'; // API version to be used in the URL
// export const API_HEADERS = {
//   'Content-Type': 'application/json',
//   'Accept': 'application/json',
// };

// You can also define different environment configurations, for example:
// export const DEV_API_BASE_URL = 'https://dev.api.example.com';
// export const PROD_API_BASE_URL = 'https://api.example.com';

// You can conditionally select the base URL based on the environment (development, production, etc.) of your app
// For example:
// export const API_BASE_URL = __DEV__ ? DEV_API_BASE_URL : PROD_API_BASE_URL;
