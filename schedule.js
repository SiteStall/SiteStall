/*
NOTES:
	- Will need to write some variables (likely threshold and time_left) to storage in a file

*/


// Global variables
// These should be set (read from file), when the program is started. 

var threshold = .3; //Global threshold variable (amount available each day, in minutes)
var time_left = MinutesToMilliseconds(threshold); //Variable used in tracking time
var timeout; 
var interval; 

function stopTime(){
	clearTimeout(timeout);
	clearInterval(interval);
}

function timeUp(timeout){
	console.log("Start blocking!")
	stopTime();

	//Write the new time to storage file.
}

function adjustTimeLeft(){ 
    time_left -= 1000
    console.log("Time left is now:", time_left)

    if(time_left == 5000){
    	stopTime()
    	console.log("Left the blocklisted site, saving time_left as:", time_left)
    }
}


// Convert a given time in minutes to milliseconds (helper for setTimeout)
function MinutesToMilliseconds(time){
	return time*(60000)
}

function startTime(time_before_blocking){
	/*
		Function which is called when blocklisted site is present,
		begins to track time:
			- if time_before_blocking runs out, calls blocker and exits. 
			- if not distracted anymore, returns time_distracted - threshold.
	*/

	//Triggered when they visit a blockslisted site.
	timeout = setTimeout(timeUp, time_before_blocking);
	interval = setInterval(adjustTimeLeft, 1000);	
}

startTime(time_left, true)
// stopTime()
