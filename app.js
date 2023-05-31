const grid = document.querySelector(".grid")
const scoreDisplay = document.querySelector("#score")
const blockWidth = 100
const blockHeight = 20
const blocks = []
const gridWidth = 560
const gridHeight = 300
const ballDiameter = 20
const user = document.createElement("div")
const userStart = [230, 10]
let currentUserPosition = userStart
let timerId
let score =0;
const ball = document.createElement("div")
const ballStart = [270, 30]
let currentBallPosition = ballStart
let ballX = 2
let ballY = 2

class Block {
    constructor(x, y) {
        this.bottomLeft = [x,y]
        this.bottomRight = [x+blockWidth, y]
        this.topLeft = [x,y+blockHeight]
        this.topRight = [x+blockWidth, y+blockHeight]
    }
}

function generateBlocks(){
    startLeft = 10
    startBottom = 270
    rowCount = 3
    colCount = 5
    let colDec = 30
    for (let row=0;row<rowCount; row++){
        startLeft = 10
        startBottom = 270 - (colDec*row)
        for(let col=0; col<colCount; col++){  
            blocks.push(new Block(startLeft, startBottom))
            startLeft += 110
        }
    }
}

function addBlocks(){
   
    for (let i=0; i<blocks.length; i++){
        const block = document.createElement("div")
        block.classList.add("block")
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] +'px'
        grid.appendChild(block)
    }
}

function addUser(){
    user.classList.add("user")
    grid.appendChild(user)
    drawUser()
}

function drawUser(){
    user.style.left = currentUserPosition[0] + 'px'
    user.style.bottom = currentUserPosition[1]+ 'px'
}

function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (currentUserPosition[0] > 0){
                currentUserPosition[0] -=10
                drawUser()
            }
            break;
        case 'ArrowRight':
            if (currentUserPosition[0] < (gridWidth - 100)){
                currentUserPosition[0] +=10
                drawUser()
            }
            break;
        }
}
// add ball
function addBall(){
    ball.classList.add("ball")
    grid.appendChild(ball)
    drawBall()
}

function drawBall(){
    ball.style.left = currentBallPosition[0] + 'px'
    ball.style.bottom = currentBallPosition[1]+ 'px'
}

function moveBall(){
    currentBallPosition[0] += ballX
    currentBallPosition[1] += ballY
    drawBall()
    checkForCollisions()
}

generateBlocks()
addBlocks()
addUser()
document.addEventListener('keydown', moveUser)
addBall()
timerId = setInterval(moveBall, 30)

function changeDirection() {
    if (ballX === 2 && ballY === 2){
        ballY = -2
        return
    }
    if (ballX === 2 && ballY === -2){
        ballX = -2
        return
    }
    if (ballX === -2 && ballY === -2){
        ballY = 2
        return
    }
    if (ballX === -2 && ballY === 2){
        ballX = 2
        return
    }
}

function checkForCollisions() {
    //check for block collision
    for(let i=0;i<blocks.length;i++){
        if(
            (currentBallPosition[0] > blocks[i].bottomLeft[0] && currentBallPosition[0]< blocks[i].bottomRight[0]) &&
        ((currentBallPosition[1] +ballDiameter) > blocks[i].bottomLeft[1] && currentBallPosition[1] <blocks[i].topLeft[1])
        ){
            let allBlocks = Array.from(document.querySelectorAll(".block"))
            allBlocks[i].classList.remove("block")
            blocks.splice(i, 1)
            score++;
            scoreDisplay.innerHTML = score
            changeDirection()
            if (blocks.length === 0){
                scoreDisplay.innerHTML = "You Win. Score: "+score
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }
    //check for wall collisions
    if (
        currentBallPosition[0] >= (gridWidth-ballDiameter) ||
        currentBallPosition[1] >= (gridHeight - ballDiameter) ||
        currentBallPosition[0] <=0
    ){
        changeDirection()
    }

    // check for user block collision
    if(
        (currentBallPosition[0] >= currentUserPosition[0] && currentBallPosition[0] <= currentUserPosition[0]+blockWidth) &&
        (currentBallPosition[1] >= currentUserPosition[1] && currentBallPosition[1] <= currentUserPosition[1]+ blockHeight)
    ){
        changeDirection()
    }
    //check for game over
    if(currentBallPosition[1] <=0 ){
        clearInterval(timerId)
        scoreDisplay.innerHTML = "You Lose. Score: "+score
        document.removeEventListener('keydown', moveUser)
    }
}






