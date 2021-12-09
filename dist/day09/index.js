import run from "aocrunner";
const parseInput = (rawInput) => rawInput.split("\n").map((row) => row.trim().split("").map(Number));
const part1 = (rawInput) => {
  var _a, _b;
  const input = parseInput(rawInput);
  const lows = [];
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const current = row[x];
      const neighbors = [
        row[x - 1],
        row[x + 1],
        (_a = input[y - 1]) == null ? void 0 : _a[x],
        (_b = input[y + 1]) == null ? void 0 : _b[x]
      ].filter((n) => n !== void 0);
      if (neighbors.every((n) => n > current)) {
        lows.push(current);
      }
    }
  }
  return lows.map((low) => low + 1).reduce((acc, curr) => acc + curr, 0);
};
const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const map = new Map();
  let basinNumber = 0;
  function walkBasin(x, y) {
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ];
    neighbors.forEach(([x2, y2]) => {
      var _a;
      const coords = `${x2},${y2}`;
      const value = (_a = input[y2]) == null ? void 0 : _a[x2];
      if (value !== void 0 && value !== 9 && !map.has(coords)) {
        map.set(coords, basinNumber);
        walkBasin(x2, y2);
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
  for (const basinNumber2 of map.values()) {
    basinSizes[basinNumber2]++;
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
        expected: 15
      }
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `2199943210
      3987894921
      9856789892
      8767896789
      9899965678`,
        expected: 1134
      }
    ],
    solution: part2
  },
  trimTestInputs: true
});
//# sourceMappingURL=index.js.map
