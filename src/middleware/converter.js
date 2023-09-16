exports.convertToNumericMatrix = (maze) => {
    return maze.map(row => {
        return row.map(cell => {
            switch (cell) {
                case 'P': return 0;
                case 'W': return 1;
                case 'S': return 2;
                default: return -1; // For any unexpected value
            }
        });
    });
}