import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput.split(",").map(Number);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const min = Math.min(...input);
  const max = Math.max(...input);
  let minFuel = Infinity;
  for (let i = min; i < max; i++) {
    const fuel = input.reduce((acc, curr) => acc + Math.abs(curr - i), 0);
    if (fuel < minFuel) {
      minFuel = fuel;
    }
  }

  return minFuel;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const min = Math.min(...input);
  const max = Math.max(...input);
  let minFuel = Infinity;
  for (let i = min; i < max; i++) {
    const fuel = input.reduce((acc, curr) => {
      const diff = Math.abs(curr - i);
      return acc + (diff * (diff + 1)) / 2;
    }, 0);
    if (fuel < minFuel) {
      minFuel = fuel;
    }
  }
  return minFuel;
};

run({
  part1: {
    tests: [{ input: `16,1,2,0,4,2,7,1,2,14`, expected: 37 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: `16,1,2,0,4,2,7,1,2,14`, expected: 168 }],
    solution: part2,
  },
  trimTestInputs: true,
});
