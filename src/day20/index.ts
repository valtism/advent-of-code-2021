import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => {
  const [enhancement, image] = rawInput.split("\n\n");
  const pixels = new Set<string>();
  image.split("\n").forEach((line, y) => {
    line
      .trim()
      .split("")
      .forEach((pixel, x) => {
        if (pixel === "#") {
          pixels.add(`${x},${y}`);
        }
      });
  });
  return { enhancement, pixels };
};

const part1 = (rawInput: string) => {
  const { enhancement, pixels } = parseInput(rawInput);

  const flipInf = enhancement[0] === "#";
  const once = enhance(pixels, enhancement, false);
  const twice = enhance(once, enhancement, flipInf ? true : false);

  return twice.size;
};

const part2 = (rawInput: string) => {
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

function enhance(
  pixels: Set<string>,
  enhancement: string,
  isInfinityOn: boolean,
) {
  const newPixels = new Set<string>();

  const { minX, maxX, minY, maxY } = getBounds(pixels);
  for (let x = minX - 1; x <= maxX + 1; x++) {
    for (let y = minY - 1; y <= maxY + 1; y++) {
      const neighbors = getNeighbours(x, y);
      const surroundNumber = neighbors.map(({ x, y }) => {
        const isBeyondBounds = x < minX || x > maxX || y < minY || y > maxY;
        if (isBeyondBounds) {
          return isInfinityOn ? "1" : "0";
        }
        return pixels.has(`${x},${y}`) ? "1" : "0";
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

// Get the max and min x and y values of the set
function getBounds(set: Set<string>) {
  const setArray = Array.from(set);
  const xArray = setArray.map((p) => Number(p.split(",")[0]));
  const yArray = setArray.map((p) => Number(p.split(",")[1]));
  const minX = Math.min(...xArray);
  const maxX = Math.max(...xArray);
  const minY = Math.min(...yArray);
  const maxY = Math.max(...yArray);
  return { minX, maxX, minY, maxY };
}

// Get neighbours on all sides, including original position
function getNeighbours(x, y) {
  return [
    { x: x - 1, y: y - 1 },
    { x: x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x, y: y },
    { x: x + 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ];
}

// Print out pixels in array, for debugging
function printSet(set: Set<string>) {
  const minX = Math.min(...Array.from(set).map((p) => Number(p.split(",")[0])));
  const maxX = Math.max(...Array.from(set).map((p) => Number(p.split(",")[0])));
  const minY = Math.min(...Array.from(set).map((p) => Number(p.split(",")[1])));
  const maxY = Math.max(...Array.from(set).map((p) => Number(p.split(",")[1])));
  const array = Array(maxY - minY + 1)
    .fill(null)
    .map(() => Array(maxX - minX + 1).fill("."));
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
        expected: 35,
      },
    ],
    solution: part1,
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
        expected: 3351,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
