import run from "aocrunner";
import _ from "lodash";

type Coord = [number, number, number];

type Match = { to: Coord; from: Coord };

type Scanner = {
  id: string;
  beacons: BeaconDistances[];
};

type BeaconDistances = {
  value: Coord;
  relativeDistances: RelativeDistance[];
};

type RelativeDistance = {
  value: Coord;
  distance: Coord;
};

type Transform = (coord: Coord) => Coord;

const parseInput = (rawInput: string) =>
  rawInput.split("\n\n").map((scannerRaw) => {
    const lines = scannerRaw.split("\n");
    const id = lines[0].match(/\d+/)[0];
    const beacons = lines
      .slice(1)
      .map((line) => line.trim().split(",").map(Number) as Coord);

    const beaconsWithRelativeDistances = beacons.map((beacon) => {
      const relativeDistances = beacons.map((otherBeacon) => {
        // Relative distance, absolute and sorted to make comparison easier
        const distance = subtract(beacon, otherBeacon)
          .map(Math.abs)
          .sort() as Coord;
        return { value: otherBeacon, distance };
      });
      return { value: beacon, relativeDistances };
    });
    return { id, beacons: beaconsWithRelativeDistances };
  });

const part1 = (rawInput: string) => {
  const scanners = parseInput(rawInput);
  const transforms = getTransforms(scanners);
  const allPoints = getAllPoints(scanners, transforms);

  return allPoints.size;
};

function getTransforms(scanners: Scanner[]) {
  const transforms = {};
  for (const scanner1 of scanners) {
    for (const scanner2 of scanners) {
      if (scanner1.id === scanner2.id) continue;
      const transform = matchScanners(scanner1, scanner2);
      if (transform) {
        transforms[scanner1.id] = {
          ...transforms[scanner1.id],
          [scanner2.id]: transform,
        };
      }
    }
  }
  return transforms;
}

function matchScanners(scanner1: Scanner, scanner2: Scanner) {
  for (const beacon1 of scanner1.beacons) {
    for (const beacon2 of scanner2.beacons) {
      const transform = getBeaconTransform(beacon1, beacon2);
      if (transform) {
        return transform;
      }
    }
  }
  return null;
}

function getBeaconTransform(
  beacon1: BeaconDistances,
  beacon2: BeaconDistances,
) {
  const distanceMatches = getDistanceMatches(
    beacon1.relativeDistances,
    beacon2.relativeDistances,
  );
  if (distanceMatches.length < 12) return null;
  return getTransformFromMatches(distanceMatches);
}

function getDistanceMatches(
  list1: RelativeDistance[],
  list2: RelativeDistance[],
): Match[] {
  let distanceMatches: { to: Coord; from: Coord }[] = [];
  for (const { value: value1, distance: distance1 } of list1) {
    for (const { value: value2, distance: distance2 } of list2) {
      if (isEqual(distance1, distance2)) {
        distanceMatches.push({ to: value1, from: value2 });
      }
    }
  }
  return distanceMatches;
}

function getTransformFromMatches(distanceMatches: Match[]) {
  for (const rotate of rotations2) {
    const diff = subtract(
      distanceMatches[0].to,
      rotate(distanceMatches[0].from),
    );
    const fits = distanceMatches.every((match) =>
      isEqual(match.to, add(rotate(match.from), diff)),
    );
    if (fits) {
      return (coord) => add(rotate(coord), diff);
    }
  }
  throw new Error("No rotation found");
}

function getAllPoints(scanners: Scanner[], transforms) {
  const vistied = new Set<string>();
  const allPoints = new Set<string>();

  function recurse(id: string, transform) {
    if (vistied.has(id)) return;
    vistied.add(id);
    scanners[Number(id)].beacons.forEach(({ value }) => {
      allPoints.add(transform(value).join(","));
    });
    for (const toId in transforms[id]) {
      const innerTransform = transforms[id][toId];
      recurse(toId, (coord) => transform(innerTransform(coord)));
    }
  }
  recurse("0", (e) => e);
  return allPoints;
}

// Coordinate functions

function isEqual(coord1: Coord, coord2: Coord) {
  return (
    coord1[0] === coord2[0] &&
    coord1[1] === coord2[1] &&
    coord1[2] === coord2[2]
  );
}

function subtract(coord: Coord, sub: Coord): Coord {
  return [coord[0] - sub[0], coord[1] - sub[1], coord[2] - sub[2]];
}

function add(coord1: Coord, coord2: Coord): Coord {
  return [coord1[0] + coord2[0], coord1[1] + coord2[1], coord1[2] + coord2[2]];
}

function identity(coord: Coord) {
  return coord;
}

// This didn't work for some reason. Must have something wrong
const rotations: ((coord: Coord) => Coord)[] = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [x, -y, z],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, y, -z],
  ([x, y, z]) => [-x, y, z],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-x, -y, -z],
  ([x, y, z]) => [-x, y, -z],

  ([x, y, z]) => [y, x, z],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [y, -x, -z],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [-y, -x, z],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [-y, x, -z],

  ([x, y, z]) => [z, y, x],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [z, -y, -x],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-z, -y, x],
  ([x, y, z]) => [-z, -y, -x],
  ([x, y, z]) => [-z, y, -x],
];

// All rotations, including invalid ones. Seems to work
const rotations2: ((coord: Coord) => Coord)[] = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [x, z, y],
  ([x, y, z]) => [y, x, z],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [z, y, x],

  ([x, y, z]) => [-x, y, z],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [y, z, -x],
  ([x, y, z]) => [z, -x, y],
  ([x, y, z]) => [z, y, -x],

  ([x, y, z]) => [x, -y, z],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [-y, z, x],
  ([x, y, z]) => [z, x, -y],
  ([x, y, z]) => [z, -y, x],

  ([x, y, z]) => [x, y, -z],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [y, -z, x],
  ([x, y, z]) => [-z, x, y],
  ([x, y, z]) => [-z, y, x],

  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-x, z, -y],
  ([x, y, z]) => [-y, -x, z],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [z, -y, -x],

  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-x, -z, y],
  ([x, y, z]) => [y, -x, -z],
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [-z, y, -x],

  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, -z, -y],
  ([x, y, z]) => [-y, x, -z],
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-z, -y, x],

  ([x, y, z]) => [-x, -y, -z],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [-y, -z, -x],
  ([x, y, z]) => [-z, -x, -y],
  ([x, y, z]) => [-z, -y, -x],
];

const part2 = (rawInput: string) => {
  const scanners = parseInput(rawInput);

  const transforms = getTransforms(scanners);
  const sensors = getTransformedSensorPositions(transforms);
  const maxDistance = getMaxDistance(sensors);

  return maxDistance;
};

function getTransformedSensorPositions(transforms) {
  const visited = new Set<string>();
  const sensors: Coord[] = [];
  function recurse(id: string, transform: Transform) {
    if (visited.has(id)) return;
    visited.add(id);
    sensors.push(transform([0, 0, 0]));
    for (const toId in transforms[id]) {
      const innerTransform = transforms[id][toId];
      recurse(toId, (coord) => transform(innerTransform(coord)));
    }
  }
  recurse("0", identity);
  return sensors;
}

function getMaxDistance(sensors: Coord[]) {
  let maxDistance = -Infinity;
  for (const point1 of sensors) {
    for (const point2 of sensors) {
      if (point1 === point2) continue;
      const manhattanDistance = getManhattanDistance(point1, point2);
      if (manhattanDistance > maxDistance) {
        maxDistance = manhattanDistance;
      }
    }
  }
  return maxDistance;
}

function getManhattanDistance(point1: Coord, point2: Coord) {
  const [x1, y1, z1] = point1;
  const [x2, y2, z2] = point2;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
}

run({
  part1: {
    tests: [
      {
        input: `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`,
        expected: 79,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`,
        expected: 3621,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
