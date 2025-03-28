This method is used to fetch the unread counters for folders, tags and feeds.

Request:

https://www.inoreader.com/reader/api/0/unread-count

Response:

{
  max: "1000",
  unreadcounts: [{
    id: "user/1005921515/state/com.google/reading-list",
    count: 4,
    newestItemTimestampUsec: "1415620910006331"
  }, {
    id: "user/1005921515/state/com.google/starred",
    count: 5,
    newestItemTimestampUsec: "1415620910006331"
  }, {
    id: "user/1005921515/label/Animation",
    count: 0,
    newestItemTimestampUsec: "1415620910006331"
  }, {
    id: "user/1005921515/label/CAN READ",
    count: 0,
    newestItemTimestampUsec: "1415620910006331"
  }]
}
max shows the maximum counter value for the current user. It can vary for different users (Free, Pro), so you should always check it. If count == max, then you should append + to the displayed counter, like 1000+.
id shows the stream ID, which can be feed of folder. user/-/state/com.google/reading-list is a functional tag, which shows the total number of unread articles for the currently logged user.
newestItemTimestampUsec is the timestamp (in microseconds) of the latest article in this section.