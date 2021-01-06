var eggXLoc = ["30%","5%","5%","55%","55%","5%","30%","30%","55%"]
var eggYLoc = ["35%","10%","60%","60%","10%","35%","10%","60%","35%"]
var eggCount = checkEggCount();
var eggPositions = checkEggPositions();
var eggBinFull = !eggPositions.includes(0);
var eggLayTime = checkEggLayTime();
var timeEggLayWasSet = checkTimeEggLayWasSet();
var lenDay = checkLenDay();

checkChickenName()

checkTime()

setInterval(showTime, 1000);

function showTime() {
	let isVisible = document.getElementById("red_blink").style.visibility;

	if(isVisible == "visible")
		document.getElementById("red_blink").style.visibility = "hidden";
	else
		document.getElementById("red_blink").style.visibility = "visible";

	// Get time
	let time = new Date();
	let hour = time.getHours();
	let min = time.getMinutes();
	let sec = time.getSeconds();
	let offset = time.getTimezoneOffset()*60;
	let currentTime = (Math.floor(time.getTime()/1000) - offset)*1000;
	let am_pm = "AM";


	// Check if egg has been laid
	if(eggLayTime == currentTime) {
		genEgg(); // Lay the egg
		timeEggLayWasSet = getSecs(hour, min, sec); // Hour, min, and sec when egg lay time was set
		eggLayTime = getNextEggTime(currentTime, timeEggLayWasSet); // Set new egg lay time

		let divChicken = document.getElementById("div_chickens");

		divChicken.style.zIndex = 0;
		divChicken.removeChild(document.getElementById("chicken"));
	}

	//Check if chicken is on the nest (only when egg bin is not full)
	if( (eggLayTime-currentTime) < lenDay/48.0 & eggBinFull == false) {
		
		let divChicken = document.getElementById("div_chickens");
		divChicken.style.zIndex = 1001;

		if(divChicken.childNodes.length == 0) {
			var newChicken = document.createElement("img");
			newChicken.src = "Images/Chicken.png";
			newChicken.id = "chicken";
			newChicken.style.width = "500px";
			divChicken.appendChild(newChicken);
		}

	}


	if(min < 10) {
		min = "0" + min;
	}

	if(sec < 10) {
		sec = "0" + sec;
	}

	if(hour > 12) {
		am_pm = "PM";
		hour = hour - 12;
	}

	if(hour == 12) {
		am_pm = "PM";
	}

	if(hour == 0) {
		hour = 12
	}

	document.getElementById("clock").innerHTML = "Real Time: " + hour + ":" + min + ":" + sec + " " + am_pm;

	var inGameTimeSection = currentTime % lenDay
	var inGameTimeHr = Math.floor(inGameTimeSection / (lenDay/24))
	var inGameTimeMin = Math.floor((inGameTimeSection % (lenDay/24)) / (lenDay/1440.0))

	var inGameAMPM = "AM"

	if(inGameTimeHr > 12) {
		inGameAMPM = "PM"
		inGameTimeHr = inGameTimeHr - 12
	}

	if(inGameTimeHr == 12) {
		inGameAMPM = "PM";
	}

	if(inGameTimeHr == 0) {
		inGameTimeHr = 12
	}


	if(inGameTimeMin < 10) {
		inGameTimeMin = "0" + inGameTimeMin;
	}

	document.getElementById("game_clock").innerHTML = "In-Game Time: " + inGameTimeHr + ":" + inGameTimeMin + " " + inGameAMPM;

}

function getSecs(currentHour, currentMin, currentSec) {
	var secs = currentHour*3600 + currentMin*60 + currentSec;
	return secs;

}

function getNextEggTime(currentTime, currentSec) {

	let lenDayInSec = lenDay / 1000
	let maxTimeToNextMorningInSec = lenDayInSec * 1.25
	let eggLayingPeriodInSec = lenDayInSec * 0.25
	let secAlreadyPassed = currentSec % lenDayInSec

	let timeToNextMorningInSecs = maxTimeToNextMorningInSec - secAlreadyPassed;

	var randomTimeInSec = Math.floor(Math.random() * eggLayingPeriodInSec);

	var eggLayTime = 1000*(randomTimeInSec + timeToNextMorningInSecs) + currentTime;

	setCookie("egg_lay_time", eggLayTime, 365);
	setCookie("time_egg_set", currentSec, 365);

	return eggLayTime;

}

function checkTime() {

	// Get time
	let time = new Date();
	let hour = time.getHours();
	let min = time.getMinutes();
	let sec = time.getSeconds();
	let offset = time.getTimezoneOffset()*60;
	let currentTime = (Math.floor(time.getTime()/1000) - offset)*1000;
	let am_pm = "AM";

	// Check if the egg has been laid
	// If dayCheck is greater than 0, the egg laid time has been passed
	// If dayCheck is greater than the length of a "day", multiple days have past (and multiple eggs have been laid)
	let dayCheck = currentTime - eggLayTime; 

	// If multiple days have passed after the egg laid time...
	if(dayCheck >= lenDay & eggLayTime != 0) {
		var numDaysPassed = Math.floor(dayCheck / lenDay);

		// Lay an egg for each day passed
		for(interval = 0; interval < numDaysPassed; interval++) {
			genEgg();
		}

		// Select a new random egg laying time

		let newDawn = eggLayTime + numDaysPassed*lenDay;

		eggLayTime = getNextEggTime(newDawn, timeEggLayWasSet);

	}

	if(eggLayTime == 0) {
		timeEggLayWasSet = getSecs(hour, min, sec);
		eggLayTime = getNextEggTime(currentTime, timeEggLayWasSet);

	}

	if(eggLayTime <= currentTime) {
		genEgg();
		timeEggLayWasSet = getSecs(hour, min, sec);
		eggLayTime = getNextEggTime(currentTime, timeEggLayWasSet);
	}


	if(min < 10) {
		min = "0" + min;
	}

	if(hour > 12) {
		am_pm = "PM";
		hour = hour - 12;
	}
	
	if(hour == 12) {
		am_pm = "PM";
	}

	if(hour == 0) {
		hour = 12
	}

	document.getElementById("clock").innerHTML = "Real Time: " + hour + ":" + min + ":" + sec + " " + am_pm;

	var inGameTimeSection = currentTime % lenDay
	var inGameTimeHr = Math.floor(inGameTimeSection / (lenDay/24))
	var inGameTimeMin = Math.floor((inGameTimeSection % (lenDay/24)) / (lenDay/1440.0))
	var inGameAMPM = "AM"

	if(inGameTimeHr > 12) {
		inGameAMPM = "PM"
		inGameTimeHr = inGameTimeHr - 12
	}

	if(inGameTimeHr == 12) {
		inGameAMPM = "PM";
	}

	if(inGameTimeHr == 0) {
		inGameTimeHr = 12
	}

	if(inGameTimeMin < 10) {
		inGameTimeMin = "0" + inGameTimeMin;
	}

	document.getElementById("game_clock").innerHTML = "In-Game Time: " + inGameTimeHr + ":" + inGameTimeMin + " " + inGameAMPM;
}

function updateLenDay() {

	let lenDayInMins = parseInt(document.getElementById("input_len_day").value);
	lenDay = lenDayInMins*60*1000;
	setCookie("len_day", lenDay, 365);
	document.getElementById("txt_len_day").innerHTML = "Length of Day in Mins:" + lenDayInMins

	eggLayTime = 0;
	checkTime();

}


function addEggImg(i) {
	var newEgg = document.createElement("img");
	newEgg.src = "Images/whiteEgg.png";
	var eggId = "egg_" + i;
	newEgg.id = eggId;

	var randDeg = Math.floor(Math.random() * 360);

	newEgg.style.cssText ='-webkit-transform:rotate(' + randDeg + 'deg); -moz-transform:rotate(' + randDeg + 'deg); -o-transform:rotate(' + randDeg + 'deg); -ms-transform:rotate(' + randDeg + 'deg); transform:rotate(' + randDeg + 'deg);';

	newEgg.style.position = "absolute";

	newEgg.style.left = eggXLoc[parseInt(i)];
	newEgg.style.top = eggYLoc[parseInt(i)];
		

	newEgg.onclick = function() {
		eggBinFull = false;

		var divEggs = document.getElementById("div_eggs")
		divEggs.removeChild(document.getElementById(eggId));
		eggCount += 1;
		setCookie("egg_count", eggCount, 365);

		eggIndex = parseInt(eggId.split("_")[1]);
		eggPositions[eggIndex] = 0;
		setCookie("egg_positions", eggPositions.toString(), 365);

		if(eggCount == 1)
			document.getElementById("txt_egg_count").innerHTML = "You have collected 1 egg.";
		else
			document.getElementById("txt_egg_count").innerHTML = "You have collected " + eggCount + " eggs.";

		if (divEggs.childNodes.length == 0) // If there are no eggs
			id_lastEggAdded = 0;

	}
	document.getElementById("div_eggs").appendChild(newEgg);
}


function genEgg() {

	if(eggBinFull == false) {

		var i;
		for(i = 0; i <= eggPositions.length; i++) {
			if(eggPositions[i] == 0) {
				eggPositions[i] = 1;
				setCookie("egg_positions", eggPositions.toString(), 365);
				break;
			}
		}

		if(i >= eggPositions.length)
			eggBinFull = true;

		else {
			addEggImg(i);
		}
	}
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";SameSite=Strict;" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
    	}
    	if (c.indexOf(name) == 0) {
    		return c.substring(name.length, c.length);
    	}
    }
  return "";
}


//Cookie Checks

function checkEggCount() {
	var count = getCookie("egg_count");
	if(count == "") {
		return 0
	}

	if(count == 1)
		document.getElementById("txt_egg_count").innerHTML = "You have collected 1 egg.";
	else
		document.getElementById("txt_egg_count").innerHTML = "You have collected " + count + " eggs.";

	return parseInt(count);
}

function checkChickenName() {
	var name = getCookie("chicken_name");
	if (name == "") {
		name = prompt("Please enter a name for your first chicken:", "");
		if (name != "" && name != null) {
			setCookie("chicken_name", name, 365);
		}
		else {
			name = "Chicken";
		}
	}
	document.getElementById("txt_chicken_count").innerHTML = "You have 1 chicken named " + name + ".";
} 

function checkEggPositions() {
	var pos = getCookie("egg_positions");
	if(pos == "") {
		return [0,0,0,0,0,0,0,0,0];
	}
	else {
		var posArray = pos.split(",")

		for(index = 0; index < posArray.length; index++) {
			let eggStatus = parseInt(posArray[index]);
			posArray[index] = eggStatus;

			if(eggStatus == 1)
				addEggImg(index);

		}
		return posArray;
	}
}

function checkEggLayTime() {
	var cookieEggLayTime = getCookie("egg_lay_time");

	if(cookieEggLayTime == "") {
		return 0;
	}

	return parseInt(cookieEggLayTime);

}

function checkTimeEggLayWasSet() {
	var cookieTimeEggLayWasSet = getCookie("time_egg_set");

	if(cookieTimeEggLayWasSet == "") {
		return 0;
	}

	return parseInt(cookieTimeEggLayWasSet);

}

function checkLenDay() {
	var cookieLenDay = getCookie("len_day");

	if(cookieLenDay == "") {
		return 86400000.0;
	}

	document.getElementById("txt_len_day").innerHTML = "Length of Day in Mins:" + parseInt(cookieLenDay)/60000;

	return parseInt(cookieLenDay);

}