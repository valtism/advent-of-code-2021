import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const common = getCounts(input);

  const gammastring = common.reduce((acc, curr) => {
    const zeros = curr["0"];
    const ones = curr["1"];
    return zeros > ones ? (acc += "0") : (acc += "1");
  }, "");

  const gamma = parseInt(gammastring, 2);

  const epsilonstring = common.reduce((acc, curr) => {
    const zeros = curr["0"];
    const ones = curr["1"];
    return zeros > ones ? (acc += "1") : (acc += "0");
  }, "");

  const epsilon = parseInt(epsilonstring, 2);

  return gamma * epsilon;
};

function getCounts(list: string[]) {
  const stringLength = list[0].length;
  const counts = Array(stringLength)
    .fill(null)
    .map(() => ({ "0": 0, "1": 0 }));
  list.forEach((line) => {
    for (let i = 0; i < stringLength; i++) {
      const char = line[i];
      counts[i][char]++;
    }
  });
  return counts;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const oxygenRating = getRating(input, (ones, zeros) =>
    ones >= zeros ? "1" : "0",
  );

  const co2Rating = getRating(input, (ones, zeros) =>
    ones < zeros ? "1" : "0",
  );

  return oxygenRating * co2Rating;
};

function getRating(
  input: string[],
  comparison: (ones: number, zeros: number) => string,
) {
  let mutableList = input;
  for (let i = 0; i < input[0].length; i++) {
    const mostOccuring = getOccurance(mutableList, comparison);
    mutableList = mutableList.filter((line) => line[i] === mostOccuring[i]);
    if (mutableList.length === 1) break;
  }

  return parseInt(mutableList[0], 2);
}

function getOccurance(
  list: string[],
  comparison: (ones: number, zeros: number) => string,
) {
  const occurances = getCounts(list);

  return occurances.map((occurance) => {
    const zeros = occurance["0"];
    const ones = occurance["1"];
    return comparison(ones, zeros);
  });
}

run({
  part1: {
    tests: [
      {
        input: `00100
        11110
        10110
        10111
        10101
        01111
        00111
        11100
        10000
        11001
        00010
        01010`,
        expected: 198,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `00100
        11110
        10110
        10111
        10101
        01111
        00111
        11100
        10000
        11001
        00010
        01010`,
        expected: 230,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
