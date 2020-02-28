// TODO: make this a .json?

var toBeBlocked = ["www.facebook.com", "www.youtube.com", "www.instagram.com"];
var blocklist = [];
for(let i = 0; i < toBeBlocked.length; i++) {
    let item = {site: toBeBlocked[i], time: 0};
    blocklist.push(item);
}

var jsonString= JSON.stringify(blocklist);
window.alert("HERE");
window.alert(jsonString);
// window.alert(JSON.parse(jsonString));
window.alert("Now here");

function compareURL(blocklist) {
    var loc = window.location.hostname;

    var blocklistLength = blocklist.length;

    var i;
    for(i = 0; i < blocklistLength; i++) {
        if(loc.localeCompare(blocklist[i].name) == 0) {
            block();
            break;
        }
    }
}

function block() {
    window.stop();

    // Option 1: black out site
    document.body.style.border = "10000px solid #2F4F4F";

    window.alert("This page might be distracting...\nYou have __ minutes left");

    document.body.style.border = "0px solid #2F4F4F";

    // Option 2: redirect to our own page with some message
    // window.location.replace("https://ix.cs.uoregon.edu/~nzt/");

    // Option 3: Popup Message / Warning
    // window.alert("Nice Try Bud");
}

// Use this for prints/debugging for now
// window.alert("Hello World");

compareURL(blocklist);

// Save data to the current local store
// localStorage.setItem("username", "John");

// Access some stored data
// window.alert("username = " + localStorage.getItem("username"));
