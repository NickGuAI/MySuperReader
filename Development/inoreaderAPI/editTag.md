This method is a lot more complex than Rename tag and Delete tag. It is used to assign tags to articles. Not only user-created tags, but also system ones. For example it is used to mark articles as read, or to star them.

Request:

POST https://www.inoreader.com/reader/api/0/edit-tag

Request parameters:

a - tag to add
r - tag to remove
i - item ID. Can accept two types of values (see Article ID formats), whichever you prefer:
tag:google.com,2005:reader/item/1234567890
1234567890 (shortened ID, preferred as it saves bandwidth)
Additionally i can be an array of IDs instead of a scalar value, so you can tag multiple items at once

List of system tags:

user/-/state/com.google/read - mark/unmark this article as read. Note that articles with timestampUsec older than firstitemmsec of its feed cannot be marked as unread. The API will silently ignore this request.
user/-/state/com.google/starred - Add/Remove star (favorite) to the article.
user/-/state/com.google/broadcast - Broadcast article.
user/-/state/com.google/like - Like article.
user/-/label/tag_name - add custom tag.
Examples:

This will mark two articles as read in one request:

https://www.inoreader.com/reader/api/0/edit-tag?a=user/-/state/com.google/read&i=12345678&i=12345679

This will mark two articles as unread and will add test tag to them:

https://www.inoreader.com/reader/api/0/edit-tag?r=user/-/state/com.google/read&a=user/-/label/com.google/test&i=12345678&i=12345679

Response:

OK