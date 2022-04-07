var solvedBoard = []
let board = document.getElementsByClassName('board')[0]
for(let i=0; i<9; i++){
    for(let j=0; j<9; j++){
        let bg = "212121"
        if( ([0,1,2].includes(i) && ![3,4,5].includes(j)) || ([3,4,5].includes(i) && [3,4,5].includes(j)) || ([6,7,8].includes(i) && ![3,4,5].includes(j)) ){
            bg = "1aa1a1"
        }
        board.innerHTML += `<div style="--bg:#${bg}" class="cell" contentEditable></div>`
    }
}

const solvePuzzle = () => {
    let allCells = [], row = []
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            let cell = document.getElementsByClassName('cell')[j + 9*i]
            if(cell.textContent == ""){
                row[j] = 0
                continue
            }
            row[j] = parseInt(cell.textContent)
        }
        allCells.push(row)
        row = []
    }

    const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')
    const encodeParams = (params) => 
    Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');

    const data = {board:allCells}
    fetch('https://sugoku.herokuapp.com/solve', {
        method: 'POST',
        body: encodeParams(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(response => response.json())
    .then(response => {
        solvedBoard = response.solution
        for(let i=0; i<9; i++){
            for(let j=0; j<9; j++){
                document.getElementsByClassName('cell')[j + 9*i].textContent = solvedBoard[i][j]
            }
        }
    })
    .catch(console.warn)
}

/* https://github.com/bertoort/sugoku */