import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").flatMap((line) => {
    const [start, end] = line.trim().split("-");
    const [start2, end2] = line.trim().split("-").reverse();
    return [
      { start, end },
      { start: start2, end: end2 },
    ];
  });

const isUpperCase = (string: string) => /^[A-Z]*$/.test(string);

const part1 = (rawInput: string) => {
  const connections = parseInput(rawInput);

  const paths: string[][] = [];
  function recurse(visited: string[], cave: string) {
    if (cave === "end") {
      paths.push([...visited, "end"]);
      return;
    }
    if (
      (visited.length > 0 && cave === "start") ||
      (!isUpperCase(cave) && visited.includes(cave))
    ) {
      return;
    } else {
      connections
        .filter((line) => line.start === cave)
        .forEach((connection) => {
          recurse([...visited, cave], connection.end);
        });
    }
  }
  recurse([], "start");

  return paths.length;
};

const part2 = (rawInput: string) => {
  const connections = parseInput(rawInput);

  const paths: string[][] = [];
  function recurse(visited: string[], cave: string, hasVisitedTwice: boolean) {
    if (cave === "end") {
      paths.push([...visited, "end"]);
      return;
    }
    const secondVisit = !isUpperCase(cave) && visited.includes(cave);
    if (
      (visited.length > 0 && cave === "start") ||
      (hasVisitedTwice && secondVisit)
    ) {
      return;
    } else {
      connections
        .filter((line) => line.start === cave)
        .forEach((connection) => {
          recurse(
            [...visited, cave],
            connection.end,
            hasVisitedTwice || secondVisit,
          );
        });
    }
  }
  recurse([], "start", false);

  return paths.length;
};

run({
  part1: {
    tests: [
      {
        input: `start-A
      start-b
      A-c
      A-b
      b-d
      A-end
      b-end`,
        expected: 10,
      },
      {
        input: `dc-end
        HN-start
        start-kj
        dc-start
        dc-HN
        LN-dc
        HN-end
        kj-sa
        kj-HN
        kj-dc`,
        expected: 19,
      },
      {
        input: `fs-end
        he-DX
        fs-he
        start-DX
        pj-DX
        end-zg
        zg-sl
        zg-pj
        pj-he
        RW-he
        fs-DX
        pj-RW
        zg-RW
        start-pj
        he-WI
        zg-he
        pj-fs
        start-RW`,
        expected: 226,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `start-A
      start-b
      A-c
      A-b
      b-d
      A-end
      b-end`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
