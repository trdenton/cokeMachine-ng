var play = require("./audio")().play;
var config = require("../config");
var util = require('util');
var fs = require('fs');
var kbc = require('linux-keyboard-catcher');

var site3Card = require("./site3Card")(config.stripeKey,
	config.herokuKey,
	config.herokuUrl);

// set up buttons and empty indicators
var cokeIO = require("./cokeIO")(config.inputs, config.outputs);

// this is part of the mechanism that prevent
// multiple charges going through rapidly.
// via multiple rfid scans or card swipes
function disableChargeInProgress(delay)
{
	setTimeout(function()
		{
			console.log("ready for next card.");
			chargeInProgress = null;
		}, delay);
}

// called when the card has been pre authorized
// on successful selection, call capture (which will then dispense on success)
// o fail: move back to the main loop
function attemptDispensing(charge)
{
	cokeIO.tryDispensing(
		// on successful selection of a button
		// and supply bay is not empty
		function (pin){
			console.log("selected  :" + pin);

			// charge here
			site3Card.captureCharge(charge,
				// on Success:
				function (res) {
					console.log(" card " + res + " capture success!");
					play(config.chargeSuccessSoundFile);
					// charge has succeed so, dispense
					cokeIO.dispenseAt(pin);
					disableChargeInProgress(config.minDelayBetweenSuccessfulCharges);
				},
				// on fail:
				function (res, id) {
					console.log(" card " + res + "capture fail! for: " + id);
					play(config.chargeFailSoundFile);
					disableChargeInProgress(config.minDelayBetweenFailedCharges);
				}
			);
		},
		// either timed out, or selected a
		// soldout item.
		// on soldout item just play sounds since the user has
		// changes to make other selection
		function (err, success){
			console.log("failed selection: " + err);
			play(config.soldOutSoundFile);
			// if it's a timeout error, then
			// we are done, because the user walked away, or gave up,
			// or failed to make a selection in the allowed time.
			if (err = "timedout");
			disableChargeInProgress(config.minDelayBetweenFailedCharges);
		}
	);
}

// the main processing head
function processInput(cardString)
{
	// try to pre authorize the card
	// if successful: move towards dispensing (attemptDispensing)
	// if fail: back out to the main loop
	site3Card.preAuth(cardString,
		function (charge) {
			console.log("Auth success: " + cardString);
			chargeInProgress = charge;
			play(config.swipeSuccessSoundFile);
			// try dispense
			attemptDispensing(charge);
		} ,
		function (string, charge, err) {
			console.log(" RFID err!");
			play(config.swipeFailSoundFile);
			disableChargeInProgress(config.minDelayBetweenFailedCharges);
		}
	);
}


// need to clean up the io before exit
// otherwise gpio may not be available to
// other users
function exit()
{
	cokeIO.exit();
	process.exit();
}

var currentTimeoutId = null;
var currentCardData = "";
var chargeInProgress = null;

console.log("Ready. Type quit to do it:");



kb_keyfob = new kbc.LinuxKeyboardCatcher()
kb_magstripe = new kbc.LinuxKeyboardCatcher()


kb_keyfob.on('opened', () => console.log("Opened kb_keyfob"));
kb_keyfob.on('closed', () => console.log("Closed kb_keyfob"));
kb_keyfob.on('error', (message) => console.log("kb_keyfob Error: ",message));
kb_keyfob.open(config.keyfob,false)
	.then(()=>console.log("kb_keyfob stream opened"))
	.catch((e)=>console.log("kb_keyfob Exception",e));

kb_magstripe.on('opened', () => console.log("Opened kb_magstripe"));
kb_magstripe.on('closed', () => console.log("Closed kb_magstripe"));
kb_magstripe.on('error', (message) => console.log("kb_magstripe Error: ",message));
kb_magstripe.open(config.magstripe,false)
	.then(()=>console.log("kb_magstripe stream opened"))
	.catch((e)=>console.log("kb_magstripe Exception",e));

// this real main function where things start
kb_keyfob.on('event', processKeystroke);
kb_magstripe.on('event', processKeystroke);

//this handles both the keyfob and the magstripe
//technically this will fall apart if someone manages to do rfid and magstripe at the same time
//but it will just generally fail and shouldnt cause harm
function processKeystroke(keyEvent) {
	if (keyEvent.value > 0 ) {
		if (keyEvent.alt === false && keyEvent.meta === false && keyEvent.control === false) {
			if (keyEvent.mapped) {
				currentCardData += keyEvent.mapped;
			}
		}
	}

	// if we are still receiving bytes,
	// delay prevent the call to process
	// the input
	if (currentTimeoutId != null)
		clearTimeout(currentTimeoutId);

	// the data comes in trickles, so
	// try to send them for processing in the future
	// if more data arrive the call will be cancelled
	// otherwise with a sufficient delay, the timeout
	// will run the following function
	currentTimeoutId = setTimeout(function()
		{

			currentCardData = currentCardData.trim();
			process.stdout.write("\nread: " + currentCardData);

			// if no existing charge is progress and real data has arrived
			// pricess the input
			// otherwise ignore garbage data
			if(chargeInProgress == null && currentCardData.length > 4)
			{
				process.stdout.write(" Ok: processing it.");
				// this is the head of the calling tree
				// and will take care of all branches.
				processInput(currentCardData);
			}
			currentCardData = "";
		},
		config.maxDelayBetweenInputBytes);

}
