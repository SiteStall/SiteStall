
document.getElementById('dailyHour').addEventListener('change', function() {
	browser.storage.local.set({thresholdHours: this.value});
	browser.storage.local.set({hoursLeft: this.value});

	let threshHour =  document.getElementById('dailyHour').value;
	let threshMin =  document.getElementById('dailyMin').value;
	threshHour = parseInt(threshHour);
	threshMin = parseInt(threshMin);

	var threshold = threshHour * 60;
	threshold += threshMin;
	var time_left = threshold * 60000; 

	// window.alert("threshold is:" + threshold);
	// window.alert("time_left is:" + time_left);

	browser.storage.local.set({"threshold": threshold});
	browser.storage.local.set({"time_left": time_left});
});

document.getElementById('dailyMin').addEventListener('change', function() {
	browser.storage.local.set({thresholdMinutes: this.value});
	browser.storage.local.set({minutesLeft: this.value});

	let threshHour =  document.getElementById('dailyHour').value;
	let threshMin =  document.getElementById('dailyMin').value;
	threshHour = parseInt(threshHour);
	threshMin = parseInt(threshMin);

	var threshold = threshHour * 60;
	threshold += threshMin;
	var time_left = threshold * 60000; 

	// window.alert("threshold is:" + threshold);
	// window.alert("time_left is:" + time_left);

	browser.storage.local.set({"threshold": threshold});
	browser.storage.local.set({"time_left": time_left});
});

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {

	/**
	 * Adds a row to the table of websites to block
	 *
	 * Author: Noah Tigner
	 *
	 * Args:
	 *
	 * Returns:
	 */
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
		// if(val === undefined) {
		// 	in1.setAttribute("placeholder", "site name");
		// }
		// else {
		// 	let text = val;
		// 	window.alert(text);
		// 	in1.setAttribute("value", text);
		// }

		in2.setAttribute("class", "bl-table-delete-row");
		in2.setAttribute("type", "button");
		in2.setAttribute("style", "display: block; margin: 0 auto;");
		in2.setAttribute("value", "-");

		let parentDiv =  document.getElementsByClassName("bl-table-row")[0].parentNode;
		let sp2 = document.getElementsByClassName("bl-table-row")[0];
		parentDiv.insertBefore(tr, sp2);
		// document.getElementById("bl-table").insertBefore(tr, document.getElementsByClassName("bl-table-row")[0]);
		// document.getElementById("bl-table").appendChild(tr);

		tr.appendChild(td1);
		tr.appendChild(td2);
		td1.appendChild(in1);
		td2.appendChild(in2);
	}

	/**
	 * when the table is changed, use its contents to update the blocklist in storage
	 *
	 * Author: Noah Tigner
	 *
	 * Args:
	 *
	 * Returns:
	 */
	function tableToStorage(tabs) {
		var rows = document.getElementsByClassName("site-name");

		if(rows.length > 0) {

			// get unique site names
			var unique = [];
			for(let i = 0; i < rows.length; i++) {
				if(rows[i].value.length > 0 && !unique.includes(rows[i].value)) {
					unique.push(rows[i].value)
				}
			}

			var bl = [];
			for(let i = 0; i < unique.length; i++) {
				bl.push({site: unique[i], time: 0});
			}

			browser.storage.local.set({websiteList: bl});
		}
		else {
			browser.storage.local.remove(websiteList);
		}
	}

	/**
	 * when the widget load, load the blocklist into the table, creating and filling necessary rows
	 *
	 * Author: Noah Tigner
	 *
	 * Args:
	 *
	 * Returns:
	 */
	function storageToTable(tabs) {

		var storedNames = [];
		var unique = [];
		browser.storage.local.get("websiteList", data => {
			if(data.websiteList) {
				storedNames = data.websiteList;

				// Get unique objects
				const map = new Map();
				for(const item of storedNames) {
					if(!map.has(item.site)) {
						map.set(item.site, true);
						unique.push({
							site: item.site,
							time: item.time
						});
					}
				}

				if(unique.length > 0) {
					for (let i = 0; i < unique.length; i++) {
						// window.alert(storedNames[i].site);
						// if(!bl.includes(storedNames[i].site)) {
						add_row(unique[i].site);

						let row = document.getElementsByClassName("site-name")[1];
						row.setAttribute("value", unique[i].site);
						// }
					}
				}
			}
		});
	}

  /**
	 * Updates save button when clicked.
	 *
	 * Author: Sean Wilson
	 *
	 * Args:
	 *
	 * Returns:
	 */
	function saveVisual(tabs) {
      var saveButton = document.getElementById("save");
      document.getElementById('save').innerHTML = 'saved!';
      // save.style.backgroundColor = "rgb(52, 110, 124)";
      // save.style.color = "rgb(235, 235, 235)";
      // save.style.borderColor = "rgb(20, 30, 36)";

      save.classList.remove("toggleclass");

  }

  /**
	 * Updates save button when table changed.
	 *
	 * Author: Sean Wilson
	 *
	 * Args:
	 *
	 * Returns:
	 */
	function saveReset(tabs) {
      document.getElementById('save').innerHTML = 'save blocklist';
      var saveButton = document.getElementById("save");
      // save.style.color = "rgb(231, 109, 81)";
      // save.style.backgroundColor = "rgb(35, 35, 35)";
      // save.style.borderColor = "rgb(231, 109, 81)";

      save.classList.add("toggleclass");
  }

	/**
	 * Updates the time dropdowns and timers.
	 *
	 * Author: Noah Tigner
	 *
	 * Args:
	 *
	 * Returns:
	 */
	function storageToTime(tabs) {

		var hoursLeft = 0;
		var hour = document.getElementById('hours');
		browser.storage.local.get("hoursLeft", data => {
			if(data.hoursLeft && parseInt(data.hoursLeft) > 0) {
				hoursLeft = parseInt(data.hoursLeft);
				if(hoursLeft < 10) {
					hoursLeft = "0" + hoursLeft.toString();
				}

				while(hour.firstChild ) {
					hour.removeChild(hour.firstChild);
				}
				hour.appendChild(document.createTextNode(hoursLeft));
			}
			else {
				while(hour.firstChild ) {
					hour.removeChild(hour.firstChild);
				}
				hour.appendChild(document.createTextNode("00"));
			}
		});

		// thresholdHours
		var threshHour = document.getElementById('dailyHour');
		browser.storage.local.get("thresholdHours", data => {
			if(data.thresholdHours) {
				let t = data.thresholdHours;
				threshHour.value=t;
			}
		});

		var minutesLeft = 0;
		var minute = document.getElementById('minutes');
		browser.storage.local.get("minutesLeft", data => {
			if(data.minutesLeft && parseInt(data.minutesLeft) > 0) {
				minutesLeft = parseInt(data.minutesLeft);
				if(minutesLeft < 10) {
					minutesLeft = "0" + minutesLeft.toString();
				}

				while(minute.firstChild ) {
					minute.removeChild(minute.firstChild);
				}
				minute.appendChild(document.createTextNode(minutesLeft));
			}
			else {
				while(minute.firstChild ) {
					minute.removeChild(minute.firstChild);
				}
				minute.appendChild(document.createTextNode("00"));
			}
		});

		// thresholdMinutes
		var threshMin = document.getElementById('dailyMin');
		browser.storage.local.get("thresholdMinutes", data => {
			if(data.thresholdMinutes) {
				let t = data.thresholdMinutes;
				threshMin.value=t;
			}
		});
	}

	browser.storage.onChanged.addListener(changeData => {
		storageToTime();
	});

	document.addEventListener("focus", (e) => {
		storageToTable();
		storageToTime();
	});

	document.addEventListener("click", (e) => {

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
			let rows = document.getElementsByClassName("bl-table-row");
			if(rows.length > 1){
				let row = e.target.parentNode.parentNode;
				row.parentNode.removeChild(row);
			}
			else {
				let row = document.getElementsByClassName("site-name")[0];
				row.setAttribute("value", "");
				row.setAttribute("placeholder", "site name");
			}
		}

		/**
		 * Get the active tab
		 */

    if (e.target.classList.contains("site-name")) {
			browser.tabs.query({active: true, currentWindow: true})
				.then(saveReset)
 		}
		if (e.target.classList.contains("bl-table-add-row")) {
			browser.tabs.query({active: true, currentWindow: true})
				.then(add_row)
        .then(saveReset)
		}
		if (e.target.classList.contains("bl-table-delete-row")) {
			browser.tabs.query({active: true, currentWindow: true})
				.then(delete_row)
        .then(saveReset)
		}
		if (e.target.classList.contains("save")) {
			browser.tabs.query({active: true, currentWindow: true})
				.then(tableToStorage)
        .then(saveVisual)
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
browser.tabs.executeScript({file: "/content_scripts/widget_content.js"})
	.then(listenForClicks)
	.catch(reportExecuteScriptError);
