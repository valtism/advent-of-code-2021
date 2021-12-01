import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let deeper = 0;
  let lastDepth = Infinity;
  for (const depth of input.split("\n").map(Number)) {
    if (depth > lastDepth) {
      deeper++;
    }
    lastDepth = depth;
  }
  return deeper;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const depths = input.split("\n").map(Number);
  let deeper = 0;
  let lastSum = Infinity;
  for (let i = 2; i < depths.length; i++) {
    const sum = depths[i] + (depths[i - 1] || 0) + (depths[i - 2] || 0);
    if (sum > lastSum) {
      deeper++;
    }
    lastSum = sum;
  }

  return deeper;
};

run({
  part1: {
    tests: [
      {
        input: `199
      200
      208
      210
      200
      207
      240
      269
      260
      263`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `199
      200
      208
      210
      200
      207
      240
      269
      260
      263`,
        expected: 5,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
