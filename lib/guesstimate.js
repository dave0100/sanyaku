window.BASE_MATCHES_LIMIT = 75;
window.OVERRIDE_HEAD_TO_HEAD_FACTOR = null;

getBaseStrength = function (matches, rikishiId) {
  const records = (matches || []).slice(0, BASE_MATCHES_LIMIT);

  if (records.length === 0) { 
    return 0.5; 
  }

  return records.filter((record) => record.winnerId === rikishiId).length / records.length;
};


versusOpponent = function (matchesVsOpponent) {
  if (!matchesVsOpponent || matchesVsOpponent.total === 0) {
    return 0.5;
  }

  let factor = matchesVsOpponent.total === 0 ? 0 : 1;

  if(matchesVsOpponent.total > 40) {
    factor = 0.8;
  } else if(matchesVsOpponent.total > 30) {
    factor = 0.6;
  } else if(matchesVsOpponent.total > 20) {
    factor = 0.5;
  } else if(matchesVsOpponent.total > 10) {
    factor = 0.4;
  } else if(matchesVsOpponent.total > 5) {
    factor = 0.3;
  } else { 
    factor = 0.2;
  }

  return {
    probability : matchesVsOpponent.total === 0 ? 0.5 : matchesVsOpponent.rikishiWins / matchesVsOpponent.total,
    factor : factor,
    matches : matchesVsOpponent.total,
  }
};

window.getProbability = function (results) {
  console.log("#############################################");
  console.log(results);

  const left = results.left;
  const right = results.right;
  const leftStrength = getBaseStrength(left.matches, left.id);
  const rightStrength = getBaseStrength(right.matches, right.id);
  const total = leftStrength + rightStrength;
  const probabilityBase = total === 0 ? 0.5 : leftStrength / total;
  let probability = probabilityBase;

  const vs = versusOpponent(left.matchesVsOpponent, left.id);
  const headToHeadFactor = window.OVERRIDE_HEAD_TO_HEAD_FACTOR != null ? window.OVERRIDE_HEAD_TO_HEAD_FACTOR : vs.factor;

  probability = (1 - headToHeadFactor) * probabilityBase + headToHeadFactor * vs.probability;

  const w = 42; 
  const log = `
${(`${left.rikishiName} winrate in last ${BASE_MATCHES_LIMIT} matches:`).padEnd(w)} ${(leftStrength * 100).toFixed(1)}%
${(`${right.rikishiName} winrate in last ${BASE_MATCHES_LIMIT} matches:`).padEnd(w)} ${(rightStrength * 100).toFixed(1)}%
${(`Base probability for a ${left.rikishiName} win:`).padEnd(w)} ${(probabilityBase * 100).toFixed(1)}%

${(`${left.rikishiName} probability vs ${right.rikishiName}:`).padEnd(w)} ${(vs.probability * 100).toFixed(1)}%
${(`Head-to-head factor for ${vs.matches} matches:`).padEnd(w)}  ${(headToHeadFactor).toFixed(1)}
------------------------------------------------
${(`Probability for a ${left.rikishiName} win:`).padEnd(w)} ${(probability * 100).toFixed(1)}%
  `.trim();

  return {
    log: log,
    probability: probability,
  };
};
