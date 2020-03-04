document.getElementById('dailyHour').addEventListener('change', function() {

  window.alert("2");

  var hour = document.getElementById('hours');
  var sec = document.getElementById('seconds');

  while( hour.firstChild ) {
    hour.removeChild( hour.firstChild );
  }
  while( sec.firstChild ) {
    sec.removeChild( sec.firstChild );
  }
  sec.appendChild( document.createTextNode('00') );
  hour.appendChild( document.createTextNode(this.value) );

});

document.getElementById('dailyMin').addEventListener('change', function() {

  window.alert("2");

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

    // TODO: blocklist -> text -> table

    // TODO: table -> json -> blocklist

    function add_row(tabs) {

      let tr = document.createElement("TR");
      let td1 = document.createElement("TD");
      let td2 = document.createElement("TD");
      let in1 = document.createElement("INPUT");
      let in2 = document.createElement("INPUT");

      tr.setAttribute("class", "bl-table-row");

      in1.setAttribute("class", "site-name");
      in1.setAttribute("type", "text");
      in1.setAttribute("size", "25%");
      in1.setAttribute("placeholder", "site name");

      in2.setAttribute("class", "bl-table-delete-row");
      in2.setAttribute("type", "button");
      in2.setAttribute("style", "display: block; margin: 0 auto;");
      in2.setAttribute("value", "-");

      document.getElementById("bl-table").appendChild(tr);
      tr.appendChild(td1);
      tr.appendChild(td2);
      td1.appendChild(in1);
      td2.appendChild(in2);
    }

    function delete_row(tabs) {
      let row = e.target.parentNode.parentNode;
      row.parentNode.removeChild(row);
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

    if (e.target.classList.contains("bl-table-add-row")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(add_row)
    }
    if (e.target.classList.contains("bl-table-delete-row")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(delete_row)
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
