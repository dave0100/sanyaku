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
        configOpen: false,
        baseMatchesLimit: window.BASE_MATCHES_LIMIT || 75,
        overrideHeadToHeadFactorInput: window.OVERRIDE_HEAD_TO_HEAD_FACTOR != null ? String(window.OVERRIDE_HEAD_TO_HEAD_FACTOR) : '',
      };
    },
    methods: {
      swapRikishi: function() {
        const t = this.leftRikishi;
        this.leftRikishi = this.rightRikishi;
        this.rightRikishi = t;
      },
      onBaseMatchesLimitInput: function() {
        const n = Math.max(1, Math.min(5000, Number(this.baseMatchesLimit) || 75));
        this.baseMatchesLimit = n;
        window.BASE_MATCHES_LIMIT = n;
      },
      onOverrideHeadToHeadFactorInput: function() {
        const s = String(this.overrideHeadToHeadFactorInput).trim();
        if (s === '') {
          window.OVERRIDE_HEAD_TO_HEAD_FACTOR = null;
          return;
        }
        const n = Math.max(0, Math.min(1, Number(s)));
        this.overrideHeadToHeadFactorInput = String(n);
        window.OVERRIDE_HEAD_TO_HEAD_FACTOR = n;
      },
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
