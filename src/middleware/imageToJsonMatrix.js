const Jimp = require('jimp');

/**
 * Converts a Jimp color integer to an RGBA object.
 * @param {number} color - A Jimp color integer.
 * @returns {object} An RGBA object with properties r, g, b, and a.
 */
const unpackColor = color => Jimp.intToRGBA(color);

const isGreen = ({ r, g, b }) => r < 100 && g > 200 && b < 100;
const isBlue = ({ r, g, b }) => r === 0 && g === 0 && b > 220;
const isWhite = ({ r, g, b }) => r > 200 && g > 200 && b > 200;

/**
 * Gets a symbolic representation of a color. 
 * Returns 'S' for Start (Green), 'W' for Wall (Blue), 'P' for Path (White), or an empty string for others.
 * @param {number} color - A Jimp color integer.
 * @returns {string} A character representing the type of the color.
 */
const getColorType = color => {
    const unpackedColor = unpackColor(color);

    if (isGreen(unpackedColor)) return 'S';   // Start
    if (isBlue(unpackedColor)) return 'W';    // Wall
    if (isWhite(unpackedColor)) return 'P';   // Path
    return '';
};

/**
 * Extracts a maze representation from an image.
 * @param {string} imagePath - The path to the image file.
 * @returns {Promise<Array<Array<string>>>} A 2D array representing the maze with 'S', 'W', 'P', and ''.
 */
exports.extractMaze = async (imagePath) => {
    const LEFT_MARGIN = 13;
    const TOP_MARGIN = 15;
    const FIELD_SIZE = 460;
    const STEP = 20;

    const image = await Jimp.read(imagePath);

    // Create an empty maze representation
    const mazeRows = FIELD_SIZE / STEP;
    const mazeCols = FIELD_SIZE / STEP;
    const maze = Array(mazeRows).fill().map(() => Array(mazeCols).fill(''));

    for (let y = TOP_MARGIN; y < TOP_MARGIN + FIELD_SIZE; y += STEP) {
        for (let x = LEFT_MARGIN; x < LEFT_MARGIN + FIELD_SIZE; x += STEP) {
            const color = image.getPixelColor(x + STEP / 2, y + STEP / 2);
            maze[(y - TOP_MARGIN) / STEP][(x - LEFT_MARGIN) / STEP] = getColorType(color);
        }
    }

    return maze;
}