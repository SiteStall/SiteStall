// browser.runtime.onMessage.addListener(message => {
// 	if(message.command === "tableToStorage") {
// 		if(message.bl.length > 0) {
// 			window.alert("Blocklist of size: " + message.bl.length);
// 			browser.storage.local.set({websiteList: message.bl});
// 		}
// 		else {
// 			browser.storage.local.remove(websiteList);
// 		}
// 		return Promise.resolve();
// 	}
// });


(function() {
	/**
	 * Check and set a global guard variable.
	 * If this content script is injected into the same page again,
	 * it will do nothing next time.
	 */
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	function settings() {
		window.alert("open settings");
	}

	function stats() {
		window.alert("open stats (redirect to stats static webpage)");
	}

	function addItem(){
		//window.alert("add");
		// var ul = document.getElementById("dynamic-list");
		// var candidate = document.getElementById("candidate");
		// var li = document.createElement("li");
		// li.setAttribute('id',candidate.value);
		// li.appendChild(document.createTextNode(candidate.value));
		// ul.appendChild(li);
	}

	function addItemCurrent(){
		alert("The URL of this page is: " + window.location.href);
	}

	function removeItem(){
		//window.alert("remove");
		// var ul = document.getElementById("dynamic-list");
		// var candidate = document.getElementById("candidate");
		// var item = document.getElementById(candidate.value);
		// ul.removeChild(item);
	}

	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "remove") {
			removeItem();
		} else if (message.command === "add") {
			addItem();
		} else if (message.command === "addCurrent") {
			addItemCurrent();
		} 
	});
})();
