
// set up required objects
var Gpio = require('onoff').Gpio;
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { /* sys.puts(stdout) */ }
function putstr(error, stdout, stderr) { sys.puts(stdout) }

var stripe = require('stripe')(' your stripe API key ');


/*
+-----+-----+---------+------+---+--B Plus--+---+------+---------+-----+-----+
 | BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
 +-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
 |     |     |    3.3v |      |   |  1 || 2  |   |      | 5v      |     |     |
 |   2 |   8 |   SDA.1 |   IN | 1 |  3 || 4  |   |      | 5V      |     |     |
 |   3 |   9 |   SCL.1 |   IN | 1 |  5 || 6  |   |      | 0v      |     |     |
 |   4 |   7 | GPIO. 7 |   IN | 1 |  7 || 8  | 0 | IN   | TxD     | 15  | 14  |
 |     |     |      0v |      |   |  9 || 10 | 1 | ALT0 | RxD     | 16  | 15  |
 |  17 |   0 | GPIO. 0 |   IN | 0 | 11 || 12 | 0 | IN   | GPIO. 1 | 1   | 18  |
 |  27 |   2 | GPIO. 2 |   IN | 0 | 13 || 14 |   |      | 0v      |     |     |
 |  22 |   3 | GPIO. 3 |   IN | 0 | 15 || 16 | 0 | IN   | GPIO. 4 | 4   | 23  |
 |     |     |    3.3v |      |   | 17 || 18 | 0 | IN   | GPIO. 5 | 5   | 24  |
 |  10 |  12 |    MOSI |   IN | 0 | 19 || 20 |   |      | 0v      |     |     |
 |   9 |  13 |    MISO |   IN | 0 | 21 || 22 | 0 | IN   | GPIO. 6 | 6   | 25  |
 |  11 |  14 |    SCLK |   IN | 0 | 23 || 24 | 1 | IN   | CE0     | 10  | 8   |
 |     |     |      0v |      |   | 25 || 26 | 1 | IN   | CE1     | 11  | 7   |
 |   0 |  30 |   SDA.0 |   IN | 1 | 27 || 28 | 1 | IN   | SCL.0   | 31  | 1   |
 |   5 |  21 | GPIO.21 |   IN | 1 | 29 || 30 |   |      | 0v      |     |     |
 |   6 |  22 | GPIO.22 |   IN | 1 | 31 || 32 | 0 | IN   | GPIO.26 | 26  | 12  |
 |  13 |  23 | GPIO.23 |   IN | 0 | 33 || 34 |   |      | 0v      |     |     |
 |  19 |  24 | GPIO.24 |   IN | 0 | 35 || 36 | 0 | IN   | GPIO.27 | 27  | 16  |
 |  26 |  25 | GPIO.25 |   IN | 0 | 37 || 38 | 0 | IN   | GPIO.28 | 28  | 20  |
 |     |     |      0v |      |   | 39 || 40 | 1 | OUT  | GPIO.29 | 29  | 21  |
 +-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
 | BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
 +-----+-----+---------+------+---+--B Plus--+---+------+---------+-----+-----+

%B4500030113633865^RAZ/ARMAND B ^1709201055660019020000078000000?;4500030113633865=17092010556607890201?
%B4500030113633865^RAZ/ARMAND B ^1709201055660019020000078000000?;4500030113633865=17092010556607890201?


*/

// set up buttons and empty indicators
 var inputs  =          [6,13,19,26,12,16,20,21,
		/* indicators */ 9,11,0,5,25,8,7,1];

 var outputs = [17,27,22,10,15,18,23,24];

var inputGpios = new Array();
var outputGpios = new Array();

function bitField(value)
{
		this.value = (!isNaN(parseFloat(value)) && isFinite(value))? value : 0;
		this.getBit = function(bitNumber) { return (this.value >> bitNumber)& 0x1 }
        this.setBit = function(bitNumber, value) {
                        if (value == 0)
                        { this.value &= 0x7FFFFFFF  & ~(1 << bitNumber); }
                else
                        { this.value |= 0x1 << bitNumber; }
         }

}

function parseCard(string)
{
        var card = {};
        if (string.indexOf("%B") != 0)
        {
                console.log("Bad Card: " + string);
                return null;
        }

        string = string.substr(2);
        var ar = string.split('^');
        card.number = ar[0];
        var name = ar[1].split('/');
        card.name = name[1]+name[0];
        card.exp_year = ar[2].substr(0,2);
        card.exp_month = ar[2].substr(2,2);
	card.object = "card";
    return card;
}


function chargeCard(amountCAD, card, description)
{

	var charge = stripe.charges.create({
  	amount: amountCAD,
  	currency: "cad",
  	source: card,
	description: description
	}, function(err, charge) {
  		// asynchronously called
	});

	if (charge.status == "succeeded")
		return true;
	else
		return false;
}



function setupInputs()
{
    for (var i = 0; i < inputs.length; i++)
    {
	    exec("gpio -g write " + inputs[i] + " 0", puts);
	    exec("gpio -g mode " + inputs[i] + " in", puts);
	    exec("gpio -g mode " + inputs[i] + " up ", puts);
	    inputGpios[i] = new Gpio(inputs[i], 'in','both');
    }
}

function setupOutputs()
{
    for (var i=0; i < outputs.length; i++)
    {
	    exec("gpio -g mode " + outputs[i] + " out", puts);
	    exec("gpio -g write " + outputs[i] + " 1 ", puts);
	    outputGpios[i] = new Gpio(outputs[i], 'out');
    }
}

function sleep(miliseconds)
{
  var end = new Date().getTime() + miliseconds;
  while(new Date().getTime() < end);
}

function printInputs()
{
  var btns = new bitField(0);

  for (var i=0; i < inputs.length; i++)
    {
		    btns.setBit(i, inputGpios[i].readSync());
//		    if (inputGpios[i].readSync() != 0)
//				    console.log(" not zero: " + inputs[i]);
    }
				console.log("Buttons: 0x" + btns.value.toString(16) );
				console.log("Buttons: 0b" + btns.value.toString(2) );

}


function exit() {
  for (var i =0; i < outputGpios.length; i++)
      outputGpios[i].unexport();
  for (var i =0; i < inputGpios.length; i++)
      inputGpios[i].unexport();

  process.exit();
}

process.on('SIGINT', exit);

// arduino style setup
function setup()
{
    setupInputs();
    setupOutputs();
}

function verifyCard(data)
{
    if (data.length < 16)
    {
        console.log("Looks Like RFID");
        return true;
    }
    else
    {
        console.log("looks like Credit Card");
        return chargeCard(500,
	parseCard(data),
	"Site3 Refereshments"); 
    }
    return false;
}

function dispense()
{
    console.log("Choose Booze");
    
    buttonsStart = 0;
    buttonsEnd = 7;
    var i= buttonsStart;
    var end = new Date().getTime() + 45000; // 45 seconds
    while(i <= buttonsEnd && (new Date().getTime()) < end )
    {
        // is there button down?

	if (inputGpios[i].readSync() != 1)
            {
                console.log("button " + i + "down!");

                printInputs();

                // are we out of it?
                if (inputGpios[i+8].readSync() == 0)
                {
                    console.log("we are out of that thing");
                    return false;
                }

                // all good dispense the can.
		console.log("dispensing out of: ["+i+"] which is bcmGPIO: " + outputs[i] );
                outputGpios[i].writeSync(1);
                sleep(1000);
                outputGpios[i].writeSync(0);

                return true;
            }
        i++;
        if (i > buttonsEnd)
            i = buttonsStart;
    }
	console.log("Waited too long!");

}

setup();

main();

function main() 
{
    var readline = require('readline'),
	rl = readline.createInterface(process.stdin, process.stdout);

    rl.setPrompt('CokePi> ');
    rl.prompt();

    rl.on('line', function(line) {

     if (verifyCard(line.trim()))
     {
        console.log('Success');
        if (dispense() == true)
        {
            console.log('dispensed');
        }
     }

      rl.prompt();
    }).on('close', function() {
      console.log('Have a great day!');
      exit();
    });

}








