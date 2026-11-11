/* Accord — demo widget.
 * BYOK: the user's API key is kept in localStorage on THEIR browser only.
 * It is never sent anywhere except by the user's own browser, directly,
 * to the OpenAI-compatible endpoint THEY configure. There is no Accord server.
 */

(function () {
  "use strict";

  var STORAGE_KEY = "accord.byok.key";
  var STORAGE_ENDPOINT = "accord.byok.endpoint";
  var STORAGE_MODEL = "accord.byok.model";

  var $apiKey = document.getElementById("apiKey");
  var $endpoint = document.getElementById("endpoint");
  var $model = document.getElementById("model");
  var $customModelWrap = document.getElementById("customModelWrap");
  var $customModel = document.getElementById("customModel");
  var $saveKey = document.getElementById("saveKey");
  var $keyStatus = document.getElementById("keyStatus");
  var $chatLog = document.getElementById("chatLog");
  var $chatForm = document.getElementById("chatForm");
  var $chatInput = document.getElementById("chatInput");

  function load() {
    try {
      $apiKey.value = localStorage.getItem(STORAGE_KEY) || "";
      $endpoint.value = localStorage.getItem(STORAGE_ENDPOINT) || "https://api.openai.com/v1/chat/completions";
      var saved = localStorage.getItem(STORAGE_MODEL) || "gpt-4o-mini";
      var opt = Array.prototype.some.call($model.options, function (o) { return o.value === saved; });
      if (opt) { $model.value = saved; } else { $model.value = "custom"; $customModel.value = saved; }
      $customModelWrap.hidden = $model.value !== "custom";
      updateKeyStatus();
    } catch (e) { /* localStorage unavailable — key stays in memory only */ }
  }

  function updateKeyStatus() {
    $keyStatus.textContent = $apiKey.value
      ? "✓ Key stored locally in your browser (never sent to us)"
      : "No key yet — paste yours above to chat.";
  }

  $saveKey.addEventListener("click", function () {
    try {
      if ($apiKey.value) {
        localStorage.setItem(STORAGE_KEY, $apiKey.value);
        localStorage.setItem(STORAGE_ENDPOINT, $endpoint.value.trim());
        localStorage.setItem(STORAGE_MODEL, $model.value === "custom" ? $customModel.value.trim() : $model.value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) { /* private mode: memory only */ }
    updateKeyStatus();
  });

  $model.addEventListener("change", function () {
    $customModelWrap.hidden = $model.value !== "custom";
  });

  function addBubble(text, cls) {
    var div = document.createElement("div");
    div.className = "bubble " + (cls || "");
    div.textContent = text;
    $chatLog.appendChild(div);
    $chatLog.scrollTop = $chatLog.scrollHeight;
    return div;
  }

  $chatForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var message = $chatInput.value.trim();
    if (!message) return;
    var key = $apiKey.value.trim();
    var endpoint = $endpoint.value.trim();
    var model = $model.value === "custom" ? $customModel.value.trim() : $model.value;
    addBubble(message, "user");
    $chatInput.value = "";

    if (!key) {
      addBubble("STUB MODE — no API key set. Paste your own key above and hit 'Save key locally' to chat for real. Your key stays in your browser and is never sent to our servers (we don't have any).", "bot stub");
      return;
    }
    if (!endpoint || !model) {
      addBubble("STUB MODE — set an endpoint and model first.", "bot stub");
      return;
    }

    addBubble("…", "bot");

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: message }]
      })
    })
      .then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      })
      .then(function (r) {
        $chatLog.removeChild($chatLog.lastChild);
        if (r.ok && r.data.choices && r.data.choices[0]) {
          addBubble(r.data.choices[0].message.content, "bot");
        } else {
          var msg = (r.data && r.data.error && (r.data.error.message || r.data.error)) || "Request failed.";
          addBubble("⚠ " + msg, "bot");
        }
      })
      .catch(function () {
        $chatLog.removeChild($chatLog.lastChild);
        addBubble("⚠ Network error — check the endpoint URL and your key.", "bot");
      });
  });

  load();
})();
