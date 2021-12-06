import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Perlin } from "three-noise";
import GUI from "lil-gui";
import { clampPerlinRegion } from "./utils/clampPerlinRegion";

// Debug
const gui = new GUI();
const settings = {
  citySize: 500,
  color: 0xffff00,
  sampleRate: 0.005
};
const extrusionSettings = {
  steps: 1,
  bevelEnabled: false,
  bevelThickness: 0,
  bevelSize: 0,
  bevelOffset: 5,
  bevelSegments: 0
};
const colorGUI = gui
  .addColor(settings, "color")
  .listen()
  .onChange((x) => {
    plane.material.color.setHex(x);
    building.material.color.set(x);
  });

const sampleRateGUI = gui
  .add(settings, "sampleRate")
  .listen()
  .onChange((x) => {
    tick();
  });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
export const scene = new THREE.Scene();

const planeGeometry = new THREE.PlaneGeometry(
  settings.citySize,
  settings.citySize,
  15,
  15
);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: "hsla(203, 7%, 68%, 1)",
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

let perlinPoints = [];
let buildings = [];

for (let x = 0; x <= settings.citySize; x += 10) {
  let x1 = x;
  let x2 = x + 10;

  for (let y = 0; y <= settings.citySize; y += 10) {
    let y1 = y;
    let y2 = y + 10;
    const buildingPoints = [];

    x1 += THREE.MathUtils.randFloat(-2, 2);
    y1 += THREE.MathUtils.randFloat(-2, 2);

    buildingPoints.push(new THREE.Vector2(x1, y1));
    buildingPoints.push(new THREE.Vector2(x2, y1));
    buildingPoints.push(new THREE.Vector2(x2, y2));
    buildingPoints.push(new THREE.Vector2(x1, y2));

    const buildingShape = new THREE.Shape(buildingPoints);
    extrusionSettings.depth = clampPerlinRegion(x1, y1, settings.sampleRate)[0];

    perlinPoints.push(extrusionSettings.depth);

    // creating building mesh
    const buildingGeometry = new THREE.ExtrudeGeometry(
      buildingShape,
      extrusionSettings
    );
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: clampPerlinRegion(x1, y1, settings.sampleRate)[1]
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(
      -(settings.citySize / 2),
      -(settings.citySize / 2),
      0
    );
    scene.add(building);
  }
}

console.log(perlinPoints);
// Lights
// const pointLight = new THREE.PointLight(0xffffff, 0.6);
// pointLight.position.x = 6;
// pointLight.position.y = 6;
// pointLight.position.z = 6;
// scene.add(pointLight);

const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  90,
  10000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

controls.minDistance = 100;
controls.maxDistance = 5000;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x92d5f2, 1);

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
