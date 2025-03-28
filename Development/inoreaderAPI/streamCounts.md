This method returns the articles for a given collection. There are two major methods here:

https://www.inoreader.com/reader/api/0/stream/contents - returns JSON object
https://www.inoreader.com/reader/atom - Returns Atom feed with the same structure as the JSON object.
The latter one is used for compatibility purposes. It's always adviseable to use the JSON method and that's why it will be documented here exclusively.

Request:

https://www.inoreader.com/reader/api/0/stream/contents/[streamId]

Request parameters:

n - Number of items to return (default 20, max 100).

r - Order. By default, it is newest first. You can pass o here to get oldest first.

ot - Start time (unix timestamp) from which to start to get items. If r=o and the time is older than one month ago, one month ago will be used instead.

xt - Exclude Target - You can query all items from a feed that are not flagged as read by setting this to user/-/state/com.google/read.

it - Include Target - You can query for a certain label with this. Accepted values: user/-/state/com.google/starred, user/-/state/com.google/like.

c - Continuation - a string used for continuation process. Each response returns not all, but only a certain number of items. You'll find in the JSON response a string called continuation. Just add that string as argument for this parameter, and you'll retrieve next items. If the continuation string is missing, then you are at the end of the stream.

output - if you prefer JSON object pass json here. Note that reader/api/0/stream/contents always returns json object, while reader/atom returns XML by default.

includeAllDirectStreamIds - set this to false if you want to receive only manually added tags in the categories list. Otherwise automatically added tags from the folders will be populated there too.

annotations - set this to 1 or true if you want to get an array of your annotations for each article.

streamId is not a parameter. It is appended to the URL, but it's important to URL encode it first. See Stream IDs.

Example requests:

Get the unread articles from Ars Technica Science feed:

https://www.inoreader.com/reader/api/0/stream/contents/feed%2Fhttp%3A%2F%2Ffeeds.arstechnica.com%2Farstechnica%2Fscience1&xt=user/-/state/com.google/read

Get the oldest articles from Google folder:

https://www.inoreader.com/reader/api/0/stream/contents/user%2F-%2Flabel%2FGoogle?r=o

Example response:

{
   "direction":"ltr",
   "id":"user\/-\/state\/com.google\/annotated",
   "title":"Annotated",
   "description":"",
   "self":{
      "href":"https:\/\/www.inoreader.com\/reader\/api\/0\/stream\/contents\/"
   },
   "updated":1618212570,
   "updatedUsec":"1618212570146918",
   "items":[
      {
         "crawlTimeMsec":"1618211779000",
         "timestampUsec":"1618211779000000",
         "id":"tag:google.com,2005:reader\/item\/0000000693c3bc0c",
         "categories":[
            "user\/1005921515\/state\/com.google\/reading-list",
            "user\/1005921515\/state\/com.google\/read",
            "user\/1005921515\/label\/Tech"
         ],
         "title":"Windows and Linux devices are under attack by a new cryptomining worm",
         "published":1617969599,
         "updated":1617990787,
         "canonical":[
            {
               "href":"https:\/\/arstechnica.com\/?p=1755573"
            }
         ],
         "alternate":[
            {
               "href":"https:\/\/arstechnica.com\/?p=1755573",
               "type":"text\/html"
            }
         ],
         "summary":{
            "direction":"ltr",
            "content":"\u003Cdiv\u003E \n\u003Cimg src=\u0022https:\/\/cdn.arstechnica.net\/wp-content\/uploads\/2021\/04\/enterprise-server-800x545.jpeg\u0022 alt=\u0022Windows and Linux devices are under attack by a new cryptomining worm\u0022\u003E\u003Cp style=\u0022font-size:.8em;\u0022\u003E\u003Ca href=\u0022https:\/\/cdn.arstechnica.net\/wp-content\/uploads\/2021\/04\/enterprise-server.jpeg\u0022\u003EEnlarge\u003C\/a\u003E (credit: Getty Images)\u003C\/p\u003E  \u003Cdiv\u003E\u003Ca\u003E\u003C\/a\u003E\u003C\/div\u003E \n\u003Cp\u003EA newly discovered cryptomining worm is stepping up its targeting of Windows and Linux devices with a batch of new exploits and capabilities, a researcher said.\u003C\/p\u003E \n\u003Cp\u003EResearch company Juniper started monitoring what it’s calling the Sysrv botnet in December. One of the botnet’s malware components was a worm that spread from one vulnerable device to another without requiring any user action. It did this by scanning the Internet for vulnerable devices and, when found, infecting them using a list of exploits that has increased over time.\u003C\/p\u003E \n\u003Cp\u003EThe malware also included a cryptominer that uses infected devices to create the Monero digital currency. There was a separate binary file for each component.\u003C\/p\u003E\u003C\/div\u003E\u003Cp\u003E\u003Ca href=\u0022https:\/\/arstechnica.com\/?p=1755573#p3\u0022\u003ERead 11 remaining paragraphs\u003C\/a\u003E | \u003Ca href=\u0022https:\/\/arstechnica.com\/?p=1755573\u0026amp;comments=1\u0022\u003EComments\u003C\/a\u003E\u003C\/p\u003E"
         },
         "author":"Dan Goodin",
         "likingUsers":[

         ],
         "comments":[

         ],
         "commentsNum":-1,
         "annotations":[
            {
               "id":1126412668,
               "start":402,
               "end":548,
               "added_on":1618211779,
               "text":"It did this by scanning the Internet for vulnerable devices and, when found, infecting them using a list of exploits that has increased over time.",
               "note":"Check your firewall!",
               "user_id":1005921515,
               "user_name":"Yordan Yordanov",
               "user_profile_picture":"https:\/\/www.inoreader.com\/cdn\/profile_picture\/1005921515\/T9zu6Ay6MqMT?s=128"
            }
         ],
         "origin":{
            "streamId":"feed\/http:\/\/feeds.arstechnica.com\/arstechnica\/gadgets",
            "title":"Ars Technica » Gear \u0026 Gadgets",
            "htmlUrl":"http:\/\/arstechnica.com\/"
         }
      }
   ],
   "continuation":"gmMZgKmmqI4U"
}
Description of the items list:
crawlTimeMsec and timestampUsec are the same date, the first with milisecond, the second with microsecond resolution. Use timestampUsec whenever possible, because we need microsecond resultion.
id is the ID of the article. This is coming in the long id format. See Article ID formats.
categories is a list of properties for the article. Those can be:
user/-/state/com.google/reading-list - it's a system tag. All articles from subscribed feeds have this.
user/-/state/com.google/read - this article has been read
user/-/state/com.google/starred - this article has been starred
user/-/state/com.google/broadcast - this article has been broadcasted
user/-/state/com.google/like - this article has been liked
user/-/label/tag_name - a tag with this name has been assigned to this article (note that articles in feeds that are assigned to folders will automatically receive the folder tag here.
title is the article title.
published is the published date for the article. This date is gathered from the publisher and may only be used for display purposes.
updated is set if the article was updated after it was fetched and represents the updated timestamp.
canonical.href is the article URL.
summary.direction is the detected direction (ltr or rtl) of the article content.
summary.content is the actual article content in HTML format.
author is the article author and can be empty in some cases.
origin.streamId is the originating feedId of the article.
origin.title is the feed title.