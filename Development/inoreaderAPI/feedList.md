his method fetches the current feeds for the logged user

Request:

https://www.inoreader.com/reader/api/0/subscription/list

Response:

{
    subscriptions: [{
        id: "feed/http://www.theanimationblog.com/feed/",
        title: "The Animation Blog.com | Est. 2007",
        categories: [{
            id: "user/1005921515/label/Animation",
            label: "Animation"
        }],
        sortid: "00DA6134",
        firstitemmsec: 1424501776942006,
        url: "http://www.theanimationblog.com/feed/",
        htmlUrl: "http://www.theanimationblog.com/",
        iconUrl: ""
    }, {
        id: "feed/http://amanita-design.net/blog/feed/",
        title: "Amanita Design Blog",
        categories: [{
            id: "user/1005921515/label/MUST READ",
            label: "MUST READ"
        }],
        sortid: "0136BF30",
        firstitemmsec: 1424330872170656,
        url: "http://amanita-design.net/blog/feed/",
        htmlUrl: "http://amanita-design.net/blog",
        iconUrl: "https://www.inoreader.com/cache/favicons/a/m/a/amanita-design_net_16x16.png"
    }, {
        id: "feed/http://gdata.youtube.com/feeds/base/users/failarmy/uploads?alt=rss&v=2&orderby=published&client=ytapi-youtube-profile",
        title: "Uploads by FailArmy",
        categories: [{
            id: "user/1005921515/label/YouTube",
            label: "YouTube"
        }],
        sortid: "00F54F6B",
        firstitemmsec: 1424502014872507,
        url: "http://gdata.youtube.com/feeds/base/users/failarmy/uploads?alt=rss&v=2&orderby=published&client=ytapi-youtube-profile",
        htmlUrl: "http://www.youtube.com/channel/UCPDis9pjXuqyI7RYLJ-TTSA/videos",
        iconUrl: "https://www.inoreader.com/cache/favicons/y/o/u/www_youtube_com_16x16.png"
    }, {
        id: "feed/http://gdata.youtube.com/feeds/base/users/gloveandboots/uploads?alt=rss&v=2&orderby=published&client=ytapi-youtube-profile",
        title: "Uploads by Glove and Boots",
        categories: [{
            id: "user/1005921515/label/YouTube",
            label: "YouTube"
        }],
        sortid: "00F54F5F",
        firstitemmsec: 1424502014872507,
        url: "http://gdata.youtube.com/feeds/base/users/gloveandboots/uploads?alt=rss&v=2&orderby=published&client=ytapi-youtube-profile",
        htmlUrl: "http://www.youtube.com/channel/UC1qC39KQoTG6LqgL_YnjSSQ/videos",
        iconUrl: "https://www.inoreader.com/cache/favicons/y/o/u/www_youtube_com_16x16.png"
    }, {
        id: "feed/http://dom.as/feed/",
        title: "domas mituzas",
        categories: [{
            id: "user/1005921515/label/Databases",
            label: "Databases"
        }, {
            id: "user/1005921515/label/MUST READ",
            label: "MUST READ"
        }],
        sortid: "009BC5E6",
        firstitemmsec: 1424501919304951,
        url: "http://dom.as/feed/",
        htmlUrl: "http://dom.as/",
        iconUrl: "https://www.inoreader.com/cache/favicons/d/o/m/dom_as_16x16.png"
    }, {
        id: "feed/http://artofdisney.canalblog.com/rss.xml",
        title: "The Art of Disney Animation",
        categories: [{
            id: "user/1005921515/label/MUST READ",
            label: "MUST READ"
        }, {
            id: "user/1005921515/label/Animation",
            label: "Animation"
        }],
        sortid: "00D42F97",
        firstitemmsec: 1424501776942006,
        url: "http://artofdisney.canalblog.com/rss.xml",
        htmlUrl: "http://artofdisney.canalblog.com/",
        iconUrl: "https://www.inoreader.com/cache/favicons/a/r/t/artofdisney_canalblog_com_16x16.png"
    }]
}
id is the feed identifier. Store this for future reference.
categories is a list with all folders that this feed is part of.
sortid is a ...sort ID. See Sort IDs for details
firstitemmsec is a timestamp (in microseconds). Articles with timestampUsec lower than this cannot be marked as unread. This is very important, because for such articles you shouldn't allow marking as unread. E.g. the button should be disabled or completely hidden.
url is the actual XML url of the feed.
htmlUrl is the link to the feed website.
iconUrl is the feed favion in 16x16 pixels