// initialize global variables

// main
$(document).ready(function(){

    renderBoard();
    $("#solveSpeed").val(100);

    $("#descriptionBtn").click(function() {
        $.ajax({
            url: "README.md",
            context: document.body,
            success: function(readMeHTML){
                var converter = new showdown.Converter();
                $("#description-content").html(converter.makeHtml(readMeHTML));
            }
        });
    });

    $("#solveInstantly").change(function() {
        var solveInstantly = $("#solveInstantly").is(':checked');
        if (solveInstantly) {
            $("#solveSpeedDiv").hide();
        } else {
            $("#solveSpeedDiv").show();
        }
    });

    $('#loadEasyPuzzle').click(function() {
        $('#msgDiv').html("Enter your own puzzle or load an existing one:");
        loadPuzzle({difficulty: "easy"});
        renderBoard();
    });
    $('#loadMediumPuzzle').click(function() {
        $('#msgDiv').html("Enter your own puzzle or load an existing one:");
        loadPuzzle({difficulty: "medium"});
        renderBoard();
    });
    $('#loadHardPuzzle').click(function() {
        $('#msgDiv').html("Enter your own puzzle or load an existing one:");
        loadPuzzle({difficulty: "hard"});
        renderBoard();
    });
});

renderBoard = function() {
    // render the game board with the current options and data
    var gameBoardTemplate = Handlebars.compile($("#gameBoard").html());
    $("#gameBoardDiv").html(gameBoardTemplate({
        rows: gameBoard
    }));

    $('#clearPuzzle').click(function() {
        $('#msgDiv').html("Enter your own puzzle or load an existing one:");
        clearPuzzle();
        renderBoard();
    });

    $('#solvePuzzle').click(function() {
        $('#msgDiv').html("Enter your own puzzle or load an existing one:");
        updateAllPossibleValues();
        if (checkForCompletedPuzzle()) {
            $('#msgDiv').html("<span class='greenText'>Puzzle Solved!</span>");
            return;
        }
        if (ConflictHelper.check()) {
            $('#msgDiv').html("<span class='redText'>This is not a valid Sudoku puzzle. There is a conflict on the board!</span>");
            return;
        }
        var solveSpeed = parseInt($("#solveSpeed").val());
        SudokuSolver.solvePuzzle(solveSpeed);
    });

    $('#solveOne').click(function() {
        $('#msgDiv').html("Enter your own puzzle or load an existing one:");
        if (checkForCompletedPuzzle()) {
            $('#msgDiv').html("<span class='greenText'>Puzzle Solved!</span>");
            return;
        }
        updateAllPossibleValues();
        if (ConflictHelper.check()) {
            $('#msgDiv').html("<span class='redText'>This is not a valid Sudoku puzzle. There is a conflict on the board!</span>");
            return;
        }

        var result = SudokuSolver.solveOneSquare();
        renderBoard();

        if (result <= 0) {
            $('#msgDiv').html("<span class='redText'>Unable to find a solution! </span>");
        }

        if (result === -1) {
            $('#msgDiv').append("<span class='redText'>There is a conflict on the board!</span>");
        }
    });

    // when a square on the game board is clicked
    $('.game-cell').click(function() {

    });
    $('.cellInput').change(function() {
        var col = this.parentNode.cellIndex;
        var row = this.parentNode.parentNode.rowIndex;
        gameBoard[row][col].value = parseInt(this.value);
    });
};

updateAllPossibleValues = function() {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            var value = parseInt(gameBoard[row][col].value);
            if (value) {
                PossibleValuesHelper.updatePossibleValues(row, col, value);
            }
        }
    }
};


Handlebars.registerHelper("showHighlight", function(highlight) {
    if (highlight) {
        return "highlight";
    }
    return "";
});

loadPuzzle = function(options) {
    clearPuzzle();

    var puzzle = [];

    if (options.difficulty === "easy") {
        puzzle = easyPuzzle1;
    }
    else if (options.difficulty === "medium") {
        puzzle = mediumPuzzle1;
    }
    else if (options.difficulty === "hard") {
        puzzle = hardPuzzle1;
    }

    // load selected puzzle
    _.each(puzzle, function(item) {
        gameBoard[item.row][item.col].value = item.value;
    });

    updateAllPossibleValues();
}

clearPuzzle = function() {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            gameBoard[row][col].value = "";
            gameBoard[row][col].possibleValues = [1,2,3,4,5,6,7,8,9];
        }
    }
};

checkForCompletedPuzzle = function() {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            if (!gameBoard[row][col].value) {
                return false;
            }
        }
    }
    return true;
};

gameBoard = [
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ],
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ],
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ],
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ],
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ],
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ],
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ],
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ],
    [
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] },
        { value: "", possibleValues: [1,2,3,4,5,6,7,8,9] }
    ]
];


