import * as THREE from "three";
import { settings, scene } from "../script";

export default function landing() {
  // Objects
  const geometry = new THREE.TorusGeometry(10, 0.4, 16, 100);

  // Materials
  const material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(settings.torusColor);

  console.log("this is working");
  // Mesh
  const torus = new THREE.Mesh(geometry, material);
  scene.add(torus);

  // Text
  const loader = new THREE.FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new THREE.TextGeometry("Tiny Towns", {
        font: font,
        size: 1,
        height: 0.1
      });
      textGeometry.center();

      // Materials
      const textMaterial = new THREE.MeshNormalMaterial();

      // Mesh
      const text = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(text);
    }
  );
}
