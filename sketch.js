var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var score = 0;
var life = 3
var bullets = 70;



var gameState = "fight"

var lose, winning, explosionSound;


function preload(){

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")

  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)


   //creating sprites to depvt lives remaining
   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
   heart1.addImage("heart1", heart1Img)
   heart1.scale = 0.4

   heart2 = createSprite(displayWidth-100,40,20,20)
   heart2.visible = false
   heart2.addImage("heart2", heart2Img)
   heart2.scale = 0.4
   
   heart3 = createSprite(displayWidth-150,40,20,20)
   heart3.addImage("heart3", heart3Img)
   heart3.scale = 0.4


   //zombie and bullet group
   bulletGroup = new Group();
   zombieGroup = new Group();



}

function draw() {
  background(0); 


  if(gameState === "fight"){

    //removing the heart when a life is lost
    if(life===3){
      heart3.visible = true
      heart2.visible = false
      heart1.visible = false
    }
    if(life===2){
      heart3.visible = false
      heart2.visible = true
      heart1.visible = false
    }
    if(life===1){
      heart3.visible = false
      heart2.visible = false
      heart1.visible = true
    }

    //go to gamestate "Lost" when all lives are lost
    if(life===0){
      gameState = "lost"

    }


    //go to gameState "won" if score is 100
    if(score==100){
      gameState = "won"
      winning.play();
    }

//moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullet = createSprite(displayWidth-1150,player.y-30,20,10)
  bullet.velocityX = 20

 bulletGroup.add(bullet)
 player.depth = bullet.depth
 player.depth = player.depth+2
  player.addImage(shooter_shooting)
  bullets = bullet-1
  explosionSound.play();
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

//go to gamsstate "bullet" when the bullets run out
if(bullets==0){
  gameState = "bullet"
lose.play();

}

//destroy the zombie when bullet touches it
if(zombieGroup.isTouching(bulletGroup)){
  for(var i=0;i<zombieGroup.length;i++){     
      
   if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play();
       
        score = score + 2
        } 
  
  }
}

//destroy zombie when player touches it
if(zombieGroup.isTouching(player)){

  lose.play();


 for(var i=0;i<zombieGroup.length;i++){     
      
  if(zombieGroup[i].isTouching(player)){
       zombieGroup[i].destroy()

       life=life-1
       } 
 
 }
}

//spawnning the zombies
enemy();
  }




drawSprites();

//displaying the score and remaining lives and bullets
textSize(20)
fill("white")
text("Bullets remaining:" + bullets, displayWidth-210,displayHeight/2-250)
text("Score is:" + score, displayWidth-200,displayHeight/2-220)
text("Lives remaining:" + life, displayWidth-200,displayHeight/2-280)

//destroy zombie and player and display a message in gamestate "lost"
if(gameState == "lost"){

  textSize(100)
  fill("red")
  test("You lost haha",400,400)
  zombieGroup.destroyEach();
  player.destroy();

}

//destroy zombie and player and display message in gamestate "won"
else if(gameState == "won"){

  textSize(100);
  fill("yellow")
  text("You won wahooo",400,400)
  zombieGroup.destroyEach();
  player.destroy();

}

//destroy zombie, player, and bullets and display message in gamestate "bullet"
else if(gameState == "bullet"){

  textSize(50)
  fill("yellow")
  text("You ran out of bullets womp womp",470,470)
  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();

}

}


//creating the function to spawn the enemies
function enemy(){
  if(frameCount%50===0){

    //giving random coordinates for the zombies
    zombie = createSprite(random(500,1100),random(100,500),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombie.debug = true
    zombie.setCollider("rectangle",0,0,400,400)

    zombie.lifetime = 400
    zombieGroup.add(zombie)
  }

}
