window.getAllRikishi = async function() {
  const response = await fetch('https://www.sumo-api.com/api/rikishis');
  const data = await response.json();

  return data.records;
};

window.getRikishiStats = async function(rikishiId) {
  const response = await fetch('https://www.sumo-api.com/api/rikishi/' + rikishiId + '/stats');
  const data = await response.json();
  
  console.log('getRikishiStats', rikishiId, data);
  
  return data;
};

window.getRikishiMatches = async function(rikishiId) {
  const response = await fetch('https://www.sumo-api.com/api/rikishi/' + rikishiId + '/matches');
  const data = await response.json();

  console.log('getRikishiMatches', rikishiId, data);
  
  return data;
};

window.getRikishiMatchesVsOpponent = async function(rikishiId, opponentId) {
  const response = await fetch('https://www.sumo-api.com/api/rikishi/' + rikishiId + '/matches/' + opponentId);
  const data = await response.json();

  console.log('getRikishiMatchesVsOpponent', rikishiId, opponentId, data);

  return data;
};

window.loadRikishiData = async function(rikishiId, opponentId) {
  const stats = await window.getRikishiStats(rikishiId);
  const matches = await window.getRikishiMatches(rikishiId);
  const matchesVsOpponent = await window.getRikishiMatchesVsOpponent(rikishiId, opponentId);

  return { stats: stats, matches: matches, matchesVsOpponent: matchesVsOpponent };
};

window.getSanyakuRikishi = function(records) {
  const sanyakuRanks = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi"];
  const sanyakuRecords = records.filter(function(r) {
    return sanyakuRanks.some(function(rank) {
      return r.currentRank && r.currentRank.startsWith(rank);
    });
  });

  sanyakuRecords.sort(function(a, b) {
    var rankA = sanyakuRanks.findIndex(function(r) {
      return a.currentRank && a.currentRank.startsWith(r);
    });
    var rankB = sanyakuRanks.findIndex(function(r) {
      return b.currentRank && b.currentRank.startsWith(r);
    });
    if (rankA !== rankB) return rankA - rankB;
    var eastA = a.currentRank.indexOf("East") !== -1 ? 0 : 1;
    var eastB = b.currentRank.indexOf("East") !== -1 ? 0 : 1;

    return eastA - eastB;
  });

  return sanyakuRecords;
};
