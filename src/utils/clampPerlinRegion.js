import * as THREE from "three";
import { Perlin } from "three-noise";

export function noiseArrayGen(x, y, sampleRate) {
  let noiseValues = [];
  for (let i = 0; i < 100; i++) {
    const perlinValue = new Perlin(Math.random());
    noiseValues.push(
      perlinValue.get2(new THREE.Vector2(x * sampleRate, y * sampleRate))
    );
  }
  return noiseValues;
}

function weightedPerlin(input, weight) {
  let absolute = Math.abs(input);
  console.log(input, absolute, "absoliute");
  return absolute * weight * 1000;
}

export function clampPerlinRegion(x, y, seed, sampleRate) {
  const perlinValue = new Perlin(seed);
  const buildingDepth = perlinValue.get2(
    new THREE.Vector2(x * sampleRate, y * sampleRate)
  );
  console.log(buildingDepth, "depth");
  const colors = [
    [-0.2, 0.01, "hsl(16,11%,41%)", "brown"], // Brown
    [-0.15, 0.02, "hsl(85,14%,55%)", "green1"], //Jade Green
    [-0.1, 0.03, "hsl(142,16%,57%)", "green2"], // Teal Green
    [0, 0.04, "hsl(112,28%,75%)", "green3"], //Pale Green
    [0.2, 0.25, "hsl(12,70%,39%)", "red"], //Red
    [0.5, 0.35, "hsl(41,45%,88%)", "beige"], //Orange
    [1.0, 1, "hsl(41,45%,88%)", "beige"] //Beige
  ];

  for (let [depth, weight, col, colName] of colors) {
    if (buildingDepth < depth) {
      console.log("less than 0", buildingDepth, colName);

      let buildingCol = col;
      const hue = buildingCol.match(/(hsl\()([0-9]*)(.*)/);
      let remixedHue = parseInt(hue[2]) + (Math.random() * 2 - 1) * (0 - 12);

      let remixedCol = buildingCol.replace(
        /(hsl\()([0-9]*)(.*)/,
        `$1${remixedHue}$3`
      );
      console.log(remixedCol);
      return [weightedPerlin(depth, weight), remixedCol];
    }
  }

  // if <-50, water (map to ~-1)
  // if between -50 and -40, sand (map to ~0)
  // if between -30 and -10, shore (map to ~2)
  // if between 10 and 30, park (map to ~3)
  // if between 40 and 50, road (map to ~3)
  // if between 50 and 70, house (map to ~3)
  // if >70, building (map to ~3)

  return buildingDepth;
}
