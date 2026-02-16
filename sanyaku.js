(async function() {
  const records = await window.getAllRikishi();
  const sanyakuRikishi = window.getSanyakuRikishi(records);
  const rikishiList = sanyakuRikishi.map(function(r) { return r.shikonaEn; });

  Vue.createApp({
    data: function() {
      return {
        rikishi: rikishiList,
        leftRikishi: rikishiList[0] || "",
        rightRikishi: rikishiList[1] || "",
        outputText: "> Jikan desu...",
        matchLoading: false,
        sanyakuRecords: sanyakuRikishi,
      };
    },
    methods: {
      startMatch: async function() {
        const leftRecord = this.sanyakuRecords.find(function(r) { return r.shikonaEn === this.leftRikishi; }.bind(this));
        const rightRecord = this.sanyakuRecords.find(function(r) { return r.shikonaEn === this.rightRikishi; }.bind(this));
        
        if (!leftRecord || !rightRecord) {
          return;
        }

        const leftId = leftRecord.id;
        const rightId = rightRecord.id;

        this.matchLoading = true;

        try {
          const [leftData, rightData] = await Promise.all([
            window.loadRikishiData(leftId, rightId, leftRecord.shikonaEn),
            window.loadRikishiData(rightId, leftId, rightRecord.shikonaEn),
          ]);
          const results = { left: leftData, right: rightData };
          const probability = window.getProbability(results);
          
          this.outputText = probability.log;

          console.log('getProbability', results, probability);
        } finally {
          this.matchLoading = false;
        }
      },
    },
  }).mount("#app");
  document.getElementById("loading-overlay").remove();
})();
