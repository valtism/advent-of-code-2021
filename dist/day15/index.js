var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import run from "aocrunner";
const parseInput = (rawInput) => rawInput.split("\n").map((line) => line.trim().split("").map(Number));
const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let allCoords = new Map();
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const coord = `${x},${y}`;
      allCoords.set(coord, {
        value: row[x],
        shortest: coord === "0,0" ? 0 : Infinity
      });
    }
  }
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const coord = `${x},${y}`;
      const neighbors = [
        `${x},${y - 1}`,
        `${x - 1},${y}`
      ];
      const coordValues = allCoords.get(coord);
      const shortestNeighborPath = neighbors.reduce((short, neighbor) => {
        if (!allCoords.has(neighbor))
          return short;
        const neighborShortest = allCoords.get(neighbor).shortest;
        return Math.min(short, neighborShortest);
      }, coordValues.shortest);
      allCoords.set(coord, __spreadProps(__spreadValues({}, coordValues), {
        shortest: shortestNeighborPath + coordValues.value
      }));
    }
  }
  return allCoords.get(`${input.length - 1},${input.length - 1}`).shortest - 1;
};
const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const allCoords = new Map();
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          const coord = `${x + i * row.length},${y + j * input.length}`;
          allCoords.set(coord, {
            value: coord === "0,0" ? 0 : (row[x] + i + j - 1) % 9 + 1,
            shortest: coord === "0,0" ? 0 : Infinity
          });
        }
      }
    }
  }
  const toUpdate = new Set();
  toUpdate.add("0,0");
  while (toUpdate.size) {
    toUpdate.forEach((coord) => {
      const coordValues = allCoords.get(coord);
      const [x, y] = coord.split(",").map(Number);
      const neighbours = [
        { x, y: y - 1 },
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y + 1 }
      ];
      neighbours.forEach(({ x: x2, y: y2 }) => {
        const neighbourCoord = `${x2},${y2}`;
        if (!allCoords.has(neighbourCoord))
          return;
        const neighborValues = allCoords.get(neighbourCoord);
        const newLength = coordValues.shortest + neighborValues.value;
        if (newLength < neighborValues.shortest) {
          allCoords.set(neighbourCoord, __spreadProps(__spreadValues({}, neighborValues), {
            shortest: newLength
          }));
          toUpdate.add(neighbourCoord);
        }
      });
      toUpdate.delete(coord);
    });
  }
  return allCoords.get(`${input.length * 5 - 1},${input.length * 5 - 1}`).shortest;
};
run({
  part1: {
    tests: [
      {
        input: `1163751742
      1381373672
      2136511328
      3694931569
      7463417111
      1319128137
      1359912421
      3125421639
      1293138521
      2311944581`,
        expected: 40
      }
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `1163751742
      1381373672
      2136511328
      3694931569
      7463417111
      1319128137
      1359912421
      3125421639
      1293138521
      2311944581`,
        expected: 315
      }
    ],
    solution: part2
  },
  trimTestInputs: true
});
//# sourceMappingURL=index.js.map
