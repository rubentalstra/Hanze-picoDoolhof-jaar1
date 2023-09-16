/**
 * Converts a symbolic maze representation into a numeric matrix.
 * 
 * - 'P' becomes 0 (Path).
 * - 'W' becomes 1 (Wall).
 * - 'S' becomes 2 (Start).
 * - Any other value becomes -1 (unexpected value).
 * 
 * @param {Array<Array<string>>} maze - A 2D array representing the maze with 'S', 'W', 'P', and ''.
 * @returns {Array<Array<number>>} A 2D numeric matrix representing the maze.
 */
exports.convertToNumericMatrix = maze => maze.map(row => row.map(cell => {
    const cellMapping = {
        'P': 0,
        'W': 1,
        'S': 2
    };

    return cellMapping[cell] !== undefined ? cellMapping[cell] : -1; // For any unexpected value
}));
