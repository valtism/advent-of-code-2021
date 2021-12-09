import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.trim().split("").map(Number));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lows = [];
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const current = row[x];
      const neighbors = [
        row[x - 1],
        row[x + 1],
        input[y - 1]?.[x],
        input[y + 1]?.[x],
      ].filter((n) => n !== undefined);

      if (neighbors.every((n) => n > current)) {
        lows.push(current);
      }
    }
  }
  return lows.map((low) => low + 1).reduce((acc, curr) => acc + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map = new Map<string, number>();
  let basinNumber = 0;

  function walkBasin(x: number, y: number) {
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    neighbors.forEach(([x, y]) => {
      const coords = `${x},${y}`;
      const value = input[y]?.[x];
      if (value !== undefined && value !== 9 && !map.has(coords)) {
        map.set(coords, basinNumber);
        walkBasin(x, y);
      }
    });
  }

  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const coords = `${x},${y}`;
      const current = row[x];
      if (map.has(coords) || current === 9) {
        continue;
      }

      walkBasin(x, y);
      basinNumber++;
    }
  }

  let basinSizes = Array(basinNumber).fill(0);
  for (const basinNumber of map.values()) {
    basinSizes[basinNumber]++;
  }

  const sizes = basinSizes.sort((a, b) => b - a);

  return sizes[0] * sizes[1] * sizes[2];
};

run({
  part1: {
    tests: [
      {
        input: `2199943210
        3987894921
        9856789892
        8767896789
        9899965678`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2199943210
      3987894921
      9856789892
      8767896789
      9899965678`,
        expected: 1134,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
