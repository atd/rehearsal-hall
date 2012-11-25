//= require three.min
//= require three.FirstPersonControls 

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    ASPECT = WIDTH / HEIGHT,
    HALLWIDTH = 200,
    HALLLONG  = 800,
    HALLHEIGHT = 100
    MOVESPEED = 100,
    LOOKSPEED = 0.050

var t = THREE, scene, cam, renderer, controls, clock
var runAnim = true, mouse = { x: 0, y: 0 }

$(function() {
//  $('body').append('<div id="intro">Click to start</div>');
//    $('#intro').css({width: WIDTH, height: HEIGHT}).one('click', function(e) {
//      e.preventDefault();
//      $(this).fadeOut();
      init();
      animate();
//    });
//  }
});

function init() {
	clock = new t.Clock(); // Used in render() for controls.update()
	scene = new t.Scene(); // Holds all objects in the canvas
	//scene.fog = new t.FogExp2(0xD6F1FF, 0.0005); // color, density
	
	// Set up camera
	cam = new t.PerspectiveCamera(50, ASPECT, 1, 10000); // FOV, aspect, near, far
	cam.position.x = 10;
	cam.position.y = HALLHEIGHT * 0.5;
  cam.rotation.y = 2;
	scene.add(cam);
	
	// Camera moves with mouse, flies around with WASD/arrow keys
	controls = new t.FirstPersonControls(cam);
	controls.movementSpeed = MOVESPEED;
	controls.lookSpeed = LOOKSPEED;
	//controls.lookVertical = false; // Temporary solution; play on flat surfaces only
	controls.noFly = true;

	// World objects
	setupScene();
	
	// Handle drawing as WebGL (faster than Canvas but less supported)
	renderer = new t.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	
	// Add the canvas to the document
	renderer.domElement.style.backgroundColor = '#D6F1FF'; // easier to see
	document.body.appendChild(renderer.domElement);
	
	// Track mouse position so we know where to shoot
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	// Display HUD
	//$('body').append('<canvas id="radar" width="200" height="200"></canvas>');
	//$('body').append('<div id="hud"><p>Health: <span id="health">100</span><br />Score: <span id="score">0</span></p></div>');
	//$('body').append('<div id="credits"><p>Created by <a href="http://www.isaacsukin.com/">Isaac Sukin</a> using <a href="http://mrdoob.github.com/three.js/">Three.js</a><br />WASD to move, mouse to look, click to shoot</p></div>');
	
	// Set up "hurt" flash
	//$('body').append('<div id="hurt"></div>');
	//$('#hurt').css({width: WIDTH, height: HEIGHT,});
}

// Helper function for browser frames
function animate() {
	if (runAnim) {
		requestAnimationFrame(animate);
	}

	render();
}

// Update and display
function render() {
	var delta = clock.getDelta();

	controls.update(delta); // Move camera
	
	renderer.render(scene, cam); // Repaint
}

// Set up the objects in the world
function setupScene() {
  var FLOORMATERIAL = '/assets/floor.png';
  var WALLMATERIAL = '/assets/wall.png';

	// Geometry: floor
  var floorGeometry = new t.CubeGeometry(HALLLONG, 0, HALLWIDTH);
  var floorTexture  = t.ImageUtils.loadTexture(FLOORMATERIAL);
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrap;
  floorTexture.repeat.set(16, 4);
  var floorMaterial = new t.MeshLambertMaterial({ map: floorTexture });


	var floor = new t.Mesh(floorGeometry, floorMaterial);
  floor.position.x = HALLLONG / 2;
	scene.add(floor);

	// Geometry: ceil
	var ceil = new t.Mesh(
		floorGeometry, 
		new t.MeshLambertMaterial({color: 0x000000,/*map: t.ImageUtils.loadTexture('images/floor-1.jpg')*/})
	);

  ceil.position.x = HALLLONG / 2;
  ceil.position.y = HALLHEIGHT;
	scene.add(ceil);

  var hWallGeometry = new t.CubeGeometry(HALLLONG, HALLHEIGHT, 0);
  var hWallTexture  = t.ImageUtils.loadTexture(WALLMATERIAL);
  hWallTexture.wrapS = hWallTexture.wrapT = THREE.RepeatWrap;
  hWallTexture.repeat.set(128, 16);
  var hWallMaterial = new t.MeshLambertMaterial({ map: hWallTexture });

  var rWall = new t.Mesh(hWallGeometry, hWallMaterial);

  rWall.position.x = HALLLONG / 2;
  rWall.position.y = HALLHEIGHT / 2;
  rWall.position.z = HALLWIDTH / 2;
	scene.add(rWall);

  var lWall = new t.Mesh(hWallGeometry, hWallMaterial);
  lWall.position.x = HALLLONG / 2;
  lWall.position.y = HALLHEIGHT / 2;
  lWall.position.z = - HALLWIDTH / 2;
	scene.add(lWall);

  var wWallGeometry = new t.CubeGeometry(0, HALLHEIGHT, HALLWIDTH);

  var wWallTexture  = t.ImageUtils.loadTexture(WALLMATERIAL);
  wWallTexture.wrapS = wWallTexture.wrapT = THREE.RepeatWrap;
  wWallTexture.repeat.set(64, 16);
  var wWallMaterial = new t.MeshLambertMaterial({ map: wWallTexture });

  var fWall = new t.Mesh(wWallGeometry, wWallMaterial);
  fWall.position.x = HALLLONG;
  fWall.position.y = HALLHEIGHT / 2;
  fWall.position.z = 0;
	scene.add(fWall);

  var bWall = new t.Mesh(wWallGeometry, wWallMaterial);
  bWall.position.x = 0;
  bWall.position.y = HALLHEIGHT / 2;
  bWall.position.z = 0;
	scene.add(bWall);

  // Geometry: logo
  var logoGeometry = new t.CubeGeometry(0, 20, 98);
  var logoMaterial = new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('/assets/logo.png')});
  var fLogo = new t.Mesh(logoGeometry, logoMaterial);

  fLogo.position.x = HALLLONG - 1;
  fLogo.position.y = HALLHEIGHT * 2 / 3;
  scene.add(fLogo);

  // Geometry: logo
  var doorGeometry = new t.CubeGeometry(50, 100, 0);
  var doorMaterial = new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('/assets/door.png')});

  var lDoor = new t.Mesh(doorGeometry, doorMaterial);
  lDoor.position.x = 200;
  lDoor.position.y = HALLHEIGHT / 3;
  lDoor.position.z = - HALLWIDTH / 2 + 1;
  scene.add(lDoor);

  var rDoor = new t.Mesh(doorGeometry, doorMaterial);
  rDoor.position.x = 400;
  rDoor.position.y = HALLHEIGHT / 3;
  rDoor.position.z = HALLWIDTH / 2 - 1;
  scene.add(rDoor);

  // Some posters
  var posterHeight = HALLHEIGHT * 2 / 3;
  var posters = {
    'jimi_hendrix.jpg' : [ 50,   1 ],
    'bob-dylan.jpg'    : [ 500,  1 ],
    'Queen.jpg'        : [ 300, -1 ],
    'rolling.jpg'      : [ 500, -1 ],
    'the-beatles.jpeg' : [ 600, -1 ]
  }

  $.each(posters, function(image, position) {
    var texture  = new t.ImageUtils.loadTexture('/assets/posters/' + image);
    var geometry = new t.CubeGeometry(texture.image.width / 10, texture.image.height / 10, 0);
    var material = new t.MeshLambertMaterial({ map: texture });
    var poster   = new t.Mesh(geometry, material);
    poster.position.x = position[0];
    poster.position.y = posterHeight;
    poster.position.z = HALLWIDTH / 2 * position[1] - position[1];
    scene.add(poster);
  });
  

  /*
  var addDefaultFloor = function(){
    // FLOOR
    var floorTexture = new THREE.ImageUtils.loadTexture( '/assets/suelo.png' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 150, 150 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
    var floorGeometry = new THREE.PlaneGeometry(10000, 10000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.doubleSided = true;
    scene.add(floor);
    };
  */
	
  /*
	// Geometry: walls
	var cube = new t.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
	var materials = [
	                 new t.MeshLambertMaterial({/*color: 0x00CCAA,/map: t.ImageUtils.loadTexture('images/wall-1.jpg')}),
	                 new t.MeshLambertMaterial({/*color: 0xC5EDA0,/map: t.ImageUtils.loadTexture('images/wall-2.jpg')}),
	                 new t.MeshLambertMaterial({color: 0xFBEBCD}),
	                 ];
	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			if (map[i][j]) {
				var wall = new t.Mesh(cube, materials[map[i][j]-1]);
				wall.position.x = (i - units/2) * UNITSIZE;
				wall.position.y = WALLHEIGHT/2;
				wall.position.z = (j - units/2) * UNITSIZE;
				scene.add(wall);
			}
		}
	}
	
  */

	// Lighting
	var directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.7 );
  directionalLight1.position.set( 0.5, 1, 0.5 );
	scene.add( directionalLight1 );

	var directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 0.5 );
	directionalLight2.position.set( -0.5, -1, -0.5 );
	scene.add( directionalLight2 );
}

function checkWallCollision(v) {
//	var c = getMapSector(v);
//	return map[c.x][c.z] > 0;
}

function onDocumentMouseMove(e) {
	e.preventDefault();
	mouse.x = (e.clientX / WIDTH) * 2 - 1;
	mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
}

// Handle window resizing
$(window).resize(function() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	ASPECT = WIDTH / HEIGHT;
	if (cam) {
		cam.aspect = ASPECT;
		cam.updateProjectionMatrix();
	}
	if (renderer) {
		renderer.setSize(WIDTH, HEIGHT);
	}
//	$('#intro, #hurt').css({width: WIDTH, height: HEIGHT,});
});

// Stop moving around when the window is unfocused (keeps my sanity!)
$(window).focus(function() {
	if (controls) controls.freeze = false;
});

$(window).blur(function() {
	if (controls) controls.freeze = true;
});
