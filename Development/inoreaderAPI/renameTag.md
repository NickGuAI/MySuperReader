This method is used to rename tags and folders

Request:

POST https://www.inoreader.com/reader/api/0/rename-tag

Request parameter:

s - Source name
dest - Target name
Please note that you should post the full tag name in s, like user/-/label/Tech and dest cannot contain forward slashes (they are forbidden in folder names).

Response:

OK