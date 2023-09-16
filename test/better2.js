const Jimp = require('jimp');
const fs = require('fs');

const LEFT_MARGIN = 13;
const TOP_MARGIN = 15;
const FIELD_SIZE = 460;


const isBlue = (color) => {
    const { r, g, b } = Jimp.intToRGBA(color);
    return r === 0 && g === 0 && b > 220;
};

const isGreen = (color) => {
    const { r, g, b } = Jimp.intToRGBA(color);
    return r < 100 && g > 200 && b < 100;
};


const isWhite = (color) => {
    const { r, g, b } = Jimp.intToRGBA(color);
    return r > 200 && g > 200 && b > 200;
};

async function extractMaze(imagePath) {
    const image = await Jimp.read(imagePath);

    // Create an empty maze representation
    const mazeRows = FIELD_SIZE / 20;
    const mazeCols = FIELD_SIZE / 20;
    const maze = Array(mazeRows).fill().map(() => Array(mazeCols).fill(''));

    for (let y = TOP_MARGIN; y < TOP_MARGIN + FIELD_SIZE; y += 20) {
        for (let x = LEFT_MARGIN; x < LEFT_MARGIN + FIELD_SIZE; x += 20) {
            const centerX = x + 10;
            const centerY = y + 10;


            if (isGreen(image.getPixelColor(centerX, centerY))) {
                maze[(y - TOP_MARGIN) / 20][(x - LEFT_MARGIN) / 20] = 'S';  // Start
            }

            else if (isBlue(image.getPixelColor(centerX, centerY))) {
                maze[(y - TOP_MARGIN) / 20][(x - LEFT_MARGIN) / 20] = 'W';  // Wall
            }
            else if (isWhite(image.getPixelColor(centerX, centerY))) {
                maze[(y - TOP_MARGIN) / 20][(x - LEFT_MARGIN) / 20] = 'P';  // Path
            }
        }
    }

    return maze;
}

// Test the function
function main() {
    extractMaze('picoDoolhof.png').then(maze => {
        console.log(maze);
        fs.writeFileSync('maze.json', JSON.stringify(maze));
    });
}

main();