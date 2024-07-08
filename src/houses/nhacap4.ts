import * as THREE from "three";

import {
    roofMaterial,
    floorMaterial,
    wallMaterial,
    aluMaterial,
    aweningMaterial,
    aweningMaterial2,
    woodMaterial,
    plantMaterial,
    bulbMaterial,
    bulbMaterialOn,
} from "../materials";

import {
    IHouse,
    // IBalconySettings,
    // IBalconyDoorSettings,
    // IAwningSettings,
    // IPlantSettings,
    // IHoleSettings,
    // IHangingLightsSettings,
    IHouseSide,
    IHouseFloor,
} from "./types";

// nhà cấp 4 :V 
const nhaCap4: IHouse = {
    floors: [],
    wallthickness: 0.2,
};

// thêm cửa chớp
const insertWindowShutters = (shutters?: number) => {
    return {
        type: "shuttersWithFrame",
        shutters: shutters || 2,
        open: [45, 10],
        z: -nhaCap4.wallthickness / 2,
        materials: {
            default: woodMaterial,
        },
    };
};

// cửa sổ thông thường
function normalWindow(props: { offsetLeft: number; width?: number }) {
    return {
        bottom: 0.2,
        width: props.width || 1,
        height: 2,
        ...props,
        shapes: [insertWindowShutters(2)],
    };
}

// cửa sổ nhỏ
function smallWindow(props: { offsetLeft: number }) {
    return {
        bottom: 0.2,
        width: 0.5,
        height: 0.5,
        ...props,
        shapes: [insertWindowShutters(1)],
    };
}

nhaCap4.floors = [
    {
        height: 0.01,
        floor: false,
        materials: {
            floor: floorMaterial,
        },
        sides: [
            {
            start: new THREE.Vector3(-4, 0, 2),
            },
            {
            start: new THREE.Vector3(3, 0, 2),
            //   holes: [],
            },
            {
            start: new THREE.Vector3(3, 0, -2),
            },
            {
            start: new THREE.Vector3(-3, 0, -3),
            },
        ],
    },
    {
        height: 4,
        floor: true,
        materials: {
            floor: floorMaterial,
        },
        sides: [
        
      ],
    }
];
// Assuming nhaCap4.floors is already defined and populated
const highestFloor = nhaCap4.floors[nhaCap4.floors.length - 1]; // Assuming the last floor is the highest

// Initialize min and max values with the first side's start position
let minX = highestFloor.sides[0]?.start?.x || 0;
let maxX = highestFloor.sides[0]?.start?.x || 0;
let minZ = highestFloor.sides[0]?.start?.z || 0;
let maxZ = highestFloor.sides[0]?.start?.z || 0;

// Calculate bounding box of the highest floor
const roofWidth = highestFloor.sides[0].width;
const roofHeight = highestFloor.sides[0].width * 0.5;
const roofDepth = highestFloor.sides[0].width * 0.5;
const roofPosition = highestFloor.sides[0].position;

// Calculate corner points of the roof base
const corners = [
    { x: roofPosition.x - roofWidth / 2, z: roofPosition.z - roofDepth / 2 }, // Front left
    { x: roofPosition.x + roofWidth / 2, z: roofPosition.z - roofDepth / 2 }, // Front right
    { x: roofPosition.x + roofWidth / 2, z: roofPosition.z + roofDepth / 2 }, // Back right
    { x: roofPosition.x - roofWidth / 2, z: roofPosition.z + roofDepth / 2 }, // Back left
];

// Roof peak position
const peak = {
    x: roofPosition.x,
    y: roofPosition.y + roofHeight,
    z: roofPosition.z,
};

// Define the sides of the roof
nhaCap4.roof.sides = corners.map((corner, index) => {
    const nextCorner = corners[(index + 1) % corners.length];
    return {
        start: new THREE.Vector3(corner.x, roofPosition.y, corner.z),
        end: new THREE.Vector3(nextCorner.x, roofPosition.y, nextCorner.z),
        shift: new THREE.Vector3(peak.x, peak.y, peak.z),
        width: roofWidth, // This might need adjustment based on the actual side
        angle: Math.atan(roofHeight / (roofWidth / 2)), // This is a simplification
    };
});

// nhaCap4.roof = {
//     width: nhaCap4.floors[0].sides[1].start.x - nhaCap4.floors[0].sides[0].start.x,
//     depth: nhaCap4.floors[0].sides[2].start.z - nhaCap4.floors[0].sides[1].start.z,
//     height: 1.5,
//     material: roofMaterial,
//     position: {
//         x: nhaCap4.floors[0].sides[0].start.x,
//         y: nhaCap4.floors.reduce((a, b) => a + b.height, 0),
//         z: nhaCap4.floors[0].sides[2].start.z,
//     }
// };

const house: IHouse = {
    floors: [],
    roof: nhaCap4.roof,
    wallthickness: nhaCap4.wallthickness,
};

function addFloor(props: { height: number }) {
    house.floors.push({ ...props, sides: [] });
  
    return house.floors[house.floors.length - 1];
  }
  console.clear();
  
  for (var f = 0; f < nhaCap4.floors.length; f++) {
    const floor = nhaCap4.floors[f];
    let currentFloor = addFloor({
      height: floor.height
    });
  
    currentFloor.sides = floor.sides;
  }

export default house;