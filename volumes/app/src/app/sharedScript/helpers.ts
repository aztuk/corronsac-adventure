/* TODO LIST
-*/

export function exists(value) {
  return (value && value !== undefined && value !== null);
}

export function dice(threshold) {
  return getRandomInt(0, 100) <= threshold;
}

export function getRandomInt(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export function getRandomInArray(array: any, min?, max?) {
  min = (min !== undefined) ? min : 0;
  max = (max !== undefined) ? max : array.length - 1;
  const index = Math.round(Math.random() * (max - min) + min);
  return array[index];
}

export function getRandomElementsInArray(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export let GLOBAL_TICK_RATE = 100;

export function weightedRand(spec) {
  var i, j, table = [];
  for (i in spec) {
    // The constant 10 below should be computed based on the
    // weights in the spec for a correct and optimal table size.
    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
    for (j = 0; j < spec[i] * 1; j++) {
      table.push(i);
    }
  }
  return table[Math.floor(Math.random() * table.length)];
}

export function createWeightedTable(spec) {
  var i, j, table = [];
  for (i in spec) {
    // The constant 10 below should be computed based on the
    // weights in the spec for a correct and optimal table size.
    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
    for (j = 0; j < spec[i] * 1; j++) {
      table.push(i);
    }
  }
  return table;
}

export function generateUID() {
  return '_' + Math.random().toString(36);
}

export function countElementInArray(array) {
  const counts = {};

  array.forEach((el) => {
    counts[el] = counts[el] ? (counts[el] += 1) : 1;
  });

  return counts;
}

const prefix = ['Phar', 'Tal', 'Te', 'Sor', 'Geo', 'Gan', 'Fle', 'Zeph', 'Wor', 'Kin', 'Lam', 'Pan', 'Mon', 'Fri', 'Vish'];
const middle = ['sith', 'tu', 'a', 'ke', 'nus', 'mil', 'pri', 'fen', 'o', 'e', 'y', 'ba', 'mo', 'ke', 'hu'];
const suffix = ['is', 'gam', 'ya', 'are', 'ava', 'rus', 'nea', 'bra', 'via', 'lion', 'cor', 'ere', 'dan', 'win', 'kon'];

export function generateName() {
  let name = "";
  name = getRandomInArray(prefix);
  if (getRandomInt(0, 3) === 1) {
    name += getRandomInArray(middle);
  }
  name += getRandomInArray(suffix);

  return name;
}
