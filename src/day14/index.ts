import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => {
  const [start, rawInstructions] = rawInput.split("\n\n");
  const instructions = new Map();
  rawInstructions.split("\n").forEach((line) => {
    const [pair, insert] = line.trim().split(" -> ");
    instructions.set(pair, insert);
  });
  return { start, instructions };
};

const part1 = (rawInput: string) => {
  const { start, instructions } = parseInput(rawInput);

  let polymerTemplate = start;
  for (let loop = 0; loop < 10; loop++) {
    for (let i = 0; i < polymerTemplate.length - 1; i++) {
      const section = polymerTemplate.slice(i, i + 2);
      const instruction = instructions.get(section);
      polymerTemplate =
        polymerTemplate.slice(0, i + 1) +
        instruction +
        polymerTemplate.slice(i + 1);
      i++;
    }
  }
  const groups = _.groupBy(polymerTemplate, (c) => c);
  let min = Infinity;
  let max = -Infinity;
  for (const letterArray of Object.values(groups)) {
    if (letterArray.length > max) {
      max = letterArray.length;
    } else if (letterArray.length < min) {
      min = letterArray.length;
    }
  }
  return max - min;
};

const part2 = (rawInput: string) => {
  const { start, instructions } = parseInput(rawInput);

  // We have a toCommit as well as a committed so we can apply all
  // changes at once at the end of the loop, rather than as we go.
  const counts = new Map<string, { toCommit: number; committed: number }>();
  for (const key of instructions.keys()) {
    counts.set(key, { toCommit: 0, committed: 0 });
  }

  for (let i = 0; i < start.length - 1; i++) {
    const section = start.slice(i, i + 2);
    const { committed } = counts.get(section);
    counts.set(section, { toCommit: 0, committed: committed + 1 });
  }

  for (let loop = 0; loop < 40; loop++) {
    counts.forEach((value, key) => {
      const insert = instructions.get(key);
      const [left, right] = key.split("");
      const leftSubstr = `${left}${insert}`;
      const rightSubstr = `${insert}${right}`;
      const leftCount = counts.get(leftSubstr);
      const rightCount = counts.get(rightSubstr);
      counts.set(leftSubstr, {
        ...leftCount,
        toCommit: leftCount.toCommit + value.committed,
      });
      counts.set(rightSubstr, {
        ...rightCount,
        toCommit: rightCount.toCommit + value.committed,
      });
    });
    counts.forEach((value, key) => {
      counts.set(key, { toCommit: 0, committed: value.toCommit });
    });
  }

  const letterCounts = {};
  counts.forEach((value, key) => {
    const [left, right] = key.split("");
    letterCounts[left] = (letterCounts[left] || 0) + value.committed / 2;
    letterCounts[right] = (letterCounts[right] || 0) + value.committed / 2;
  });
  // Add one on the ends, which will still be the bookmark letters from the original input.
  letterCounts[start[0]] = letterCounts[start[0]] || 0 + 1;
  letterCounts[start[start.length - 1]] =
    letterCounts[start[start.length - 1]] || 0 + 1;

  let min = Infinity;
  let max = -Infinity;
  for (const value of Object.values(letterCounts)) {
    if (value > max) {
      max = Number(value);
    }
    if (value < min) {
      min = Number(value);
    }
  }

  return Math.round(max) - Math.round(min);
};

run({
  part1: {
    tests: [
      {
        input: `NNCB

      CH -> B
      HH -> N
      CB -> H
      NH -> C
      HB -> C
      HC -> B
      HN -> C
      NN -> C
      BH -> H
      NC -> B
      NB -> B
      BN -> B
      BB -> N
      BC -> B
      CC -> N
      CN -> C`,
        expected: 1588,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `NNCB

      CH -> B
      HH -> N
      CB -> H
      NH -> C
      HB -> C
      HC -> B
      HN -> C
      NN -> C
      BH -> H
      NC -> B
      NB -> B
      BN -> B
      BB -> N
      BC -> B
      CC -> N
      CN -> C`,
        expected: 2188189693529,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
