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


// function storageToTable() {
//   // var storedNames = localStorage["websiteList"];
//   window.alert("HERE");

//   // if(storedNames != null && storedNames.length > 0) {
//   //   // window.alert(storedNames);
//   // //   storedNames = JSON.parse(storedNames);
    
//   // //   for(let i = 0; i < storedNames.length; i++) {
//   // //     window.alert(storedNames[i].site);
//   // //   }
//   // }

// }


/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  
  // TODO: blocklist -> text -> table
  // window.alert("1");
  // // storageToTable();
  // window.alert("2");

  /**
   * when the table is changed, use its contents to update the blocklist in storage
   * 
   * Author: Noah Tigner
   * 
   * Args: 
   * 
   * Returns:
   */
  function tableToStorage() {
    var rows = document.getElementsByClassName("site-name");
    if(rows.length > 0) {
      var bl = [];
      for(let i = 0; i < rows.length; i++) {
        // window.alert(rows[i].value);
        if(rows[i].value.length > 0) {
          bl.push({site: rows[i].value, time: 0});
        }
      }

      var listAsString = JSON.stringify(bl);
      localStorage["websiteList"] = listAsString;
      window.alert("blocklist: " + localStorage["websiteList"]);
    }
  }

  document.addEventListener("keyup", (e) => {
    if (e.target.classList.contains("site-name")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(tableToStorage)
    }
  });

  document.addEventListener("click", (e) => {

    /**
     * Adds a row to the table of websites to block
     * 
     * Author: Noah Tigner
     * 
     * Args: 
     * 
     * Returns:
     */
    function add_row(tabs, val) {

      let tr = document.createElement("TR");
      let td1 = document.createElement("TD");
      let td2 = document.createElement("TD");
      let in1 = document.createElement("INPUT");
      let in2 = document.createElement("INPUT");

      tr.setAttribute("class", "bl-table-row");

      in1.setAttribute("class", "site-name");
      in1.setAttribute("type", "text");
      in1.setAttribute("size", "25%");

      if(val === undefined) {
        in1.setAttribute("placeholder", "site name");
      }
      else {
        in2.setAttribute("value", val);
      }

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

    /**
     * deletes a specific row from the table
     * 
     * Author: Noah Tigner
     * 
     * Args: e, the event (passed to parent function)
     * 
     * Returns:
     */
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

    // function storageToTable(tabs) {
    //   // window.alert(firstTime);
    //   // if(firstTime == true) {
    //   // firstTime = false;
    //   // window.alert("HERE");
    //   if(document.getElementsByClassName("site-name").length == 1) {
    //     var storedNames = localStorage["websiteList"];
    //     window.alert("HERE");
  
    //     if(storedNames != null && storedNames.length > 0) {
    //       window.alert(storedNames);
    //       storedNames = JSON.parse(storedNames);
          
    //       for(let i = 0; i < storedNames.length; i++) {
    //         // window.alert(storedNames[i].site);
    //         add_row(storedNames[i].site);
    //       }
    //     }
    //   }
      

    // }

    /**
     * Get the active tab
     */

    // browser.tabs.query({active: true, currentWindow: true})
    //     .then(storageToTable)

    

    if (e.target.classList.contains("bl-table-add-row")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(add_row)
    }
    if (e.target.classList.contains("bl-table-delete-row")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(delete_row)
        .then(tableToStorage)
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
