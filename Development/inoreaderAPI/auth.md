User authentication via OAuth 2.0
OAuth 2.0 logo
OAuth 2.0 is the most widely used and secure method for authenticating 3rd party applications nowadays. It looks a bit complicated at first, but it's quite straightforward and consistent across most applications that use it.

In contrast with the ClientLogin method, OAuth doesn't require the end user to enter his credentials outside of Inoreader. Instead your application redirects him to a special consent page hosted on Inoreader's end where he can chose to authorize your application. When he does, you receive an access token and refresh token and you can start to make API requests with them. Read more about the process below:

Be sure to first register your app, so you can get the needed credentials required to proceed.

Consent page redirection
To initiate the OAuth flow, you must first redirect the user to the consent page for authorization of your app. For example you do this when the user presses a button labeled Sign in with Inoreader. Here's the URL you should redirect to:

https://www.inoreader.com/oauth2/auth?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT_URI]&response_type=code&scope=[OPTIONAL_SCOPES]&state=[CSRF_PROTECTION_STRING]
Parameters:

CLIENT_ID - Replace this with the Client ID that you got when registering your app.
REDIRECT_URI - This is the address that the user will be redirected to when he authorizes your application from the consent page. It should match the one set in your application registration settings and it should be URL encoded.
OPTIONAL_SCOPES - You can pass read or read write (URL encoded) here in order to have read-only or read/write capabilities. Only request what your app needs. The user will be informed on the consent screen what permissions your app is requesting. You can leave this parameter empty to use the defined scope from your application registration settings. If you set "Read only" in your app settings, you will not be able to request the write scope. The API is divided into two zones. Zone 2 requires read/write permissions. Read more about zones in rate limiting.
CSRF_PROTECTION_STRING - Up to 500 bytes of arbitrary data that will be passed back to your redirect URI. This parameter should be used to protect against cross-site request forgery (CSRF). Save this string on your end so you can compare it later.
Upon successful redirection, your user will see a page similar to this:

Authorization consent screen

After the user authorizes your application, their browser will be redirected to your defined redirect URI with two added parameters:

https://yourredirecturi.com/?code=[AUTHORIZATION_CODE]&state=[CSRF_PROTECTION_STRING]
Obtaining access and refresh tokens
There are no more browser redirects. From now on, all requests should be made through your backend.

First check that CSRF_PROTECTION_STRING matches that one that you send during the consent page redirection. If it doesn't match, then the request is suspicious and you should not continue. Show an error message to the user and ask them to try again.

Get the AUTHORIZATION_CODE and immediately exchange it for access and refresh tokens by sending a POST request to the following address:

https://www.inoreader.com/oauth2/token
Request:
POST /oauth2/token HTTP/1.1
Host: www.inoreader.com
Content-length: 217
Content-type: application/x-www-form-urlencoded
User-agent: your-user-agent

code=[AUTHORIZATION_CODE]&redirect_uri=[REDIRECT_URI]&client_id=[CLIENT_ID]&client_secret=[CLIENT_SECRET]&scope=&grant_type=authorization_code
You can get CLIENT_SECRET from your application registration settings.
Please do not forget to include the Content-type header!

Response:
{
  "access_token": "[ACCESS_TOKEN]", 
  "token_type": "Bearer", 
  "expires_in": [EXPIRATION_IN_SECONDS], 
  "refresh_token": "[REFRESH_TOKEN]", 
  "scope": "read"
}
Save ACCESS_TOKEN and REFRESH_TOKEN into your database. Save the timestamp that you get when adding EXPIRATION_IN_SECONDS to the current time in your database too.

You will need to add the ACCESS_TOKEN to the headers of all further API requests like this:

Authorization: Bearer [ACCESS_TOKEN]
Sample request:
GET /reader/api/0/user-info HTTP/1.1
Host: www.inoreader.com
Content-length: 0
Authorization: Bearer ecd53979fc1917b66b16cd2c65f305943ed386f0
Refreshing an access token
All access tokens will eventually expire. In order to continue using the API, you need to refresh your expired access tokens from time to time. You should check the validity of your access token before every request and refresh it if necessary. If you are using a ready-made OAuth library, it should be able to do that for you.

To refresh an access token, send a POST request to the /oauth2/token endpoint like this:

Request:
POST /oauth2/token HTTP/1.1
Host: www.inoreader.com
Content-length: 147
content-type: application/x-www-form-urlencoded
user-agent: your-user-agent

client_id=[CLIENT_ID]&client_secret=[CLIENT_SECRET]&grant_type=refresh_token&refresh_token=[REFRESH_TOKEN]
Response:
{
  "access_token": "[ACCESS_TOKEN]", 
  "token_type": "Bearer", 
  "expires_in": [EXPIRATION_IN_SECONDS], 
  "refresh_token": "[REFRESH_TOKEN]", 
  "scope": "read"
}
Done
From here on, the process repeats. Remember to always include your access token to all subsequent API requests.

Authorization: Bearer [ACCESS_TOKEN]
Google OAuth 2.0 Playground
You can try our API before writing a single line of code by using the Google OAuth 2.0 Playground web application.

Open the gear menu to configure our endpoint:

Google OAuth 2.0 Playground configuration

OAuth flow - Leave it to Server-side
OAuth endpoints - Set to Custom
Authorization endpoint - Paste https://www.inoreader.com/oauth2/auth?state=test
Token endpoint - Paste https://www.inoreader.com/oauth2/token
Access token location - Leave it to Authorization header w/ Bearer prefix
OAuth Client ID - Fill in your client ID from your application registration settings
OAuth Client Secret - Fill in your client secret from your application registration settings
On the left under Step 1, enter read or read write. Do not select any of the predefined scopes! Then hit the Authorize APIs button. This should redirect to the consent page when you should Authorize your app. This will get you to Step 2 - Exchange authorization code for tokens. In the left pane, click the Exchange authorization code for tokens button without modifying the Authorization code. Watch the Request / Response flow in the right pane. Couple of seconds later Step 3 should become active.

Now you can test any of our API endpoints by using OAuth. For example paste https://www.inoreader.com/reader/api/0/user-info as Request URI. You should get a 200 OK response with a JSON containing information about the current user.

Google OAuth 2.0 Playground success

You can go back at any time to Step 2 to see how refreshing access tokens work.

That's it! Have fun with OAuth.