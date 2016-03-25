
PossibleValuesHelper = {

    updatePossibleValues: function(row, col, val)
    {
        this.removePossFromRow(row, val);
        this.removePossFromColumn(col, val);
        this.removePossFromSquare(row, col, val);
    },

    /*
     * Updates the lists of possible values for every square in a given row.
     */
    removePossFromRow: function(row, val)
    {
        for (var col = 0; col < 9; col++)
        {
            var withh = gameBoard[row][col].possibleValues;
            var without = _.without(withh, val);
            gameBoard[row][col].possibleValues = _.without(gameBoard[row][col].possibleValues, val);
        }

    },

    /*
     * Updates the lists of possible values for every square in a given column.
     */
    removePossFromColumn: function(col, val)
    {
        for (var row = 0; row < 9; row++)
        {
            gameBoard[row][col].possibleValues = _.without(gameBoard[row][col].possibleValues, val);
        }
    },

    /*
     * Determines which 3x3 square the provided location is in and
     * updates the lists of possible values for every square in the 3x3 square.
     */
    removePossFromSquare: function (row, col, val)
    {
        var startRow = 0;
        var startCol = 0;

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

        for (var row = startRow; row < (startRow + 3); row++)
        for (var col = startCol; col < (startCol + 3); col++)
        {
            gameBoard[row][col].possibleValues = _.without(gameBoard[row][col].possibleValues, val);
        }
    }
};