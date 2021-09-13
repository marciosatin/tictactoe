const PLAYER_XIS = 'xis'
const PLAYER_BALL = 'ball'
const ROW_A = 'a'
const ROW_B = 'b'
const ROW_C = 'c'

let container = document.querySelector('section div#board')
let template = document.getElementById('item')

let createRow = () => document.createElement('div')

let row = createRow()
let rowLable = ROW_A
let colLable = 1

let player = new Player({
    type: PLAYER_XIS
})

let gameData = {
    xis: [],
    ball: [],
    usedPositions: [],
    lastMove: {
        player: null,
        position: null
    }
}

const isDiagonalWinner = (playerMoves) => {
    let diagonalOne = 0
    let diagonalTwo = 0
    const positionsDiagonalOne = ['a1', 'b2', 'c3']
    const positionsDiagonalTwo = ['c1', 'b2', 'a3']
    for (let i = 0; i < playerMoves.length; i++) {
        const move = playerMoves[i]
        const rowCol = move.row + move.col
        if (positionsDiagonalOne.find(item => item == rowCol)) {
            diagonalOne++
        }
        if (positionsDiagonalTwo.find(item => item == rowCol)) {
            diagonalTwo++
        }
    }
    if (diagonalOne == 3 || diagonalTwo == 3) {
        return true
    }
    return false
}

const atLeastThreeOccurrences = (handleUsed) => {
    let itemsEqual = {}
    for (let i = 0; i < handleUsed.length; i++) {
        const item = handleUsed[i]
        if (!itemsEqual[item]) {
            itemsEqual[item] = 1
            continue
        }
        itemsEqual[item]++
    }

    for (const key in itemsEqual) {
        if (Object.hasOwnProperty.call(itemsEqual, key)) {
            const value = itemsEqual[key];
            if (value == 3) {
                return true
            }

        }
    }

    return false

}

const isThreeEquals = handleUsed => {
    return atLeastThreeOccurrences(handleUsed)
}

const isWinner = (playerMoves) => {

    let winner = false;

    const playerColsUsed = playerMoves.map(item => item.col);
    const playerRowsUsed = playerMoves.map(item => item.row);

    console.log('playerColsUsed', playerColsUsed);
    console.log('playerRowsUsed', playerRowsUsed);

    //Completou linha
    if (isThreeEquals(playerRowsUsed)) {
        winner = true
        console.log('Possui 3 em linha');
    }

    //Completou coluna
    if (isThreeEquals(playerColsUsed)) {
        winner = true
        console.log('Possui 3 em coluna');
    }

    //Possui pelo menos 3 colunas e linhas diferentes formando diagonal
    if (isDiagonalWinner(playerMoves)) {
        winner = true
        console.log('Possui 3 em coluna e linha diferentes formando diagonal');
    }

    return winner;
}

const setPlayerLabel = (player, positionId) => {
    let elementItem = document.querySelector('div.item.' + positionId)
    elementItem.innerText = (player.type === PLAYER_XIS) ? 'X' : 'O'
}

const itemClick = (e) => {

    gameData.lastMove.player = player
    gameData.lastMove.position = e.target.dataset.row + e.target.dataset.col

    const found = gameData.usedPositions.find(element => element == gameData.lastMove.position);
    if (found) {
        e.preventDefault()
        return
    }

    gameData.usedPositions.push(gameData.lastMove.position);
    gameData[player.type].push({
        player: player.type,
        row: e.target.dataset.row,
        col: e.target.dataset.col
    })

    const playerMoves = gameData[player.type]

    setPlayerLabel(player, gameData.lastMove.position)

    /******************
    *** GAME DATA *****
    *******************/
    console.log('GAME DATA: ', gameData)
    /******************
    *******************
    *******************/

    if (gameData.usedPositions.length > 4) {
        if (isWinner(playerMoves)) {
            alert('Winner is: ' + gameData.lastMove.player.type)
            resetGame()
            return
        }
    }
    if (gameData.usedPositions.length === 9) {
        console.log('=== EMPATE ===')
    }

    player.type = (player.type === PLAYER_XIS) ? PLAYER_BALL : PLAYER_XIS

}

const renderView = () => {

    for (let i = 1; i <= 9; i++) {

        let itemClone = template.content.firstElementChild.cloneNode(true)

        itemClone.dataset.col = colLable++
        itemClone.dataset.row = rowLable

        let identifierBlock = rowLable + itemClone.dataset.col

        itemClone.className = 'item ' + identifierBlock
        itemClone.innerText = identifierBlock

        itemClone.addEventListener('click', itemClick)
        row.append(itemClone)

        if (i % 3 === 0) {
            container.append(row)
            row.innerHtml = ''
            row = createRow()

            colLable = 1
            rowLable = (rowLable === ROW_A) ? ROW_B : ROW_C
        }

    }

}

const resetGame = () => {
    rowLable = ROW_A
    colLable = 1

    player = new Player({
        type: PLAYER_XIS
    })
    gameData = {
        xis: [],
        ball: [],
        usedPositions: [],
        lastMove: {
            player: null,
            position: null
        }
    }
    container.innerHTML = ''
    renderView()
}

renderView()
