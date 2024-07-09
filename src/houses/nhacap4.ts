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
            start: new THREE.Vector3(-3, 0, 2),
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
            {
                start: new THREE.Vector3(-3, 0, 2),
                // angle: 0,
            },
            // {
            //     start: new THREE.Vector3(3, 0, 2),
            //     // angle: -30,
            // //   holes: [],
            // },
            // {
            //     start: new THREE.Vector3(3, 0, -2),
            //     // angle: 0,
            // },
            // {
            //     start: new THREE.Vector3(-3, 0, -3),
            //     // angle: 0,
            // },
        ],
    }
];
// Assuming nhaCap4.floors is already defined and populated
const highestFloor = nhaCap4.floors[nhaCap4.floors.length - 1]; // Assuming the last floor is the highest


// Calculate the total height of all floors
let totalFloorsHeight = 0;
nhaCap4.floors.forEach(floor => {
    totalFloorsHeight += floor.height;
});

const minX = Math.min(...highestFloor.sides.map(side => side.start.x));
const maxX = Math.max(...highestFloor.sides.map(side => side.start.x));
const minZ = Math.min(...highestFloor.sides.map(side => side.start.z));
const maxZ = Math.max(...highestFloor.sides.map(side => side.start.z));
const roofDepth = 1;
const roofHeight = 5;
nhaCap4.roof = {
    // depth: roofDepth, // Assume roofDepth is defined
    height: roofHeight, // Assume roofHeight is defined
    material: roofMaterial, // Assume roofMaterial is defined
    position: {
        x: (minX + maxX) / 2, // Center of the roof on the x-axis
        y: totalFloorsHeight, // Position the roof on top of the highest floor
        z: (minZ + maxZ) / 2, // Center of the roof on the z-axis
    },
    sides: [
        {
            start: new THREE.Vector3(-minX / 2, 0, roofDepth / 2),
            end: new THREE.Vector3(maxX / 2, 0, roofDepth / 2),
            shift: new THREE.Vector3(0, roofHeight, 0),
            angle: 30,
            combinedAngle: 0, // This might need calculation based on your design
            width: 3,
        },
        {
            start: new THREE.Vector3(minX / 2, 0, roofDepth / 2),
            end: new THREE.Vector3(maxX / 2, 0, -roofDepth / 2),
            shift: new THREE.Vector3(0, roofHeight, 0),
            angle: 30,
            combinedAngle: 0, // This might need calculation based on your design
            width: 3,
        },
        {
            start: new THREE.Vector3(minX / 2, 0, -roofDepth / 2),
            end: new THREE.Vector3(-maxX / 2, 0, -roofDepth / 2),
            shift: new THREE.Vector3(0, roofHeight, 0),
            angle: 30,
            combinedAngle: 0, // This might need calculation based on your design
            width: 3,
        },
        {
            start: new THREE.Vector3(-minX / 2, 0, -roofDepth / 2),
            end: new THREE.Vector3(-maxX / 2, 0, roofDepth / 2),
            shift: new THREE.Vector3(0, roofHeight, 0),
            angle: 30,
            combinedAngle: 0, // This might need calculation based on your design
            width: 3,
        },
    ]
};

// debugger;


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