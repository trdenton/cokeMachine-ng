var http = require('https');

module.exports = site3Card;

site3Card.prototype.captureCharge = captureCharge;
site3Card.prototype.parseCard = parseCard;
site3Card.prototype.preAuth =preAuth;
site3Card.prototype.parseCard = parseCard;
site3Card.prototype.captureChargeRfid = captureChargeRfid;

var herokuToken;

function site3Card(stripeKey, herokuKey)
{
	if (!(this instanceof site3Card))
		return new site3Card(stripeKey, herokuKey);

	this.stripe = require("stripe")(stripeKey);
	herokuToken = herokuKey;
	console.log("site3 card init: " + stripeKey, herokuKey);
}

function parseCard(string)
{
	var card = {};
	if (string.indexOf("%B") != 0)
	{
		if (string.length == 8)
		{
			console.log("Rfid: " + string);
			card.number = string;
			card.object = "rfid";
			return card;
		}
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
	//console.log("card:  %j", card);

	return card;
}

function preAuth(string, success, fail)
{
	if (string.length < 4)
	{ fail("nocard"); return; }

	if (string.length == 8)
	{
		success(parseCard(string));
		return;
	}

	var out = this.stripe.charges.create({
		amount: 500,
		currency: "cad",
		source: parseCard(string),
		capture: false,
		description: "Charge for refereshments"
	}, function(err, charge) {
		// asynchronously called
		if (charge !== null && charge["status"] == "paid")
		{
			console.log("Authorized!");
			success(charge);
		}
		else
		{
			//console.log("charge: %j error: %j", charge, err);
			fail("chargeError", charge, err);
			// done here
		}
	});
}

function captureCharge(charge, success, fail)
{
	if (charge.object == 'rfid')
	{
		captureChargeRfid(charge.number, success, fail);
		return;
	}

	this.stripe.charges.capture(charge.id, function(err, chargeInfo) {
		// asynchronously called
		if (charge !== null && charge["status"] == "paid")
			success(charge);
		else
			fail(err);
	});
}

function captureChargeRfid(Rfid, success, fail)
{
	var host = "site3.herokuapp.com";
	var query = "/purchases?rfid=" + Rfid + "&token=" + herokuToken;
	console.log("query: " + query);
	http.get(
		{
			hostname : host,
			path : query,
			method: 'POST'
		}
		, function(res)
		{
			console.log("status: " + res.statusCode);
			res.on('data',
				function(res) {
					console.log("Received Data:" + res);
					if ('{"status":0}' == res)
						success();
					else
						fail(res);
				}
			);
		}).on('error', fail);
}
