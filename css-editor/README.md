# CSS Editor

I've created this tool to manage long CSS files.

I have to admit that working with long CSS files is troublesome. Going up and down, again and again, to make changes and figuring out which lines relate to which page or section is really tiring.

To make things easier, I usually seperate the lines with comments (e. g. `/* ===== HEADER ===== */`) that indicates what the below lines/styles are about. But as the lines increase, this doesn't really help much. Again, I wanted to make this more easier. So I came up with the idea of a CSS Editor that splits the CSS file by these comments/sections. And I'm loving it so far.

Remember to use `=` in the section seperator (comment), because we need to differentiate section header `/* ===== SOME-SECTION-NAME ===== */` from a normal comment (both comment `/* arbitrary commment here */` and disabled style `/* width: 600px; */`).

This (`=`) is important when importing/parsing CSS, and the number of `=` doesn't matter. There has to be some. If you're creating your CSS from scratch using the editor, you don't have to worry about the seperators. They will be added automatically when exported (copy button at top right).