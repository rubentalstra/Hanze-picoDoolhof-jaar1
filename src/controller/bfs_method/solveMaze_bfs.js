const fs = require('fs');
const { extractMaze } = require('../../middleware/imageToJsonMatrix');
const { convertToNumericMatrix } = require('../../middleware/converter');

var maze = []

// Define directions for moving up, down, left, and right
const directions = [
    { x: -1, y: 0, dir: 'up' },
    { x: 1, y: 0, dir: 'down' },
    { x: 0, y: -1, dir: 'left' },
    { x: 0, y: 1, dir: 'right' }
];

function bfs(matrix, start) {
    let visited = new Set();
    let queue = [{ ...start, steps: 0, path: [] }];
    let totalPaths = 0;
    let visitedPaths = 0;

    // Count total paths in the matrix
    for (let row of matrix) {
        for (let cell of row) {
            if (cell === 0) totalPaths++;
        }
    }

    while (queue.length > 0) {
        let current = queue.shift();
        let key = `${current.x}-${current.y}`;

        // If the current cell is a path, increment the visited paths count
        if (matrix[current.x][current.y] === 0) visitedPaths++;

        // If all paths are visited, return the path taken
        if (visitedPaths === totalPaths) return current.path;

        // Check neighboring cells
        for (let dir of directions) {
            let newX = current.x + dir.x;
            let newY = current.y + dir.y;
            let newKey = `${newX}-${newY}`;

            if (newX >= 0 && newY >= 0 && newX < matrix.length && newY < matrix[0].length && !visited.has(newKey) && matrix[newX][newY] !== 1) {
                visited.add(newKey);  // Mark the cell as visited before enqueueing
                queue.push({ x: newX, y: newY, steps: current.steps + 1, path: [...current.path, dir.dir] });
            }
        }
    }

    return []; // If unreachable
}

async function main() {
    // start first part.
    await writeMatrixFile('../../assets/json/matrixText.json')
    // start second part
    const matrixText = await readMatrixFile('../../assets/json/matrixText.json');
    // console.log(matrixText)
    maze = convertToNumericMatrix(JSON.parse(matrixText));
    fs.writeFileSync('../../assets/json/maxtrixNumeric.json', JSON.stringify(maze));
    processMaze(maze);
}


async function writeMatrixFile(fileName) {
    return new Promise((resolve, reject) => {
        extractMaze('../../assets/img/picoDoolhof.png')
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

function processMaze() {
    // Find the starting point
    let start = null;
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 2) {
                start = { x: i, y: j };
                break;
            }
        }
        if (start) break;
    }

    console.log(JSON.stringify(start))
    if (start) {
        const path = bfs(maze, start);
        console.log(`Path to visit all paths: ${path.join(' -> ')}`);
    } else {
        console.log('No starting point found.');
    }
}

main();
