window.getAllRikishi = async function() {
  const response = await fetch('https://www.sumo-api.com/api/rikishis');
  const data = await response.json();

  return data.records;
};

window.getSanyakuRikishi = function(records) {
  var sanyakuRanks = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi"];
  var sanyakuRecords = records.filter(function(r) {
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
