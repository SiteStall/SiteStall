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

/** Function: addWebsite()
 *      Adds a website to the block list. The current block list being used should be set equal
 *      to the return of this function, and the blocklist should be passed as an argument.
 *
 *  Args:
 *      url: The website url to add to the block list
 *      curBlockList: The current block list being used.
 *      checkDuplicates: checks to make sure the url from theSite is not already
 *                       in the blocklist. If == 1, do not add the duplicate.
 *                       If == 0, add theSite even if it is a duplicate.
 *      shouldSave: If == 1, automatically save the blocklist to local storage,
 *                  do nothing otherwise.
 *
 *  Returns:
 *      Returns curBlockList with theSite added to it if checkDuplicates == 1.
 */

function addWebsite(url, curBlockList, checkDuplicates=0, shouldSave=0) {
    // check to make sure the website is not already in the block list
    if (checkDuplicates) {
        var listLen = curBlockList.length;
        for (let i = 0; i < listLen; i++) {
            if (url.localeCompare(curBlockList[i].site) === 0) {
                //window.alert("WARNING: " + theSite + ' is already on the block list!');
                return curBlockList;
            }
        }
    }

    let item = {site: url, time: 0};
    curBlockList.push(item);

    if (shouldSave) {
        saveWebsites();
    }
    return curBlockList;
}

/** Function: removeWebsite()
 *      Removes a website to the block list. The current block list being used should be set equal
 *      to the return of this function, and the blocklist should be passed as an argument. To
 *      delete all websites from the list, pass 'all' into theSite argument.
 *
 *  Args:
 *      url: The website url to add to the block list
 *      curBlockList: The current block list being used.
 *      shouldSave: If == 1, automatically save the blocklist to local storage,
 *                  do nothing otherwise.
 *
 *  Returns:
 *      Returns curBlockList with theSite removed.
 */

function removeWebsite(url, curBlockList, shouldSave=0) {
    // removes a website from the blocklist. If theSite == 'all',
    // then remove all the websites in the list.

    var listLen = curBlockList.length;

    if (url.localeCompare("all") === 0) {
        curBlockList.splice(0);
        return curBlockList;
    }

    for (let i = 0; i < listLen; i++) {
        if (url.localeCompare(curBlockList[i].site) === 0) {
            curBlockList.splice(i, 1);
            //window.alert("deleted " + deleted);

            if (shouldSave) {
                saveWebsites();
            }
            return curBlockList;
        }
    }

    return curBlockList;
}

function saveWebsites() {
    window.alert(JSON.stringify(blocklist));
    listAsString = JSON.stringify(blocklist);

    localStorage["websitesList"] = listAsString;

    var saveString = "Saving the following websites to local storage:\n";
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
        // FIXME: fix if array is empty (all entries were removed)

        storedNames = JSON.parse(storedNames);

        var websitesRead = "The following websites were retrieved: \n";
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
        for (let i = 0; i < tempToBeBlocked.length; i++) {
            tempBlocklist = addWebsite(tempToBeBlocked[i], tempBlocklist);
        }
        // var jsonString= JSON.stringify(blocklist);
        return tempBlocklist;
    }
}

function testAddRemove() {
    blocklist = addWebsite('twitter.com', blocklist, 1);
    blocklist = addWebsite('twitter.com', blocklist, 1);
    blocklist = removeWebsite('slither.io', blocklist);
}

var blocklist = getWebsites();
testAddRemove();
saveWebsites(blocklist);

compareURL(blocklist);
