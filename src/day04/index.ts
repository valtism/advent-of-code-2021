import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const toDraw = input[0].split(",").map(Number);
  const boards = input
    .slice(1)
    .map((board) =>
      board.split("\n").map((line) => line.trim().split(/\s+/).map(Number)),
    );

  let drawn: number[] = [];
  let winningBoard = [];
  for (const draw of toDraw) {
    drawn.push(draw);
    winningBoard = boards.filter((board) => checkBoardForWin(board, drawn));
    if (winningBoard.length > 0) break;
  }

  const unmarked = getUnmarked(winningBoard[0], drawn).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  return unmarked * drawn[drawn.length - 1];
};

function checkBoardForWin(board: number[][], drawn: number[]) {
  const rowWin = board.some((row) => row.every((num) => drawn.includes(num)));
  if (rowWin) return true;

  for (let x = 0; x < board.length; x++) {
    let colWin = true;
    for (let y = 0; y < board.length; y++) {
      const num = board[y][x];
      if (!drawn.includes(num)) {
        colWin = false;
        break;
      }
    }
    if (colWin === true) return true;
  }
}

function getUnmarked(board: number[][], drawn: number[]): number[] {
  const unmarked = [];
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board.length; y++) {
      const num = board[y][x];
      if (!drawn.includes(num)) {
        unmarked.push(num);
      }
    }
  }
  return unmarked;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const toDraw = input[0].split(",").map(Number);
  const boards = input
    .slice(1)
    .map((board) =>
      board.split("\n").map((line) => line.trim().split(/\s+/).map(Number)),
    );

  let drawn: number[] = [];
  let unWonBoards = [...boards];
  let lastUnWonBoard: number[][] = null;
  for (const draw of toDraw) {
    drawn.push(draw);
    unWonBoards = boards.filter((board) => !checkBoardForWin(board, drawn));
    if (unWonBoards.length === 1) {
      lastUnWonBoard = unWonBoards[0];
    }
    if (unWonBoards.length === 0) break;
  }

  const unmarked = getUnmarked(lastUnWonBoard, drawn).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  return unmarked * drawn[drawn.length - 1];
};

run({
  part1: {
    tests: [
      {
        input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`,
        expected: 4512,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`,
        expected: 1924,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
