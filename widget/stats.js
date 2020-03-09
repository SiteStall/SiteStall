/* 
 * Call the topSites API to get pages that the user has visited frequently. Display on stats.html
 * 
 * Author: Claire Kolln
 * 
 * Args: None
 * 
 * Returns: None
 */ 

function getTopSites() {
    var top_div = document.getElementById("top");
    var gettingTopSites = browser.topSites.get({
        onePerDomain: true,
        limit: 10,
        includeFavicon: true
    });

    gettingTopSites.then(top => {
        console.log(top);
        for (var x = 0; x < top.length ; x++) {
            var new_div = document.createElement("DIV");
            new_div.classList.add("topsites");
            
            // get the favicon for the site
            var node = document.createElement("IMG");
            node.classList.add("icons");
            node.display = "absolute";
           
            if (top[x].favicon == null) {
                node.src = '../icons/anonymous.png';
            }
            else {
                node.src = top[x].favicon;
            }

            // get the title
            var span = document.createElement("P");
            span.classList.add("titles");

            // if no title, use url
            if (top[x].title == "") {
                var textnode = document.createTextNode(top[x].url);
            }
            else {
                var textnode = document.createTextNode(top[x].title);         
            }

            span.appendChild(textnode);
            new_div.appendChild(node);
            new_div.appendChild(span);
            
            top_div.appendChild(new_div);
        }
    })
}

/*
 * Use data to render pie chart
 * 
 * Author: Claire Kolln
 * 
 * Args: two data arrays
 * 
 * Returns: None
 */ 

function renderChart(data,labels) {
    var ctx = document.getElementById('reasonChart').getContext('2d');
    // console.log("made ctx");
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#e1bf64',
                    '#64462d',
                    '#da7559',
                    '#8fb48c',
                    '#45281b'
                ]
            }],
        },
        options: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                position: 'top',
                fontFamily: "'Lucida Console', 'Monaco', 'monospace'",
                text: "Your reasons for staying distracted",
                padding: 15,
                fontColor: 'black',
                fontSize: 18
            }
        }
    });
}

/*
 * Dynamically list the "other" reasons
 * 
 * Author: Claire Kolln
 * 
 * Args: list
 * 
 * Returns: None
 */ 
function listOther(other) {
    // get the other reasons from the list
    // Add them, if there are none -> display that
    console.log(other);
    var list = document.getElementById("other_list");
    var node = document.createElement("H3");                
    var textnode = document.createTextNode("Other Reasons you stayed distracted:");         
    node.appendChild(textnode);                              
    document.getElementById("other").insertBefore(node,list); 

    if (other.length == 0) {
        var node = document.createElement("LI");                 
        var textnode = document.createTextNode("There is no data to display!");         
        node.appendChild(textnode);                              
        list.appendChild(node); 
    }

    for (var i = 0; i < other.length ; i++) {
        var node = document.createElement("LI");                 
        var textnode = document.createTextNode(other[i]);         
        node.appendChild(textnode);                              
        list.appendChild(node); 
    }
}

/*
 * Get data from local storage and pass to functions above
 * 
 * Author: Claire Kolln
 * 
 * Args: None
 * 
 * Returns: None
 */ 
function getData() {

    let gettingReasons = browser.storage.local.get("reasons");
    gettingReasons.then(results => {

        // if there are no reasons stored, display that
        console.log("Getting reasons");
        if (!results.reasons) {
            document.getElementById("pie-chart").innerHTML = '<p> You have not gone past your time limit so there is no distraction data to display. Good job staying focused!</p>';
            console.log("There are no saved reasons -> user hasn't chosen to stay distracted");
        }
        else {

            // get all the non-other justifications
            var data = Object.values(results.reasons.default);
            var labels = Object.keys(results.reasons.default);
            
            // add the other count
            data.push(Object.keys(results.reasons.other).length);
            labels.push("Other");

            renderChart(data,labels);
            listOther(results.reasons.other);

        }
    })
}

// MAIN CALL ON PAGE LOAD
getData();
getTopSites();
