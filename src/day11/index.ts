import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim().split("").map(Number));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const map = new Map();
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const value = row[x];
      const coords = `${x},${y}`;
      map.set(coords, value);
    }
  }

  let flashes = 0;
  for (let i = 0; i < 100; i++) {
    let incrementAround: { x: number; y: number }[] = [];

    map.forEach((value, coord) => {
      const [x, y] = coord.split(",").map(Number);
      map.set(coord, value + 1);
      if (value === 9) {
        incrementAround.push({ x, y });
      }
    });
    while (incrementAround.length > 0) {
      const { x, y } = incrementAround.shift();
      const neighborCoords = [
        `${x - 1},${y - 1}`,
        `${x - 1},${y}`,
        `${x - 1},${y + 1}`,
        `${x},${y - 1}`,
        `${x},${y + 1}`,
        `${x + 1},${y - 1}`,
        `${x + 1},${y}`,
        `${x + 1},${y + 1}`,
      ].filter((c) => map.has(c));
      neighborCoords.forEach((coord) => {
        const [nX, nY] = coord.split(",").map(Number);
        const value = map.get(coord);
        map.set(coord, value + 1);
        if (value === 9) {
          incrementAround.push({ x: nX, y: nY });
        }
      });
    }
    map.forEach((value, coord) => {
      if (value > 9) {
        flashes++;
        map.set(coord, 0);
      }
    });
  }

  return flashes;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const map = new Map();
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const value = row[x];
      const coords = `${x},${y}`;
      map.set(coords, value);
    }
  }

  let flashes = 0;
  for (let i = 1; i < 1000000000; i++) {
    let incrementAround: { x: number; y: number }[] = [];

    map.forEach((value, coord) => {
      const [x, y] = coord.split(",").map(Number);
      map.set(coord, value + 1);
      if (value === 9) {
        incrementAround.push({ x, y });
      }
    });
    while (incrementAround.length > 0) {
      const { x, y } = incrementAround.shift();
      const neighborCoords = [
        `${x - 1},${y - 1}`,
        `${x - 1},${y}`,
        `${x - 1},${y + 1}`,
        `${x},${y - 1}`,
        `${x},${y + 1}`,
        `${x + 1},${y - 1}`,
        `${x + 1},${y}`,
        `${x + 1},${y + 1}`,
      ].filter((c) => map.has(c));
      neighborCoords.forEach((coord) => {
        const [nX, nY] = coord.split(",").map(Number);
        const value = map.get(coord);
        map.set(coord, value + 1);
        if (value === 9) {
          incrementAround.push({ x: nX, y: nY });
        }
      });
    }
    flashes = 0;
    map.forEach((value, coord) => {
      if (value > 9) {
        flashes++;
        map.set(coord, 0);
      }
    });
    if (flashes === map.size) {
      return i;
    }
  }
  return -1;
};

run({
  part1: {
    tests: [
      {
        input: `5483143223
      2745854711
      5264556173
      6141336146
      6357385478
      4167524645
      2176841721
      6882881134
      4846848554
      5283751526`,
        expected: 1656,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `5483143223
      2745854711
      5264556173
      6141336146
      6357385478
      4167524645
      2176841721
      6882881134
      4846848554
      5283751526`,
        expected: 195,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
