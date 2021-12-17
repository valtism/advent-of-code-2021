import run from "aocrunner";
const parseInput = (rawInput) => rawInput.slice(13).split(", ").map((s) => s.slice(2).split("..").map(Number));
const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const xMin = input[0][0];
  const xMax = input[0][1];
  const yMin = input[1][0];
  const yMax = input[1][1];
  const trajectories = [];
  for (let y0 = 0; y0 < 200; y0++) {
    for (let x0 = 0; x0 < 500; x0++) {
      const hit = stepTrajectory(x0, y0);
      if (hit !== -1) {
        trajectories.push(hit);
      }
    }
  }
  function stepTrajectory(x0, y0) {
    let xv = x0;
    let yv = y0;
    let x = 0;
    let y = 0;
    let highest = -Infinity;
    while (x < xMax && y > yMin) {
      x += xv;
      y += yv;
      xv = Math.max(0, xv - 1);
      yv -= 1;
      if (y > highest) {
        highest = y;
      }
      if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
        return highest;
      }
    }
    return -1;
  }
  return trajectories.reduce((a, b) => a > b ? a : b);
};
const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const xMin = input[0][0];
  const xMax = input[0][1];
  const yMin = input[1][0];
  const yMax = input[1][1];
  const trajectories = [];
  let tooFar = false;
  for (let y0 = -100; y0 < 100; y0++) {
    tooFar = false;
    for (let x0 = 0; x0 < 500; x0++) {
      const hit = stepTrajectory(x0, y0);
      if (hit) {
        trajectories.push(hit);
      }
    }
  }
  function stepTrajectory(x0, y0) {
    let xv = x0;
    let yv = y0;
    let x = 0;
    let y = 0;
    while (x < xMax && y > yMin && !tooFar) {
      x += xv;
      y += yv;
      xv = Math.max(0, xv - 1);
      yv -= 1;
      if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
        return `${x},${y}`;
      }
    }
    return false;
  }
  return trajectories.length;
};
run({
  part1: {
    tests: [{ input: `target area: x=20..30, y=-10..-5`, expected: 45 }],
    solution: part1
  },
  part2: {
    tests: [{ input: `target area: x=20..30, y=-10..-5`, expected: 112 }],
    solution: part2
  },
  trimTestInputs: true
});
//# sourceMappingURL=index.js.map
