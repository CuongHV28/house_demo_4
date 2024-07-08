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
highestFloor.sides.forEach(side => {
    minX = Math.min(minX, side.start?.x ?? 0);
    maxX = Math.max(maxX, side.start?.x ?? 0);
    minZ = Math.min(minZ, side.start?.z || 0);
    maxZ = Math.max(maxZ, side.start?.z || 0);
}); 

// Calculate width, depth, and position for the roof
const roofWidth = maxX - minX;
const roofDepth = maxZ - minZ;
const roofHeight = 0.2; // Example height of the roof
const totalFloorsHeight = nhaCap4.floors.reduce((acc, floor) => acc + floor.height, 0);

// Create the roof object
nhaCap4.roof = {
    width: roofWidth,
    depth: roofDepth,
    height: roofHeight,
    material: roofMaterial, // Assuming roofMaterial is defined
    position: {
        x: (minX + maxX) / 2, // Center of the roof on the x-axis
        y: totalFloorsHeight, // Position the roof on top of the highest floor
        z: (minZ + maxZ) / 2, // Center of the roof on the z-axis
    }
};
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