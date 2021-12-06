import * as THREE from "three";
import { Perlin } from "three-noise";

function noiseArrayGen(x, y, sampleRate) {
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
  let absoluteInput = ((input + 1) / 2) * weight * 100;
  return absoluteInput + THREE.MathUtils.randFloat(-weight * 5, weight * 5);
}

export function clampPerlinRegion(x, y, sampleRate) {
  const perlinValue = new Perlin(Math.random());
  const buildingDepth = perlinValue.get2(
    new THREE.Vector2(x * sampleRate, y * sampleRate)
  );

  const colors = [
    [-0.5, 0.00001, "hsl(16,11%,41%)"], // Blue
    [-0.25, 0.00005, "hsl(85,14%,55%)"],
    [-0.125, 0.0001, "hsl(142,16%,57%)"],
    [0, 0.15, "hsl(112,28%,75%)"],
    [0.25, 0.35, "hsl(12,70%,39%)"],
    [0.5, 0.65, "hsl(27,75%,66%)"],
    [1.0, 1, "hsl(41,45%,88%)"]
  ];

  console.log("noise array", noiseArrayGen(x, y, sampleRate));

  for (let [depth, wp, col] of colors) {
    if (buildingDepth < depth) {
      return [weightedPerlin(buildingDepth, wp), col];
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
