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
      };
    },
  }).mount("#app");
  document.getElementById("loading-overlay").remove();
})();
