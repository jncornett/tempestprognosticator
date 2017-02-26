Test.add('Sample', function() {
  const items = new Set([1, 2, 3]);
  const s = new Random.Sample(items);
  while (s.size != 0) {
    const val = s.next();
    if (!items.has(val)) {
      Test.fail('unexpected item in sample: ' + val);
    }
  }
});

Test.add('Dist (weighted coin)', function() {
  const db = new Random.DistBuilder();
  db.push(['heads', 1]);
  db.push(['tails', 3]);
  const d = db.dist();
  const n = 1000000;
  const results = {heads: 0, tails: 0};
  for (let i = 0; i < n; i++) {
    const val = d.next();
    results[val]++;
  }
  const epsilon = 0.1; // 10%? We *really* have a low bar :P
  const heads = results.heads / n; // normalize
  if (Math.abs(heads - 0.25) > epsilon) {
    Test.fail('expected heads ratio of 0.25, got ' + heads);
  }
  const tails = results.tails /= n; // normalize
  if (Math.abs(tails - 0.75) > epsilon) {
    Test.fail('expected tails ratio of 0.75, got ' + tails);
  }
});
