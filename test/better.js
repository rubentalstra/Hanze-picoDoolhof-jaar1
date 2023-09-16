const Jimp = require('jimp');
const fs = require('fs');

const DIRECTIONS = {
    UP: { x: 0, y: -20, left: 'LEFT', right: 'RIGHT' },
    DOWN: { x: 0, y: 20, left: 'RIGHT', right: 'LEFT' },
    LEFT: { x: -20, y: 0, left: 'DOWN', right: 'UP' },
    RIGHT: { x: 20, y: 0, left: 'UP', right: 'DOWN' }
};

const isWhite = (color) => {
    const { r, g, b } = Jimp.intToRGBA(color);
    return r > 200 && g > 200 && b > 200;
};

const isGreen = (color) => {
    const { r, g, b } = Jimp.intToRGBA(color);
    return r < 100 && g > 200 && b < 100;
};


const findStart = (image) => {
    for (let y = 0; y < image.bitmap.height - 20; y++) {
        for (let x = 0; x < image.bitmap.width - 20; x++) {
            if (isGreen(image.getPixelColor(x, y))) {
                // Check if a 20x20 block is green
                let isBlockGreen = true;
                for (let blockY = 0; blockY < 20 && isBlockGreen; blockY++) {
                    for (let blockX = 0; blockX < 20 && isBlockGreen; blockX++) {
                        if (!isGreen(image.getPixelColor(x + blockX, y + blockY))) {
                            isBlockGreen = false;
                        }
                    }
                }
                if (isBlockGreen) {
                    console.log(x + 10)
                    console.log(y + 10)
                    // Return the center of the green block
                    return { x: x + 10, y: y + 10 };
                }
            }
        }
    }
    return null;
};



const leftHandRule = async (imagePath, outputPath) => {
    const image = await Jimp.read(imagePath);
    let position = findStart(image);
    if (!position) {
        throw new Error("No green starting point found in the image.");
    }

    let direction = DIRECTIONS.UP;
    const movements = [];

    do {
        const leftDir = DIRECTIONS[direction.left];
        const newPosX = position.x + leftDir.x;
        const newPosY = position.y + leftDir.y;

        if (isWhite(image.getPixelColor(newPosX, newPosY))) {
            direction = leftDir;
            movements.push('LEFT');
        } else {
            const forwardPosX = position.x + direction.x;
            const forwardPosY = position.y + direction.y;

            if (isWhite(image.getPixelColor(forwardPosX, forwardPosY))) {
                movements.push('FORWARD');
            } else {
                direction = DIRECTIONS[direction.right];
                movements.push('RIGHT');
            }
        }

        position = { x: position.x + direction.x, y: position.y + direction.y };

    } while (movements.length < 10000 && !isGreen(image.getPixelColor(position.x, position.y)));

    fs.writeFileSync(outputPath, movements.join('\n'));
};

function main() {
    leftHandRule('picoDoolhof.png', 'test.txt').catch(error => {
        console.error(error);
    });
}

main();