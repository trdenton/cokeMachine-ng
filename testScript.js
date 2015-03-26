var play = require("./audio")().play;
var site3Card = require("./site3Card")("sk_test_","secret");

//play('success.mp3');
//play('fail.mp3');

/*
var card = site3Card.parseCard("%B4242424242424242^RAZ/ARMAND B ^160723?;2234234");
console.log(JSON.stringify(card));
*/

/*
site3Card.preAuth("%B4242424242424242^RAZ/ARMAND B ^160723?;2234234",
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

site3Card.preAuth("%B4243424242424242^RAZ/ARMAND B ^160723?;2234234",
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
var rfid = site3Card.parseCard("DEADBEEF");

site3Card.captureCharge(rfid,
  function () {console.log(" rfid capture success!") },
  function () {console.log(" rfid capture fail!") }
   );

var rfid = site3Card.parseCard("DEADBEAT");

   site3Card.captureCharge(rfid,
     function () {console.log(" rfid capture success!") },
     function () {console.log(" rfid capture fail!") }
      );

*/

// set up buttons and empty indicators
var inputs  =          [6,13,19,26,12,16,20,21,
		/* indicators */ 9,11,0,5,25,8,7,1];

var outputs = [17,27,22,10,4,18,23,24];

var cokeIO = require("./cokeIO")(inputs, outputs);
cokeIO.printInputs();
cokeIO.dispenseAt(1);
