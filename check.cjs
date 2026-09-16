// Run with: node check.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, 'index.html'), 'utf8');
const model = html.match(/<script id="auction-model">([\s\S]*?)<\/script>/)[1];
const context = vm.createContext({});
vm.runInContext(model, context);
const { minimumBid, placeBid, finishAuction } = context;
const lot = () => ({ start: 10000, bids: [], ends: Date.now() + 60000 });
const first = lot();
assert.equal(minimumBid(first), 10000);
assert.throws(() => placeBid(first, 9000));
assert.throws(() => placeBid(first, 10500));
assert.throws(() => placeBid(first, NaN));
assert.equal(first.bids.length, 0);
placeBid(first, 10000);
assert.equal(minimumBid(first), 11000);
assert.throws(() => placeBid(first, 10000));
const result = finishAuction(first);
assert.equal(result.status, 'sold');
assert.equal(result.amount, 10000); // One bidder wins at the student's starting price.
assert.equal(result.bidder, 'me');
assert.throws(() => placeBid(first, 11000));
assert.equal(finishAuction(lot()).status, 'unsold');
assert.throws(() => placeBid({ ...lot(), ends: Date.now() - 1 }, 10000));
const higher = lot();
placeBid(higher, 120000); // The expected 10,000–100,000 budget is not a bidding cap.
assert.equal(finishAuction(higher).amount, 120000);
const careerScript = html.match(/<script id="career-model">([\s\S]*?)<\/script>/);
assert.ok(careerScript, 'career model exists');
vm.runInContext(careerScript[1], context);
const ranked = context.rankArtists([
  { artist: '가', study: '회화', closed: true, bids: [{ amount: 10000 }] },
  { artist: '가', study: '회화', closed: true, bids: [] },
  { artist: '나', study: '도예', closed: false, ends: Date.now() + 60000, bids: [{ amount: 12000 }] },
  { artist: '다', study: '회화', closed: true, bids: [{ amount: 15000 }] }
], { 나: 2 });
assert.deepEqual(JSON.parse(JSON.stringify(ranked.map(({ artist, sales, rank }) => ({ artist, sales, rank })))), [
  { artist: '나', sales: 2, rank: 1 },
  { artist: '가', sales: 1, rank: 2 },
  { artist: '다', sales: 1, rank: 2 }
]);
assert.equal(context.rankArtists([{ artist: '__proto__', study: '기타', closed: false, ends: Date.now() + 60000, bids: [] }], {})[0].sales, 0);
console.log('PASS: first bid, minimum increment, invalid input, single-bid sale, unsold, expiry, closed auction, no budget cap');
console.log('PASS: artist ranks use completed demo auctions, not active bids or unsold lots');
