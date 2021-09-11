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

let player = PLAYER_XIS
let gameData = {
    xis: [],
    ball: [],
    usedPositions: [],
    lastMove: {
        player: null,
        position: null
    }
}

const isDiagonalWinner = (playerColsUsed, playerRowsUsed) => {
    let colsGroup = {}
    let rowsGroup = {}
    const notDiagonal = ['a2', 'b1', 'b3', 'c2']

    for (let i = 0; i < playerColsUsed.length; i++) {
        const col = playerColsUsed[i]
        if (!colsGroup[col]) {
            colsGroup[col] = 1
            continue
        }
        colsGroup[col]++
    }
    for (let i = 0; i < playerRowsUsed.length; i++) {
        const row = playerRowsUsed[i]
        if (!rowsGroup[row]) {
            rowsGroup[row] = 1
            continue
        }
        rowsGroup[row]++
    }

    const colsDifferent = Object.keys(colsGroup)
    const rowsDifferent = Object.keys(rowsGroup)

    if (colsDifferent.length == 3 && rowsDifferent.length == 3) {
        for (let i = 0; i < colsDifferent.length; i++) {
            const col = colsDifferent[i]
            for (let i = 0; i < rowsDifferent.length; i++) {
                const row = rowsDifferent[i]
                const rowCol = row + col
                if (notDiagonal.every(item => item == rowCol)) {
                    return false
                }
            }
        }

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

const isWinner = (gameData) => {

    let winner = false;

    const playerMoves = gameData[gameData.lastMove.player];
    const playerColsUsed = playerMoves.map(item => item.col);
    const playerRowsUsed = playerMoves.map(item => item.row);

    //Possui pelo menos 3 linhas iguais
    if (isThreeEquals(playerRowsUsed)) {
        winner = true
        console.log('Possui 3 linhas iguais');
    }

    //Possui pelo menos 3 colunas iguais
    if (isThreeEquals(playerColsUsed)) {
        winner = true
        console.log('Possui 3 colunas iguais');
    }

    //Possui pelo menos 3 colunas e linhas diferentes formando diagonal
    if (isDiagonalWinner(playerColsUsed, playerRowsUsed)) {
        winner = true
        console.log('Possui 3 colunas e linhas diferentes formando diagonal');
    }

    if (winner) {
        console.log('WINNER::::', gameData.lastMove.player);
        // resetGame()
    }

    return winner;
}

const setPlayerLabel = (player, positionId) => {
    let elementItem = document.querySelector('div.item.' + positionId)
    elementItem.innerText = (player === PLAYER_XIS) ? 'X' : 'O'
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
    gameData[player].push({
        player: player,
        row: e.target.dataset.row,
        col: e.target.dataset.col
    })

    setPlayerLabel(player, gameData.lastMove.position)

    /******************
    *** GAME DATA *****
    *******************/
    console.log('GAME DATA: ', gameData)
    /******************
    *******************
    *******************/

    player = (player === PLAYER_XIS) ? PLAYER_BALL : PLAYER_XIS

    if (gameData.usedPositions.length > 4) {
        if (isWinner(gameData)) {
            // alert('Winner is: ' + gameData.lastMove.player)
            // window.location.reload()
        }
    }
    if (gameData.usedPositions.length === 9) {
        console.log('=== EMPATE ===')
    }

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

    player = PLAYER_XIS
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
