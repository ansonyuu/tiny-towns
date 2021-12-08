import * as THREE from "three";
import { Perlin } from "three-noise";

export function generateNoiseMap(
  width,
  height,
  scale,
  octaves,
  persistence,
  lacunarity
) {
  let noiseMap = [];

  if (scale <= 0) {
    scale = 0.00001;
  }

  for (let y = 0; y < height; y++) {
    let tempNoise = new Array();
    for (let x = 0; x < width; x++) {
      let amplitude = 1;
      let frequency = 1;
      let noiseHeight = 0;

      for (let i = 0; i < octaves; i++) {
        let sampleX = (x / scale) * frequency;
        let sampleY = (y / scale) * frequency;

        let perlinSeed = new Perlin(Math.random());
        let perlinValue = perlinSeed.get2(new THREE.Vector2(sampleX, sampleY));

        noiseHeight += perlinValue * amplitude;

        amplitude *= persistence;
        frequency *= lacunarity;
      }
      tempNoise.push(noiseHeight);
    }
    noiseMap.push(tempNoise);
  }
  return noiseMap;
}
