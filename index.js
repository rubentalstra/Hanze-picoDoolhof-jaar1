const fs = require('fs');
const { solveMazeLeftHandRule } = require('./src/controller/solveMazeLeftHandRule');
const { convertToNumericMatrix } = require('./src/middleware/converter');
const { extractMaze } = require('./src/middleware/imageToJsonMatrix');



async function main() {
    //Cleanup the fles before starting
    await cleanUpFiles();
    // start first part.
    await writeMatrixFile('assets/json/matrixText.json')
    // start second part
    const matrixText = await readMatrixFile('assets/json/matrixText.json');
    // console.log(matrixText)
    maze = convertToNumericMatrix(JSON.parse(matrixText));
    fs.writeFileSync('assets/json/maxtrixNumeric.json', JSON.stringify(maze));

    solveMazeLeftHandRule(maze);
}


async function writeMatrixFile(fileName) {
    return new Promise((resolve, reject) => {
        extractMaze('assets/img/picoDoolhof.png')
            .then(maze => {
                console.log(maze);
                try {
                    fs.writeFileSync(fileName, JSON.stringify(maze));
                    resolve();  // Resolve the promise after writing the file
                } catch (err) {
                    reject(err);  // Reject the promise if there's an error writing the file
                }
            })
            .catch(err => {
                reject(err);  // Reject the promise if there's an error extracting the maze
            });
    });
}


async function readMatrixFile(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

async function cleanUpFiles() {
    fs.writeFile('assets/json/matrixText.json', '', function () { console.log('cleaning matrixText.json done') })
    fs.writeFile('assets/json/maxtrixNumeric.json', '', function () { console.log('cleaning maxtrixNumeric.json done') })
    fs.writeFile('output/pathInText.txt', '', function () { console.log('cleaning pathInText.txt done') })
    fs.writeFile('output/solutionMazeVisual.txt', '', function () { console.log('cleaning solutionMazeVisual.txt done') })
}

main();