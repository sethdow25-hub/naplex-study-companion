const assert = require('node:assert/strict');
const Core = require('./sync-core.js');

function change(records, state, device) {
  return Core.recordChanges(records, state, device, 0).records;
}

// Independent offline work on two devices combines without dropping either item.
const starting = change({}, {...Core.empty(), examDate:'2027-07-01'}, 'base');
const phoneState = Core.project(starting);
phoneState.days['1-0'] = true;
phoneState.notes['1'] = 'Review anticoagulation.';
const computerState = Core.project(starting);
computerState.lessons['1-0'] = true;
computerState.scores['1'] = 8;
const phone = change(starting, phoneState, 'phone');
const computer = change(starting, computerState, 'computer');
const merged = Core.merge(phone, computer);
const result = Core.project(merged);
assert.equal(result.examDate, '2027-07-01');
assert.equal(result.days['1-0'], true);
assert.equal(result.lessons['1-0'], true);
assert.equal(result.scores['1'], 8);
assert.equal(result.notes['1'], 'Review anticoagulation.');
assert.ok(Core.sameRecords(Core.merge(phone, computer), Core.merge(computer, phone)));

// A deliberate uncheck and a deleted note must not be resurrected by stale data.
const edited = Core.project(merged);
delete edited.days['1-0'];
delete edited.notes['1'];
const changed = change(merged, edited, 'phone');
const afterStale = Core.project(Core.merge(changed, merged));
assert.equal(afterStale.days['1-0'], undefined);
assert.equal(afterStale.notes['1'], undefined);

// Concurrent edits of one field choose the same result on both devices.
const left = Core.project(merged), right = Core.project(merged);
left.notes['1'] = 'First revision';
right.notes['1'] = 'Second revision';
const concurrentA = change(merged, left, 'a');
const concurrentB = change(merged, right, 'b');
assert.deepEqual(Core.project(Core.merge(concurrentA, concurrentB)), Core.project(Core.merge(concurrentB, concurrentA)));

// Existing guest progress is combined rather than replacing an account.
const account = {...Core.empty(), days:{'1-0':true}, scores:{'1':7}, notes:{'1':'Account note'}};
const guest = {...Core.empty(), days:{'1-1':true}, scores:{'1':9}, notes:{'1':'Guest note'}};
const combined = Core.combineGuest(account, guest);
assert.equal(combined.days['1-0'], true);
assert.equal(combined.days['1-1'], true);
assert.equal(combined.scores['1'], 9);
assert.match(combined.notes['1'], /Account note/);
assert.match(combined.notes['1'], /Guest note/);
assert.deepEqual(Object.keys(Core.cleanRecords({'__proto__': {n:1,d:'x',v:true}, 'd/99-1':{n:1,d:'x',v:true}})), []);

console.log('Sync merge, concurrent edits, deletions and device-progress import passed.');
