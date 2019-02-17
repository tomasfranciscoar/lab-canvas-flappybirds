// window.onload = function() {
  // document.getElementById("start-button").onclick = function() {
  //   start();
  // };

//   function startGame() {

//   }

// };

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var frames = 0;
var pipes = [];
var gravity = 2;
var interval;
var score = 0;
var maxScore = 0;

class Flappy{
  constructor(){
    this.x = 60;
    this.y = 40;
    this.width = 30;
    this.height = 30;
    this.image = new Image();
    this.image.src = "./images/flappy.png"
  }
  rise(){
    this.y -= 40;
  }
  collision(item){
    return (this.x < item.x + item.width) &&
    (this.x + this.width > item.x) &&
    (this.y < item.y + item.height) &&
    (this.y + this.height > item.y);
  }
  draw(){
    if(this.y < canvas.height - 30)this.y += gravity;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Pipe{
  constructor(pos, y, height){
    this.x = canvas.width;
    this.y = y;
    this.width = 30;
    this.height = height;
    this.image = new Image();
    this.image.src = pos === "top" ? "./images/obstacle_top.png" : "./images/obstacle_bottom.png";
  }
  draw(){
    this.x -= 2;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

}

class Background{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.image = new Image();
    this.image.src = "./images/bg.png"
  }
  points(){
    if (!(frames % 120 === 0)) score++;
    document.getElementById("score").innerHTML = "SCORE: " + score;
    if (score >= maxScore) {
      maxScore = score;
      document.getElementById("max-score").innerHTML = "MAX SCORE: " + maxScore;
    }
  }
  gameOver(){
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", 160, 190);
    ctx.font = "40px Arial";
    ctx.fillStyle = "black"
    ctx.fillText("Press ESC to Restart", 155, 240)
    clearInterval(interval)
    interval = undefined;
  }
  draw(){
    this.x--
    if(this.x < -canvas.width) this.x = 0;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + canvas.width, this.y, this.width, this.height);
  }
}

var flappy = new Flappy();
var background = new Background();

function generatePipes(){
  if (!(frames % 120 === 0)) return;
  let height = Math.floor((Math.random() * canvas.height * .6) + 30)
  let pipe1 = new Pipe("top", 0, height);
  let pipe2 = new Pipe(null, height+120, canvas.height-120-height);
  pipes.push(pipe1);
  pipes.push(pipe2);
}

function drawPipes(){
  pipes.forEach( (pipe, index) => {
    if (pipe.x < -30) pipes.splice(index, 1);
    pipe.draw();
    if(flappy.collision(pipe)){
      console.log("GAME OVER")
      background.gameOver();
    }
  })
}

// function maxScore(){
  // if (score >= maxScore) {
  //   maxScore = score;
  //   document.getElementById("max-score").innerHTML = "MAX SCORE: " + maxScore;
//   }
// }

function update(){
  frames++;
  ctx.clearRect(0,0,canvas.width, canvas.height);
  background.draw();
  flappy.draw();
  generatePipes();
  drawPipes();
  background.points();
}

function start() {
  interval = setInterval(update, 1000/60)
}

function restart(){
  if(interval !== undefined) return;
  score = 0;
  frames = 0;
  interval = undefined;
  pipes = [];
  start();
}

start()


addEventListener("keydown", function(e){
  if(e.keyCode === 32){
    flappy.rise();
  }
  if(e.keyCode === 27){
    restart();
  }
})

// document.getElementById("start-button").onclick = function() {
//   start();
// };
