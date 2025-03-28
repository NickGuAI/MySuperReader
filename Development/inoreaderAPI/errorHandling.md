The API is designed to return valid HTTP codes for easier error handling as well as error messages when needed. For example a 401 code means that the request is not authorized.

You should generally test all your responses for a 401 HTTP response. If you encounter such response, you should forcibly sign-out the current user and show him/her a message:

Your session has expired! Please Sign In again.

There are some API methods, which return a meaningful error message in the response body, which is formatted in the following way:

Error=Error message

In such cases it's a good practice to strip out the Error= part and show the actual error to the user, but this depends on the actual use case.

For example if you encounter an error code during Sign-In or Registration process, you should show the error message to the user, e.g. if you receive Error=Please enter password, you should show Please enter password.

List of HTTP codes
Code	Description
200	Request OK
400	Mandatory parameter(s) missing
401	End-user not authorized
403	You are not sending the correct AppID and/or AppSecret
404	Method not implemented
429	Daily limit reached for this zone
503	Service unavailable