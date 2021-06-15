
  var PLAY = 1;
  var END = 0;
  var gameState = PLAY;
  
  var trex, trex_running, trex_collided;
  var ground, invisibleGround, groundImage;
  
  var cloudsGroup, cloudImage;
  var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
  
  var score=0;
  
  var gameOver, restart;
  
  var bg;

  var skullGroup;

  var fireGroup, fire;

  var ice;
  
  function preload(){
    trex_running =   loadAnimation("dino1.png","dino2.png","dino3.png");
    trex_collided = loadAnimation("dino_collided.png");
    
    DinoMomImg = loadImage("Dino Mom.png")
    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud.png");
    
    obstacle1 = loadImage("obstacle.png");
    obstacle2 = loadImage("obstacle.png");
    obstacle3 = loadImage("obstacle.png");
    obstacle4 = loadImage("obstacle.png");
    obstacle5 = loadImage("obstacle.png");
    obstacle6 = loadImage("obstacle.png");

    skullImg = loadImage("skeleton.png");

    sGroundImg = loadImage("platform.png");

    iceImg = loadImage("stone4.png");
    
    fireImg = loadImage("fire.png");

    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("replay.jpg");
    
    jumpSound = loadSound("jump.mp3");
    dieSound = loadSound("die.mp3");
    checkPointSound = loadSound("checkPoint.mp3"); 

    bg = loadImage("bg1.jpg");
  }
  
  function setup() {
    createCanvas(displayWidth, displayHeight);

     bg1 = createSprite(800,100,displayWidth,displayHeight);
  bg1.addImage("q",bg);
  bg1.scale =2.5;
    
    trex = createSprite(50,displayHeight-100,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);
    trex.scale = 0.25;

    motherTrex = createSprite(displayWidth-100,displayHeight-100,20,50);
    motherTrex.addImage(DinoMomImg);
    motherTrex.visible = false;

    //fire = createSprite(50,displayHeight-150,20,50);
    //fire.addImage("fire",fireImg);
    //fire.scale = 0.5;

    ground = createSprite(200,displayHeight-100,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;
    ground.velocityX = -(6 + 3*score/100);
    
    gameOver = createSprite(displayWidth/2,displayHeight/2);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(displayWidth/2,displayHeight/2+100);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.5;
  
    gameOver.visible = false;
    restart.visible = false;
    
    invisibleGround = createSprite(200,displayHeight-80,400,10);
    invisibleGround.visible = false;


    
    cloudsGroup = new Group();
    obstaclesGroup = new Group();
    skullGroup = new Group();
    fireGroup = new Group();
    
    score = 0;
  }
  
  function draw() {
    background(255);
    text("Score: "+ score, displayWidth-100,100);
    
    if (gameState===PLAY){
      score = score + Math.round(getFrameRate()/60);
      
    
      if(keyDown("space") && trex.y >= 159) {
        jumpSound.play();
        trex.velocityY = -14;
        
      }

      if(keyDown("up")){
        trex.velocityX = 3;
      }
      if(keyDown("down")){
        trex.velocityX = -3
      }
    
      //if(keyDown("right")){
        //fire.y = trex.y;
        //fire.velocityX = 5; 
      //}
    
      trex.velocityY = trex.velocityY + 0.8
    
      
      if (ground.x < 0){
        ground.x = ground.width/2;
      }

      if(score >= 700){
        motherTrex.visible = true;
        text("You reached your Mom",displayWidth/2,displayHeight/2);
       gameState = END
         }

      bg1.velocityX = -5;

      if (bg1.x < 200){
        bg1.x = bg1.width/2;
      }
    
      trex.collide(invisibleGround);
      spawnClouds();
      spawnObstacles();
      spawnSkull();
      spawnIce();


      
      
      if (score>0 && score%100 === 0){
        checkPointSound.play();
      }
    
      if(obstaclesGroup.isTouching(trex)){
        dieSound.play();  
        gameState = END;
          
      }
      if(skullGroup.isTouching(trex)){
       // trex.setCollider("rectangle",0,0,300,trex.height);
       //fire.y = trex.y;
       //fire.velocityX = 5;
       spawnFire(); 
      }

     
    }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
      //set velcity of each game object to 0
      bg1.velocityX = 0;
      ground.velocityX = 0;
      trex.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      
      //change the trex animation
      trex.changeAnimation("collided",trex_collided);
      
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      
      if(mousePressedOver(restart)) {
        reset();
      }
    }
    
    
    
    
    
    drawSprites();
    textSize(40);
    stroke(5);

    text("Score: "+ score, displayWidth-230,100);
    if(score >= 700){
      text("You reached your Mom",displayWidth/2,displayHeight/2);
      
       }
  }
  
  function spawnClouds() {
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
      var cloud = createSprite(600,120,40,10);
      cloud.y = Math.round(random(80,120));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      
       //assign lifetime to the variable
      cloud.lifetime = 200;
      
      //adjust the depth
      cloud.depth = trex.depth;
      trex.depth = trex.depth + 1;
      
      //add each cloud to the group
      cloudsGroup.add(cloud);
    }
    
  }
  
  function spawnObstacles() {
    if(frameCount % 60 === 0) {
      var obstacle = createSprite(600,displayHeight-100,10,40);
      obstacle.velocityX = -(6 + 3*score/100);
      
      //generate random obstacles
      var rand = Math.round(random(1,6));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        case 3: obstacle.addImage(obstacle3);
                break;
        case 4: obstacle.addImage(obstacle4);
                break;
        case 5: obstacle.addImage(obstacle5);
                break;
        case 6: obstacle.addImage(obstacle6);
                break;
        default: break;
      }
      
      //assign scale and lifetime to the obstacle           
      //obstacle.scale = 0.5;
      obstacle.lifetime = 300;
      //add each obstacle to the group
      obstaclesGroup.add(obstacle);
    }
  }
  

  function spawnSkull(){
    if (frameCount % 250 === 0) {
    var skull = createSprite(200,280,50,50);
    var randX = Math.round(random(350,500));
    skull.x = randX;
    skull.addImage(skullImg);
    skull.velocityX = -4;
    skullGroup.add(skull);

    var sGround = createSprite(200,350,80,80);
    sGround.x = randX;
    sGround.addImage(sGroundImg);
    sGround.velocityX = -4;
    }
  }

  function spawnIce(){
    if (frameCount % 200 === 0) {
      var ice = createSprite(200,280,50,50);
      var randX = Math.round(random(350,500));
      ice.x = randX;
     ice.addImage(iceImg);
      ice.velocityY = 4;
      ice.scale = 0.5;
     

      if(ice.isTouching(trex)){
        gameState = END;
      }
  }
}

function spawnFire(){

  //if(keyWentDown("up")){
    fire = createSprite(50,trex.y,20,50);
    //fire.y = trex.y;
    fire.addImage("fire",fireImg);
    fire.scale = 0.5;
      //fire.visible = false;
      fire.lifetime = 150;
      fire.velocityX = 10;
      

      fireGroup.add(fire);
  //}

}
  function reset(){
    gameState = PLAY;
    ground.velocityX = -(6 + 3*score/100);
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    fireGroup.destroyEach();
    trex.changeAnimation("running",trex_running);
    
    score = 0;
    
  }
 


 
    
    
   
   
    
    