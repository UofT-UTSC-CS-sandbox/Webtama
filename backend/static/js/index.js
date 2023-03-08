(function () {
  "use strict";

  function onError(err) {
    console.error("[error]", err);
    let errorBox = document.querySelector("#error-box");
    errorBox.innerHTML = err;
    // Rewrite this to use a 'hidden' class instead.
    errorBox.style.visibility = "hidden";
  }

  window.onload = function () {
    apiService.getUsername().then((res) => {
      document.querySelector("#signin-button").style.visibility = res.username
        ? "hidden"
        : "visible";
      document.querySelector("#signout-button").style.visibility = res.username
        ? "visible"
        : "hidden";
    });
  };
})();
