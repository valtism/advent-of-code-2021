import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const rows = input.split("\n").map((x) => {
    const elements = x.split(" ");
    return { instruction: elements[0], value: Number(elements[1]) };
  });

  const forwards = rows
    .filter((x) => x.instruction === "forward")
    .reduce((acc, curr) => acc + curr.value, 0);
  const up = rows
    .filter((x) => x.instruction === "up")
    .reduce((acc, curr) => acc + curr.value, 0);
  const down = rows
    .filter((x) => x.instruction === "down")
    .reduce((acc, curr) => acc + curr.value, 0);

  return forwards * (down - up);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const rows = input.split("\n").map((x) => {
    const elements = x.split(" ");
    return { instruction: elements[0], value: Number(elements[1]) };
  });

  let aim = 0;
  let depth = 0;
  let position = 0;
  for (const row of rows) {
    switch (row.instruction) {
      case "down":
        aim += row.value;
        break;
      case "up":
        aim -= row.value;
        break;
      case "forward":
        position += row.value;
        depth += aim * row.value;
        break;
      default:
        break;
    }
  }

  return depth * position;
};

run({
  part1: {
    tests: [
      {
        input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`,
        expected: 900,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
