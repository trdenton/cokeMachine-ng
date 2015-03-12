# cokeMachine

| notes | BCM Pin | Name | Header | Header  | Name  | BCM Pin | notes |
|       |         | 3.3v |  1     | 2       |   5v  |         |       |
|       |   2     |SDA.1 |  3     |      4  |   5V  |         |       |
|       |   3     |SCL.1 |5       | 6       |   0v  |         |       |
|       |   4     |GPIO.7|7       | 8       |TxD    | 14      |       |
  |       |         |      0v |9    | 10      | RxD   | 15  |  |
  |       |  17     |GPIO. 0| 11  | 12      |GPIO. 1 | 18  |    |
|       |  27     |GPIO.2|  13    | 14      |   0v   |     |     |     |
|       |  22     |GPIO. 3| 15 | 16 | GPIO. 4 | 23  | |
|       |         |         3.3v |17 | 18 | GPIO. 5 | 24  |  |
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
*/

// set up buttons and empty indicators
 var inputs  =  [6,13,19,26,12,16,20,21,   // inputs
                 9,11,0,5,25,8,7,1 ];      // empty bay indicators

 var outputs = [17,27,22,10,15,18,23,24];
