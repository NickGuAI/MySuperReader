This method is used to follow feeds.

Request:

https://www.inoreader.com/reader/api/0/subscription/quickadd

Request parameters:

quickadd - feedId to follow to, e.g. feed/http://feeds.arstechnica.com/arstechnica/science
Response:

Unlike most other POST methods, this one returns a JSON object:

{
  query: "feed/http://feeds.arstechnica.com/arstechnica/science",
  numResults: 1,
  streamId: "feed/http://arstechnica.com/",
  streamName: "Ars Technica » Scientific Method"
}
numResults will be 0 if the feed is not added for some reason. It will be 1 when feed is added, even if the user is already subscribed.