Final project &ndash; A personal blogging system &ndash; Group Five
==========
## NOTES: 
-----------------------------
> Caution

There is no need to execute sql and initialize the database if it is not necessary.
Some relative data like article details is not inserted directly!

> Set up 

When doing npm install: Setup for Windows, the two sqlite npm packages are needed.
 
If you do npm install without any vulnerability, but run 'node app.js' have such error:

(Error: Cannot find module 'pathname\node_modules\bcrypt\lib\binding\napi-v3\bcrypt_lib.node')
 
Try to run: 'npm rebuild bcrypt', and then run 'node app.js' again.

>Existing users in system

(*username: bb02, plaintext password: 12345678*) 

(*username: Zoey, plaintext password: 11111111*) 

**Tasks:**
-----------------------------
Each of group members worked on both the front-ed and back-end for their own pages.
 - Zhuoran Zhang: is responsible for Homepage and WYSIWYG pages
 - Zeyuan Chen: is responsible for Login and Sign in pages.
 - Yikuan Tu: is responsible for ArticleDetail page. 
