import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput.split(",").map(Number);

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);

  for (let i = 0; i < 80; i++) {
    const births = input.filter((x) => x === 0).length;
    const newFish = Array(births).fill(8);
    input = input.map((x) => (x === 0 ? 6 : x - 1)).concat(newFish);
  }

  return input.length;
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);
  const counts = _.countBy(input);

  Array(256)
    .fill(null)
    .forEach(() => {
      const births = counts[0] || 0;
      for (let i = 0; i < 9; i++) {
        switch (i) {
          case 8:
            counts[i] = births;
            break;
          case 6:
            counts[i] = counts[i + 1] || 0;
            counts[i] += births || 0;
            break;
          default:
            counts[i] = counts[i + 1] || 0;

            break;
        }
      }
    });

  return Object.values(counts).reduce((acc, curr) => acc + curr);
};

run({
  part1: {
    tests: [{ input: `3,4,3,1,2`, expected: 5934 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: `3,4,3,1,2`, expected: 26984457539 }],
    solution: part2,
  },
  trimTestInputs: true,
});
