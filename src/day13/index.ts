import run from "aocrunner";
import _ from "lodash";
import { permutator } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  const [rawCoords, rawInstructions] = rawInput.split("\n\n");
  const coords = rawCoords.split("\n").map((line) => {
    const [x, y] = line.trim().split(",").map(Number);
    return { x, y };
  });
  const instructions = rawInstructions.split("\n").map((line) => {
    const [direction, steps] = line.trim().slice(11).split("=");
    const dir = direction.trim() as "x" | "y";
    return { direction: dir, steps: Number(steps) };
  });
  return { coords, instructions };
};

const part1 = (rawInput: string) => {
  const { coords, instructions } = parseInput(rawInput);

  const set = new Set<string>();
  coords.forEach((coord) => {
    set.add(`${coord.x},${coord.y}`);
  });
  [instructions[0]].forEach((instruction) => {
    const { direction, steps } = instruction;

    set.forEach((coord) => {
      const [x, y] = coord.split(",").map(Number);
      const newX = direction === "x" ? steps - Math.abs(x - steps) : x;
      const newY = direction === "y" ? steps - Math.abs(y - steps) : y;
      set.add(`${newX},${newY}`);
      if (
        (direction === "x" && x > steps) ||
        (direction === "y" && y > steps)
      ) {
        set.delete(coord);
      }
    });
  });
  return set.size;
};

const part2 = (rawInput: string) => {
  const { coords, instructions } = parseInput(rawInput);

  const set = new Set<string>();
  coords.forEach((coord) => {
    set.add(`${coord.x},${coord.y}`);
  });
  instructions.forEach((instruction) => {
    const { direction, steps } = instruction;

    set.forEach((coord) => {
      const [x, y] = coord.split(",").map(Number);
      const newX = direction === "x" ? steps - Math.abs(x - steps) : x;
      const newY = direction === "y" ? steps - Math.abs(y - steps) : y;
      set.add(`${newX},${newY}`);
      if (
        (direction === "x" && x > steps) ||
        (direction === "y" && y > steps)
      ) {
        set.delete(coord);
      }
    });
  });

  let xMax = 0;
  let yMax = 0;
  set.forEach((coord) => {
    const [x, y] = coord.split(",").map(Number);
    xMax = Math.max(xMax, x);
    yMax = Math.max(yMax, y);
  });

  const printout: string[][] = new Array(yMax + 1)
    .fill(null)
    .map(() => new Array(xMax + 1).fill(" "));

  set.forEach((coord) => {
    const [x, y] = coord.split(",").map(Number);
    printout[y][x] = "X";
  });

  console.log(`\n${printout.map((row) => row.join("")).join("\n")}\n`);

  return "CPJBERUL";
};

run({
  part1: {
    tests: [
      {
        input: `6,10
      0,14
      9,10
      0,3
      10,4
      4,11
      6,0
      6,12
      4,1
      0,13
      10,12
      3,4
      3,0
      8,4
      1,10
      2,14
      8,10
      9,0

      fold along y=7
      fold along x=5`,
        expected: 17,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
