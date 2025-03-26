This method is used to rename the feed, add it to a folder, remove it from folder or unfollow it. You can also follow and directly rename it and add it to folder via this method.

Request:

https://www.inoreader.com/reader/api/0/subscription/edit

Request parameters:

ac - Action. Can be edit, follow, or unfollow.
s - Stream ID, e.g. feed/http://feeds.arstechnica.com/arstechnica/science
t - Feed title. Omit this parameter to keep the title unchanged
a - Add feed to folder. Use full folder name like user/-/label/Tech
r - Remove feed from folder. Use full folder name like user/-/label/Tech
Response:

OK