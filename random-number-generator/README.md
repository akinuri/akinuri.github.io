# Random Number Generator

A tiny tool to generate random numbers.

## Example

```javascript
    
// random()
random(); //0.32717961551564256
// random(max)
random(20); // 5
// random(min, max)
random(5, 20); // 14


// [].random(count)
[].random(6); // [0.7171, 0.0673, 0.9486, 0.4951, 0.4148, 0.2306]

// [].random(count, max)
[].random(6, 20); // [7, 4, 10, 11, 15, 15]

// [].random(count, min, max)
[].random(6, 5, 20); // [9, 6, 18, 16, 16, 13]

// [].random(count, min, max, unique)
[].random(6, 5, 20, true); // [18, 17, 10, 11, 5, 15]

// [].random(count, min, max, unique).sortNumeric()
[].random(6, 5, 20, true).sortNumeric(); // [7, 8, 11, 14, 16, 17]


// [].random2d(rows, cols)
[].random2d(1, 2) // [ [0.13538064923387738, 0.7219046793592905] ]

// [].random2d(rows, cols, max)
[].random2d(1, 6, 20) // [ [3, 10, 13, 16, 17, 17] ]

// [].random2d(rows, cols, min, max)
[].random2d(1, 6, 5, 20) // [ [11, 14, 16, 16, 17, 19] ]

// [].random2d(rows, cols, min, max, unique)
[].random2d(1, 6, 5, 20, true) // [ [5, 7, 9, 17, 18, 20] ]

// [].random2d(rows, cols, min, max, unique)
[].random2d(2, 6, 5, 20, true) // [ [7, 8, 17, 18, 19, 20], [10, 12, 15, 16, 17, 18] ]

```