import run from "aocrunner";
import _ from "lodash";
const parseInput = (rawInput) => rawInput.split("\n").map((line) => eval(line));
const part1 = (rawInput2) => {
  const input = parseInput(rawInput2);
  input[0] = reduce(input[0]);
  const res = input.reduce((acc, curr) => {
    return reduce([acc, curr]);
  });
  function magnitude(pair) {
    if (typeof pair === "number") {
      return pair;
    }
    return magnitude(pair[0]) * 3 + magnitude(pair[1]) * 2;
  }
  return magnitude(res);
};
function reduce(snailNumber) {
  let runType = "Explode";
  let noSplit = false;
  while (!(runType === "Split" && noSplit === true)) {
    let recurse = function(pair) {
      if (noSplit === false)
        return pair;
      depth++;
      if (depth === 5) {
        const leftRef = getToLeft(snailNumber, pair);
        const rightRef = getToRight(snailNumber, pair);
        if (leftRef) {
          leftRef.pair[leftRef.index] += pair[0];
        }
        if (rightRef) {
          rightRef.pair[rightRef.index] += pair[1];
        }
        depth--;
        return 0;
      }
      if (Array.isArray(pair[0])) {
        const res = recurse(pair[0]);
        pair[0] = res;
        if (noSplit === false) {
          return pair;
        }
      }
      if (typeof pair[0] === "number" && pair[0] > 9 && runType === "Split") {
        noSplit = false;
        depth--;
        pair[0] = [Math.floor(pair[0] / 2), Math.ceil(pair[0] / 2)];
        return pair;
      }
      if (Array.isArray(pair[1])) {
        const res = recurse(pair[1]);
        pair[1] = res;
        if (noSplit === false) {
          return pair;
        }
      }
      if (typeof pair[1] === "number" && pair[1] > 9 && runType === "Split") {
        noSplit = false;
        depth--;
        pair[1] = [Math.floor(pair[1] / 2), Math.ceil(pair[1] / 2)];
        return pair;
      }
      depth--;
      return pair;
    };
    let depth = 0;
    noSplit = true;
    recurse(snailNumber);
    if (runType === "Explode") {
      runType = "Split";
      noSplit = false;
    } else if (runType === "Split") {
      if (noSplit === false) {
        runType = "Explode";
      }
    }
  }
  return snailNumber;
}
function getToLeft(input, ref) {
  let toLeft = null;
  let found = false;
  function recurse(pair) {
    if (pair === ref) {
      found = true;
      return;
    }
    if (typeof pair[0] === "number") {
      if (!found) {
        toLeft = { pair, index: 0 };
      }
    } else {
      recurse(pair[0]);
    }
    if (typeof pair[1] === "number") {
      if (!found) {
        toLeft = { pair, index: 1 };
      }
    } else {
      recurse(pair[1]);
    }
  }
  recurse(input);
  return toLeft;
}
function getToRight(input, ref) {
  let toRight = null;
  let passedRef = false;
  function recurse(pair) {
    if (typeof pair[0] === "number") {
      if (passedRef) {
        if (toRight === null) {
          toRight = { pair, index: 0 };
        }
        return;
      }
    } else {
      recurse(pair[0]);
    }
    if (typeof pair[1] === "number") {
      if (passedRef) {
        if (toRight === null) {
          toRight = { pair, index: 1 };
        }
        return;
      }
    } else {
      recurse(pair[1]);
    }
    if (pair === ref) {
      passedRef = true;
    }
  }
  recurse(input);
  return toRight;
}
const part2 = (rawInput2) => {
  const input = parseInput(rawInput2);
  let pairs = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (i === j) {
        continue;
      }
      pairs.push(reduce([_.cloneDeep(input[i]), _.cloneDeep(input[j])]));
    }
  }
  function magnitude(pair) {
    if (typeof pair === "number") {
      return pair;
    }
    return magnitude(pair[0]) * 3 + magnitude(pair[1]) * 2;
  }
  return pairs.map(magnitude).sort((a, b) => b - a)[0];
};
run({
  part1: {
    tests: [
      { input: `[[1,2],[[3,4],5]]`, expected: 143 },
      { input: `[[[[0,7],4],[[7,8],[6,0]]],[8,1]]`, expected: 1384 },
      { input: `[[[[1,1],[2,2]],[3,3]],[4,4]]`, expected: 445 },
      { input: `[[[[3,0],[5,3]],[4,4]],[5,5]]`, expected: 791 },
      { input: `[[[[5,0],[7,4]],[5,5]],[6,6]]`, expected: 1137 },
      {
        input: `[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]`,
        expected: 3488
      },
      {
        input: `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
        [[[5,[2,8]],4],[5,[[9,9],0]]]
        [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
        [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
        [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
        [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
        [[[[5,4],[7,7]],8],[[8,3],8]]
        [[9,3],[[9,9],[6,[4,9]]]]
        [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
        [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`,
        expected: 4140
      }
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
      [[[5,[2,8]],4],[5,[[9,9],0]]]
      [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
      [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
      [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
      [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
      [[[[5,4],[7,7]],8],[[8,3],8]]
      [[9,3],[[9,9],[6,[4,9]]]]
      [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
      [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`,
        expected: 3993
      }
    ],
    solution: part2
  },
  trimTestInputs: true
});
//# sourceMappingURL=index.js.map
