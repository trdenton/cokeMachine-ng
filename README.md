# cokeMachine

Converted Coke Machine driver in Node.JS.
# Set up:
A Raspberry Pi running Node.Js controlling a 8-Relay Board (single Coil Non-latching) to Trigger/Drive the Machine Dispensing Motors.  
- The **sold out** switches are connected to the indicated header pins in the table below and are **active low** as in, connect the other end of the switch to ground.
- The Selection **Buttons** on the front of the machine are connected to the header pins in table below and are also active low.
- The **Output pins** are connected directly to the respective relay driver on the relay board driving each bay/compartment motor.  This assumes your driver-transistors are consuming little to no current.
- This system uses stripe.com for processing.  Ensure to manage the API key at the top of the file. As-in not host it on git.

# Config File
a Configuration file in the form of a nodejs module should be placed in the directory
above these files (as in ../config.js). example content:

config = {

  herokuUrl : "site3-staging.herokuapp.com",
  
  herokuKey : "1dd4432e4000002342042422222",
  
  stripeKey: "sk_test_Jxxxxxxxxxxxxxxxxxxx",
  
  maxDelayBetweenInputBytes: 500,
  
  minDelayBetweenSuccessfulCharges: 2000,
  minDelayBetweenFaildCharges: 1500,
  inputs:          [6,13,19,26,12,16,20,21,
  		/* indicators */ 9,11,0,5,25,8,7,1],
  outputs: [17,27,22,10,4,18,23,24],
  swipeFailSoundFile: "fail.mp3",
  swipeSuccessSoundFile: "success.mp3",
  chargeFailSoundFile: "fail.mp3",
  chargeSuccessSoundFile: "success.mp3",
  soldOutSoundFile: "fail.mp3",
  test : function(foo) {return foo + " bar!";}
};

module.exports = config;




| notes | BCM Pin | Name | Header | Header  | Name  | BCM Pin | notes |
| ------| --------| -----| -------| --------| ----- | --------| ------|
| **Near Red LED**  |         | 3.3v |  1     | 2       |   5v  |         | **PCB Corner** |
|          |   2     |SDA.1 |  3     |      4  |   5V  |         |       |
|          |   3     |SCL.1 |5       | 6       |   0v  |         |       |
| **Output 4** |   4     |GPIO.7|7       | 8       |TxD    | 14      |       |
|          |         |      0v |9    | 10      | RxD   | 15      |       |
| **Output 0** |  17   |GPIO. 0| 11  | 12      |GPIO. 1 | 18     |    **Output 5**      |
| **Output 1** |  27     |GPIO.2|  13    | 14      |   0v   |     |     |     |
| **Output 2** |  22     |GPIO. 3| 15 | 16 | GPIO. 4 | 23  |  **Output 6** |
| **3V3 HIGH** |         |         3.3v |17 | 18 | GPIO. 5 | 24  |  **Output 7**  |
| **Output 3** |  10     |   MOSI |   19 |20 |   0v      |     |     |
| **SoldOut 0** |   9  |    MISO  | 21 | 22 | GPIO. 6 | 25  | **SoldOut 4** |
| **SoldOut 1**|  11 |      SCLK |   23 | 24 | CE0     | 8   | **SoldOut 5** |
| **Ground**|     |0v         | 25   | 26 | CE1     | 7   | **SoldOut 6** |
| **SoldOut 2** |   0 |   SDA.0 | 27 | 28 | SCL.0     | 1   | **SoldOut 7**  |
| **SoldOut 3** |   5 |GPIO.21 |   29 | 30 |   0v      |     | **Ground**    |
| **Button 0** |   6 | GPIO.22 |   31 | 32 | GPIO.26  | 12   | **Button 4**  |
| **Button 1** |  13 | GPIO.23 | 33 | 34       | 0v      |     | **Ground**     |
| **Button 2** |  19 |  GPIO.24  | 35 | 36 | GPIO.27 | 16  | **Button 5** |
| **Button 3** |  26 | GPIO.25   | 37 | 38 | GPIO.28 | 20  |  **Button 6** |
| **Ground** |     |      0v  | 39 | 40 |  GPIO.29 | 21  | **Button 7**  |
