### manifest.json
basic structure/initialization of the extension

# popup
### widget.html
static widget html page loaded as popup whenever extension icon is clicked
### widget.css
style of the widget
### widget.js
functionality of the widget. All actions performed occur within the widget.html page
### stats.html
page that widget will redirect to on button click to show stats/progress/rewards/etc...?
# content_scripts
### block.js
widget.js can call fucntions in this file. This file interacts with page user is on. NOT the widget page popup
# icons
where the extension icons are stored
