var play = require("./audio")().play;
var config = require("../config");
var util = require('util');

/*
console.log("config:" + util.format("%s %s %s %s %s", "output: ", config.test("ga "),
                config.stripeKey,
                config.herokuKey,
                config.herokuUrl));
*/
//console.log("config:" + JSON.stringify(config));


var site3Card = require("./site3Card")(config.stripeKey,
                config.herokuKey,
                config.herokuUrl);

//play('success.mp3');
//play('fail.mp3');

/*
var card = site3Card.parseCard("%B4242424242424242^SITE3/ARMAND B ^160723?;2234234");
console.log(JSON.stringify(card));
*/

/*
site3Card.preAuth("%B4242424242424242^SITE3/ARMAND B ^160723?;2234234",
    function (charge) {

        console.log("success!");
        // capture
        site3Card.captureCharge(charge,
          function () {console.log(" capture success!") },
          function () {console.log(" capture fail!") }
           );
    } ,
function (string, charge, err) { console.log("err!" + err.code);}
);

site3Card.preAuth("%B4243424242424242^SITE3/ARMAND B ^160723?;2234234",
function (charge) { console.log("success!");} ,
function (string, charge, err) { console.log("err!" + err.code);}
);
*/

/*
site3Card.preAuth("DEADBEEF",
function (charge) { console.log("RFID success!");} ,
function (string, charge, err) { console.log(" RFID err!");}
);



site3Card.preAuth("DEADBEAT",
function (charge) { console.log("RFID success!");} ,
function (string, charge, err) { console.log(" RFID err!");}
);
*/

/*
var rfids = ["DEADBEEF", "deadbeef", "deadbeat"];

for (i=0; i < rfids.length; i++)
{
  var r = site3Card.parseCard(rfids[i]);
  site3Card.captureCharge(r,
    function (res) {console.log(" rfid " + res + " capture success!"); },
    function (res, id) {console.log(" rfid " + res + "capture fail! for: " + id); }
     );
}
*/




/*
      site3Card.captureCharge(rfid2,
        function () {console.log(" rfid " + rfid + "capture success!") },
        function () {console.log(" rfid " + + rfid + "capture fail!") }
         );
*/


// set up buttons and empty indicators
var cokeIO = require("./cokeIO")(config.inputs, config.outputs);

// cokeIO.printInputs();
// cokeIO.dispenseAt(1);
/*
cokeIO.tryDispensing(
  function (pin){
    console.log("selected  :" + pin);
  },
  function (err, success){
    console.log("failed selection: " + err);
  }
  );
*/

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

process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);
console.log("Ready. Type quit to do it:");

// this real main function where things start
process.stdin.on('readable', function () {
  var key = String(process.stdin.read());
  //console.log("got: " + key);

  // if we are still receiving bytes,
  // delay prevent the call to process
  // the input
  if (currentTimeoutId != null)
	clearTimeout(currentTimeoutId);

  // manual exit command
  if (currentCardData + key == "quit") exit();

  // accumulate the bytes
  currentCardData += key;

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

});

process.stdin.on('end', function() {
            process.stdout.write('end');
	exit();
});
