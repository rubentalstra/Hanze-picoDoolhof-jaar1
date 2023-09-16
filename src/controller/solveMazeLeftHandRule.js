const fs = require('fs');

// Define DIRECTIONS for moving up, down, left, and right
const DIRECTIONS = [
    { dir: 'up', x: -1, y: 0 },     // North
    { dir: 'right', x: 0, y: 1 },   // East
    { dir: 'down', x: 1, y: 0 },    // South
    { dir: 'left', x: 0, y: -1 }    // West
];

function getNextDirectionIndex(currentIdx, turn) {
    return (currentIdx + turn + 4) % 4; // Add 4 to handle negative index
}

function getNextPosition(position, direction) {
    return {
        x: position.x + direction.x,
        y: position.y + direction.y
    };
}

function leftHandRule(matrix, start) {
    let currentIdx = 0; // Assuming we start facing up (index 0)
    let path = [];
    let currentPosition = { ...start };
    let visited = {};

    matrix[start.x][start.y] = 0;

    const zeros = new Set();
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) zeros.add(`${i}-${j}`);
        }
    }

    while (true) {
        let possibleMoves = [-1, 0, 1, 2].map(turn => {
            const nextDirIdx = getNextDirectionIndex(currentIdx, turn);
            const direction = DIRECTIONS[nextDirIdx];
            const nextPos = getNextPosition(currentPosition, direction);

            return { direction: direction.dir, position: nextPos, dirIdx: nextDirIdx };
        });

        let key = `${currentPosition.x}-${currentPosition.y}`;
        visited[key] = (visited[key] || 0) + 1;

        if (matrix[currentPosition.x][currentPosition.y] === 0) {
            zeros.delete(key);
        }

        if (zeros.size === 0 || visited[key] > 5) {
            break;
        }

        const validMove = possibleMoves.find(move => isValidMove(move.position, matrix));

        if (!validMove) {
            break; // No valid move found
        }

        path.push(validMove.direction);
        currentPosition = validMove.position;
        currentIdx = validMove.dirIdx;
    }

    return path;
}

function isValidMove(position, matrix) {
    if (!matrix || matrix.length === 0) return false; // Ensure matrix is non-empty

    const { x, y } = position;

    const isWithinBounds = x >= 0 && y >= 0 && x < matrix.length && y < matrix[0].length;
    const isPositionAvailable = isWithinBounds && matrix[x][y] === 0;

    return isPositionAvailable;
}


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

    fs.writeFileSync('output/solutionMazeVisual.txt', output);
}

function printMaze(maze) {
    if (maze.length === 0) return '';

    const getBorder = () => " " + "X".repeat(maze[0].length * 2 - 1) + "\n";

    let mazeString = getBorder();

    for (let row of maze) {
        let rowStr = "X" + row.map(cell => {
            return cell === 2 ? '*' : cell === 1 ? 'X' : ' ';
        }).join(' ') + "X";
        mazeString += rowStr + '\n';
    }

    mazeString += getBorder();

    return mazeString;
}

// Helper function to find the starting point
function findStartingPoint(maze) {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 2) {
                return { x: i, y: j };
            }
        }
    }
    return null;
}

exports.solveMazeLeftHandRule = (maze) => {
    const start = findStartingPoint(maze);

    if (!start) {
        console.log('No starting point found.');
        return;
    }

    console.log(start);
    const path = leftHandRule(maze, start);
    if (path && path.length) {
        console.log(`Path to visit all paths: ${path.join(' -> ')}`);
        fs.writeFileSync('output/pathInText.txt', path.join(' -> '));
        visualizeMovement(maze, path, start);
    } else {
        console.log('No path found.');
    }
}