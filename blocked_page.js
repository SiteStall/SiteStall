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
 * Returns: String 
 */ 

function createInput() {
    var reason = "REASON";
    var reasons_input = document.getElementById("buttons");

    reasons_input.innerHTML = '<div id="select"><select id="slct" name="reason_input"><option selected="selected">Please select a reason...</option> <option value="Task was work related">This is work related</option><option value="Almost done with task">I am almost done</option><option value="Had no work that needed focus">I have nothing that needs focus</option><option value="Other">Other</option> </select><div>'
    var select_field = document.getElementById("slct");
    document.getElementById("submit_button").innerHTML = '<button class="btn" id="submit">Submit and Redirect</button>'
    
    select_field.addEventListener('change', function() {
        reason = select_field.options[select_field.selectedIndex].value;
        // console.log(reason);
        // console.log(reason);

        if (reason == "Other") {
            console.log("Other selected");
            document.getElementById("other").innerHTML = '<input type="text" id="other_reason" value="Enter other reason..."> </input>';
            // reason = document.getElementById("other_reason").value;
            // console.log(reason);
        }
        else {
            document.getElementById("other").innerHTML = '';
        }
    });

    document.getElementById("submit").addEventListener('click', function() {
        console.log("Clicked");
        var is_other = 0;
        if (reason == "Other") {
            reason =  document.getElementById("other_reason").value;
            is_other = 1;
        }

        save_reason(reason,is_other);
    });

    /* 
    * Stores the reasons in local storage
    */

   function redirectToBlocked() {
        let site = browser.storage.local.get("blockedSite");
        site.then(onGot,onError);
    }

    function testStorage() {
        let gettingReasons = browser.storage.local.get("reasons");
        gettingReasons.then(onStorage,onError);
    }

    function save_reason(reason,other) {
        
        console.log("Submitting reason " + reason);
        var gettingReasons = browser.storage.local.get();
        
        gettingReasons.then(results => {
            // if there are no reasons stored, initialize the object
            console.log("Getting reasons");
            if (!results.reasons) {
                console.log("There are no saved reasons, initializing");
                results.reasons = {};
            }

            results.reasons[reason] = results.reasons[reason] || 0;
            results.reasons[reason]++;
        
            browser.storage.local.set({reasons: results.reasons});
        })
        
        testStorage();
        redirectToBlocked();
    }

}

document.getElementById("stay").addEventListener('click', function() {
    createInput();
})