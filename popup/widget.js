

document.getElementById('dailyTime').addEventListener('change', function() {

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



// document.getElementById('blt-table-add-row').addEventListener('click', function() {
//
//   window.alert("1");
//
//   let site_name = '<input type="text" class="site-name" name="site-name" placeholder="site name" size="25%">';
//
//   let button = '<input type="button" class="blt-table-delete-row" value="-" style="display: block; margin: 0 auto;">';
//
//
//   document.getElementsByTagName('bl-table')[0].appendChild('<tr class="blt-table-row"><td>' + site_name + '</td><td>' + button + '</td></tr>');
//
//   // $('.bl-table tr:first').after('<tr class="blt-table-row"><td>' + site_name + '</td><td>' + button + '</td></tr>');
//
//   window.alert("2");
//
// });



// $(document).on('click', '.blt-table-add-row', function() {
//
//
//
//   let site_name = '<input type="text" class="site-name" name="site-name" placeholder="site name" size="25%">';
//
//   let button = '<input type="button" class="blt-table-delete-row" value="-" style="display: block; margin: 0 auto;">';
//
//   $('.bl-table tr:first').after('<tr class="blt-table-row"><td>' + site_name + '</td><td>' + button + '</td></tr>');
//
// });


// document.getElementById('dynamic-list').addEventListener('change', function() {
//
//     window.alert("HERE");
//
//     window.alert(document.getElementByClassName('list-el'));
//
//     var list = document.getElementByClassName('list-el');
//     for(let i = 0; i < list.length; i++) {
//         window.alert(list[i].innerHTML);
//     }
//
// });



// function saveWebsites(blocklist) {
//     window.alert(JSON.stringify(blocklist));
//     listAsString = JSON.stringify(blocklist)
//
//     localStorage["websitesList"] = listAsString;
//
//     var saveString = "Saving the following websites to local storage:\n"
//     for (let i = 0; i < blocklist.length; i++) {
//         saveString = saveString.concat('\tname: ', blocklist[i].site, '\ttime: ', blocklist[i].time, '\n');
//     }
//
//     if (printStorageInfo) {  // change to 0 to not print this
//         window.alert(saveString);
//         console.log(saveString);
//     }
// }




/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {


    function add_row(tabs) {
      
      var tr = document.createElement("TR");             
      var td1 = document.createElement("TD");     
      var td2 = document.createElement("TD");   
      var in1 = document.createElement("INPUT");      
      var in2 = document.createElement("INPUT");      
      var td2t = document.createTextNode("-"); 

      tr.appendChild(td1);   
      tr.appendChild(td2);
      td1.appendChild(in1);
      td2.appendChild(in2);
      in2.appendChild(td2t);

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
    }

    function delete_row(tabs) {
      var row = document.getElementsByClassName("bl-table-row")[0];
      row.parentNode.removeChild(row); 
    }


    // function add(tabs) {
    //
    //   var ul = document.getElementById("dynamic-list");
    //   var candidate = document.getElementById("candidate");
    //   var li = document.createElement("li");
    //   li.setAttribute('id',candidate.value);
    //   li.classList.add('list-el');
    //   li.appendChild(document.createTextNode(candidate.value));
    //   ul.appendChild(li);
    //
    // }
    //
    // function remove(tabs) {
    //
    //   var ul = document.getElementById("dynamic-list");
    //   var candidate = document.getElementById("candidate");
    //   var item = document.getElementById(candidate.value);
    //   ul.removeChild(item);
    //
    // }
    //
    // function addCurrent(tabs) {
    //
    //   alert("The URL of this page is: " + window.location.href);
    //
    //   browser.tabs.sendMessage(tabs[0].id, {
    //       command: "addCurrent"
    //     });
    // }

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
