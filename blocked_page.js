/*
 * Prints object from local storage
 * 
 * Author: Claire Kolln
 * 
 * Args: Object retrieved from local storage
 * 
 * Returns: None
 */
function onStorage(item) {
    console.log(Object.values(item)[0]);
}

/*
 * Redirects back to the blocked website
 * 
 * Author: Claire Kolln
 * 
 * Args: Object retrieved from local storage
 * 
 * Returns: None
 */

function onGot(item) {
    console.log(Object.values(item)[0]);
    window.location = Object.values(item)[0];
}

/*
 * Error logging for retrieving blocked site from local storage
 * 
 * Author: Claire Kolln
 * 
 * Args: Object retrieved from local storage
 * 
 * Returns: None
 */ 

function onError(error) {
    console.log(`Error: ${error}`);
}

/*
 * Gets the user's reason for going back to the blocklisted site
 * 
 * Author: Claire Kolln
 * 
 * Args: None
 * 
 * Returns: None 
 */ 

function createInput() {
    
    var reason = "";
    var reasons_input = document.getElementById("reason");
    
    // add the select element, replacing the button 
    reasons_input.innerHTML = '<div id="select"><p>Enter a reason for going back to blocked site to add 15 minutes</p><select id="slct" name="reason_input"><option selected="selected">Please select a reason...</option> <option value="Task was work related">This is work related</option><option value="Was almost done with task">I am almost done</option><option value="Had no work that needed focus">I have nothing that needs focus</option><option value="Other">Other</option> </select><div>'
    var select_field = document.getElementById("slct");
   
    // add a submit and redirect button
    document.getElementById("submit_button").innerHTML = '<button class="btn" id="submit">Submit and Redirect</button>'
    
    // listen for change to the select element, assign reason variable
    select_field.addEventListener('change', function() {
        reason = select_field.options[select_field.selectedIndex].value;
        
        // if other is selected, add a text box for user input and remove if other is unselected
        if (reason == "Other") {
            console.log("Other selected");
            document.getElementById("other").innerHTML = '<input type="text" id="other_reason" value="Enter other reason..."> </input>';
        }
        else {
            document.getElementById("other").innerHTML = '';
        }
    });

    // listen for submit button click
    document.getElementById("submit").addEventListener('click', function() {
        console.log("Clicked");
        var is_other = 0;
        
        if (reason === "Other") {
            console.log("OTHER");
            reason =  document.getElementById("other_reason").value;
            if (reason !== "Enter other reason...") {
                is_other = 1;
                save_reason(reason, is_other);
            }
            else {
                document.getElementById("message").innerHTML = "<p>No reason entered. Please enter a reason</p>";
                reason = "Other";
            }
        }
        else if (reason === "" || reason === "Please select a reason...") {
            document.getElementById("message").innerHTML = "<p>Please enter a reason</p>";
        }
        else {
            save_reason(reason, is_other);
        }
    });

    /*
    * Gets the blockedSite from local storage, and redirects
    * 
    * Author: Claire Kolln
    * 
    * Args: None
    * 
    * Returns: None 
    */ 
    function redirectToBlocked() {
        let site = browser.storage.local.get("blockedSite");
        site.then(onGot,onError);
    }

    /*
    * Tests to make sure values are being stored as expected
    * 
    * Author: Claire Kolln
    * 
    * Args: None
    * 
    * Returns: None 
    */ 
    function testStorage() {
        let gettingReasons = browser.storage.local.get("reasons");
        gettingReasons.then(onStorage,onError);
    }

    /*
    * Adds 15 minutes to user's timeleft in local storage when they decide to stay on distracting site
    * 
    * Author: Claire Kolln
    * 
    * Args: None
    * 
    * Returns: None 
    */ 
   function addTime() {
        browser.storage.local.set({"time_left": 900000});
        browser.storage.local.set({"hoursLeft": 0});
        browser.storage.local.set({"minutesLeft": 900000});
    }

    /*
    * Saves reason in local storage
    * 
    * Author: Claire Kolln
    * 
    * Args: String (reason)
    * 
    * Returns: None 
    */ 

    function save_reason(reason, is_other) {
        
        console.log("Submitting reason " + reason);
        var gettingReasons = browser.storage.local.get();
        
        gettingReasons.then(results => {

            // if there are no reasons stored, initialize the object
            console.log("Getting reasons");
            
            if (!results.reasons) {
                console.log("There are no saved reasons, initializing");
                results.reasons = {
                    default: {},
                    other: []
                };
            }

            if (!is_other) {
                results.reasons.default[reason] = results.reasons.default[reason] || 0;
                results.reasons.default[reason]++;
            }
            else {
                results.reasons.other.push(reason);
            }

            browser.storage.local.set({reasons: results.reasons});

        })

        addTime();
        
        // testStorage();
        redirectToBlocked();
    }
}

/*
* Listens for "stay" button click and then calls createInput()
* 
* Author: Claire Kolln
*/ 

document.getElementById("stay").addEventListener('click', function() {
    createInput();
})