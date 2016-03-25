
SudokuSolver = {
    solvePuzzle: function(speed) {
        if (!speed) speed = 0;

        var result = this.solveOneSquare();

        if (result <= 0) {
            $('#msgDiv').html("<span class='redText'>Unable to find a solution! </span>");
        }

        if (ConflictHelper.check()) {
            $('#msgDiv').append("<span class='redText'>There is a conflict on the board!</span>");
        }

        renderBoard();

        if (result === 1) {
            var solveInstantly = $("#solveInstantly").is(':checked');
            if (solveInstantly) {
                this.solvePuzzle();
            } else {
                setTimeout(_.bind(this.solvePuzzle, this), speed, speed);
            }
        }
    },

    solveOneSquare: function () {
        if (this.onlyChoiceRule_Square() || this.onlyChoiceRule_Number() || this.TwoOutOfThreeRule()) {
            // if we succeeded check if we're done
            if (checkForCompletedPuzzle()) {
                $('#msgDiv').html("<span class='greenText'>Puzzle Solved!</span>");
                return 2;
            }

            if (ConflictHelper.check()) {
                return -1;
            }

            return 1;
        }

        return 0;
    },

    /*
     * The Only Choice Rule, the most basic of rules.  Check for squares that have only one possible value;
     */
    onlyChoiceRule_Square: function() {
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                if (!gameBoard[row][col].value && gameBoard[row][col].possibleValues.length === 1) {
                    var newValue = gameBoard[row][col].possibleValues.pop();
                    gameBoard[row][col].value = newValue;
                    PossibleValuesHelper.updatePossibleValues(row, col, newValue);

                    return true;
                }
            }
        }

        return false;
    },

    /*
     * This algorithm looks from the perspective of the number in any given row/col/square
     * and checks whether there is only one square in which that the number can exist.
     */
    onlyChoiceRule_Number: function() {
        for (var i = 0; i < 9; i++)
        {
            if (this.onlyChoiceRule_Number_Row(i) || this.onlyChoiceRule_Number_Column(i) || this.onlyChoiceRule_Number_Square(i))
            {
                return true;
            }
        }
        return false;
    },

    onlyChoiceRule_Number_Row: function(nRow)
    {
        for (var value = 1; value < 10; value++)
        {
            var nCount = 0;
            var nLocation = -1;
            for (var col = 0; col < 9; col++)
            {
                if (!gameBoard[nRow][col].value && _.contains(gameBoard[nRow][col].possibleValues, value))
                {
                    nCount++;
                    nLocation = col;
                }
            }

            if (nCount === 1)
            {
                gameBoard[nRow][nLocation].value = value;
                PossibleValuesHelper.updatePossibleValues(nRow, nLocation, value);
                return true;
            }
        }
        return false;
    },


    onlyChoiceRule_Number_Column: function(nCol)
    {
        for (var value = 1; value < 10; value++)
        {
            var nCount = 0;
            var nLocation = -1;
            for (var row = 0; row < 9; row++)
            {
                if (!gameBoard[row][nCol].value && _.contains(gameBoard[row][nCol].possibleValues, value))
                {
                    nCount++;
                    nLocation = row;
                }
            }

            if (nCount === 1)
            {
                gameBoard[nLocation][nCol].value = value;
                PossibleValuesHelper.updatePossibleValues(nLocation, nCol, value);
                return true;
            }
        }
        return false;
    },


    onlyChoiceRule_Number_Square: function(nSqr)
    {
        var startRow = nSqr % 3;
        var startCol = Math.floor(nSqr / 3);
        startRow = startRow * 3;
        startCol = startCol * 3;

        for (var value = 1; value < 10; value++)
        {
            var nCount = 0;
            var nLocationRow = -1;
            var nLocationCol = -1;

            for (var row = startRow; row < (startRow + 3); row++)
            for (var col = startCol; col < (startCol + 3); col++)
            {
                if (!gameBoard[row][col].value && _.contains(gameBoard[row][col].possibleValues, value))
                {
                    nCount++;
                    nLocationRow = row;
                    nLocationCol = col;
                }
            }

            if (nCount === 1)
            {
                gameBoard[nLocationRow][nLocationCol].value = value;
                PossibleValuesHelper.updatePossibleValues(nLocationRow, nLocationCol, value);
                return true;
            }
        }
        return false;
    },

    TwoOutOfThreeRule: function()
    {
        for (var nVal=1; nVal <= 9; nVal++)
        {
            if (this.TwoOfThreeRuleRows(nVal) || this.TwoOfThreeRuleColumns(nVal))
            {
                return true;
            }
        }
        return false;
    },

    //See if nVal exists in two out of three rows
    TwoOfThreeRuleRows: function(nVal)
    {

        var nValPos = [-1,-1,-1,-1,-1,-1,-1,-1,-1];

        //See if nVal exists in each row and mark its column position
        for (var row=0; row<9; row++) {
            for (var col=0; col<9; col++)
            {
                if (gameBoard[row][col].value === nVal)
                {
                    // if found store the column position
                    nValPos[row] = col;
                    break;
                }
            }
        }

        if (this.TwoOfThreeRowHelper(nValPos, 0, 1, 2, nVal) ||
            this.TwoOfThreeRowHelper(nValPos, 3, 4, 5, nVal) ||
            this.TwoOfThreeRowHelper(nValPos, 6, 7, 8, nVal))
        {
            return true;
        }

        return false;
    },

    TwoOfThreeRowHelper: function(nValPos, rowA, rowB, rowC, nVal)
    {
        // if nVal exists in A, B, and NOT C
        if (nValPos[rowA] !== -1 && nValPos[rowB] !== -1 && nValPos[rowC] === -1)
        {
            // determine the range the value must be found in
            if (nValPos[rowA] >= 3 && nValPos[rowB] >= 3)
            {
                return this.TwoOfThreeRowSet(rowC, 0, 3, nVal);
            }
            else if ((nValPos[rowA] < 3 || nValPos[rowA] > 5)
                && (nValPos[rowB] < 3 || nValPos[rowB] > 5))
            {
                return this.TwoOfThreeRowSet(rowC, 3, 6, nVal);
            }
            else if (nValPos[rowA] < 6 && nValPos[rowB] < 6)
            {
                return this.TwoOfThreeRowSet(rowC, 6, 9, nVal);
            }
        }
        // if nVal exists in A, C, and NOT B
        else if (nValPos[rowA] !== -1 && nValPos[rowB] === -1 && nValPos[rowC] !== -1)
        {
            // determine the range the value must be found in
            if (nValPos[rowA] >= 3 && nValPos[rowC] >= 3)
            {
                return this.TwoOfThreeRowSet(rowB, 0, 3, nVal);
            }
            else if ((nValPos[rowA] < 3 || nValPos[rowA] > 5)
                && (nValPos[rowC] < 3 || nValPos[rowC] > 5))
            {
                return this.TwoOfThreeRowSet(rowB, 3, 6, nVal);
            }
            else if (nValPos[rowA] < 6 && nValPos[rowC] < 6)
            {
                return this.TwoOfThreeRowSet(rowB, 6, 9, nVal);
            }
        }
        // if nVal exists in B, C, and NOT A
        else if (nValPos[rowA] === -1 && nValPos[rowB] !== -1 && nValPos[rowC] !== -1)
        {
            // determine the range the value must be found in
            if (nValPos[rowB] >= 3 && nValPos[rowC] >= 3)
            {
                return this.TwoOfThreeRowSet(rowA, 0, 3, nVal);
            }
            else if ((nValPos[rowB] < 3 || nValPos[rowB] > 5)
                && (nValPos[rowC] < 3 || nValPos[rowC] > 5))
            {
                return this.TwoOfThreeRowSet(rowA, 3, 6, nVal);
            }
            else if (nValPos[rowB] < 6 && nValPos[rowC] < 6)
            {
                return this.TwoOfThreeRowSet(rowA, 6, 9, nVal);
            }
        }

        return false;
    },

    TwoOfThreeRowSet: function(nRow, begin, end, nVal)
    {
        var nCount = 0;
        var nLocation = -1;

        // If the value is only possible in one cell in the provided range then save the value
        for (var i=begin; i<end; i++)
        {

            if (!gameBoard[nRow][i].value && _.contains(gameBoard[nRow][i].possibleValues, nVal))
            {
                nCount++;
                nLocation = i;
            }
        }

        if (nCount === 1)
        {
            gameBoard[nRow][nLocation].value = nVal;
            PossibleValuesHelper.updatePossibleValues(nRow, nLocation, nVal);
            return true;
        }

        return false;
    },

    //See if nVal exists in two out of three columns
    TwoOfThreeRuleColumns: function(nVal)
    {
        //See if nVal exists in two out of three rows
        var nValPos = [-1,-1,-1,-1,-1,-1,-1,-1,-1];

        //See if nVal exists in each column and mark its row position
        for (var col=0; col<9; col++) {
            for (var row=0; row<9; row++)
            {
                if (gameBoard[row][col].value === nVal)
                {
                    // if found store the row position
                    nValPos[col] = row;
                    break;
                }
            }
        }

        if (this.TwoOfThreeColHelper(nValPos, 0, 1, 2, nVal) ||
            this.TwoOfThreeColHelper(nValPos, 3, 4, 5, nVal) ||
            this.TwoOfThreeColHelper(nValPos, 6, 7, 8, nVal))
        {
            return true;
        }

        return false;
    },

    TwoOfThreeColHelper: function(nValPos, colA, colB, colC, nVal)
    {
        // if nVal exists in A, B, and NOT C
        if (nValPos[colA] !== -1 && nValPos[colB] !== -1 && nValPos[colC] === -1)
        {
            // determine the range the value must be found in
            if (nValPos[colA] >= 3 && nValPos[colB] >= 3)
            {
                return this.TwoOfThreeColSet(colC, 0, 3, nVal);
            }
            else if ((nValPos[colA] < 3 || nValPos[colA] > 5)
                && (nValPos[colB] < 3 || nValPos[colB] > 5))
            {
                return this.TwoOfThreeColSet(colC, 3, 6, nVal);
            }
            else if (nValPos[colA] < 6 && nValPos[colB] < 6)
            {
                return this.TwoOfThreeColSet(colC, 6, 9, nVal);
            }
        }
        // if nVal exists in A, C, and NOT B
        else if (nValPos[colA] !== -1 && nValPos[colB] === -1 && nValPos[colC] !== -1)
        {
            // determine the range the value must be found in
            if (nValPos[colA] >= 3 && nValPos[colC] >= 3)
            {
                return this.TwoOfThreeColSet(colB, 0, 3, nVal);
            }
            else if ((nValPos[colA] < 3 || nValPos[colA] > 5)
                && (nValPos[colC] < 3 || nValPos[colC] > 5))
            {
                return this.TwoOfThreeColSet(colB, 3, 6, nVal);
            }
            else if (nValPos[colA] < 6 && nValPos[colC] < 6)
            {
                return this.TwoOfThreeColSet(colB, 6, 9, nVal);
            }
        }
        // if nVal exists in B, C, and NOT A
        else if (nValPos[colA] === -1 && nValPos[colB] !== -1 && nValPos[colC] !== -1)
        {
            // determine the range the value must be found in
            if (nValPos[colB] >= 3 && nValPos[colC] >= 3)
            {
                return this.TwoOfThreeColSet(colA, 0, 3, nVal);
            }
            else if ((nValPos[colB] < 3 || nValPos[colB] > 5)
                && (nValPos[colC] < 3 || nValPos[colC] > 5))
            {
                return this.TwoOfThreeColSet(colA, 3, 6, nVal);
            }
            else if (nValPos[colB] < 6 && nValPos[colC] < 6)
            {
                return this.TwoOfThreeColSet(colA, 6, 9, nVal);
            }
        }

        return false;
    },

    TwoOfThreeColSet: function(nCol, begin, end, nVal)
    {
        // If the value is only possible in one cell in the provided range then save the value
        var nCount = 0;
        var nLocation = -1;

        for (var row=begin; row<end; row++)
        {
            if (!gameBoard[row][nCol].value && _.contains(gameBoard[row][nCol].possibleValues, nVal))
            {
                nCount++;
                nLocation = row;
            }
        }

        if (nCount === 1)
        {
            gameBoard[nLocation][nCol].value = nVal;
            PossibleValuesHelper.updatePossibleValues(nLocation, nCol, nVal);
            return true;
        }

        return false;
    }

};