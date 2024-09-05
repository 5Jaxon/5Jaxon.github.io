const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const bullets=[];
class Tank{    
    constructor(x,y,color,size){
        this.x=x;
        this.y=y;
        this.color=color;
        this.size=size;
        this.speed=1;
        this.angle=0;
        this.flag=false;
    }
    draw(){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle=this.color;
        ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size);
        ctx.fillStyle='black';
        ctx.fillRect(0,-this.size/6,this.size,this.size/3);
        ctx.restore();
    }
    moveForward() {
        const nextX = this.x + Math.cos(this.angle) * this.speed;
        const nextY = this.y + Math.sin(this.angle) * this.speed;
        
        if (!this.checkCollisionWithWalls(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }
    }
    
    moveBackward() {
        const nextX = this.x - Math.cos(this.angle) * this.speed;
        const nextY = this.y - Math.sin(this.angle) * this.speed;
    
        if (!this.checkCollisionWithWalls(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }
    }
    
    checkCollisionWithWalls(x, y) {
        for (let wall of walls) {
            if (x + this.size / 2 > wall.x && x - this.size / 2 < wall.x + wall.width &&
                y + this.size / 2 > wall.y && y - this.size / 2 < wall.y + wall.height) {
                return true; // 碰撞检测
            }
        }
        return false;
    }

    rotateLeft() {
        this.angle -= 0.02; // 每次按键旋转的弧度
    }

    rotateRight() {
        this.angle += 0.02;
    }
    shot(){
        if(!this.flag){
            const x=this.x+Math.cos(this.angle) * (this.size+10)/2;
            const y=this.y+Math.sin(this.angle) * (this.size+10)/2;
            const bullet=new Bullet(x,y,this.angle);
            bullets.push(bullet);
            this.flag=true;
            setTimeout(()=>{                
                this.flag=false;
            },500);            
        }        
    }
}

class Bullet{
    constructor(x,y,angle){
        this.x=x;
        this.y=y;
        this.angle=angle;
        this.speed=5;
        this.size=3;
        this.color='black';
        this.timer=0;
        this.velocityX = Math.cos(this.angle) * this.speed;
        this.velocityY = Math.sin(this.angle) * this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.timer++;
        this.checkCollisionWithTank(tk1);
        this.checkCollisionWithTank(tk2);
    

        if (this.x - this.size < 0 || this.x + this.size > width) {
            this.velocityX = -this.velocityX;
        }

        if (this.y - this.size < 0 || this.y + this.size > height) {
            this.velocityY = -this.velocityY;
        }

        for (let wall of walls) {
            if (wall.isColliding(this)) {
                if (this.x - this.size < wall.x || this.x + this.size > wall.x + wall.width) {
                    this.velocityX = -this.velocityX;
                }

                if (this.y - this.size < wall.y || this.y + this.size > wall.y + wall.height) {
                    this.velocityY = -this.velocityY;
                }
            }
        }
    }

    checkCollisionWithTank(tank) {
        if (this.x + this.size > tank.x - tank.size / 2 &&
            this.x - this.size < tank.x + tank.size / 2 &&
            this.y + this.size > tank.y - tank.size / 2 &&
            this.y - this.size < tank.y + tank.size / 2) {
            tank.color='black';
  
        }
    }
}

class Wall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 'gray';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isColliding(bullet) {
        return bullet.x + bullet.size > this.x && 
               bullet.x - bullet.size < this.x + this.width &&
               bullet.y + bullet.size > this.y && 
               bullet.y - bullet.size < this.y + this.height;
    }
}

function generateRandomWalls(numWalls, minWidth, maxWidth, minHeight, maxHeight) {
    const walls = [];
    for (let i = 0; i < numWalls; i++) {
        const wallWidth = Math.random() * (maxWidth - minWidth) + minWidth;
        const wallHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        const wallX = Math.random() * (width - wallWidth);
        const wallY = Math.random() * (height - wallHeight);
        walls.push(new Wall(wallX, wallY, wallWidth, wallHeight));
    }
    return walls;
}

function isTankInWall(tank, walls) {
    for (let wall of walls) {
        if (
            tank.x + tank.size / 2 > wall.x && 
            tank.x - tank.size / 2 < wall.x + wall.width &&
            tank.y + tank.size / 2 > wall.y && 
            tank.y - tank.size / 2 < wall.y + wall.height
        ) {
            return true; // 坦克与墙壁重叠
        }
    }
    return false; // 坦克位置合法
}

// 随机生成坦克位置，确保不与墙壁重叠
function generateRandomTankPosition(walls, tankSize) {
    let x, y;
    let validPosition = false;

    while (!validPosition) {
        x = Math.random() * (width - tankSize) + tankSize / 2;
        y = Math.random() * (height - tankSize) + tankSize / 2;
        
        const tempTank = { x: x, y: y, size: tankSize };

        if (!isTankInWall(tempTank, walls)) {
            validPosition = true;
        }
    }

    return { x, y };
}

// 生成随机墙壁和坦克
const numWalls = 15;
const walls = generateRandomWalls(numWalls, 50, 150, 20, 100);

const tank1Position = generateRandomTankPosition(walls, 30);
const tank2Position = generateRandomTankPosition(walls, 30);

const tk1 = new Tank(tank1Position.x, tank1Position.y, 'red', 30);
const tk2 = new Tank(tank2Position.x, tank2Position.y, 'blue', 30);
const keyMap={};

window.onkeydown = (event) => {
    keyMap[event.code] = true;
};

// 键盘松开事件，更新按键状态
window.onkeyup = (event) => {
    keyMap[event.code] = false;
};

function handleTankMovement() {
    if (keyMap['KeyW']) {
        tk1.moveForward();
    }
    if (keyMap['KeyS']) {
        tk1.moveBackward();
    }
    if (keyMap['KeyA']) {
        tk1.rotateLeft();
    }
    if (keyMap['KeyD']) {
        tk1.rotateRight();
    }
    if (keyMap['Space']) {
        tk1.shot();
    }
    if (keyMap['ArrowUp']) {
        tk2.moveForward();
    }
    if (keyMap['ArrowDown']) {
        tk2.moveBackward();
    }
    if (keyMap['ArrowLeft']) {
        tk2.rotateLeft();
    }
    if (keyMap['ArrowRight']) {
        tk2.rotateRight();
    }
    if (keyMap['Enter']) {
        tk2.shot();
    }
}

function loop(){
    ctx.fillStyle='rgba(255,255,255,1)';
    ctx.fillRect(0,0,width,height);    
    handleTankMovement();
    tk1.draw();    
    tk2.draw();
    if(bullets.length>0&&bullets[0].timer>=500)bullets.shift();
    for(const bullet of bullets){
        bullet.update();
        bullet.draw();
    }
    for(const wall of walls){
        wall.draw();
    }
    requestAnimationFrame(loop);
}

loop();
