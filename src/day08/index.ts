import run from "aocrunner";
import _ from "lodash";
import { isDeepStrictEqual } from "util";
import { permutator } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((row) => row.split(" | ").map((row) => row.split(" ")));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  for (const row of input) {
    count += row[1].filter((row) => [2, 3, 4, 7].includes(row.length)).length;
  }
  return count;
};

const segmentArrangements: string[][] = permutator([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
]);

const numberPositions = [
  [0, 1, 2, 4, 5, 6],
  [2, 5],
  [0, 2, 3, 4, 6],
  [0, 2, 3, 5, 6],
  [1, 2, 3, 5],
  [0, 1, 3, 5, 6],
  [0, 1, 3, 4, 5, 6],
  [0, 2, 5],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 5, 6],
];

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (const [inputPatterns, outputPatterns] of input) {
    // We sort the patterns to make comparison easier
    const sortedInputPatterns = inputPatterns.map((r) =>
      r.split("").sort().join(""),
    );

    // Check each permutation until a valid match is found
    const validArrangement = segmentArrangements.find((arrangement) => {
      // Map each "number" (made of segments) to the transform of the arrangement
      const signalPatterns = numberPositions.map((numberSegments) =>
        numberSegments
          .map((segment) => arrangement[segment])
          .sort()
          .join(""),
      );
      // If the transform matches our input, we have a valid match
      return isDeepStrictEqual(
        sortedInputPatterns.sort(),
        signalPatterns.sort(),
      );
    });

    // Convert output pattern to numbers
    const outputNumbers = outputPatterns.map((pattern) =>
      patternToNumber(pattern, validArrangement),
    );

    // Join output numbers into a single number
    const decodedOutput = Number(outputNumbers.join(""));

    sum += decodedOutput;
  }

  return sum;
};

function patternToNumber(pattern: string, arrangment: string[]): number {
  const indexes = pattern.split("").map((c) => arrangment.indexOf(c));
  const orderedIndexes = indexes.sort((a, b) => a - b);

  return numberPositions.findIndex((value) =>
    isDeepStrictEqual(value, orderedIndexes),
  );
}

run({
  part1: {
    tests: [
      {
        input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`,
        expected: 5353,
      },
      {
        input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`,
        expected: 61229,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
