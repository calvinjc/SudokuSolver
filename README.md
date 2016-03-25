#Sudoku Puzzle Solver

This app will solve your Sudoku Puzzle for you!  Just enter your puzzle into the grid provided and click solve.  It's like magic!

This is a javascript port of an old college project.  So if you look at the code please forgive the non-javascripty-ness of some of it.

It basically uses 3 different methods for solving the puzzle.  First it looks from the perspective of each square, and determines the values it could possibly be based on the values of the other squares in its row column and section.  It iteratively searches for squares with only one possible value. 

Next looks from the perspective of number's perspective.  Is there only one square in this row/column/section that this number could possibly go.  This adds an extra layer because from the squares perspective 5 & 7 can both be possible values but that could be the only square in that row in which 7 is a possible value.

Last it looks for instances where a number appears in two out of three related rows or columns and determines whether it can place the number in the remaining row/column.  

Between these three techniques it can solve most Sudoku puzzles, however there may be some particularly devious Sudoku puzzles it cannot solve.  My college project fell back on a guess and check method if everything else failed, but I did not include that in this port.
