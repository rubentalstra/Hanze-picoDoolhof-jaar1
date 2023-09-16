// const sharp = require('sharp');

// function main(){
// let imageData;
// sharp('picoDoolhof.png')
//   .raw()
//   .toBuffer()
//   .then(data => {
//     imageData = data;
//     // Continue processing...

//     console.log(imageData)
//   })
//   .catch(err => {
//     console.error(err);
//   });
// }

// main();


//   1. Start facing north (or any initial direction).
// 2. At each step:
//   a. If there is an open space to your left:
//     - Turn left.
//     - Move forward.
//   b. Else if there's an open space in front of you:
//     - Move forward.
//   c. Else if there's an open space to your right:
//     - Turn right.
//     - Move forward.
//   d. Else:
//     - Turn around 180 degrees.



const sharp = require('sharp');
const fs = require('fs/promises');

async function findStart(data, width, height) {
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const red = data[idx];
            const green = data[idx + 1];
            const blue = data[idx + 2];
// console.log(red)
// console.log(green)
// console.log(blue)
console.log(idx)
            if ((red > 110 && red < 120) && (green > 250 && green < 255 ) ) {
                console.log('FINDED')
                console.log(x)
                console.log(y)
                return { x, y };
            }
        }
    }
}

async function isWall(data, x, y, width) {
    const idx = (y * width + x) * 4;
    return data[idx] === 0 && data[idx + 1] === 0 && data[idx + 2] === 255;
}

async function navigateMaze(data, width, height, startX, startY) {
    const directions = ['N', 'E', 'S', 'W'];
    let directionIdx = 0;  // start facing north

    let x = startX;
    let y = startY;

    while(true) {
        let dx = 0, dy = 0;
        switch(directions[directionIdx]) {
            case 'N': dy = -1; break;
            case 'E': dx = 1; break;
            case 'S': dy = 1; break;
            case 'W': dx = -1; break;
        }

        const leftIdx = (directionIdx - 1 + 4) % 4;
        let leftDx = 0, leftDy = 0;
        switch(directions[leftIdx]) {
            case 'N': leftDy = -1; break;
            case 'E': leftDx = 1; break;
            case 'S': leftDy = 1; break;
            case 'W': leftDx = -1; break;
        }

        const leftX = x + leftDx;
        const leftY = y + leftDy;

        // If left is open
        if (!await isWall(data, leftX, leftY, width)) {
            directionIdx = leftIdx;
            // console.log('Turn Left');
            // writeFile('Turn Left');
            x = leftX;
            y = leftY;
            // console.log('Move Forward');
            // writeFile('Move Forward');
        }
        // If front is open
         else 
         if (!await isWall(data, x + dx, y + dy, width)) {
            x += dx;
            y += dy;
            // console.log('Move Forward');
            // writeFile('Move Forward');
        }
        // If right is open
        else if (!await isWall(data, x - dx, y - dy, width)) {
            directionIdx = (directionIdx + 1) % 4;
            // console.log('Turn Right');
            // writeFile('Turn Right');
            // console.log('Move Forward');
            // writeFile('Move Forward');
        }
        // If blocked, turn around
        else {
            directionIdx = (directionIdx + 2) % 4;
            // console.log('Turn Around');
            // writeFile('Turn Around');
        }

        // Exit condition - you can choose an exit condition that suits your maze
        if (x == width - 1 && y == height - 1) {
            console.log('Exit reached');
            // writeFile('Exit reached');
            break;
        }
    }
}





//  function writeFile(content) {

//   fs.writeFile('test.txt', content, err => {
//     if (err) {
//       console.error(err);
//     }
//     // file written successfully
//   });
// }

function main(){
sharp('picoDoolhof.png')
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
        const start = findStart(data, info.width, info.height);
        if (start) {
            navigateMaze(data, info.width, info.height, start.x, start.y);
        } else {
            console.error("Couldn't find the green starting box!");
        }
    })
    .catch(err => {
        console.error(err);
    });
}

main();