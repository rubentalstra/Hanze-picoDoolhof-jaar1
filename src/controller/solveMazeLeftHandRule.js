const fs = require('fs');

/**
 * Represents the available directions to move within the matrix.
 * Each direction is represented by an object with a direction name and corresponding x, y values.
 * @constant
 */
const DIRECTIONS = [
    { dir: 'up', x: -1, y: 0 },     // North
    { dir: 'right', x: 0, y: 1 },   // East
    { dir: 'down', x: 1, y: 0 },    // South
    { dir: 'left', x: 0, y: -1 }    // West
];

/**
 * Computes the next direction index based on the current direction index and the turn.
 * @param {number} currentIdx - The current direction index.
 * @param {number} turn - The turn number. -1: left, 0: straight, 1: right, 2: reverse.
 * @returns {number} The next direction index.
 */
function getNextDirectionIndex(currentIdx, turn) {
    return (currentIdx + turn + 4) % 4; // Add 4 to handle negative index
}

/**
 * Computes the next position based on the current position and direction.
 * @param {object} position - The current position.
 * @param {object} direction - The direction object with x, y values.
 * @returns {object} The next position.
 */
function getNextPosition(position, direction) {
    return {
        x: position.x + direction.x,
        y: position.y + direction.y
    };
}

/**
 * Applies the left-hand rule algorithm to navigate through the matrix from the start position.
 * @param {Array<Array<number>>} matrix - The 2D numeric matrix representing the maze.
 * @param {object} start - The starting position in the matrix.
 * @returns {Array<string>} An array of directions (e.g., ["up", "left", ...]) representing the path.
 */
function leftHandRule(matrix, start) {
    let currentIdx = 0; // Assuming we start facing up (index 0)
    let path = [];
    let currentPosition = { ...start };
    let visited = {};

    // Set the starting position to 0 after determining the initial direction
    matrix[start.x][start.y] = 0;

    // Create a set of all '0' positions in the maze
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
        // Update the visited count for the current position
        visited[key] = (visited[key] || 0) + 1;

        if (matrix[currentPosition.x][currentPosition.y] === 0) {
            zeros.delete(key);
        }

        // Check if all 0's were reached, and if so, break the loop || If a position is visited more than 5 times, break
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

/**
 * Checks if a given move is valid based on the current position and the matrix.
 * A move is valid if the next position is within the bounds of the matrix and is a '0'.
 * @param {object} position - The next position to check.
 * @param {Array<Array<number>>} matrix - The 2D numeric matrix representing the maze.
 * @returns {boolean} True if the move is valid, otherwise false.
 */
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

/**
 * Converts the given 2D maze matrix into a printable string representation.
 * In this representation:
 * - '0' becomes ' ' (a space for paths)
 * - '1' becomes 'X' (for walls)
 * - '2' becomes '*' (for the start point)
 * The maze is also bordered by 'X'.
 *
 * @param {Array<Array<number>>} maze - The 2D numeric matrix representing the maze.
 * @returns {string} A string representation of the maze.
 */
function printMaze(maze) {
    if (maze.length === 0) return '';

    /**
     * Generates a border string for the maze.
     * @returns {string} A border string of 'X's.
     */
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

/**
 * Searches for and returns the starting point in the maze.
 * The starting point is denoted by the value '2'.
 *
 * @param {Array<Array<number>>} maze - The 2D numeric matrix representing the maze.
 * @returns {object|null} The coordinates of the starting point as { x, y }, or null if not found.
 */
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

/**
 * Solves the given 2D maze matrix using the left-hand rule algorithm.
 * 
 * This function:
 * 1. Identifies the starting point in the maze.
 * 2. Applies the left-hand rule to find a path through the maze.
 * 3. Logs the found path or indicates if no path was found.
 * 4. If a path is found, it writes the path to an output file and visualizes the movement.
 *
 * Note: This function assumes the existence of a `visualizeMovement` function to visualize the path.
 *
 * @param {Array<Array<number>>} maze - The 2D numeric matrix representing the maze.
 */
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