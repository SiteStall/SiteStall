/**
 * Compare the current website to those in the blocklist, blocking if necessary
 * 
 * Author: Noah Tigner, Lucas Hyatt, Jimmy Lam
 * 
 * Args: blocklist, a list of objects of the form {site: , time: }
 * 
 * Returns:
 */
function compareURL(blocklist) {
    //var loc = window.location.hostname;
    // window.alert("(comp) bl: " + blocklist);

    var blocklistLength = blocklist.length;
    for(let i = 0; i < blocklistLength; i++) {
        // window.alert(blocklist[i].site);
        //if(loc.localeCompare(blocklist[i].site) === 0) {
        if (shouldBeBlocked(blocklist[i].site)) {
            // block();
            // console.log("Blocklisted.");
            startTime(time_left);
            break;
        }
        else{
            // console.log("Not blocklisted.");
            stopTime();
        }
    }
}

/**
 * Checks to see if the url should be blocked. fixed robustness for:
 *      - user url omits www. but website has it
 *      - website doesn't have www. but user url has it
 *      - user copies full url (including https) into block list
 *
 * Author: Jimmy Lam
 *
 * Args: url: the url from the blocklist
 *
 * Returns: 1 if the website should be blocked, 0 otherwise.
 */
function shouldBeBlocked(in_url) {
    // web_url will never have https or anything after .com
    var web_url = window.location.hostname;
    var splitted = in_url.split('/'); // split url from blocklist on forward slash
    //console.log(splitted);

    var firstfour_web_url = web_url.substring(0, 4);
    var firstfour_in_url = in_url.substring(0, 4);

    // check if http is in url. If yes, get only website url
    if (firstfour_in_url.localeCompare('http') === 0) {
        in_url = splitted[2];
    }

    if (web_url.localeCompare(in_url) === 0) {
        return 1;
    }
    // everything past here means in_url and web_url don't match
    // add www. to in_url if it doesn't have it but web_url does
    else if (firstfour_web_url.localeCompare('www.') === 0) {
        in_url = 'www.' + in_url;
        if (web_url.localeCompare(in_url) === 0) {
            return 1;
        }
    }
    // remove www. from in_url if web_url doesn't have it
    else {
        in_url = in_url.substring(4); // get url after www.
        if (web_url.localeCompare(in_url) === 0) {
            return 1;
        }
    }
    return 0;

}

/**
 * Redirects websites in the blocklist to "blocked.html"
 * 
 * Author: Noah Tigner
 * 
 * Args: 
 * 
 * Returns:
 */
function block() {
    window.stop();

    browser.storage.local.set({blockedSite: window.location.href});
    // console.log("RELOCATION!!!");
    console.log(window.location.href);
    // console.log("REDIRECTION");
    window.location = browser.extension.getURL("blocked.html");
}

var printStorageInfo = 0;

/** Function: addWebsite()
 *      Adds a website to the block list. The current block list being used should be set equal
 *      to the return of this function, and the blocklist should be passed as an argument.
 *
 *  Author: Jimmy Lam
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

    var item = {site: url, time: 0};
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
 *  Author: Jimmy Lam
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

/**
 *  Saves the block list
 *
 *  Author: Jimmy Lam
 *
 *  Args: blocklist: the blocklist that contains websites to block
 *
 *  Returns:  
 */

function saveWebsites(blocklist) {
    // window.alert(JSON.stringify(blocklist));
    listAsString = JSON.stringify(blocklist);

    browser.storage.local.set({websiteList: listAsString});

    var saveString = "Saving the following websites to local storage:\n";
    for (let i = 0; i < blocklist.length; i++) {
        saveString = saveString.concat('\tname: ', blocklist[i].site, '\ttime: ', blocklist[i].time, '\n');
    }

    if (printStorageInfo) {  // change to 0 to not print this
        window.alert(saveString);
        console.log(saveString);
    }
}

/**
 * Access the websites held in storage.local['websiteList'] (the blocklist)
 * Parses and passes these URLs to compareURL
 * 
 * Author: Noah Tigner, Jimmy Lam
 * 
 * Args: 
 * 
 * Returns:
 */
function getWebsites() {

    var storedNames = [];
    
    let prom = browser.storage.local.get("websiteList", data => {
        if(data.websiteList) {
            storedNames = data.websiteList;

            if(storedNames.length > 0) {
                var websitesRead = "The following websites were retrieved: \n";
                for (let i = 0; i < storedNames.length; i++) {
                    websitesRead = websitesRead.concat("\tname: ", storedNames[i].site, "\ttime: ", storedNames[i].time, '\n');
                }
        
                if (printStorageInfo) {  // change to 0 to not print this
                    window.alert(websitesRead);
                    console.log(websitesRead);
                }
                compareURL(storedNames)
            }
        }
    });
}

function testAddRemove() {
    blocklist = addWebsite('twitter.com', blocklist, 1);
    blocklist = addWebsite('twitter.com', blocklist, 1);
    blocklist = removeWebsite('slither.io', blocklist);
}

var blocklist = getWebsites();  // had to chain this to block() compareURL to work correctly (blame how js promises work)
// testAddRemove();
// saveWebsites(blocklist);
// compareURL(blocklist);

// add event listener for blocklist in storage.local... then update getWebsites?
// browser.storage.onChanged.addListener(changeData => {
//     // window.alert("BL[0] Changed: " + changeData.websiteList.newValue[0].site);    
//     getWebsites();
// });

/* ============================================================================= */
/* ================================scheduling=================================== */
/* ============================================================================= */

/*
NOTES:
    - Needs to reset at midnight
    - Needs to read from GUI
*/
function sleep(milliseconds) { 
let timeStart = new Date().getTime(); 
    while (true) { 
        let elapsedTime = new Date().getTime() - timeStart; 
        if (elapsedTime > milliseconds) { 
            break; 
        } 
    } 
    console.log("WAKING NOW.");
} 

window.onfocus = function() {
    // console.log("FOCUSED");
    browser.storage.local.get(["time_left"], function(result){
        time_left = result["time_left"];

        // console.log('Retrieved the variable time_left as:', time_left);
    });
    getWebsites();
};

window.onblur = function() {
    // console.log("BLURRED");
    browser.storage.local.set({"time_left": time_left});
    stopTime();
};

// Global variables
var threshold; //Global threshold variable (amount available each day, in minutes)
// var time_left;

function getTimes(){
    /*
        Get current times.
    */
    // console.log("Call to getTimes.")

    browser.storage.local.get(["thresholdHours"], function(result1){
        browser.storage.local.get(["thresholdMinutes"], function(result2){
            var threshHours = HoursToMinutes(result1["thresholdHours"]);

            var threshMins = result2["thresholdMinutes"];
            if(threshMins == NaN || threshHours == NaN || threshMins === undefined || threshHours === undefined){
                threshold = 0;
                console.log("Threshold set by default to:", threshold);
                // window.alert("No threshold set in widget. Threshold automatically set to 0 minutes");
                // Setting the threshold value.
                browser.storage.local.set({"threshold": threshold});
            }
            else{
                // console.log("CALCULATED THRESHHOURS AS:", threshHours);
                // console.log("CALCULATED THRESHMINS AS:", threshMins);
                
                threshHours = parseInt(threshHours, 10);
                threshMins = parseInt(threshMins, 10);
                
                if(isNaN(threshHours)){
                    // console.log("TYPERROR CHANGED HOURS");
                    threshHours = 0;
                }

                // console.log("Hours from GUI:", threshHours);
                // console.log("Mins from GUI:", threshMins);
                threshold = threshHours + threshMins;

                // console.log("Threshold from GUI:", threshold);
                
                // Setting the threshold value.
                // console.log("Threshold is:", threshold);
                browser.storage.local.set({"threshold": threshold});
            }

            browser.storage.local.get(["time_left"], function(result){
                var val = result["time_left"];
                // console.log("Time left is:", val);
                if (val === undefined || val == NaN){ // Hasn't been set before, establish as threshold.
                    // console.log("Current value of threshold is:", threshold);
                    time_left = MinutesToMilliseconds(threshold); //Variable used in tracking time
                    console.log('Set time_left as:', time_left);
                }
                else{
                    time_left = val;
                    getWebsites();
                    // console.log('Retrieved the variable time_left as:', time_left);
                }
            });
        });
    });

    // Also set current date in local storage
    var curr_date = new Date();
    var day = curr_date.getDay();
    // console.log("Current date is:", day);
    browser.storage.local.set({"curr_date": day});
}

getTimes();

var timeout; 
var interval; 

function checkDate(){
    var now = new Date();
    var day = now.getDay();
    browser.storage.local.get(["curr_date"], function(result){
        var val = result["curr_date"];
        if(parseInt(val) != parseInt(day)){
            console.log("Reset time_left to threshold.")
            time_left = threshold;
            browser.storage.local.set({"time_left": time_left});
        }
    });
}

function MinutesToMilliseconds(time){
    /*
        Convert a given time in minutes to milliseconds (helper for setTimeout)
    */
    return time*(60000)
}

function HoursToMinutes(time){
    /*
        Convert a given time in hours to minutes (helper for setTimeout)
    */
    return time*(60)
}

function timeUp(){
    /*
        Called if user is on blocklisted site and runs out of time.
    */
    // console.log("Call to timeUp()!")
    
    //Check the date to see if they get a reset on time_left
    checkDate();

    stopTime();
    block();
}

function adjustTimeLeft(){ 
    /*
        Function which decrements the time left every second.
    */
    // console.log("Call to time_left");
    if(time_left === undefined || time_left == NaN){
        // console.log("Detected time_left error, reset time_left to threshold.");
        browser.storage.local.get(["threshold"], function(result){
            var val = result["threshold"];
            time_left = MinutesToMilliseconds(val);
            // console.log("TIME LEFT SET:", time_left);
        });
    }

    time_left -= 1000

    //Updating time_left in storage.
    browser.storage.local.set({"time_left": time_left});
    browser.storage.local.get(["time_left"], function(result){
        var curr_time = result["time_left"];
        console.log('Time_left adjusted to:', curr_time);

        var hourInMilliseconds = 3600000; // hour in milliseconds
        var minuteInMilliseconds = 60000; // minute in milliseconds

        var hoursLeft = Math.floor(curr_time/hourInMilliseconds);
        var minutesLeft = Math.floor((curr_time%hourInMilliseconds)/minuteInMilliseconds);
        // console.log("Hours left is:", hoursLeft);
        // console.log("Minutes left is:", minutesLeft);
        browser.storage.local.set({"hoursLeft": hoursLeft});
        browser.storage.local.set({"minutesLeft": minutesLeft});
    });

    if(time_left < 0){
        timeUp()
    }
}

function startTime(time_before_blocking){
    /*
        Function which is called when a user visits a blocklisted site,
        begins to track time:
    */

    //Triggered when they visit a blockslisted site.
    // console.log("Call to startTime.");
    browser.storage.local.get(["timing"], function(result){
        var val = result["timing"];
        if(val == false){
            browser.storage.local.set({"timing": true}); //Sets the boolean to true when timing begins

            timeout = setTimeout(function(){timeUp}, time_before_blocking);
            interval = setInterval(adjustTimeLeft, 1000);
        }
        else{
            // console.log("Duplicate timing detected.");
            //Restart

            stopTime();
            startTime(time_left);
        }
    });
}

function stopTime(){
    /*
        Function which is called when a user visits a non-blocklisted site
    */

    // console.log("Stopping time.");
    browser.storage.local.set({"timing": false}); // Set boolean to false when timing stops

    clearTimeout(timeout);
    clearInterval(interval);

    //Write the new time to storage file.
    browser.storage.local.set({"time_left": time_left});

}

// startTime(time_left)
// stopTime()

/* ============================================================================= */
/* ============================================================================= */
/* ============================================================================= */


