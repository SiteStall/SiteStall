function compareURL(blocklist) {
    var loc = window.location.hostname;

    var blocklistLength = blocklist.length;
    for(let i = 0; i < blocklistLength; i++) {
        if(loc.localeCompare(blocklist[i].site) == 0) {
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

var printStorageInfo = 1;

function saveWebsites() {
    window.alert(JSON.stringify(blocklist));
    listAsString = JSON.stringify(blocklist)

    localStorage["websitesList"] = listAsString;

    var saveString = "Saving the following websites to local storage:\n"
    for (let i = 0; i < blocklist.length; i++) {
        saveString = saveString.concat('\tname: ', blocklist[i].site, '\ttime: ', blocklist[i].time, '\n');
    }

    if (printStorageInfo) {  // change to 0 to not print this
        window.alert(saveString);
        console.log(saveString);
    }
}

function getWebsites() {
    
    var storedNames = localStorage["websitesList"];
    window.alert(localStorage["websitesList"]);
    

    if(storedNames != null) {

        storedNames = JSON.parse(storedNames);

        var websitesRead = "The following websites were retrieved: \n"
        for (let i = 0; i < storedNames.length; i++) {
            websitesRead = websitesRead.concat("\tname: ", storedNames[i].site, "\ttime: ", storedNames[i].time, '\n');
        }

        if (printStorageInfo) {  // change to 0 to not print this
            window.alert(websitesRead);
            console.log(websitesRead);
        }

        return storedNames;
    }
    else {
        // TODO: create empty blocklist object if "websiteList" doesnt exist
        // TODO: right now I'm just creating a default below
        window.alert("No blocklist stored\n(using temporary default for now)");
        var tempToBeBlocked = ["www.facebook.com", "www.youtube.com", "www.instagram.com", "slither.io"];
        var tempBlocklist = [];
        for(let i = 0; i < tempToBeBlocked.length; i++) {
            let item = {site: tempToBeBlocked[i], time: 0};
            tempBlocklist.push(item);
        }
        // var jsonString= JSON.stringify(blocklist);
        return tempBlocklist;
    }
}


var blocklist = getWebsites();
compareURL(blocklist);
saveWebsites();

