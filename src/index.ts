import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
    windowMaterial,
    wallMaterial,
    pavementMaterial,
    colors,
    groundMaterial,
    backgroundMaterial,
    floorMaterial,
    roofMaterial,
} from "./materials";

import { bulbLight, chair, table } from "./shapes/shapes";

import dayLight from "./daylight";

import {
    Evaluator,
    EdgesHelper,
    Operation,
    OperationGroup,
    ADDITION,
    SUBTRACTION,
} from "three-bvh-csg";

import nhaCap4 from "./houses/nhacap4";
import spanishHouse from "./houses/spanish";
import init from "./house";
import { IHouseRoof, IHouseFloor, IHouseSide } from "./houses/types";

import Stats from "stats.js";

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// init house
// const house = init(spanishHouse);
const house = init(nhaCap4);


const settings = {
    isNight: true,
};


// init scene
let scene = new THREE.Scene();
if (settings.isNight) {
  colors.background = 0x000000;
}
scene.background = new THREE.Color(colors.background);

// init camera
const isocamera = false;

let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
let cameraSettings = {
  position: new THREE.Vector3(),
  lookAt: new THREE.Vector3(),
  fov: 45,
  far: 250,
};

if (isocamera) {
  const aspect = window.innerWidth / window.innerHeight;
  const d = 20;
  camera = new THREE.OrthographicCamera(
    -d * aspect,
    d * aspect,
    d,
    -d,
    1,
    4000
  );

  camera.position.set(20, 20, 20);
  camera.rotation.order = "YXZ";
  camera.rotation.y = -Math.PI / 4;
  camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
} else {
  let cameraPositionFront = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(0, 7, 60),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  let cameraPositionAngled = {
    fov: 45,
    far: 250,
    position: new THREE.Vector3(15, 15, 20),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  let cameraPositionISO = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(50, 20, 50),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  cameraSettings = cameraPositionAngled;
  camera = new THREE.PerspectiveCamera(
    cameraSettings.fov,
    window.innerWidth / window.innerHeight,
    0.1,
    cameraSettings.far
  );
  camera.position.copy(cameraSettings.position);
}

// init renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor("#eee");
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.CineonToneMapping;

//deferred rendering,
renderer.toneMappingExposure = 1.75;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// progressive lightmap

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// time
let hour = 23;
const lights = dayLight();
lights.render(scene);
function updatetime() {
  lights.setTime({ hour: hour });
  hour = hour >= 23 ? (hour = 0) : hour + 1;

  renderer.render(scene, camera);
}
updatetime();

// init controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.target = cameraSettings.lookAt;

if (hour >= 22 || hour < 6) {
    // console.log("testbulb", testbulb);
    scene.add(bulbLight(-1, 9, -1));
    scene.add(bulbLight(-1, 2, -1));
  
    const chairmodel = chair(-2, 0, 3, 0);
    scene.add(chairmodel);
  
    const chairmodel2 = chairmodel.clone();
    chairmodel2.position.set(-2.1, 0, 3.8);
    chairmodel2.rotation.y = THREE.MathUtils.degToRad(20);
    scene.add(chairmodel2);
  
    const tablemodel = table(-1, 0, 3.5, -5);
    scene.add(tablemodel);
}

// CSG
let csgEvaluator: any, result: any;
csgEvaluator = new Evaluator();
csgEvaluator.attributes = ["position", "normal"];
csgEvaluator.useGroups = false;
csgEvaluator.debug.enabled = true;

//fucntion to render output
function renderOutput(outputGroup: any) {
    if (result && result.geometry) {
    }
  
    result = csgEvaluator.evaluateHierarchy(outputGroup);
    result.material = wallMaterial;
    result.castShadow = true;
    result.receiveShadow = true;
  
    result.matrixAutoUpdate = false;
    result.updateMatrix();
    scene.add(result);
}

// add a ground plane
const groundPlane = new THREE.Mesh(
    new THREE.CylinderGeometry(30, 30, 1, 32),
    groundMaterial
  );
groundPlane.position.y = -0.5;
groundPlane.castShadow = true;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

// add a house
const houseGroup = new Operation(new THREE.BoxGeometry(0.01, 0.01, 0.01)); //BoxBufferGeometry
houseGroup.operation = ADDITION;
houseGroup.receiveShadow = true;

// add floor
function addFloor(floor: IHouseFloor) {
    // if (floor.floor === true) {
    //   addRealFloor(floor);
    // }
  
    const floorGroup = new OperationGroup();
  
    const dummy = new Operation(new THREE.BoxGeometry(1, 1, 1));
  
    let s = 0;
    floor.sides.forEach((side) => {
      const wallWidth = side.width || 0.01;
  
      const floorSideGroup = new OperationGroup();
      floorSideGroup.position.x = side.start?.x;
      floorSideGroup.position.z = side.start?.z;
      floorSideGroup.position.y = side.start?.y;
  
      const shapesGroup = new THREE.Group();
      shapesGroup.position.set(
        floorSideGroup.position.x,
        floorSideGroup.position.y,
        floorSideGroup.position.z
      );
  
      const wallGeo = new THREE.BoxGeometry(
        wallWidth,
        floor.height,
        house.wallthickness
      );
      wallGeo.translate(wallWidth / 2, 0, -house.wallthickness / 2);
      const wall = new Operation(wallGeo); //BoxBufferGeometry
      wall.operation = ADDITION;
      wall.receiveShadow = true;
      wall.position.y = floor.height / 2;
      wall.position.x = 0;
      wall.position.z = 0;
      // floorSideGroup.rotation.y = Math.PI / 2;
      floorSideGroup.add(wall);
  
    //   addFloorHoles(shapesGroup, floorSideGroup, side);
      floorGroup.add(floorSideGroup);
      //floorSideGroup.rotation.y = Math.PI / -2;
  
      if (s < floor.sides.length - 1) {
        dummy.position.copy(side.end);
        dummy.lookAt(side.start);
        floorSideGroup.rotation.y = dummy.rotation.y + Math.PI / 2;
      } else {
        dummy.position.copy(side.start);
        dummy.lookAt(side.end);
        floorSideGroup.rotation.y = dummy.rotation.y - Math.PI / 2;
      }
  
      shapesGroup.rotation.y = floorSideGroup.rotation.y;
      scene.add(shapesGroup);
  
      s++;
    });

    return floorGroup;
}

// add roof
function addRoof(roof: IHouseRoof) {
    const roofGroup = new OperationGroup();

    // Assuming the roof is a flat shape for simplicity
    const roofGeometry = new THREE.BoxGeometry(roof.width, roof.height, roof.depth);
    roofGeometry.translate(0, roof.height / 2, 0); // Center the geometry on the y-axis

    const roofMaterial = new THREE.MeshStandardMaterial({ color: roof.material });
    const roofMesh = new Operation(roofGeometry, roofMaterial);
    roofMesh.operation = ADDITION;
    roofMesh.receiveShadow = true;

    // Set the position based on the roof object
    roofGroup.position.set(roof.position.x, roof.position.y, roof.position.z);

    roofGroup.add(roofMesh);
    scene.add(roofGroup);

    return roofGroup;
}

function createRoofSide(side: IHouseSide): THREE.Mesh {
  // Default values
  const width = side.width || 5;
  const depth = new THREE.Vector3().subVectors(side.start!, side.end!).length();
  const height = side.angle ? (depth / 2) * Math.tan(side.angle) : 2; // Example calculation

  // Create geometry and mesh
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);

  // Position and rotate mesh based on `side` properties
  // This is a simplified example. You'll need to adjust calculations based on your needs
  if (side.shift) {
      mesh.position.add(side.shift);
  }
  if (side.angle) {
      mesh.rotation.x = -side.angle; // Assuming angle is the slope angle from the horizontal
  }

  // Additional transformations based on `start`, `end`, and `combinedAngle` might be needed

  return mesh;
}

const baseSize = 10; // Length of the square base
const roofHeight = 5; // Height from the base to the peak

// Calculate the center of the base (which is at the origin for this example)
const baseCenter = new THREE.Vector3(0, 0, 0);

// Calculate the peak of the roof
const roofPeak = new THREE.Vector3(0, roofHeight, 0);

// Define the corners of the base
const baseCorners = [
  new THREE.Vector3(-baseSize / 2, 0, baseSize / 2), // Front left
  new THREE.Vector3(baseSize / 2, 0, baseSize / 2),  // Front right
  new THREE.Vector3(baseSize / 2, 0, -baseSize / 2), // Back right
  new THREE.Vector3(-baseSize / 2, 0, -baseSize / 2) // Back left
];

// Define the sides of the roof
const roofSides: IHouseSide[] = baseCorners.map((corner, index) => ({
  start: corner,
  end: baseCorners[(index + 1) % baseCorners.length], // Connects each corner to the next
  shift: roofPeak, // All sides shift up to the peak
  width: baseSize,
  angle: Math.atan2(roofHeight, baseSize / Math.sqrt(2)), // Angle from base to peak
}));

function createRoofSideMesh(side: IHouseSide): THREE.Mesh {
  const geometry = new THREE.BoxGeometry();
  geometry.vertices.push(side.start!, side.end!, side.shift!); // Add vertices
  geometry.faces.push(new THREE.Face3(0, 1, 2)); // Create a triangular face

  const material = new THREE.MeshBasicMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

// Example: Creating and adding the first roof side to the scene
const firstRoofSideMesh = createRoofSideMesh(roofSides[0]);
scene.add(firstRoofSideMesh);


for (const floor of house.floors) {
    houseGroup.add(addFloor(floor));
}



// const slope = new THREE.PlaneGeometry(5, 5);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
// const plane = new THREE.Mesh(slope, material);
// plane.rotation.x = -Math.PI / 4;
// plane.position.y = 1;
// scene.add(plane);

// renderOutput(houseGroup);

// show result
function animate() {
    stats.begin();
    requestAnimationFrame(animate);
  
    renderer.render(scene, camera);
    lights.setAutoUpdate(false);
    stats.end();
}
animate();
controls.update();



