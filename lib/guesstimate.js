window.BASE_MATCHES_LIMIT = 75;

getBaseStrength = function (matches, rikishiId) {
  const records = (matches || []).slice(0, BASE_MATCHES_LIMIT);

  if (records.length === 0) { 
    return 0.5; 
  }

  return records.filter((record) => record.winnerId === rikishiId).length / records.length;
};

window.getProbability = function (results) {
  console.log("#############################################");
  console.log(results);

  const left = results.left;
  const right = results.right;
  const leftStrength = getBaseStrength(left.matches, left.id);
  const rightStrength = getBaseStrength(right.matches, right.id);
  const total = leftStrength + rightStrength;
  const probability = total === 0 ? 0.5 : leftStrength / total;

  const log = `
${left.rikishiName} winrate in last ${BASE_MATCHES_LIMIT} matches:\t\t ${(leftStrength * 100).toFixed(1)}%
${right.rikishiName} winrate in last ${BASE_MATCHES_LIMIT} matches:\t\t ${(rightStrength * 100).toFixed(1)}%
--------------------------------
Probability for a ${left.rikishiName} win:\t\t\t\t ${(probability * 100).toFixed(1)}%
  `.trim();

  return {
    log: log,
    probability: probability,
  };
};
