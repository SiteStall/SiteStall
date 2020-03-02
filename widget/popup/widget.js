
document.getElementById('dailyTime').addEventListener('change', function() {

  var min = document.getElementById('minutes');
  var sec = document.getElementById('seconds');

  while( min.firstChild ) {
    min.removeChild( min.firstChild );
  }
  while( sec.firstChild ) {
    sec.removeChild( sec.firstChild );
  }
  min.appendChild( document.createTextNode(this.value) );
  sec.appendChild( document.createTextNode('00') );
});

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {


    function add(tabs) {

      var ul = document.getElementById("dynamic-list");
      var candidate = document.getElementById("candidate");
      var li = document.createElement("li");
      li.setAttribute('id',candidate.value);
      li.appendChild(document.createTextNode(candidate.value));
      ul.appendChild(li);

    }

    function remove(tabs) {

      var ul = document.getElementById("dynamic-list");
      var candidate = document.getElementById("candidate");
      var item = document.getElementById(candidate.value);
      ul.removeChild(item);

    }

    function addCurrent(tabs) {

      alert("The URL of this page is: " + window.location.href);

      browser.tabs.sendMessage(tabs[0].id, {
          command: "addCurrent"
        });
    }

    function settings(tabs) {
      window.alert("block-widget");
      browser.tabs.sendMessage(tabs[0].id, {
          command: "settings"
        });
    }

    function stats(tabs) {
      window.alert("unblock-widget");
      browser.tabs.sendMessage(tabs[0].id, {
          command: "stats"
        });
    }

    /**
     * Get the active tab
     */

    if (e.target.classList.contains("add")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(add)
    }
    else if (e.target.classList.contains("addCurrent")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(addCurrent)
    }
    else if (e.target.classList.contains("remove")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(remove)
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}


/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/block.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
