import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => {
    const [start, end] = row.split(" -> ");
    const [x1, y1] = start.split(",").map(Number);
    const [x2, y2] = end.split(",").map(Number);
    return {
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
    };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const horOrVert = input.filter(
    (row) => row.start.x === row.end.x || row.start.y === row.end.y,
  );

  const lines = horOrVert.flatMap((row) => {
    if (row.start.x === row.end.x) {
      const yDiff = Math.abs(row.end.y - row.start.y);
      if (row.start.y < row.end.y) {
        return Array(yDiff + 1)
          .fill(null)
          .map((_, i) => {
            return { x: row.start.x, y: row.start.y + i };
          });
      } else {
        return Array(yDiff + 1)
          .fill(null)
          .map((_, i) => {
            return { x: row.start.x, y: row.end.y + i };
          });
      }
    } else if (row.start.y === row.end.y) {
      const xDiff = Math.abs(row.end.x - row.start.x);
      if (row.start.x < row.end.x) {
        return Array(xDiff + 1)
          .fill(null)
          .map((_, i) => {
            return { x: row.start.x + i, y: row.start.y };
          });
      } else {
        return Array(xDiff + 1)
          .fill(null)
          .map((_, i) => {
            return { x: row.end.x + i, y: row.start.y };
          });
      }
    }
  });

  const map = new Map();

  lines.forEach((line) => {
    const coords = `${line.x},${line.y}`;
    if (map.has(coords)) {
      const value = map.get(coords);
      map.set(coords, value + 1);
    } else {
      map.set(coords, 1);
    }
  });

  let atLeastTwo = 0;
  map.forEach((value) => {
    if (value >= 2) {
      atLeastTwo++;
    }
  });

  return atLeastTwo;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const coordinates: Record<string, number> = {};
  input.forEach(({ start, end }) => {
    const diff = Math.abs(end.x - start.x || end.y - start.y);
    const xSign = end.x === start.x ? 0 : end.x > start.x ? 1 : -1;
    const ySign = end.y === start.y ? 0 : end.y > start.y ? 1 : -1;

    return Array(Math.abs(diff) + 1)
      .fill(null)
      .forEach((_, i) => {
        const x = start.x + i * xSign;
        const y = start.y + i * ySign;
        const coords = `${x},${y}`;
        coordinates[coords] = coordinates[coords] + 1 || 1;
      });
  });

  return Object.values(coordinates).filter((value) => value >= 2).length;
};

run({
  part1: {
    tests: [
      {
        input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
