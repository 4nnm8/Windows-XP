If you're interested, you're help is welcome :)
Sorry I'm french so the interface is writen this way (but the code is in english)
The code is actually a mess so I try to organize and clean it so people car participate more easily

TO DO LIST :

* Check if the URL to a program exists before opening it
* Avoid inline png files (data:image/png;base64...) and make CSS sprites for each icon size (16,24,32,48)
* Allow to drag multiple icons at one time
* Create popups to confirm / cancel actions (like deleting a file)
* Allow copy/paste and drag 'n drop files from a folder to another (like the trash for start)
* Maybe don't use IFRAME but Web Components for Programs
* Add context menu to programs in taskbar (close, minimize, maximize)
* Make a file explorer
* Allow all the actions on icons (select with cursor, copy, paste, rename) on other workspaces (not just desktop)
* Add proper sounds to all actions
* Add proper fonts
* Prevent resizing windows too small
* When copying a file or a folder, add a number to avoid same name ("Image.jpg" > "Image (1).jpg", etc)
* Merge all mousemove events because we need them often
* Be able to create a new file or new folder with context menu (and being able to open that new folder or file)
* Link filetype to programs so we can open files with programs (won't be easy with cross-origin programs)
* Make a save state of the desktop (HARD)
