This method marks all items in a given stream as read. Please provide the ts parameter - unix timestamp, generated the last time the list stream was fetched and displayed to the user, so it won't mark as read items that the user never got.

Request:

https://www.inoreader.com/reader/api/0/mark-all-as-read

Request parameters:

ts - Unix Timestamp in seconds or microseconds.
s - Stream ID. See Stream IDs
Response:

OK