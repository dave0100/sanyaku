(async function() {
  var records = await window.getAllRikishi();
  var sanyakuRikishi = window.getSanyakuRikishi(records);

  console.log(sanyakuRikishi);

  var rikishiList = sanyakuRikishi.map(function(r) { return r.shikonaEn; });

  Vue.createApp({
    data: function() {
      return {
        rikishi: rikishiList,
        leftRikishi: rikishiList[0] || "",
        rightRikishi: rikishiList[1] || "",
        outputText: "Jikan desu",
        matchLoading: false,
        sanyakuRecords: sanyakuRikishi,
      };
    },
    methods: {
      startMatch: async function() {
        var leftRecord = this.sanyakuRecords.find(function(r) { return r.shikonaEn === this.leftRikishi; }.bind(this));
        var rightRecord = this.sanyakuRecords.find(function(r) { return r.shikonaEn === this.rightRikishi; }.bind(this));
        if (!leftRecord || !rightRecord) return;
        var leftId = leftRecord.id;
        var rightId = rightRecord.id;
        this.matchLoading = true;
        try {
          await Promise.all([
            window.loadRikishiData(leftId, rightId),
            window.loadRikishiData(rightId, leftId),
          ]);
        } finally {
          this.matchLoading = false;
        }
      },
    },
  }).mount("#app");
  document.getElementById("loading-overlay").remove();
})();
