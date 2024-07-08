// import { IHoleSettings } from "../shapes/shapes";

// export {
//   IBalconySettings,
//   IBalconyDoorSettings,
//   IAwningSettings,
//   IPlantSettings,
//   IHoleSettings,
//   IHangingLightsSettings
// } from "../shapes/shapes";

import * as THREE from "three";

export interface IHouseSide {
  start?: THREE.Vector3;
  end?: THREE.Vector3;
  shift?: THREE.Vector3;
  width?: number;
  angle?: number;
  combinedAngle?: number;
  // holes?: IHoleSettings[];
}

export interface IHouseFloor {
  height: number;
  y?: number;
  floor?: boolean;
  materials: any;
  sides: IHouseSide[];
  // ground?: any[];
}

export interface IHouseRoof {
  material: any; // The material of the roof
  position?: {
    x: number;
    y: number;
    z: number;
  }; // Optional position, if you want to override automatic placement
  baseHeight?: number; // Optional base height, representing the height at which the roof starts
  sides?: THREE.Mesh[]; // Optional meshes, if you want to add custom geometry to the roof
}

export interface IHouse {
  floors: IHouseFloor[];
  roof?: IHouseRoof;
  wallthickness: number;
}
