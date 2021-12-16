import run from "aocrunner";
const parseInput = (rawInput) => rawInput.split("").map(hex2bin).join("");
function hex2bin(string) {
  return string.split("").map((i) => parseInt(i, 16).toString(2).padStart(4, "0")).join("");
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let index = 0;
  let versionNumbers = [];
  function parsePacket(packet) {
    const version = parseInt(packet.slice(index, index += 3), 2);
    versionNumbers.push(version);
    const typeId = parseInt(packet.slice(index, index += 3), 2);
    if (typeId === 4) {
      let last = false;
      let literals = [];
      while (!last) {
        if (packet[index++] === "0") {
          last = true;
        }
        const literal = packet.slice(index, index += 4).padEnd(4, "0");
        literals.push(literal);
        if (last) {
          break;
        }
      }
      return;
    }
    const lengthTypeId = packet[index++];
    const endOfLength = lengthTypeId === "0" ? 15 : 11;
    const length = parseInt(packet.slice(index, index += endOfLength), 2);
    if (lengthTypeId === "0") {
      const end = index + length;
      while (index < end) {
        parsePacket(packet);
      }
    } else if (lengthTypeId === "1") {
      for (let i = 0; i < length; i++) {
        parsePacket(packet);
      }
    }
  }
  parsePacket(input);
  return versionNumbers.reduce((acc, curr) => acc + curr, 0);
};
const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let index = 0;
  function parsePacket(packet) {
    const version = parseInt(packet.slice(index, index += 3), 2);
    const typeId = parseInt(packet.slice(index, index += 3), 2);
    if (typeId === 4) {
      let last = false;
      let literals = [];
      while (!last) {
        if (packet[index++] === "0") {
          last = true;
        }
        const literal = packet.slice(index, index += 4).padEnd(4, "0");
        literals.push(literal);
        if (last) {
          return parseInt(literals.join(""), 2);
        }
      }
    }
    const lengthTypeId = packet[index++];
    const endOfLength = lengthTypeId === "0" ? 15 : 11;
    const length = parseInt(packet.slice(index, index += endOfLength), 2);
    const subPacketResults = [];
    if (lengthTypeId === "0") {
      const end = index + length;
      while (index < end) {
        subPacketResults.push(parsePacket(packet));
      }
    } else if (lengthTypeId === "1") {
      for (let i = 0; i < length; i++) {
        subPacketResults.push(parsePacket(packet));
      }
    }
    return subPacketResults.reduce(operations[typeId]);
  }
  return parsePacket(input);
};
const operations = {
  0: (acc, curr) => acc + curr,
  1: (acc, curr) => acc * curr,
  2: (acc, curr) => Math.min(acc, curr),
  3: (acc, curr) => Math.max(acc, curr),
  5: (acc, curr) => acc > curr ? 1 : 0,
  6: (acc, curr) => acc < curr ? 1 : 0,
  7: (acc, curr) => acc === curr ? 1 : 0
};
run({
  part1: {
    tests: [
      { input: `8A004A801A8002F478`, expected: 16 },
      { input: `620080001611562C8802118E34`, expected: 12 },
      { input: `C0015000016115A2E0802F182340`, expected: 23 },
      { input: `A0016C880162017C3686B18A3D4780`, expected: 31 }
    ],
    solution: part1
  },
  part2: {
    tests: [
      { input: `C200B40A82`, expected: 3 },
      { input: `04005AC33890`, expected: 54 },
      { input: `880086C3E88112`, expected: 7 },
      { input: `CE00C43D881120`, expected: 9 },
      { input: `D8005AC2A8F0`, expected: 1 },
      { input: `F600BC2D8F`, expected: 0 },
      { input: `9C005AC2F8F0`, expected: 0 },
      { input: `9C0141080250320F1802104A08`, expected: 1 }
    ],
    solution: part2
  },
  trimTestInputs: true
});
//# sourceMappingURL=index.js.map
