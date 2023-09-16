exports.convertToNumericMatrix = maze => maze.map(row => row.map(cell => {
    const cellMapping = {
        'P': 0,
        'W': 1,
        'S': 2
    };

    return cellMapping[cell] !== undefined ? cellMapping[cell] : -1; // For any unexpected value
}));
