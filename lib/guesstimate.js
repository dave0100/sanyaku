window.getBaseStrength = function (matches, rikishiId) {
  const records = matches || [];

  if (records.length === 0) { 
    return 0.5; 
  }

  return records.slice(0, 75).filter((record) => record.winnerId === rikishiId).length / records.length;
};

window.getProbability = function (results) {
  console.log("#############################################");
  console.log(results);

  const left = results.left;
  const right = results.right;
  const leftStrength = window.getBaseStrength(left.matches, left.id);
  const rightStrength = window.getBaseStrength(right.matches, right.id);
  const total = leftStrength + rightStrength;
  const probability = total === 0 ? 0.5 : leftStrength / total;

  const log = `
${left.rikishiName} strength: ${leftStrength}
${right.rikishiName} strength: ${rightStrength}
total: ${total}
probability: ${probability}
  `.trim();

  return {
    log: log,
    probability: probability,
  };
};
