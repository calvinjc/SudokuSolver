
ConflictHelper = {
    check: function() {
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                if (gameBoard[row][col].value !== "")
                {
                    if (this.checkRowConflicts(row, col, gameBoard[row][col].value) ||
                        this.checkColConflicts(row, col, gameBoard[row][col].value) ||
                        this.checkSqrConflicts(row, col, gameBoard[row][col].value)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    /*
     * Checks for conflicts between the square at the provided location and
     * the other squares in that row.
     */
    checkRowConflicts: function(row, col, nVal)
    {
        for (var iterCol = 0; iterCol < 9; iterCol++)
        {
            if (gameBoard[row][iterCol].value === nVal && iterCol != col)
                return true;
            if (!gameBoard[row][iterCol].value && gameBoard[row][iterCol].possibleValues.length === 0)
                return true;
        }
        return false;
    },

    /*
     * Checks for conflicts between the square at the provided location and
     * the other squares in that column.
     */
    checkColConflicts: function(row, col, nVal)
    {
        for (var iterRow = 0; iterRow < 9; iterRow++)
        {
            if (gameBoard[iterRow][col].value === nVal && iterRow != row)
                return true;
            if (!gameBoard[iterRow][col].value && gameBoard[iterRow][col].possibleValues.length === 0)
                return true;
        }
        return false;
    },

    /*
     * Determines which 3x3 square the provided location is in and
     * checks for conflicts between the square at the provided location and
     * the other squares in that 3x3 square.
     */
    checkSqrConflicts: function(row, col, nVal)
    {
        var startRow = -1;
        var startCol = -1;

        if (row < 3)
            startRow = 0;
        else if (row < 6)
            startRow = 3;
        else
            startRow = 6;

        if (col < 3)
            startCol = 0;
        else if (col < 6)
            startCol = 3;
        else
            startCol = 6;

        for (var iterRow = startRow; iterRow < (startRow + 3); iterRow++) {
            for (var iterCol = startCol; iterCol < (startCol + 3); iterCol++) {
                if (gameBoard[iterRow][iterCol].value === nVal && iterRow != row && iterCol != col)
                    return true;
                if (!gameBoard[iterRow][iterCol].value && gameBoard[iterRow][iterCol].possibleValues.length === 0)
                    return true;
            }
        }
        return false;
    }
};