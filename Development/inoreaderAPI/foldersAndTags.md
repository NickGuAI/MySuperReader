This method fetches the current folders and tags for the user

Request:

https://www.inoreader.com/reader/api/0/tag/list

Parameters:

types - set to 1 to get the item type. Can be tag, folder or active_search
counts - set to 1 to get unread counts for tags and active searches.
Response:

{
  tags: [
    {
      id: "user/1005921515/state/com.google/starred",
      sortid: "FFFFFFFF"
},
    {
      id: "user/1005921515/state/com.google/broadcast",
      sortid: "FFFFFFFE"
},
    {
      id: "user/1005921515/state/com.google/blogger-following",
      sortid: "FFFFFFFD"
},
    {
      id: "user/1005921515/label/Google",
      sortid: "BEBC2063",
      type: "tag",
      unread_count: 0,
      unseen_count: 0
},
    {
      id: "user/1005921515/label/DIY",
      sortid: "BECC0BE1",
      type: "folder"
},
    {
      id: "user/1005921515/label/Feedly active search",
      sortid: "BECC502C",
      type: "active_search",
      unread_count: 0,
      unseen_count: 0
}
]
}
id is the unique item id.
type is the unique item id.
unread_count is the number of unread items. Only applicable to tags and active searches.
unseen_count is the number of unseen items (new since last visit). Only applicable to tags and active searches.
type is the unique item id.
sortid is a ...sort ID. See Sort IDs for details.