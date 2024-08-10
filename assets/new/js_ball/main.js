// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}
class Shape{
  constructor(x,y,r,color){
    this.x=x;
    this.y=y;
    this.r=r;
    this.color=color;
  }
  
  
}

class Ball extends Shape{
  constructor(x,y,r,color,vx,vy){
    super(x,y,r,color);
    this.vx=vx;
    this.vy=vy;
    this.exist=true;
  }

  update(){
    if(this.x+this.r>=width){
      this.vx=-this.vx;
    }
    else if(this.x-this.r<=0){
      this.vx=-this.vx;
    }
    if(this.y+this.r>=height){
      this.vy=-this.vy;
    }
    else if(this.y-this.r<=0){
      this.vy=-this.vy;
    }
    this.x=this.x+this.vx;
    this.y=this.y+this.vy;
  }
    
  draw(){
    ctx.beginPath();
    ctx.fillStyle=this.color;
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fill();
  }

  bump(){
    for(const ball of balls){
      if(ball===this)continue;
      const dx=this.x-ball.x;
      const dy=this.y-ball.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<ball.r+this.r){
        this.color=randomRGB();
      }
    }    
  }

}

class eatball extends Shape{
  constructor(x,y,r,color,v){
    super(x,y,r,color);    
    this.v=v;
  }  
  eat(){
    for(const ball of balls){      
      if(!ball.exist)continue;
      const dx=this.x-ball.x;
      const dy=this.y-ball.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<ball.r+this.r){
        ball.exist=false;
      }
    }    
  }

  draw(){
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.strokeStyle=this.color;
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.stroke();
  }

  ctrl(){
    window.onkeydown = (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.v;
          break;
        case "d":
          this.x += this.v;
          break;
        case "w":
          this.y -= this.v;
          break;
        case "s":
          this.y += this.v;
          break;
      }
    };
  }
}



var balls=[];
var len=random(10,20);
var eat=new eatball(200,200,20,'white',15);
function gen(){
  var i=0;
  while(i<len){
    var r=random(10,20);
    var x=random(r,width-r);
    var y=random(r,height-r);
    var vx=random(-5,5);
    var vy=random(-5,5);
    var color=randomRGB();
    const tmp=new Ball(x,y,r,color,vx,vy);
    balls.push(tmp);
    i++;
  }  
  eat.ctrl();
}

function loop(){
  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.fillRect(0,0,width,height);
  for(const ball of balls){
    if(ball.exist){
      ball.draw();
      ball.update();
      // ball.bump();
    }
    
  }
  eat.draw();
  eat.eat();
  requestAnimationFrame(loop);
}

gen();
loop();