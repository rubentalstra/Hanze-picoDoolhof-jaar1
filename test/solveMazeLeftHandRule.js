const fs = require('fs');

const maze = [[0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0], [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], [0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1], [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0], [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0], [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0], [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0], [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0], [0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], [0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1]];

// Define directions for moving up, down, left, and right
const directions = [
    { x: -1, y: 0, dir: 'up' },    // North
    { x: 0, y: 1, dir: 'right' },  // East
    { x: 1, y: 0, dir: 'down' },   // South
    { x: 0, y: -1, dir: 'left' }   // West
];

// Function to get the next direction according to the left-hand rule
function getNextDirection(currentDirection, turn) {
    let idx = directions.findIndex(d => d.dir === currentDirection);
    idx = (idx + turn + 4) % 4;  // Add 4 to handle negative index
    return directions[idx].dir;
}

function leftHandRule(matrix, start) {
    let currentDirection = 'up'; // Assuming we start facing up
    let path = [];
    let currentPosition = start;
    let visited = {};

    // Set the starting position to 0 after determining the initial direction
    matrix[start.x][start.y] = 0;

    // Create a set of all '0' positions in the maze
    let zeros = new Set();
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
                zeros.add(`${i}-${j}`);
            }
        }
    }

    while (true) {



        let leftDir = getNextDirection(currentDirection, -1);  // Turn left
        let straightDir = currentDirection;                    // Go straight
        let rightDir = getNextDirection(currentDirection, 1);  // Turn right
        let backDir = getNextDirection(currentDirection, 2);   // Turn around

        let leftMove = directions.find(d => d.dir === leftDir);
        let straightMove = directions.find(d => d.dir === straightDir);
        let rightMove = directions.find(d => d.dir === rightDir);
        let backMove = directions.find(d => d.dir === backDir);

        let leftPos = { x: currentPosition.x + leftMove.x, y: currentPosition.y + leftMove.y };
        let straightPos = { x: currentPosition.x + straightMove.x, y: currentPosition.y + straightMove.y };
        let rightPos = { x: currentPosition.x + rightMove.x, y: currentPosition.y + rightMove.y };
        let backPos = { x: currentPosition.x + backMove.x, y: currentPosition.y + backMove.y };

        let key = `${currentPosition.x}-${currentPosition.y}`;
        // Update the visited count for the current position
        if (!visited[key]) {
            visited[key] = 1;
        } else {
            visited[key]++;
        }

        // After each move
        if (matrix[currentPosition.x][currentPosition.y] === 0) {
            zeros.delete(`${currentPosition.x}-${currentPosition.y}`);
        }

        // Check if all 0's were reached, and if so, break the loop
        if (zeros.size === 0) {
            console.log("The * has reached every 0 in the maze!");
            break;
        }

        // If a position is visited more than 5 times, break
        if (visited[key] > 5) {
            break;
        }

        if (isValidMove(leftPos, matrix)) {
            path.push(leftDir);
            currentPosition = leftPos;
            currentDirection = leftDir;
        } else if (isValidMove(straightPos, matrix)) {
            path.push(straightDir);
            currentPosition = straightPos;
            currentDirection = straightDir;
        } else if (isValidMove(rightPos, matrix)) {
            path.push(rightDir);
            currentPosition = rightPos;
            currentDirection = rightDir;
        } else if (isValidMove(backPos, matrix)) {
            path.push(backDir);
            currentPosition = backPos;
            currentDirection = backDir;
        } else {
            // If no move is possible, we're stuck
            break;
        }

    }

    return path;
}

function isValidMove(position, matrix) {
    return position.x >= 0 && position.y >= 0 && position.x < matrix.length && position.y < matrix[0].length && matrix[position.x][position.y] === 0;
}



// 


function visualizeMovement(maze, path, startPosition) {
    let currentPos = { ...startPosition };
    let output = "Initial Maze:\n";
    output += printMaze(maze);

    for (let step of path) {
        switch (step) {
            case 'up':
                currentPos.x--;
                break;
            case 'down':
                currentPos.x++;
                break;
            case 'left':
                currentPos.y--;
                break;
            case 'right':
                currentPos.y++;
                break;
        }
        maze[currentPos.x][currentPos.y] = 2;
        output += `Step: ${step}\n`;
        output += printMaze(maze);
        maze[currentPos.x][currentPos.y] = 0;  // Reset the position to 0 for the next step
    }

    fs.writeFileSync('../../output/solutionMazeVisual.txt', output);
}

function printMaze(maze) {
    let mazeString = "";

    // Top border
    mazeString += " " + "X".repeat(maze[0].length * 2 - 1) + "\n";

    for (let row of maze) {
        let rowStr = "X"; // Start with left border for each row
        rowStr += row.map(cell => {
            switch (cell) {
                case 2:
                    return '*';  // Green for 2
                case 1:
                    return 'X';  // Blue for 1
                case 0:
                default:
                    return ' ';  // White for 0
            }
        }).join(' ');
        rowStr += "X"; // Add right border for each row
        mazeString += rowStr + '\n';
    }

    // Bottom border
    mazeString += " " + "X".repeat(maze[0].length * 2 - 1) + "\n";

    return mazeString;
}




// 



function main() {
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

    console.log(start)
    if (start) {
        const path = leftHandRule(maze, start);
        console.log(`Path to visit all paths: ${path.join(' -> ')}`);

        visualizeMovement(maze, leftHandRule(maze, start), start);
    } else {
        console.log('No starting point found.');
    }
}

main();
