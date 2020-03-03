// TODO: make this a .json?

var toBeBlocked = ["www.facebook.com", "www.youtube.com", "www.instagram.com", "slither.io"];
// blocklist = getWebsites(); // TODO: uncomment this to get websites

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

var printStorageInfo = 1;

function saveWebsites() {
    listAsString = JSON.stringify(blocklist)

    localStorage.setItem("websitesList", listAsString);

    var saveString = "Saving the following websites to local storage:\n"
    for (let i = 0; i < blocklist.length; i++) {
        saveString = saveString.concat('\tname: ', blocklist[i].site, '\ttime: ', blocklist[i].time, '\n');
    }

    if (printStorageInfo) {  // change to 0 to not print this
        window.alert(saveString);
    }
    console.log(saveString);
}

function getWebsites() {
    var storedNames = JSON.parse(localStorage.getItem("websitesList"));

    var websitesRead = "The following websites were retrieved: \n"
    for (let i = 0; i < storedNames.length; i++) {
        websitesRead = websitesRead.concat("\tname: ", storedNames[i].site, "\ttime: ", storedNames[i].time, '\n');
    }

    if (printStorageInfo) {  // change to 0 to not print this
        window.alert(websitesRead);
    }
    console.log(websitesRead);

    return storedNames;
}
saveWebsites();

