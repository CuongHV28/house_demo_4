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
    }
];
// Assuming nhaCap4.floors is already defined and populated
const highestFloor = nhaCap4.floors[nhaCap4.floors.length - 1]; // Assuming the last floor is the highest

// roof
const baseSize = 10; // Length of the square base
const roofHeight = 5; // Height from the base to the peak

// Calculate the center of the base (which is at the origin for this example)
const baseCenter = new THREE.Vector3(0, 0, 0);

// Calculate the peak of the roof
const roofPeak = new THREE.Vector3(highestFloor.sides[0].start?.x, roofHeight, highestFloor.sides[0].start?.z);

// Define the corners of the base
const baseCorners = [
    new THREE.Vector3(highestFloor.sides[0].start?.x, highestFloor.sides[0].start?.y, highestFloor.sides[0].start?.z), // Front left
    new THREE.Vector3(highestFloor.sides[1].start?.x, highestFloor.sides[1].start?.y, highestFloor.sides[1].start?.z),  // Front right
    new THREE.Vector3(highestFloor.sides[2].start?.x, highestFloor.sides[2].start?.y, highestFloor.sides[2].start?.z), // Back right
    new THREE.Vector3(highestFloor.sides[3].start?.x, highestFloor.sides[3].start?.y, highestFloor.sides[3].start?.z) // Back left
//   new THREE.Vector3(-baseSize / 2, 0, baseSize / 2), // Front left
//   new THREE.Vector3(baseSize / 2, 0, baseSize / 2),  // Front right
//   new THREE.Vector3(baseSize / 2, 0, -baseSize / 2), // Back right
//   new THREE.Vector3(-baseSize / 2, 0, -baseSize / 2) // Back left
];

// Calculate the total height of all floors
let totalFloorsHeight = 0;
nhaCap4.floors.forEach(floor => {
    totalFloorsHeight += floor.height;
});

// Adjust the roof peak to be on top of the highest floor
roofPeak.y += totalFloorsHeight;

// Adjust the base corners to be at the top of the highest floor
baseCorners.forEach(corner => {
    corner.y += totalFloorsHeight;
});

// Recalculate the roof sides with the adjusted base corners and roof peak
const roofSides: IHouseSide[] = baseCorners.map((corner, index) => ({
    start: corner,
    end: baseCorners[(index + 1) % baseCorners.length], // Connects each corner to the next
    shift: roofPeak, // All sides shift up to the peak
    width: baseSize,
    angle: Math.atan2(roofHeight, baseSize / Math.sqrt(2)), // Angle from base to peak
}));

function createRoofSideMesh(side: IHouseSide): THREE.Mesh {
    const geometry = new THREE.BufferGeometry();
    const vertices = [
      side.start!,
      side.end!,
      side.shift!
    ];
    const indices = [0, 1, 2];
    geometry.setFromPoints(vertices);
    geometry.setIndex(indices);
  
    const material = new THREE.MeshBasicMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
  
    return mesh;
}

const roofSideMeshes = roofSides.map(side => createRoofSideMesh(side));
nhaCap4.roof = {
    material: new THREE.MeshBasicMaterial({ color: 0x8B4513 }), // Example material
    sides: roofSideMeshes,
};
debugger;


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