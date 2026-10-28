const assert = require('node:assert/strict');
const Focus = require('./focus-core.js');

// Concurrent offline work keeps the best result for each week, including zero.
const phone = {'1': 5, '2': 0};
const computer = {'1': 7, '3': 4};
assert.deepEqual(Focus.merge(phone, computer), {'1': 7, '2': 0, '3': 4});
assert.deepEqual(Focus.merge(phone, computer), Focus.merge(computer, phone));
assert.deepEqual(Focus.merge(phone, phone), phone);
assert.deepEqual(Focus.merge(Focus.merge(phone, computer), {'1': 6, '12': 3}), {'1': 7, '2': 0, '3': 4, '12': 3});
assert.deepEqual(Focus.clean({'0':1, '01':1, '13':1, '4':-1, '5':101, '6':1.5, '7':'4', '8':3}), {'8':3});
assert.equal(Focus.same({'1':0}, {}), false);
console.log('Medication-use score validation and offline merge passed.');
