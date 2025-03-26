Article IDs can be returned in short or long form depending on the API method.

Long form: The prefix tag:google.com,2005:reader/item/ followed by the ID as an unsigned base 16 number that is 0-padded so that it's always 16 characters wide.
Short form: The ID as a signed base 10 number.
Here's some sample mappings between the two forms:

Long form	Short form
tag:google.com,2005:reader/item/00000000148b9369	344691561
tag:google.com,2005:reader/item/00000000148b383e	344668222
tag:google.com,2005:reader/item/00000000148b3841	344668225
