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

		// FIXME: setting here doesn't currently work when called by promised object
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
		// sp2 = sp2[0] || undefined;
		parentDiv.insertBefore(tr, sp2);
		// document.getElementById("bl-table").insertBefore(tr, document.getElementsByClassName("bl-table-row")[0]);

		// document.getElementById("bl-table").appendChild(tr);
		tr.appendChild(td1);
		tr.appendChild(td2);
		td1.appendChild(in1);
		td2.appendChild(in2);
	}

	// function clearTable(tabs) {
	// 	var rows = document.getElementsByClassName("bl-table-row");

	// 	// while(rows[0]) {
	// 	// 	rows[0].parentNode.removeChild(rows[0]);
	// 	// }​
	// 	// var rows = 
	// 	// window.alert("here");
	// }


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
			var bl = [];
			for(let i = 0; i < rows.length; i++) {
				if(rows[i].value.length > 0) {
					// window.alert(rows[i].value);
					bl.push({site: rows[i].value, time: 0});
				}
			}

			browser.storage.local.set({websiteList: bl});

			// for(let tab of tabs) {
			// 	browser.tabs.sendMessage(
			// 		tab.id,
			// 		{
			// 			command: "tableToStorage",
			// 			bl: bl
			// 		}
			// 	);
			// }
		}
		else {
			browser.storage.local.remove(websiteList);
		}
	}

	// // TODO: blocklist -> text -> table
	function storageToTable(tabs) {
		// 	// var storedNames = localStorage["websiteList"];
			// window.alert("1");

		// let rows = document.getElementsByClassName("bl-table-row");
		// rows.parentNode.removeChild(rows);

		// window.alert("3");
		let copy = [];
		var storedNames = [];
		browser.storage.local.get("websiteList", data => {
			if(data.websiteList) {
				// FIXME: fix if array is empty (all entries were removed)

				// window.alert(websiteList);
				// storedNames = JSON.parse(websiteList);

				

				storedNames = data.websiteList;
				if(storedNames.length > 0) {
					for (let i = 0; i < storedNames.length; i++) {
						// window.alert(storedNames[i].site);
						add_row(storedNames[i].site);


						// i = 0 -> [1]
						// i = 1 -> [2]

						let row = document.getElementsByClassName("site-name")[1];
						row.setAttribute("value", storedNames[i].site);
						

						// const newStr = Object.assign("", storedNames[i].site);
						// copy.push(newStr);
						
					}
				}
			}
		});
	}

	document.addEventListener("focus", (e) => {
		// clearTable();
		storageToTable();
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
				// .then(tableToStorage)
		}
		if (e.target.classList.contains("save")) {
			browser.tabs.query({active: true, currentWindow: true})
				// .then(tableToStorage)
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
browser.tabs.executeScript({file: "/content_scripts/widget_content.js"})
	.then(listenForClicks)
	.catch(reportExecuteScriptError);
