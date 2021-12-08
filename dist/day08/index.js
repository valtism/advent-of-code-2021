import run from "aocrunner";
import { isDeepStrictEqual } from "util";
import { permutator } from "../utils/index.js";
const parseInput = (rawInput) => rawInput.split("\n").map((row) => row.split(" | ").map((row2) => row2.split(" ")));
const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let count = 0;
  for (const row of input) {
    count += row[1].filter((row2) => [2, 3, 4, 7].includes(row2.length)).length;
  }
  return count;
};
const segmentArrangements = permutator([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g"
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
  [0, 1, 2, 3, 5, 6]
];
const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let sum = 0;
  for (const [inputPatterns, outputPatterns] of input) {
    const sortedInputPatterns = inputPatterns.map((r) => r.split("").sort().join(""));
    const validArrangement = segmentArrangements.find((arrangement) => {
      const signalPatterns = numberPositions.map((numberSegments) => numberSegments.map((segment) => arrangement[segment]).sort().join(""));
      return isDeepStrictEqual(sortedInputPatterns.sort(), signalPatterns.sort());
    });
    const outputNumbers = outputPatterns.map((pattern) => patternToNumber(pattern, validArrangement));
    const decodedOutput = Number(outputNumbers.join(""));
    sum += decodedOutput;
  }
  return sum;
};
function patternToNumber(pattern, arrangment) {
  const indexes = pattern.split("").map((c) => arrangment.indexOf(c));
  const orderedIndexes = indexes.sort((a, b) => a - b);
  return numberPositions.findIndex((value) => isDeepStrictEqual(value, orderedIndexes));
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
        expected: 26
      }
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`,
        expected: 5353
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
        expected: 61229
      }
    ],
    solution: part2
  },
  trimTestInputs: true
});
//# sourceMappingURL=index.js.map
