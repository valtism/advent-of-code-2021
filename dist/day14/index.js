var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import run from "aocrunner";
import _ from "lodash";
const parseInput = (rawInput) => {
  const [start, rawInstructions] = rawInput.split("\n\n");
  const instructions = new Map();
  rawInstructions.split("\n").forEach((line) => {
    const [pair, insert] = line.trim().split(" -> ");
    instructions.set(pair, insert);
  });
  return { start, instructions };
};
const part1 = (rawInput) => {
  const { start, instructions } = parseInput(rawInput);
  let polymerTemplate = start;
  for (let loop = 0; loop < 10; loop++) {
    for (let i = 0; i < polymerTemplate.length - 1; i++) {
      const section = polymerTemplate.slice(i, i + 2);
      const instruction = instructions.get(section);
      polymerTemplate = polymerTemplate.slice(0, i + 1) + instruction + polymerTemplate.slice(i + 1);
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
const part2 = (rawInput) => {
  const { start, instructions } = parseInput(rawInput);
  const counts = new Map();
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
      counts.set(leftSubstr, __spreadProps(__spreadValues({}, leftCount), {
        toCommit: leftCount.toCommit + value.committed
      }));
      counts.set(rightSubstr, __spreadProps(__spreadValues({}, rightCount), {
        toCommit: rightCount.toCommit + value.committed
      }));
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
  letterCounts[start[0]] = letterCounts[start[0]] || 0 + 1;
  letterCounts[start[start.length - 1]] = letterCounts[start[start.length - 1]] || 0 + 1;
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
        expected: 1588
      }
    ],
    solution: part1
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
        expected: 2188189693529
      }
    ],
    solution: part2
  },
  trimTestInputs: true
});
//# sourceMappingURL=index.js.map
