There are some system tags and other similar places where user ID is present. Examples:

user/1005921515/label/Testing
user/1005921515/state/com.google/root
user/1005921515/state/com.google/read
When you need to pass those back to the API, you can safely replace the user ID with -. This way you don't have to worry about parametrizing your request parameters.

For example user/1005921515/label/Testing becomes user/-/label/Testing.