const fs = require('fs').promises;
const { solveMazeLeftHandRule } = require('./src/controller/solveMazeLeftHandRule');
const { convertToNumericMatrix } = require('./src/middleware/converter');
const { extractMaze } = require('./src/middleware/imageToJsonMatrix');


/**
 * The main function orchestrating the maze solving process.
 * It performs the following steps:
 * 1. Cleans up old files.
 * 2. Writes the maze matrix from an image to a file.
 * 3. Converts the matrix to a numeric format and writes it to another file.
 * 4. Solves the maze using the left-hand rule.
 */
async function main() {
    // Cleanup the files before starting
    await cleanUpFiles();

    // Write the matrix
    await writeMatrixFile('assets/img/picoDoolhof.png', 'assets/json/matrixText.json');

    // Read the matrix and convert to numeric format
    const matrixText = await fs.readFile('assets/json/matrixText.json', 'utf8');
    const maze = convertToNumericMatrix(JSON.parse(matrixText));

    await fs.writeFile('assets/json/maxtrixNumeric.json', JSON.stringify(maze));

    // Solve the maze using the left-hand rule
    solveMazeLeftHandRule(maze);
}

/**
 * Extracts the maze matrix from an input image and writes the matrix to a specified file.
 *
 * @param {string} inputImagePath - The path to the input image containing the maze.
 * @param {string} outputFileName - The path to the output file where the maze matrix should be written.
 */
async function writeMatrixFile(inputImagePath, outputFileName) {
    const maze = await extractMaze(inputImagePath);
    console.log(maze);
    await fs.writeFile(outputFileName, JSON.stringify(maze));
}

/**
 * Cleans up specified files by resetting their content.
 * Useful for ensuring a clean state before operations.
 */
async function cleanUpFiles() {
    const filesToClean = [
        'assets/json/matrixText.json',
        'assets/json/maxtrixNumeric.json',
        'output/pathInText.txt',
        'output/solutionMazeVisual.txt'
    ];

    for (const filePath of filesToClean) {
        await fs.writeFile(filePath, '');
        console.log(`cleaning ${filePath} done`);
    }
}

// Calls the main function and catches any errors that might occur
main().catch(error => {
    console.error('An error occurred:', error);
});