# cokeMachine

| notes | BCM Pin | Name | Header | Header  | Name  | BCM Pin | notes |
| ------| --------| -----| -------| --------| ----- | --------| ------|
|       |         | 3.3v |  1     | 2       |   5v  |         |       |
|       |   2     |SDA.1 |  3     |      4  |   5V  |         |       |
|       |   3     |SCL.1 |5       | 6       |   0v  |         |       |
|       |   4     |GPIO.7|7       | 8       |TxD    | 14      |       |
|       |         |      0v |9    | 10      | RxD   | 15      |       |
|       |  17   |GPIO. 0| 11  | 12      |GPIO. 1 | 18     |          |
|       |  27     |GPIO.2|  13    | 14      |   0v   |     |     |     |
|       |  22     |GPIO. 3| 15 | 16 | GPIO. 4 | 23  | |
|       |         |         3.3v |17 | 18 | GPIO. 5 | 24  |  |
| |  10 MOSI |   19 |20 |   0v      |     |     |
| |   9  |    MISO  | 21 | 22 | GPIO. 6 | 25  | |
| |  11 |      SCLK |   23 | 24 | CE0     | 8   | |
| |     |0v         | 25   | 26 | CE1     | 7   | |
|  |   0 |   SDA.0 | 27 | 28 | SCL.0     | 1   | |
|  |   5 |GPIO.21 |   29 | 30 |   0v      |     |     |
| |   6 | GPIO.22 |   31 | 32 | GPIO.26  | 12   |   |
| |  13 | GPIO.23 | 33 | 34       | 0v      |     |     |
| |  19 |  GPIO.24  | 35 | 36 | GPIO.27 | 16  | |
| |  26 | GPIO.25   | 37 | 38 | GPIO.28 | 20  |  |
 |     |     |      0v  | 39 | 40 |  GPIO.29 | 21  | |

// set up buttons and empty indicators
 var inputs  =  [6,13,19,26,12,16,20,21,   // inputs
                 9,11,0,5,25,8,7,1 ];      // empty bay indicators

 var outputs = [17,27,22,10,15,18,23,24];
