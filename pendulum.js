// Constants
const background = document.getElementById('pendulum')
const width = 1200
const height = 600
const gravity = -9.8
const c = document.getElementById('pendulum-canvas')
c.width = width; 
c.height = height;
const ctx = c.getContext('2d')

//Ball
const ballSize = 40
const ballStartingPos = [width / 2 - ballSize / 2, triangleHeight + length]
let ballPos = ballStartingPos
let ballPositions = []

// variables
let maxAngle, currentAngle, time, triangleHeight, launch, length

//input
let leftDown = false
let rightDown = false
let upDown = false
let downDown = false

function reset() {
  triangleHeight = 25
  ballPos = [width / 2 - ballSize / 2, triangleHeight + length]
  length = 100
  maxAngle = 0
  currentAngle = 0
  time = 0
}

function keyDownHandler(event) {
  if (event.key == "ArrowLeft") {
    leftDown = true
  } if (event.key == "ArrowRight") {
    rightDown = true
  } if (event.key == "ArrowUp") {
    upDown = true
  } if (event.key == "ArrowDown") {
    downDown = true
  }
}

function keyUpHandler(event) {
  if (event.key == "ArrowLeft") {
    leftDown = false
  } if (event.key == "ArrowRight") {
    rightDown = false
  } if (event.key == "ArrowUp") {
    upDown = false
  } if (event.key == "ArrowDown") {
    downDown = false
  }
}

function changeValues() {
  if (leftDown) {
    maxAngle += 1
  } if (rightDown) {
      maxAngle -= 1   
  } if (upDown) {
    length += 1
  } if (downDown && length > 1) {
    length -= 1
  }
}

function radians(num) {
  return num * (Math.PI / 180)
}

function degrees(num) {
  return num * (180 / Math.PI)
}

function moveBall() {
  const period = 2 * Math.PI * Math.sqrt((length / 100) / (-1 * gravity))
  const angFrequency = (2 * Math.PI) / period
  const amplitude = length * Math.sin(radians(Math.abs(maxAngle)))
  const phase = Math.PI / 2

  // X pos
  let x = amplitude * Math.sin(angFrequency * time - phase)
  ballPos[0] = width / 2 + x - ballSize / 2

  // Y pos
  let y = Math.sqrt(Math.pow(length, 2) - Math.pow(x, 2))
  ballPos[1] = y - ballSize / 2 + triangleHeight

  currentAngle = degrees(Math.acos(x / length)) - degrees(phase)
  time += 0.01
}

function drawGraph() {
  let tileSize = 50
  ctx.beginPath()
  ctx.lineWidth = 1
  
  for (let i = 0; i < 1200; i += tileSize) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height)
  }

  for (let k = 0; k < height; k += tileSize) {
    ctx.moveTo(0, k)
    ctx.lineTo(width, k)
  }
  ctx.stroke()
}

function drawText() {
  let vals = document.getElementById('text')
  vals.innerText = `X position: ${Math.round((ballPos[0] - ballStartingPos[0] + Number.EPSILON) * 100) / 100}m
Y position: ${Math.round((-1 * (ballPos[1] - ballStartingPos[1]) + Number.EPSILON) * 100) / 100}m
Initial Velocity: ${Math.round((vel + Number.EPSILON) * 100) / 100}m/s
Angle: ${Math.round((angle + Number.EPSILON) * 100) / 100} degrees
Height: ${(Math.round((height- ballPos[1] - ballSize + Number.EPSILON) * 100) / 100)}m
Ground Height: ${height - groundHeight - ballSize}m`
  vals.style.margin = '0em 1'
}

function drawSpeedArrows() {
  const lineConstant = 0.07
  const lineWidth = 3
  const arrowConstant = 6
  let arrowConstantX = arrowConstant
  let arrowConstantY = arrowConstant

  const period = 2 * Math.PI * Math.sqrt((length / 100) / (-1 * gravity))
  const angFrequency = (2 * Math.PI) / period
  const amplitude = length * Math.sin(radians(Math.abs(maxAngle)))

  let vel = amplitude * angFrequency * Math.sin(angFrequency * time)
  let velX = vel * Math.cos(radians(currentAngle))
  let velY = vel * Math.sin(radians(currentAngle))

  const xLineLength = velX / lineConstant
  const yLineLength = velY / lineConstant

  if (velX >= 0) {
    arrowConstantX = -1 * Math.abs(arrowConstantX)
  } else {
    arrowConstantX = Math.abs(arrowConstantX)
  }
  if (velY >= 0) {
    arrowConstantY = -1 * Math.abs(arrowConstantY)
  } else {
    arrowConstantY = Math.abs(arrowConstantY)
  }

  ctx.beginPath()
  // X
  ctx.moveTo(ballPos[0] + ballSize / 2, ballPos[1] + ballSize / 2)
  ctx.lineTo(ballPos[0] + xLineLength + ballSize / 2, ballPos[1] + ballSize / 2)
  ctx.moveTo(ballPos[0] + xLineLength + ballSize / 2, ballPos[1] + ballSize / 2)
  ctx.lineTo(ballPos[0] + ballSize / 2 + xLineLength + arrowConstantX, ballPos[1] + ballSize / 2 + arrowConstantY)
  ctx.moveTo(ballPos[0] + xLineLength + ballSize / 2, ballPos[1] + ballSize / 2)  
  ctx.lineTo(ballPos[0] + ballSize / 2 + xLineLength + arrowConstantX, ballPos[1] + ballSize / 2 - arrowConstantY)

  // Y
  ctx.moveTo(ballPos[0] + ballSize / 2, ballPos[1] + ballSize / 2)
  ctx.lineTo(ballPos[0] + ballSize / 2, ballPos[1] + ballSize / 2 + yLineLength)
  ctx.moveTo(ballPos[0] + ballSize / 2, ballPos[1] + ballSize / 2 + yLineLength)
  ctx.lineTo(ballPos[0] + ballSize / 2 + arrowConstantX, ballPos[1] + ballSize / 2 + yLineLength + arrowConstantY)
  ctx.moveTo(ballPos[0] + ballSize / 2, ballPos[1] + ballSize / 2 + yLineLength)  
  ctx.lineTo(ballPos[0] + ballSize / 2 + arrowConstantX, ballPos[1] + ballSize / 2 + yLineLength + arrowConstantY)


  ctx.stroke()
}

function drawBackground() {
  ctx.fillStyle = "beige"
  ctx.fillRect(0, width, 0, height)
  ctx.clearRect(0, 0, width, height)
}

function drawWindow() {
  drawBackground()
  drawGraph()
  drawSpeedArrows()
  drawText()
  ball.style.left = ballPos[0] + 'px'
  ball.style.top = ballPos[1] + 'px'
}

function gameLoop() {
  if (shot) {
    moveBall()
  }
  else {
    changeValues()
  }
  drawWindow()
  window.requestAnimationFrame(gameLoop);
}

export function projStart() {
  document.getElementById('proj-motion').style.display = "block"
  document.getElementById('text-box').style.display = "block"
  document.getElementById('text').style.display = "block"

  reset()
  
  document.addEventListener("keydown", keyDownHandler, false)
  document.addEventListener("keyup", keyUpHandler, false)
  document.addEventListener("keydown", function(event) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
      event.preventDefault();
    }
    switch (event.key) {
      case " ":
        shot = true
        break;
      case "r":
        reset()
        break;
      default:
        return;
    }
  })
  window.requestAnimationFrame(gameLoop);
}
