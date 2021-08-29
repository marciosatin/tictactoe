const PLAYER_XIS = 'xis'
const PLAYER_BALL = 'ball'
const COL_A = 'a'
const COL_B = 'b'
const COL_C = 'c'

let container = document.querySelector('section')
let template = document.getElementById('item')

let createRow = () => document.createElement('div')

let row = createRow()
let rowLable = COL_A
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

const isAllEquals = handleUsed => handleUsed.every((value, i, arr) => value === arr[0])
const isAllDifferent = handleUsed => {
    let verifier = {}
    for (const item of handleUsed) {
        if (!verifier[item]) {
            verifier[item] = 1
            continue
        }
        verifier[item]++
    }

    let foundEquals = false 
    for (const index of Object.keys(verifier)) {
        if (verifier[index] === 1) {
            continue
        }
        foundEquals = true
    }
    if (foundEquals) {
        return false
    }
    return true
}

const isWinner = (gameData) => {

    let winner = false;

    const playerMoves = gameData[gameData.lastMove.player];
    const playerColsUsed = playerMoves.map(item => item.col);
    const playerRowsUsed = playerMoves.map(item => item.row);

    //Possui 3 linhas e colunas diferentes
    if (isAllDifferent(playerColsUsed) && isAllDifferent(playerRowsUsed)) {
        winner = true
    }

    //Possui 3 colunas iguais e 3 linhas diferentes
    if (isAllEquals(playerColsUsed) && isAllDifferent(playerRowsUsed)) {
        winner = true
    }

    //Possui 3 linhas iguais e 3 colunas diferentes
    if (isAllEquals(playerRowsUsed) && isAllDifferent(playerColsUsed)) {
        winner = true
    }

    if (winner) {
        console.log('WINNER::::', gameData.lastMove.player);
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
        rowLable = (rowLable === COL_A) ? COL_B : COL_C
    }

}