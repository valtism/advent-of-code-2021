import run from "aocrunner";
const parseInput = (rawInput) => {
  const [enhancement, image] = rawInput.split("\n\n");
  const pixels = new Set();
  image.split("\n").forEach((line, y) => {
    line.trim().split("").forEach((pixel, x) => {
      if (pixel === "#") {
        pixels.add(`${x},${y}`);
      }
    });
  });
  return { enhancement, pixels };
};
const part1 = (rawInput) => {
  const { enhancement, pixels } = parseInput(rawInput);
  const flipInf = enhancement[0] === "#";
  const once = enhance(pixels, enhancement, false);
  const twice = enhance(once, enhancement, flipInf ? true : false);
  return twice.size;
};
const part2 = (rawInput) => {
  let { enhancement, pixels } = parseInput(rawInput);
  const doesInfinityFlip = enhancement[0] === "#";
  let isInfinityOn = false;
  for (let i = 0; i < 50; i++) {
    pixels = enhance(pixels, enhancement, isInfinityOn);
    if (doesInfinityFlip) {
      isInfinityOn = !isInfinityOn;
    }
  }
  return pixels.size;
};
function enhance(pixels, enhancement, isInfinityOn) {
  const newPixels = new Set();
  const { minX, maxX, minY, maxY } = getBounds(pixels);
  for (let x = minX - 1; x <= maxX + 1; x++) {
    for (let y = minY - 1; y <= maxY + 1; y++) {
      const neighbors = getNeighbours(x, y);
      const surroundNumber = neighbors.map(({ x: x2, y: y2 }) => {
        const isBeyondBounds = x2 < minX || x2 > maxX || y2 < minY || y2 > maxY;
        if (isBeyondBounds) {
          return isInfinityOn ? "1" : "0";
        }
        return pixels.has(`${x2},${y2}`) ? "1" : "0";
      });
      const enhancementIndex = parseInt(surroundNumber.join(""), 2);
      const newPixel = enhancement[enhancementIndex];
      if (newPixel === "#") {
        newPixels.add(`${x},${y}`);
      }
    }
  }
  return newPixels;
}
function getBounds(set) {
  const setArray = Array.from(set);
  const xArray = setArray.map((p) => Number(p.split(",")[0]));
  const yArray = setArray.map((p) => Number(p.split(",")[1]));
  const minX = Math.min(...xArray);
  const maxX = Math.max(...xArray);
  const minY = Math.min(...yArray);
  const maxY = Math.max(...yArray);
  return { minX, maxX, minY, maxY };
}
function getNeighbours(x, y) {
  return [
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y },
    { x, y },
    { x: x + 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 }
  ];
}
function printSet(set) {
  const minX = Math.min(...Array.from(set).map((p) => Number(p.split(",")[0])));
  const maxX = Math.max(...Array.from(set).map((p) => Number(p.split(",")[0])));
  const minY = Math.min(...Array.from(set).map((p) => Number(p.split(",")[1])));
  const maxY = Math.max(...Array.from(set).map((p) => Number(p.split(",")[1])));
  const array = Array(maxY - minY + 1).fill(null).map(() => Array(maxX - minX + 1).fill("."));
  set.forEach((coord) => {
    const [x, y] = coord.split(",").map(Number);
    array[y - minY][x - minX] = "#";
  });
  set.forEach((coord) => {
    const [x, y] = coord.split(",").map(Number);
    array[y - minY][x - minX] = "#";
  });
  console.log(array.map((row) => row.join("")).join("\n"));
}
run({
  part1: {
    tests: [
      {
        input: `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`,
        expected: 35
      }
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`,
        expected: 3351
      }
    ],
    solution: part2
  },
  trimTestInputs: true
});
//# sourceMappingURL=index.js.map
