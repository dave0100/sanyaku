(function() {
  var rikishiList = window.getAllRikishi();
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
})();
