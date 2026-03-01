/**
 * Fetches sumo-api.com torikumi JSON for a basho/day, builds an HTML table
 * with Calc (win %) and Guess (random outcome) columns. Requires loadRikishiData
 * and getProbability from lib/rikishi.js and lib/guesstimate.js.
 */
window.getTable = async function (basho, day) {
  const bashoId = (basho != null && String(basho).trim() !== '') ? String(basho).trim() : null;
  const dayNum = (day != null && String(day).trim() !== '') ? String(day).trim() : null;
  if (!bashoId || !dayNum) {
    throw new Error('Basho and day are required (e.g. 202601, 14)');
  }

  const url = 'https://www.sumo-api.com/api/basho/' + encodeURIComponent(bashoId) + '/torikumi/makuuchi/' + encodeURIComponent(dayNum);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Fetch failed: ' + response.status);
  const data = await response.json();

  const torikumi = data.torikumi || [];
  if (torikumi.length === 0) {
    return '<p class="text-sm text-slate-600">No bouts for this day.</p>';
  }

  const table = document.createElement('table');
  table.className = 'w-full text-xs border-collapse';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['East', 'West', '%', '🎲'].forEach(function (label) {
    const th = document.createElement('th');
    th.textContent = label;
    th.className = 'text-left border border-slate-300 bg-slate-100 px-2 py-1';
    if (label === '%') th.style.minWidth = '70px';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let i = torikumi.length - 1; i >= 0; i--) {
    const bout = torikumi[i];
    const eastId = bout.eastId;
    const westId = bout.westId;
    const winnerId = bout.winnerId;
    const eastShikona = bout.eastShikona || '';
    const westShikona = bout.westShikona || '';
    const eastRank = bout.eastRank || '';
    const westRank = bout.westRank || '';

    const tr = document.createElement('tr');
    const eastTd = document.createElement('td');
    eastTd.className = 'border border-slate-300 px-2 py-1' + (winnerId && winnerId === eastId ? ' bg-green-200' : '');
    eastTd.innerHTML = '<small>'+(eastRank ? eastRank + '</small><br/><b>' + eastShikona+'</b>' : eastShikona);
    const westTd = document.createElement('td');
    westTd.className = 'border border-slate-300 px-2 py-1' + (winnerId && winnerId === westId ? ' bg-green-200' : '');
    westTd.innerHTML = '<small>'+(westRank ? westRank + '</small><br/><b>' + westShikona+'</b>' : westShikona);
    const calcTd = document.createElement('td');
    calcTd.className = 'border border-slate-300 px-2 py-1';
    calcTd.style.minWidth = '90px';
    const guessTd = document.createElement('td');
    guessTd.className = 'border border-slate-300 px-2 py-1';

    try {
      const [leftData, rightData] = await Promise.all([
        window.loadRikishiData(eastId, westId, eastShikona),
        window.loadRikishiData(westId, eastId, westShikona),
      ]);
      const result = window.getProbability({ left: leftData, right: rightData });
      const p = result.probability;

      let winner = p >= 0.5 ? '\u6771' : '\u897F';
      let winnerClass = 'text-green-600'; 
      
      if(winnerId && winnerId === eastId && p < 0.5) {
        winnerClass = 'text-red-600';
      } else if(winnerId && winnerId === westId && p >= 0.5) {
        winnerClass = 'text-red-600';
      }

      calcTd.innerHTML = '\u6771 ' + (p * 100).toFixed(1) + '%: '+ '<b class="'+winnerClass+'">'+winner+'</b> ';
      guessTd.textContent = Math.random() < p ? 'East' : 'West';
    } catch (e) {
      calcTd.textContent = '?';
      guessTd.textContent = '?';
    }

    tr.appendChild(eastTd);
    tr.appendChild(westTd);
    tr.appendChild(calcTd);
    tr.appendChild(guessTd);
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  var html = table.outerHTML;
  html = html.replace(/East/g, '\u6771');  // 東
  html = html.replace(/West/g, '\u897F');   // 西
  return html;
};
