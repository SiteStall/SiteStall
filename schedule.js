/*
NOTES:
	- Will need to write some variables (likely threshold and time_left) to storage in a file

	TODO: 

		- Connect this to the blocking module, so functions are called each time.
		- Deal with I/O to save threshold and time_left

		- Can use local storage.

		window.location.url()
*/


// Global variables
// These should be set (read from file), when the program is started. 

var threshold = .3; //Global threshold variable (amount available each day, in minutes)
var time_left = MinutesToMilliseconds(threshold); //Variable used in tracking time
var timeout; 
var interval; 

function MinutesToMilliseconds(time){
	/*
		Convert a given time in minutes to milliseconds (helper for setTimeout)
	*/
	return time*(60000)
}

function timeUp(timeout){
	/*
		Called if user is on blocklisted site and runs out of time.
	*/
	console.log("Start blocking!")
	stopTime();

	//Write the new time to storage file.
}

function adjustTimeLeft(){ 
	/*
		Function which decrements the time left every second.
	*/
    time_left -= 1000
    console.log("Time left is now:", time_left)

    if(time_left == 5000){
    	stopTime()
    	console.log("Left the blocklisted site, saving time_left as:", time_left)
    }
}

function startTime(time_before_blocking){
	/*
		Function which is called when a user visits a blocklisted site,
		begins to track time:
	*/

	//Triggered when they visit a blockslisted site.
	timeout = setTimeout(timeUp, time_before_blocking);
	interval = setInterval(adjustTimeLeft, 1000);	
}

function stopTime(){
	/*
		Function which is called when a user visits a non-blocklisted site
	*/
	clearTimeout(timeout);
	clearInterval(interval);

	//Write the new time to storage file.
}

startTime(time_left, true)
// stopTime()
