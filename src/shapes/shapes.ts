

import * as THREE from "three";
import {
    Evaluator,
    EdgesHelper,
    Operation,
    OperationGroup,
    ADDITION,
    SUBTRACTION,
} from "three-bvh-csg";

export { chair } from "./chairs";
export { table } from "./tables";

export function bulbLight(x: number, y: number, z: number) {
    // console.log("bulb", x, y, z);
    const bulbLight = new THREE.PointLight(0xffcf73, 0.1);
    // const bulbLight = new THREE.SpotLight(0xffcf73, 1);
    // const bulbLight = new THREE.DirectionalLight(0xffcf73, 1);
    bulbLight.castShadow = false;
    //Set up shadow properties for the light
  
    bulbLight.power = 20;
    bulbLight.decay = 0.5;
    // bulbLight.distance = Infinity;
    //bulbLight.position.set(-100, 600, -100);
    bulbLight.position.set(x, y, z);
    // bulbLight.target.updateMatrixWorld();
  
    bulbLight.matrixAutoUpdate = false;
    bulbLight.updateMatrix();
    // scene.add(bulbLight);
  
    const bulbLightshadowCam = bulbLight.shadow.camera;
    bulbLight.castShadow = true;
    bulbLight.shadow.mapSize.setScalar(512);
    bulbLight.shadow.mapSize.width = 512;
    bulbLight.shadow.mapSize.height = 512;
    bulbLight.shadow.camera.near = 0.05; // default
    bulbLight.shadow.camera.far = 10; // default
    bulbLight.shadow.bias = -0.00005; //1e-5;
    bulbLight.shadow.normalBias = 0.02; //1e-2;
    setTimeout(() => {
      bulbLight.shadow.autoUpdate = false;
    }, 500);
  
    // bulbLightshadowCam.left = bulbLightshadowCam.bottom = -1000;
    // bulbLightshadowCam.right = bulbLightshadowCam.top = 1000;
    bulbLightshadowCam.updateProjectionMatrix();
  
    return bulbLight;
}

