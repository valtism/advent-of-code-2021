import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => Number(line[line.length - 1]));

const part1 = (rawInput: string) => {
  const positions = parseInput(rawInput);
  const scores = [0, 0];

  let die = 0;
  let rolls = 0;

  function roll() {
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      die = (die % 100) + 1;
      rolls++;
      sum += die;
    }
    return sum;
  }

  let turn = 0;
  while (scores.every((score) => score < 1000)) {
    const sum = roll();
    positions[turn] = ((positions[turn] + sum - 1) % 10) + 1;
    scores[turn] += positions[turn];
    turn = turn === 0 ? 1 : 0;
  }

  return rolls * Math.min(...scores);
};

// All possible combinations of 3 rolls of the Dirac dice
const rolls = [
  3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8,
  9,
];

const part2 = (rawInput: string) => {
  const [pos1, pos2] = parseInput(rawInput);

  const initialState = {
    turn: 0,
    players: [
      { position: pos1, score: 0 },
      { position: pos2, score: 0 },
    ],
  };

  const cache = new Map<string, number[]>();
  function recurse(
    roll: number,
    state: {
      turn: number;
      players: { position: number; score: number }[];
    },
  ) {
    const player = state.players[state.turn];
    player.position = ((player.position + roll - 1) % 10) + 1;
    player.score += player.position;

    // End case
    if (player.score >= 21) {
      return [state.turn ^ 1, state.turn];
    }

    state.turn = state.turn ^ 1;
    roll = 0;

    // Check cache
    const stringState = JSON.stringify(state);
    if (cache.has(stringState)) {
      return cache.get(stringState);
    }

    // Recurse for all rolls and add up
    const result = rolls.reduce(
      (res, nextRoll) => sumResults(res, recurse(nextRoll, _.cloneDeep(state))),
      [0, 0],
    );
    cache.set(stringState, result);
    return result;
  }

  const totalWins = rolls.reduce(
    (res, nextRoll) =>
      sumResults(res, recurse(nextRoll, _.cloneDeep(initialState))),
    [0, 0],
  );

  return Math.max(...totalWins);
};

function sumResults(array1, array2) {
  return [array1[0] + array2[0], array1[1] + array2[1]];
}

run({
  part1: {
    tests: [
      {
        input: `Player 1 starting position: 4
Player 2 starting position: 8`,
        expected: 739785,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Player 1 starting position: 4
Player 2 starting position: 8`,
        expected: 444356092776315,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
