function compareURL(blocklist) {
    var loc = window.location.hostname;

    // window.alert(blocklist);

    var blocklistLength = blocklist.length;
    for(let i = 0; i < blocklistLength; i++) {
        if(loc.localeCompare(blocklist[i].site) == 0) {
            // block();
            console.log("Blocklisted.");
            startTime(time_left);
            break;
        }
        else{
            stopTime();
            console.log("Not blocklisted.");
        }
    }
}

function block() {
    window.stop();

    localStorage["blockedSite"] = window.location;
    window.location = browser.extension.getURL("blocked.html");
}

var printStorageInfo = 0;

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
        saveWebsites(curBlockList);
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
                saveWebsites(curBlockList);
            }
            return curBlockList;
        }
    }

    return curBlockList;
}

function saveWebsites(blocklist) {
    // window.alert(JSON.stringify(blocklist));
    listAsString = JSON.stringify(blocklist);

    localStorage["websiteList"] = listAsString;

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
    
    var storedNames = localStorage["websiteList"];
    // window.alert(localStorage["websiteList"]);

    if(storedNames != null && storedNames.length > 0) {
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

/* ============================================================================= */
/* ================================scheduling=================================== */
/* ============================================================================= */

/*
NOTES:
    - Will need to write some variables (likely threshold and time_left) to storage in a file

    TODO: 

        - Connect this to the blocking module, so functions are called each time.
        - Deal with I/O to save threshold, time_left, current_date
            - Can use local storage.

        Check current tab: window.location.url()
*/


// Global variables
// These should be set (read from file), when the program is started. 

var threshold = .1; //Global threshold variable (amount available each day, in minutes)
var time_left = MinutesToMilliseconds(threshold); //Variable used in tracking time
var timeout; 
var interval; 

function MinutesToMilliseconds(time){
    /*
        Convert a given time in minutes to milliseconds (helper for setTimeout)
    */
    return time*(60000)
}

function timeUp(){
    /*
        Called if user is on blocklisted site and runs out of time.
    */
    console.log("Start blocking!")
    stopTime();
    block();

    //Write the new time to storage file.
}

function adjustTimeLeft(){ 
    /*
        Function which decrements the time left every second.
    */
    time_left -= 1000
    console.log("Time left is now:", time_left)

    if(time_left < 0){
        // stopTime()
        // console.log("Left the blocklisted site, saving time_left as:", time_left)
        timeUp()
    }
}

function startTime(time_before_blocking){
    /*
        Function which is called when a user visits a blocklisted site,
        begins to track time:
    */

    //Triggered when they visit a blockslisted site.
    console.log("Starting timer.")
    timeout = setTimeout(function(){timeUp}, time_before_blocking);
    interval = setInterval(adjustTimeLeft, 1000);   
}

function stopTime(){
    /*
        Function which is called when a user visits a non-blocklisted site
    */
    clearTimeout(timeout);
    clearInterval(interval);

    //Write the new time to storage file.
}

// startTime(time_left)
// stopTime()

/* ============================================================================= */
/* ============================================================================= */
/* ============================================================================= */



