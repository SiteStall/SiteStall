var blocklist = ["www.facebook.com", "www.youtube.com", "www.instagram.com"];

function compareURL(blocklist) {
    var loc = window.location.hostname;

    var blocklistLength = blocklist.length;

    var i;
    for(i = 0; i < blocklistLength; i++) {
        if(loc.localeCompare(blocklist[i]) == 0) {
            block();
            break;
        }
    }
}

function block() {
    window.stop();

    // Option 1: black out site
    // document.body.style.border = "10000px solid #2F4F4F";

    // Option 2: redirect to our own page with some message
    window.location.replace("https://ix.cs.uoregon.edu/~nzt/");

    // Option 3: Popup Message / Warning
}

// Use this for prints/debugging for now
// window.alert("Hello World");

compareURL(blocklist);
