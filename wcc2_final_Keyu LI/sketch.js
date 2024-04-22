//Keyu li, Keep you eyes on it!,2024
//Instruction: 
////Welcome to the interaction! Next you'll see a red oval in the center of the canvas.
////Please try to put your face in it to keep it green.
////Keep your eyes on it!\nDon't let your face turn off the center so that the ellipse turns red;
////Read the texts on the canvas as well as possible;\nWatch the middle animation as much as possible;
////Of course, you can also choose not to follow these rules and arbitrarily.
////let your face out of the center.
////Let's play!
//Suggestion:
////Even better if you can open it on a 16:9 portrait monitor!
////This interaction requires your camera access to be enabled.
//————————————————————————————————————————————————————————————————————————————————————————————————————————
//face.api:
let video;
let interactionStarted = false;
let faceIsAligned = false;
let lastDetectedFaceCenter = null;
let activationTimer; 
let activeElement = null; 


const rectX = 0;
const rectY = 0;
const rectW = 400;
const rectH = 350;

const videoX = (1440 / 2) - (400 / 2);
const videoY = (2560 / 2) - (300 / 2);

let indicatorCircleWid
let indicatorCircleHei

let faceCheckX
let faceCheckY
let outsideCircle = []


//3Dmodel:
let appleModel1, appleModel2, appleModel3, appleModel4;
let appleRadius = 300;
let startTime;
let appleTexture1, appleTexture2, appleFrame;
let appleFrameY = -2560; 
let magic, medicine, food;
let myFont1;
let angle = 0;
let alpha = 250;
let ellipseBuffer;
//porn:
let applePorn, rightHand, leftHand;
//gamble:
let slotMachine;
let slotNumbers = [0, 0, 0];
//taro:
let taro1, taro2, taro3, taroBuddha, buddhaRight, buddhaLeft;
//fraud:
let circleIcon, treasureBox;
//slogan:
let fallingTexts = [];
let text1, text2, text3, text4, text5, text6, text7, text8, text9;

let restrictedAreas = [
  { x: rectX, y: rectY, w: rectW, h: rectH }
];

const ROTATION_SPEED = 0.05;
const STROKE_WEIGHT = 1;
const IS_INNER = false;

class Popup {
  constructor(details, x, y, w, h, bgColor) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.bgColor = bgColor;  
    this.isActive = false;
    this.buffer = null; 
    this.drawFuncs = details.drawFuncs;
  }

  initBuffer() {
    this.buffer = createGraphics(this.width, this.height);
    if (this.bgColor && !(this.bgColor.length === 4 && this.bgColor[3] === 0)) {
      this.buffer.background(this.bgColor);
    } else {
      this.buffer.clear();
    }
  }

  update() {
    if (!this.isActive || !this.buffer) return;
  
    this.buffer.clear();
    if (this.bgColor) {
      this.buffer.background(this.bgColor);
    }

    this.buffer.push();
    this.drawFuncs.forEach(func => {
      func(this.buffer, { x: this.x, y: this.y, width: this.width, height: this.height }, ROTATION_SPEED, STROKE_WEIGHT, IS_INNER);
    });
    this.buffer.pop();

    push();
    translate(this.x + this.width / 2, this.y + this.height / 2);
    imageMode(CENTER);
    image(this.buffer, 0, 0);
    pop();
  }
  
  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}
let popups;
let sequenceCounter = 0;

///————————————————————————————————————————————————————————————————————————
class FallingText {
  constructor(img, initialX, initialY, finalX, finalY, size) {
    this.img = img;
    this.x = initialX;
    this.y = initialY;
    this.finalX = finalX;
    this.finalY = finalY;
    this.size = size;
    this.velocity = 0;
    this.falling = false;
  }

  startFalling() {
    this.velocity = 5; 
    this.falling = true;
  }
  
  update() {
    if (this.falling) {
      this.y += this.velocity;
      this.velocity += 0.5;
      if (this.y >= this.finalY) {
        this.y = this.finalY;
        this.velocity = 0;
        this.falling = false;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.size);
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  }
}

///————————————————————————————————————————————————————————————————————————
function setup() {
  createCanvas(1440, 2560, WEBGL);

  //face.api setting;
  video = createCapture(VIDEO);
  video.size(400, 300); // Set the size you want
  video.elt.style.zIndex = "1"; // Set z-index for video element
  video.hide()
  loadFaceApiModels();
  imageMode(CENTER)
  indicatorCircleWid = rectW * 0.5;
  indicatorCircleHei = rectH * 0.7;
  noStroke();
  startTime = millis();
  //pop-up1_illusions
  popups = [new Popup({
    drawFuncs: [drawAnimatedRedEllipse, drawSwirlingIllusion, drawCentralEllipse, drawShiningTiltedGreenEllipse, drawStaringText]
  }, -520, -800, 450, 450, [254, 115, 193])
];

// pop-up2_porn
popups.push(new Popup({
  drawFuncs: [
    (buffer) => animateImagePorn(buffer, applePorn, 410, 500, applePorn.width / 3, applePorn.height / 3, 0.01),
    (buffer) => animateWavingRightHand(buffer, rightHand, 650, 350, rightHand.width / 2, rightHand.height / 2),
    (buffer) => animateWavingLeftHand(buffer, leftHand, 200, 300, leftHand.width / 2.5, leftHand.height / 2.5)
    // Add other functions if needed
  ]
}, -200, 500, applePorn.width/2, applePorn.height/2)); // Adjust position and size as needed

//pop-up3_gamble
// Initialize the popup for the slot machine
popups.push(new Popup({
  drawFuncs: [
    (buffer) => drawSlotMachine(buffer, slotMachine, 300, 300, slotMachine.width/3, slotMachine.height/3)
  ]
}, 200, -400, slotMachine.width/2, slotMachine.height/2, [0,245,212])); // Adjust position and size as needed

//pop-up4_taro
popups.push(new Popup({
  drawFuncs: [
    (buffer) => animateTaroCard(buffer, taro1, 320, 110, taro1.width/1.8, taro1.height/1.8, 0.02, radians(8)),
    (buffer) => drawBuddha(buffer, buddhaRight, 450, 300, buddhaRight.width/2, buddhaRight.height/2),
    (buffer) => animateTaroCard(buffer, taro2, 330, 320, taro2.width/1.8, taro2.height/1.8, 0.01, radians(10)),
    (buffer) => drawBuddha(buffer, buddhaLeft, 200, 300, buddhaLeft.width/2, buddhaLeft.height/2),
    (buffer) => animateTaroCard(buffer, taro3, 300, 520, taro3.width/1.8, taro3.height/1.8, 0.015, radians(12))
  ]
}, 200, -1200, taroBuddha.width/1.2, taroBuddha.height/1.2));

//pop-up5_fraud
popups.push(new Popup({
  drawFuncs: [
    (buffer) => animateShakeBox(buffer, treasureBox, 220, 190, treasureBox.width/1.6, treasureBox.height/1.6, 100),
    (buffer) => rotateCircle(buffer, circleIcon, 100, 135, circleIcon.width/1.8, circleIcon.height/1.8)
  ]
},-800, 50, circleIcon.width/1.3, circleIcon.height/1.15));

//slogan:
 // Initialize falling texts with images and positions
 fallingTexts.push(new FallingText(text1, -100, -1400, -100, 400, 2.0)); // x, y start, x, y end
 fallingTexts.push(new FallingText(text2, 400, -1400, 400, 550, 1.5)); // Adjust as needed
 fallingTexts.push(new FallingText(text3, 200, -1400, 200, -600, 1)); // Adjust as needed
 fallingTexts.push(new FallingText(text4, 100, -1600, 100, -900, 1.5)); 
 fallingTexts.push(new FallingText(text5, -400, -1400, -400, 100, 1)); // Adjust as needed
 fallingTexts.push(new FallingText(text6, 500, -1400, 500, 40, 1)); 
 fallingTexts.push(new FallingText(text7, -300, -1400, -300, 800, 1)); // Adjust as needed
 fallingTexts.push(new FallingText(text8, 50, -1400, 50, 700, 1)); 
 fallingTexts.push(new FallingText(text9, -450, -1600, -450, -600, 1)); // Adjust as needed

popups.forEach(popup => popup.initBuffer());
}

//————————————————————————————————————————————————————————————————————————
function preload() {
  appleModel1 = loadModel("model3d/appleModel.obj", true);
  appleModel2 = loadModel("model3d/applelogo3.obj", true);
  appleModel3 = loadModel("model3d/appleModel.obj", true);
  appleModel4 = loadModel("model3d/appleModel.obj", true);
  appleTexture1 = loadImage("model3d/applelogo3.png");
  appleTexture2 = loadImage("model3d/real.jpg");
  appleFrame = loadImage("model3d/frame.png");

  //porn:
  applePorn = loadImage("disturb/porn/pornapple.png");
  rightHand = loadImage("disturb/porn/rightHand.png");
  leftHand = loadImage("disturb/porn/leftHand.png");
  //taro:
  taro1 = loadImage("disturb/taro/taro1.png");
  taro2 = loadImage("disturb/taro/taro2.png");
  taro3 = loadImage("disturb/taro/taro3.png");
  taroBuddha = loadImage("disturb/taro/taroBuddha.png");
  buddhaLeft = loadImage("disturb/taro/buddhaleft.png");
  buddhaRight = loadImage("disturb/taro/buddharight.png");
  //gamble:
  slotMachine = loadImage("disturb/gamble/slotmachine.png");
  //fraud:
  circleIcon = loadImage("disturb/fraud/circleIcon.png");
  treasureBox = loadImage("disturb/fraud/treasureBox.png");
  //slogan:
  text1 = loadImage("disturb/text/1.png");
  text2 = loadImage("disturb/text/2.png");
  text3 = loadImage("disturb/text/3.png");
  text4 = loadImage("disturb/text/4.png");
  text5 = loadImage("disturb/text/5.png");
  text6 = loadImage("disturb/text/6.png");
  text7 = loadImage("disturb/text/7.png");
  text8 = loadImage("disturb/text/8.png");
  text9 = loadImage("disturb/text/9.png");


  medicine = loadModel("model3d/pillBottle.obj");
  magic = loadModel("model3d/magicApple.obj");;
  food = loadModel("model3d/appleCake.obj");;
  myFont1 = loadFont("fonts/centuryGothic_bold.ttf");
}


//————————————————————————————————————————————————————————————————————————
function draw() {

  background(155,93,229,200);
  directionalLight(255, 255, 255, 1, 1, -1);
  ambientLight(180);

  //face.api:
  image(video, 0, 0)
  drawIndicatorCircle();  
  if (lastDetectedFaceCenter) {
    drawFaceCenterDebug(lastDetectedFaceCenter.x, lastDetectedFaceCenter.y);
  }
  createPersistentCircle()
  drawVideoDebug();

  push();
  translate(-width / 2, -height / 3-100, 0);
  fill(255);
  textFont(myFont1);
  textSize(30);
  textAlign(LEFT, TOP);

  let textLines = [
    "Viral Advertisements, the latest marvel in consumer culture.",
    "They have transcended mere marketing tools;",
    "they have become commodities themselves.",
    "They can blur the line between reality and illusion;",
    "they can make fantasies tangible and spark desires that go beyond mere want.",
    "They are more than distractions—",
    "they are modern-day superfoods for consumerism,",
    "offering not nutrition but nourishment for curiosity and engagement.",
    "",
    "",
    "", 
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "They do not merely fill a gap;",
    "they create an addictive loop of consumption where the act of engaging—",
    "clicking,",
    "watching,",
    "playing—becomes the product itself.",
    "They're designed not to satiate but to perpetuate a cycle of desire and satisfaction,",
    "masking their persuasive force behind the guise of entertainment.",
    "Like a placebo for modern anxieties,",
    "these ads offer a semblance of control and a promise of freedom,",
    "suggesting that consumer choices can somehow lead to personal liberation,",
    "in a society where attention is the ultimate currency.",
    "They're infinite and pervasive,",
    "turning every interaction into an opportunity for consumption.",
  ];

  let yPos = 0;
  for (let i = 0; i < textLines.length; i++) {
    text(textLines[i], 10, yPos);
    yPos += 70;
  }
  pop();

  // Display text
  push();
  translate(-width / 2 + 3, -height / 3 + 3-100, 0);
  fill(255, 150);
  textFont(myFont1);
  textSize(30); 
  textAlign(LEFT, TOP);

  let textLines_shadow = [
    "Viral Advertisements, the latest marvel in consumer culture.",
    "They have transcended mere marketing tools;",
    "they have become commodities themselves.",
    "They can blur the line between reality and illusion;",
    "they can make fantasies tangible and spark desires that go beyond mere want.",
    "They are more than distractions—",
    "they are modern-day superfoods for consumerism,",
    "offering not nutrition but nourishment for curiosity and engagement.",
    "",
    "",
    "", 
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "They do not merely fill a gap;",
    "they create an addictive loop of consumption where the act of engaging—",
    "clicking,",
    "watching,",
    "playing—becomes the product itself.",
    "They're designed not to satiate but to perpetuate a cycle of desire and satisfaction,",
    "masking their persuasive force behind the guise of entertainment.",
    "Like a placebo for modern anxieties,",
    "these ads offer a semblance of control and a promise of freedom,",
    "suggesting that consumer choices can somehow lead to personal liberation,",
    "in a society where attention is the ultimate currency.",
    "They're infinite and pervasive,",
    "turning every interaction into an opportunity for consumption.",
  ];

  let yPos_shadow = 0;
  for (let i = 0; i < textLines_shadow.length; i++) {
    text(textLines_shadow[i], 10, yPos_shadow);
    yPos_shadow += 70; 
  }
  pop();

  //layout:
  drawRectangle1();
  push();
  pop();

  let currentMillis = millis() - startTime;

  // First apple's movement and rotation logic with lerp for smooth transition
  push();
  if (currentMillis < 5000) {
    animateApple(appleModel1, 0, 0.5);
  } else if (currentMillis >= 5000 && currentMillis < 15000) {
    let yPos = lerp(0, 150, (currentMillis - 5000) / 10000);
    translate(0, yPos, 0);
    animateApple(appleModel1, 0, 0.5);
  } else {
    // Start rotating after 15s
    translate(0, 150, 0);
    animateApple(appleModel1, 0.9, 0.5);
  }
  pop();

  // Second apple's appearance, movement, and texture logic with smooth transition
  push();
  if (currentMillis > 15000 && currentMillis < 30000) {
    // Smoothly move the second apple to its position
    let xPos = lerp(0, -180, (currentMillis - 15000) / 15000);
    let yPos = lerp(150, -150, (currentMillis - 15000) / 15000);
    translate(xPos, yPos, 0);
    animateApple(appleModel2, 0, 0.5);
  } else if (currentMillis >= 30000) {
    translate(-180, -150, 0);
    animateApple(appleModel2, 0.9, 0.5, appleTexture1);
  }
  pop();

  // AppleFrame appearance
  if (currentMillis > 30000 && currentMillis < 40000) {
    appleFrameY = lerp(-2560, -150, (currentMillis - 30000) / 10000);
  } else if (currentMillis >= 40000) {
    appleFrameY = -150;
  }

  imageMode(CENTER);
  image(
    appleFrame,
    0,
    appleFrameY,
    appleFrame.width / 3,
    appleFrame.height / 3
  );

  // Fourth apple's movement, scaling, and color change logic
  if (currentMillis > 40000 && currentMillis < 55000) {
    push();
    translate(0, lerp(150, -150, (currentMillis - 40000) / 15000), 0);
    animateApple(appleModel4, 0, 0.8, null, false, true);
    pop();
  } else if (currentMillis >= 55000) {
    push();
    translate(0, -150, 0);
    animateApple(appleModel4, 0.9, 0.4, null, true, true);
    pop();
  }

  // Third apple's appearance, movement, and texture logic with smooth transition
  push();
  if (currentMillis > 55000 && currentMillis < 70000) {
    let xPos = lerp(0, 180, (currentMillis - 55000) / 15000);
    let yPos = lerp(150, -150, (currentMillis - 55000) / 15000);
    translate(xPos, yPos, 0);
    animateApple(appleModel3, 0, 0.5);
  } else if (currentMillis >= 70000) {
    translate(180, -150, 0);
    animateApple(appleModel3, 0.9, 0.5, appleTexture2);
  }
  pop();
  
  popups.forEach(popup => popup.update());
  
  //slogan:
  for (let text of fallingTexts) {
    text.update();
    text.display();
  }
  
}

//————————————————————————————————————————————————————————————————————————
function createPersistentCircle() {
  let isFaceAligned = isFaceWithinBounds();
  if (lastBoundResult != isFaceAligned) {
      lastBoundResult = isFaceAligned;
      if (!isFaceAligned) {
    
          let totalElements = popups.length + 2 * fallingTexts.length;
          if (sequenceCounter >= totalElements) {
              sequenceCounter = 0; 
          }
          if (sequenceCounter % 3 === 0) {
              let popupIndex = Math.floor(sequenceCounter / 3);
              if (popupIndex < popups.length) {
                  if (popups[popupIndex].isActive) {
                      popups[popupIndex].deactivate();
                  } else {
                      popups[popupIndex].activate();
                  }
              }
          } else { 
              let textIndex = Math.floor((sequenceCounter - 1) / 3) * 2 + (sequenceCounter % 3) - 1;
              if (textIndex < fallingTexts.length) {
                  if (!fallingTexts[textIndex].falling) {
                      fallingTexts[textIndex].startFalling();
                  }
              }
          }
          sequenceCounter++; 
      }
  }
}


//————————————————————————————————————————————————————————————————————————
function drawVideoDebug() {
  fill('red');
  ellipse(-175, -170, 20, 20);
}

//————————————————————————————————————————————————————————————————————————
// Load face-api models
async function loadFaceApiModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('lib/tfjs/weights');
  await faceapi.nets.faceLandmark68Net.loadFromUri('lib/tfjs/weights');
  await faceapi.nets.faceRecognitionNet.loadFromUri('lib/tfjs/weights');
  detectFace(); 
}

//————————————————————————————————————————————————————————————————————————
async function detectFace() {
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 });
  try {
    const result = await faceapi.detectSingleFace(video.elt, options).withFaceLandmarks();
    if (result) {
      const { x, y, width, height } = result.detection.box;
      const faceCenterX = x + width / 2;
      const faceCenterY = y + height / 2;
      lastDetectedFaceCenter = { x: faceCenterX, y: faceCenterY };

      faceIsAligned = isFaceWithinBounds(faceCenterX, faceCenterY);
      interactionStarted = faceIsAligned;
    }
  } catch (error) {
  }
  setTimeout(detectFace, 1);
}

//————————————————————————————————————————————————————————————————————————
function drawFaceCenterDebug(faceCenterX, faceCenterY) {
  const adjustedX = faceCenterX - (video.width / 2) + videoX;
  const adjustedY = faceCenterY - (video.height / 2) + videoY;

  push();
  fill(255,0);
  noStroke();
  ellipse(adjustedX - width / 2.3, adjustedY - height / 1.98, 20, 20);
  stroke(0)
  faceCheckX = adjustedX - width / 2.3
  faceCheckY = adjustedY - height / 1.98
  pop();
}

//————————————————————————————————————————————————————————————————————————
function drawIndicatorCircle() {

  push();
  const circleColor = faceIsAligned ? color(0, 255, 0, 100) : color(255, 0, 0, 100);
  fill(circleColor);
  noStroke();
  translate(-width / 2 + videoX + rectW / 2, -height / 2 + videoY + rectH / 2.3);
  ellipseMode(CENTER);
  ellipse(0, 0, indicatorCircleWid, indicatorCircleHei);
  pop();
}

//————————————————————————————————————————————————————————————————————————
let lastBoundResult = false
function isFaceWithinBounds() {

  let isWithinBounds = false
  let cx = -width / 2 + videoX + rectW / 2
  let cy = -height / 2 + videoY + rectH / 2.3

  let p1 = new p5.Vector(cx, cy)
  let p2 = new p5.Vector(faceCheckX, faceCheckY)
  let dir = p5.Vector.sub(p2, p1)
  let d1 = dist(cx, cy, faceCheckX, faceCheckY)
  let angle = dir.heading()
  let x = cos(angle) * indicatorCircleWid / 2
  let y = sin(angle) * indicatorCircleHei / 2
  let d2 = dist(x, y, 0, 0)
  if (d1 < d2) {
    isWithinBounds = true
  }
  return isWithinBounds;
}


//————————————————————————————————————————————————————————————————————————
setInterval(detectFace, 100);

//————————————————————————————————————————————————————————————————————————
function animateApple(
  appleModel,
  speed,
  scaleSize,
  textureImg = null,
  changeColor = false,
  changeScale = false
) {
  rotateX(PI);
  let currentScale = scaleSize;

  if (changeScale) {
    currentScale *= 0.5;
  }

  if (changeColor) {
    ambientMaterial(255, 215, 0);
  } else if (textureImg) {
    texture(textureImg);
  } else {
    ambientMaterial(255);
  }

  scale(currentScale);
  rotateY(frameCount * speed);
  model(appleModel);
}

//————————————————————————————————————————————————————————————————————————
function drawRectangle1() {
  push();
  stroke(255);
  strokeWeight(5);
  noFill();
  translate(0, 0, appleRadius);
  rectMode(CENTER);
  rect(0, 0, 350, 350);
  pop();
}

//————————————————————————————————————————————————————————————————————————
function drawRectangle2() {
  push();
  stroke(255, 150);
  strokeWeight(7);
  noFill();
  translate(0, 0, appleRadius);
  rectMode(CENTER);
  rect(3, 3, 350, 350);
  pop();
}

//————————————————————————————————————————————————————————————————————————
function drawAnimatedRedEllipse(buffer, popDetails) {
  if (!(buffer instanceof p5.Graphics)) {
    console.error('Invalid buffer in drawAnimatedRedEllipse:', buffer);
    return;
  }
  buffer.push();
  buffer.translate(popDetails.width / 2, popDetails.height / 2);
  buffer.noStroke();
  buffer.fill(237, 44, 161);
  buffer.ellipse(0, 0, 250, 250); 
  buffer.pop();
}


//————————————————————————————————————————————————————————————————————————
function drawShiningTiltedGreenEllipse(buffer, popDetails) {
  if (!(buffer instanceof p5.Graphics)) {
    console.error('Invalid buffer in drawShiningTiltedGreenEllipse:', buffer);
    return;
  }

  let alpha = 150 + sin(frameCount * 0.1) * 100;  // Adjusted for better visibility
  buffer.push();
  buffer.translate(popDetails.width / 1.8, popDetails.height / 4);  // Center the drawing
  buffer.noStroke();
  //buffer.strokeWeight(6);
  buffer.fill(0,245,212);
  buffer.rotate(radians(-35));  // Example rotation
  buffer.ellipse(0, -20, 100, 50);  // Adjust size and position as needed
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function drawCentralEllipse(buffer, popDetails) {
  console.log("Drawing on buffer:", buffer);
  //let alpha = 255; // Set alpha to 255 for debugging
  let alpha = 150 + sin(frameCount * 0.1) * 50;
  if (!(buffer instanceof p5.Graphics)) {
    console.error('Invalid buffer in drawCentralEllipse:', buffer);
    return;
  }

  buffer.push();
  buffer.fill(78, 67, 86); 
  buffer.noStroke();
  buffer.ellipse(popDetails.width / 2, popDetails.height / 2, 20, 0); 
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function drawSwirlingIllusion(buffer, rotationSpeed, isInner) {
  if (!(buffer instanceof p5.Graphics)) {
    console.error('Invalid buffer for drawing. Expected p5.Graphics instance.', buffer);
    return;
  }
  
  buffer.push();
  buffer.translate(buffer.width / 2, buffer.height / 2);

  let startSize = min(buffer.width / 1.8, buffer.height / 1.8);
  let size = startSize;
  let angle = 0;
  let alpha = 150 + sin(frameCount * 0.1) * 50;
  while (size > (isInner ? 1 : startSize * 0.05)) {
    drawAnimatedRedEllipse,
    buffer.noFill();
    buffer.stroke(243, 114, 192, alpha);
    buffer.strokeWeight(5);
    angle += radians(size * rotationSpeed);
    buffer.rotate(angle);
    
    buffer.ellipse(0, 0, size, size); 
    size /= 1.08; 
    buffer.rotate(-angle);
  }
  
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function animateImagePorn(buffer, img, x, y, w, h, angleSpeed) {
  buffer.push();
  const angle = sin(millis() * angleSpeed) * radians(5);
  buffer.translate(x + sin(millis() * 0.005) * 10, y); 
  buffer.rotate(angle);
  buffer.imageMode(CENTER);
  buffer.image(img, 0, 0, w, h);
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function drawStaringText(buffer) {
  buffer.push(); 
  buffer.fill(255); 
  buffer.noStroke(); 
  buffer.textAlign(CENTER, CENTER);
  buffer.textSize(20);
  buffer.text("How long can you stare at it?", buffer.width / 2, buffer.height - 50); 
  buffer.pop(); 
}

//————————————————————————————————————————————————————————————————————————
function animateWavingRightHand(buffer, img, x, y, w, h) {
  buffer.push();
  const wavingSpeed = 0.02; 
  const wavingAmount = radians(10); 
  const angle = sin(millis() * wavingSpeed) * wavingAmount;

  buffer.translate(x, y);
  buffer.rotate(angle); 
  buffer.imageMode(CENTER);
  buffer.image(img, 0, 0, w, h);
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function animateWavingLeftHand(buffer, img, x, y, w, h) {
  buffer.push();
  const wavingSpeed = 0.02; 
  const wavingAmount = radians(10); 
  const angle = sin(millis() * wavingSpeed + PI) * wavingAmount;

  buffer.translate(x, y);
  buffer.rotate(angle); // Rotate by the waving angle
  buffer.imageMode(CENTER);
  buffer.image(img, 0, 0, w, h);
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function drawSlotMachine(buffer, img, x, y, w, h) {
  buffer.push();
  buffer.imageMode(CENTER);
  buffer.image(img, x, y, w, h);
  buffer.fill(255); 
  buffer.strokeWeight(5);
  buffer.stroke(0,245,212);
  buffer.textSize(64); 
  buffer.textFont(myFont1);
  buffer.textAlign(CENTER, CENTER);

  const numXStart = w * 0.55; 
  const numY = h * 0.65;
  const numXOffset = 70;
  
  slotNumbers.forEach((num, index) => {
    buffer.text(num, numXStart + index * numXOffset, numY);
  });

  buffer.pop();
}
setInterval(() => {
  slotNumbers = slotNumbers.map(() => Math.floor(Math.random() * 10)); 
}, 200); 

//————————————————————————————————————————————————————————————————————————
function drawBuddha(buffer, img, x, y, w, h){
  buffer.push();
  buffer.imageMode(CENTER);
  buffer.image(img, x, y, w, h);
  buffer.pop();
}


//————————————————————————————————————————————————————————————————————————
function animateTaroCard(buffer, img, x, y, w, h, shakeSpeed, shakeAngle) {
  buffer.push();
  //const shakeSpeed = 0.02; // Speed at which the hand waves
  //const shakeAngle = radians(10); // Maximum angle for the wave

  // Calculate the current angle based on time
  const angle = sin(millis() * shakeSpeed) * shakeAngle;

  buffer.translate(x, y);
  buffer.rotate(angle); // Rotate by the waving angle
  buffer.imageMode(CENTER);
  buffer.image(img, 0, 0, w, h);
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function animateShakeBox(buffer, img, x, y, w, h, startTime){
  const currentTime = millis();
  const elapsedTime = currentTime - startTime;

  // Start with a small shake and increase the intensity over time
  let shakeIntensity = min(0.5 + elapsedTime / 5000, 5);

  // Generate random offsets for the shake
  let offsetX = random(-shakeIntensity, shakeIntensity);
  let offsetY = random(-shakeIntensity, shakeIntensity);

  buffer.push();
  buffer.translate(x + offsetX, y + offsetY); // Apply the random offsets here
  buffer.imageMode(CENTER);
  buffer.image(img, x, y, w, h);
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function rotateCircle(buffer, img, x, y, w, h) {
  angle += 0.01; // Increment the angle for rotation
  buffer.push(); // Save the current drawing state
  buffer.translate(x + w / 2, y + h / 2); // Translate to the center point where the image will rotate
  buffer.rotate(angle); // Apply the rotation
  buffer.imageMode(CENTER); // Draw the image from its center
  buffer.image(img, 0, 0, w, h); // Draw the image
  buffer.pop();
}

//————————————————————————————————————————————————————————————————————————
function drawFallingTexts() {
  Object.keys(fallingTexts).forEach(key => {
    const text = fallingTexts[key];
    if (text.falling) {
      text.y += text.velocity;
      text.velocity += 0.5; // Gravity effect
      if (text.y > height / 2 - text.img.height / 2) {
        text.y = height / 2 - text.img.height / 2;
        text.velocity = 0;
        text.falling = false; // Stop falling
      }
      image(text.img, text.x, text.y - height / 2);
    }
  });
}


//————————————————————————————————————————————————————————————————————————
function isInsideRestrictedArea(x, y) {
  return restrictedAreas.some(area => {
    return x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h;
  });
}


