Feeds and folders are manually sorted via the so-called sort IDs. They are 8-character strings consisting of hex characters. Sort IDs are present in the subscription list and folder/tag list methods. The items that are returned via those methods are not sorted, so you should use the sort IDs to find the desired order.

To do so, you need to first fetch the stream preference list.

The subscription-ordering pair for each folder is what you need. Get the value and split on each 8th character. You will get a list with sort IDs in the desired order. You can then iterate over those IDs and place the feeds/folders in the correct order.

For example this string:

0018292200233381002094C100085B3A00007D1E000CAA76000859980000BD680000165D00016D1E001CE9620000BCB30011C20C000154F60001AB4D00127963001F609E0022AA500022C9D000215FEA002267B300064FD7003F4DFC`
Is broken down into the following IDs:

Result
00182922
00233381
002094C1
00085B3A
00007D1E
000CAA76
00085998
0000BD68
0000165D
00016D1E
001CE962
0000BCB3
0011C20C
000154F6
0001AB4D
00127963
001F609E
0022AA50
0022C9D0
00215FEA
002267B3
00064FD7
003F4DFC