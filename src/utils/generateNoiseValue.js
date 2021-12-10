import * as THREE from "three";
import { Perlin } from "three-noise";

export function generateNoiseValue(
  x,
  y,
  seed,
  scale,
  octaves,
  persistence,
  lacunarity
) {
  let noiseValue = 0;

  if (scale <= 0) {
    scale = 0.00001;
  }

  let amplitude = 1;
  let frequency = 1;

  for (let i = 0; i < octaves; i++) {
    let sampleX = (x / scale) * frequency;
    let sampleY = (y / scale) * frequency;

    let perlinSeed = new Perlin(seed);
    let perlinValue = perlinSeed.get2(new THREE.Vector2(sampleX, sampleY));

    noiseValue += perlinValue * amplitude;

    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return noiseValue;
}
