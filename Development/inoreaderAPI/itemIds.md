This method is used to return only the article ids for a given stream. It's useful if you want to check if certain articles match a given query, but you don't want to get the full content.

For example, you might want to get the most recently read article IDs from the server, so you can update the internal database with read states.
Please always use this method for such purposes instead of stream contents, because it is a lot lighter for our backend and transfers a lot less data over the wire.

Request:

https://www.inoreader.com/reader/api/0/stream/items/ids

Request parameters:

n - Number of items to return (default 20, max 1000).
r - Order. By default, it is newest first. You can pass o here to get oldest first.
ot - Start time (unix timestamp) from which to start to get items. If r=o and the time is older than one month ago, one month ago will be used instead.
xt - Exclude Target - You can query all items from a feed that are not flagged as read by setting this to user/-/state/com.google/read.
it - Include Target - You can query for a certain label with this. Accepted values: user/-/state/com.google/read, user/-/state/com.google/starred, user/-/state/com.google/like.
c - Continuation - a string used for continuation process. Each response returns not all, but only a certain number of items. You'll find in the JSON response a string called continuation. Just add that string as argument for this parameter, and you'll retrieve next items.
output - if you prefer JSON object pass json here. Note that reader/api/0/stream/contents always returns json object, while reader/atom returns XML by default.
s - Stream ID. See Stream IDs.
includeAllDirectStreamIds - pass false (not 0) to exclude the folder tags for articles.
Response:

{
  items: [],
  itemRefs: [
    {
      id: "3614359203",
      directStreamIds: [
"user/1005921515/label/MTB"
],
      timestampUsec: "1416313130505268"
},
    {
      id: "3614347074",
      directStreamIds: [
"user/1005921515/label/MUST READ"
],
      timestampUsec: "1416313031906359"
},
    {
      id: "3614347075",
      directStreamIds: [
"user/1005921515/label/MUST READ"
],
      timestampUsec: "1416313031906358"
}
],
  continuation: "aDRTXr1ek6qT"
}