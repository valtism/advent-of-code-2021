import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim().split(""));

const matchingChar = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
};

const openChars = ["(", "[", "{", "<"];

const illegalCharPoints = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const autoCompletePoints = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const scores = input.map((row) => {
    let opens: string[] = [];
    for (const char of row) {
      if (openChars.includes(char)) {
        opens.push(char);
      } else {
        const lastOpen = opens.pop();
        if (lastOpen !== matchingChar[char]) {
          return illegalCharPoints[char];
        }
      }
    }
    return 0;
  });

  return scores.reduce((acc, curr) => acc + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const missingChars = input
    .map((row) => {
      let opens: string[] = [];
      for (const char of row) {
        if (openChars.includes(char)) {
          opens.push(char);
        } else {
          const lastOpen = opens.pop();
          if (lastOpen !== matchingChar[char]) {
            return null;
          }
        }
      }
      const missingChars: string[] = opens
        .reverse()
        .map((o) => matchingChar[o]);
      return missingChars;
    })
    .filter(Boolean);

  const score = missingChars
    .map((s) => s.reduce((acc, curr) => acc * 5 + autoCompletePoints[curr], 0))
    .sort((a, b) => a - b);

  const middleIndex = Math.floor(score.length / 2);

  return score[middleIndex];
};

run({
  part1: {
    tests: [
      {
        input: `[({(<(())[]>[[{[]{<()<>>
        [(()[<>])]({[<{<<[]>>(
        {([(<{}[<>[]}>{[]{[(<()>
        (((({<>}<{<{<>}{[]{[]{}
        [[<[([]))<([[{}[[()]]]
        [{[{({}]{}}([{[{{{}}([]
        {<[[]]>}<{[{[{[]{()[[[]
        [<(<(<(<{}))><([]([]()
        <{([([[(<>()){}]>(<<{{
        <{([{{}}[<[[[<>{}]]]>[]]`,
        expected: 26397,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `[({(<(())[]>[[{[]{<()<>>
        [(()[<>])]({[<{<<[]>>(
        {([(<{}[<>[]}>{[]{[(<()>
        (((({<>}<{<{<>}{[]{[]{}
        [[<[([]))<([[{}[[()]]]
        [{[{({}]{}}([{[{{{}}([]
        {<[[]]>}<{[{[{[]{()[[[]
        [<(<(<(<{}))><([]([]()
        <{([([[(<>()){}]>(<<{{
        <{([{{}}[<[[[<>{}]]]>[]]`,
        expected: 288957,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
