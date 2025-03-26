This method is mainly used to save custom feed ordering if such functionality is incorporated in the client.

Request:

POST https://www.inoreader.com/reader/api/0/preference/stream/set

Request parameters:

s - Stream ID
user/-/state/com.google/root - This is the root level
user/-/label/MIT - Folder named MIT
k - Key. Only accepted is subscription-ordering
v - Value. for subscription-ordering this is concatenated string from subscriptions and folders Sort IDs. They should be concatenated in the desired order.
Response:

OK