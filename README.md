# Hanze-picoDoolhof-jaar1

## Maze Solver: Left Hand Rule

This program is designed to solve a given maze using the "Left Hand Rule" algorithm. The maze is first extracted from an image, then the program attempts to find a path through the maze such that all open paths (`0`s) are visited.

### How It Works

1. **Maze Extraction from Image**:
   The `extractMaze` function is used to extract the maze structure from an image. It does so by scanning the image pixel by pixel and determining the type of each cell (Start, Wall, or Path) based on its color.

2. **Maze Conversion**:
   Once the maze is extracted, it's represented in a matrix of characters. The `convertToNumericMatrix` function is then used to convert this representation to a numeric matrix where:

   - `P` (Path) becomes `0`
   - `W` (Wall) becomes `1`
   - `S` (Start) becomes `2`

3. **Solving the Maze**:
   The `solveMazeLeftHandRule` function is the main function that attempts to solve the maze using the Left Hand Rule. The basic premise is that by keeping one hand (in this case, the left hand) on one wall of the maze, you can navigate through the maze and find the exit. Along the way, the algorithm also ensures it visits every open path.

4. **Visualizing the Solution**:
   After solving the maze, the program visualizes the solution by marking the path taken with `*`. This visualization is saved in a text file for easy reference.

   ### Output

After successfully running the program, you can find the output in the following locations:

- `output/pathInText.txt`: Contains the path taken by the solver through the maze.
- `output/solutionMazeVisual.txt`: A visual representation of the maze with the path marked by `*` symbols.

### How to Run

Ensure that you have all the required dependencies installed. Then, execute the following command:

```
npm run start
```

This will start the program, and you should see the solution to the maze printed in the console, as well as in the output files.

### Dependencies

- `fs`: For file handling operations.
- `jimp`: For image processing and reading pixel values.

### Contribution

Feel free to fork this repository and make any changes or improvements. Pull requests are always welcome!
