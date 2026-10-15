/* Rainbow Tools — all tools run in your browser */
(function () {
  "use strict";
  var grid = document.getElementById("tools-grid");
  var workspace = document.getElementById("workspace");
  var content = document.getElementById("tool-content");
  var title = document.getElementById("workspace-title");
  var search = document.getElementById("tool-search");
  var toast = document.getElementById("toast");
  var soundOn = false;
  var audioContext = null;
  var toastTimer = null;
  var timerInterval = null;
  var timerRemaining = 5 * 60;
  var timerRunning = false;
  var titles = { calculator:"Quick Calculator", words:"Word Counter", colors:"Color Generator", timer:"Focus Timer", todo:"To-do List", password:"Password Generator" };

  function safeGet(key, fallback) {
    try { var value = localStorage.getItem(key); return value === null ? fallback : value; }
    catch (e) { return fallback; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch (e) { showToast("Browser storage is unavailable. Your change may not be saved."); return false; }
  }
  function showToast(message) {
    toast.textContent = message;
    toast.className = "toast show";
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.className = "toast"; }, 2300);
  }
  function beep(freq, duration) {
    if (!soundOn) return;
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === "suspended") audioContext.resume();
      var oscillator = audioContext.createOscillator();
      var gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = freq || 660;
      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + (duration || 0.12));
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + (duration || 0.12));
    } catch (e) {}
  }
  function escapeHTML(value) {
    return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function openTool(name) {
    if (!titles[name]) return;
    title.textContent = titles[name];
    workspace.classList.remove("hidden");
    content.innerHTML = "";
    if (timerInterval) { window.clearInterval(timerInterval); timerInterval = null; timerRunning = false; }
    if (name === "calculator") renderCalculator();
    if (name === "words") renderWords();
    if (name === "colors") renderColors();
    if (name === "timer") renderTimer();
    if (name === "todo") renderTodo();
    if (name === "password") renderPassword();
    workspace.scrollIntoView({ behavior:"smooth", block:"start" });
    beep(520, .07);
  }
  function renderCalculator() {
    content.innerHTML = '<div class="tool-panel"><label class="field-label" for="calc-a">First number</label><input class="text-field" id="calc-a" type="number" step="any" placeholder="e.g. 24"><div style="height:12px"></div><label class="field-label" for="calc-op">Operation</label><select class="select-field" id="calc-op"><option value="+">Add (+)</option><option value="-">Subtract (−)</option><option value="*">Multiply (×)</option><option value="/">Divide (÷)</option><option value="%">Remainder (%)</option></select><div style="height:12px"></div><label class="field-label" for="calc-b">Second number</label><input class="text-field" id="calc-b" type="number" step="any" placeholder="e.g. 6"><div style="height:15px"></div><button class="action-button" id="calc-go" type="button">Calculate result</button><div class="result-box" aria-live="polite">Result: <strong id="calc-result">—</strong></div></div>';
    document.getElementById("calc-go").onclick = function () {
      var a = Number(document.getElementById("calc-a").value), b = Number(document.getElementById("calc-b").value), op = document.getElementById("calc-op").value;
      if (document.getElementById("calc-a").value.trim() === "" || document.getElementById("calc-b").value.trim() === "") { showToast("Enter both numbers first."); return; }
      if ((op === "/" || op === "%") && b === 0) { document.getElementById("calc-result").textContent = "Cannot divide by zero"; return; }
      var result = op === "+" ? a+b : op === "-" ? a-b : op === "*" ? a*b : op === "/" ? a/b : a%b;
      document.getElementById("calc-result").textContent = String(Number(result.toPrecision(12)));
      beep(720,.1);
    };
  }
  function renderWords() {
    content.innerHTML = '<div class="tool-panel"><label class="field-label" for="word-text">Enter or paste your text</label><textarea class="text-area" id="word-text" placeholder="Start typing here..."></textarea><div class="stats-row"><div class="stat"><strong id="word-count">0</strong><span>Words</span></div><div class="stat"><strong id="char-count">0</strong><span>Characters</span></div><div class="stat"><strong id="line-count">0</strong><span>Lines</span></div></div><div style="margin-top:13px"><button class="secondary-button" id="word-clear" type="button">Clear text</button></div></div>';
    var field = document.getElementById("word-text");
    function update() {
      var value = field.value;
      var trimmed = value.trim();
      document.getElementById("word-count").textContent = trimmed ? trimmed.split(/\s+/).length : 0;
      document.getElementById("char-count").textContent = value.length;
      document.getElementById("line-count").textContent = value ? value.split(/\r\n|\r|\n/).length : 0;
    }
    field.addEventListener("input", update);
    document.getElementById("word-clear").onclick = function () { field.value = ""; update(); field.focus(); };
  }
  function randomHex() {
    var digits = "0123456789ABCDEF", result = "#";
    for (var i=0;i<6;i++) result += digits[Math.floor(Math.random()*16)];
    return result;
  }
  function renderColors() {
    content.innerHTML = '<div class="tool-panel"><div class="color-preview" id="color-preview"></div><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><div class="section-kicker">YOUR COLOR</div><div class="color-code" id="color-code">#8B5CF6</div></div><button class="action-button" id="color-new" type="button">Generate new color</button></div><div style="margin-top:13px"><button class="secondary-button" id="color-copy" type="button">Copy HEX code</button></div></div>';
    var code = document.getElementById("color-code"), preview = document.getElementById("color-preview");
    function update() { var hex = randomHex(); code.textContent = hex; preview.style.background = hex; }
    update();
    document.getElementById("color-new").onclick = function () { update(); beep(620,.08); };
    document.getElementById("color-copy").onclick = function () { copyText(code.textContent, "Color code copied."); };
  }
  function formatTime(seconds) {
    var m = Math.floor(seconds / 60), s = seconds % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }
  function renderTimer() {
    timerRemaining = 5 * 60;
    content.innerHTML = '<div class="tool-panel"><label class="field-label" for="timer-minutes">Countdown length (minutes)</label><div class="form-row"><input class="text-field" id="timer-minutes" type="number" min="1" max="180" value="5"><button class="secondary-button" id="timer-set" type="button">Set time</button></div><div class="timer-display" id="timer-display">05:00</div><div class="timer-actions"><button class="action-button" id="timer-start" type="button">Start timer</button><button class="secondary-button" id="timer-reset" type="button">Reset</button></div><p style="text-align:center;color:var(--muted);font-size:12px">Keep this page open while the timer runs.</p></div>';
    var display = document.getElementById("timer-display"), start = document.getElementById("timer-start");
    function paint() { display.textContent = formatTime(timerRemaining); }
    function stop() { if (timerInterval) window.clearInterval(timerInterval); timerInterval = null; timerRunning = false; start.textContent = "Start timer"; }
    document.getElementById("timer-set").onclick = function () {
      var mins = Number(document.getElementById("timer-minutes").value);
      if (!isFinite(mins) || mins < 1 || mins > 180) { showToast("Choose between 1 and 180 minutes."); return; }
      stop(); timerRemaining = Math.round(mins*60); paint(); showToast("Timer set.");
    };
    start.onclick = function () {
      if (timerRunning) { stop(); return; }
      if (timerRemaining <= 0) timerRemaining = 5*60;
      timerRunning = true; start.textContent = "Pause timer"; beep(600,.08);
      timerInterval = window.setInterval(function () {
        timerRemaining--; paint();
        if (timerRemaining <= 0) { stop(); beep(880,.3); window.setTimeout(function(){beep(660,.3);},350); showToast("Time is up!"); }
      }, 1000);
    };
    document.getElementById("timer-reset").onclick = function () { stop(); timerRemaining = 5*60; document.getElementById("timer-minutes").value = "5"; paint(); };
    paint();
  }
  function loadTasks() {
    try { var tasks = JSON.parse(safeGet("rainbowToolsTasks", "[]")); return Array.isArray(tasks) ? tasks : []; }
    catch (e) { return []; }
  }
  function saveTasks(tasks) { safeSet("rainbowToolsTasks", JSON.stringify(tasks)); }
  function renderTodo() {
    content.innerHTML = '<div class="tool-panel"><form class="task-form" id="task-form"><input class="text-field" id="task-input" maxlength="180" placeholder="Add a task..." aria-label="New task"><button class="action-button" type="submit">Add</button></form><p id="task-summary" style="color:var(--muted);font-size:12px"></p><ul class="task-list" id="task-list"></ul><div style="margin-top:13px"><button class="secondary-button" id="clear-done" type="button">Clear completed</button></div></div>';
    var tasks = loadTasks(), list = document.getElementById("task-list"), summary = document.getElementById("task-summary");
    function draw() {
      list.innerHTML = "";
      tasks.forEach(function(task, index) {
        var li = document.createElement("li"); li.className = "task-item" + (task.done ? " done" : "");
        var checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.checked = !!task.done; checkbox.setAttribute("aria-label","Mark task complete");
        checkbox.onchange = function(){ tasks[index].done = checkbox.checked; saveTasks(tasks); draw(); };
        var span = document.createElement("span"); span.textContent = task.text;
        var del = document.createElement("button"); del.className = "delete-task"; del.type = "button"; del.textContent = "×"; del.setAttribute("aria-label","Delete task");
        del.onclick = function(){ tasks.splice(index,1); saveTasks(tasks); draw(); showToast("Task removed."); };
        li.appendChild(checkbox); li.appendChild(span); li.appendChild(del); list.appendChild(li);
      });
      var remaining = tasks.filter(function(t){return !t.done;}).length;
      summary.textContent = tasks.length + " task" + (tasks.length === 1 ? "" : "s") + " · " + remaining + " remaining";
      if (!tasks.length) { var empty = document.createElement("li"); empty.className = "result-box"; empty.textContent = "Your list is empty. Add your first task above."; list.appendChild(empty); }
    }
    document.getElementById("task-form").onsubmit = function(e) {
      e.preventDefault(); var input = document.getElementById("task-input"), value = input.value.trim();
      if (!value) { showToast("Type a task first."); return; }
      tasks.push({text:value,done:false}); saveTasks(tasks); input.value = ""; draw(); beep(680,.07);
    };
    document.getElementById("clear-done").onclick = function(){ tasks = tasks.filter(function(t){return !t.done;}); saveTasks(tasks); draw(); showToast("Completed tasks cleared."); };
    draw();
  }
  function renderPassword() {
    content.innerHTML = '<div class="tool-panel"><label class="field-label" for="password-length">Password length</label><div class="form-row"><input class="text-field" id="password-length" type="number" min="8" max="64" value="16"><button class="action-button" id="password-make" type="button">Generate password</button></div><div class="password-options"><label><input id="pw-upper" type="checkbox" checked> Uppercase</label><label><input id="pw-lower" type="checkbox" checked> Lowercase</label><label><input id="pw-number" type="checkbox" checked> Numbers</label><label><input id="pw-symbol" type="checkbox" checked> Symbols</label></div><label class="field-label" for="password-output">Your password</label><input class="text-field password-output" id="password-output" readonly placeholder="Click Generate password"><div style="margin-top:13px"><button class="secondary-button" id="password-copy" type="button">Copy password</button></div><p style="color:var(--muted);font-size:12px">This tool generates the password in your browser. For important accounts, consider using a trusted password manager and never share your password.</p></div>';
    function makePassword() {
      var length = Number(document.getElementById("password-length").value);
      if (!isFinite(length) || length < 8 || length > 64) { showToast("Choose a length from 8 to 64."); return; }
      var groups = [];
      if (document.getElementById("pw-upper").checked) groups.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
      if (document.getElementById("pw-lower").checked) groups.push("abcdefghijkmnopqrstuvwxyz");
      if (document.getElementById("pw-number").checked) groups.push("23456789");
      if (document.getElementById("pw-symbol").checked) groups.push("!@#$%&*+-=?_");
      if (!groups.length) { showToast("Select at least one character type."); return; }
      var pool = groups.join(""), result = "", cryptoObj = window.crypto || window.msCrypto;
      function pick(max) {
        if (cryptoObj && cryptoObj.getRandomValues) {
          var array = new Uint32Array(1); cryptoObj.getRandomValues(array); return array[0] % max;
        }
        return Math.floor(Math.random()*max);
      }
      groups.forEach(function(group){ if (result.length < length) result += group.charAt(pick(group.length)); });
      while (result.length < length) result += pool.charAt(pick(pool.length));
      var chars = result.split("");
      for (var i=chars.length-1;i>0;i--) { var j=pick(i+1), temp=chars[i]; chars[i]=chars[j]; chars[j]=temp; }
      document.getElementById("password-output").value = chars.join("");
      beep(700,.08);
    }
    document.getElementById("password-make").onclick = makePassword;
    document.getElementById("password-copy").onclick = function(){ var value=document.getElementById("password-output").value; if(!value){showToast("Generate a password first.");return;} copyText(value,"Password copied. Keep it private."); };
    makePassword();
  }
  function copyText(value, success) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function(){showToast(success);beep(760,.07);}, function(){fallbackCopy(value,success);});
    } else fallbackCopy(value,success);
  }
  function fallbackCopy(value, success) {
    var field = document.createElement("textarea"); field.value=value; field.style.position="fixed"; field.style.opacity="0"; document.body.appendChild(field); field.select();
    try { var ok=document.execCommand("copy"); showToast(ok ? success : "Copy wasn't available. Select and copy the text manually."); }
    catch(e) { showToast("Copy wasn't available. Select and copy the text manually."); }
    document.body.removeChild(field);
  }

  grid.addEventListener("click", function(e) {
    var button = e.target.closest ? e.target.closest("[data-open]") : null;
    if (button) openTool(button.getAttribute("data-open"));
  });
  document.getElementById("close-tool").onclick = function() {
    if (timerInterval) window.clearInterval(timerInterval);
    timerInterval = null; timerRunning = false; workspace.classList.add("hidden"); content.innerHTML = ""; showToast("Tool closed.");
  };
  search.addEventListener("input", function() {
    var query = search.value.toLowerCase().trim(), cards = grid.querySelectorAll(".tool-card"), visible = 0;
    Array.prototype.forEach.call(cards, function(card) {
      var match = !query || (card.getAttribute("data-tool") + " " + card.textContent).toLowerCase().indexOf(query) !== -1;
      card.classList.toggle("hidden", !match); if (match) visible++;
    });
    document.getElementById("tool-count").textContent = visible + (visible === 1 ? " tool" : " tools");
    document.getElementById("no-results").classList.toggle("hidden", visible !== 0);
  });
  var soundButton = document.getElementById("sound-toggle");
  soundOn = safeGet("rainbowToolsSound","off") === "on";
  function paintSound() { soundButton.textContent = "Sound: " + (soundOn ? "On" : "Off"); soundButton.setAttribute("aria-pressed", soundOn ? "true" : "false"); }
  soundButton.onclick = function() { soundOn = !soundOn; safeSet("rainbowToolsSound", soundOn ? "on" : "off"); paintSound(); if(soundOn) beep(650,.1); showToast("Sound effects " + (soundOn ? "enabled." : "disabled.")); };
  paintSound();
  var darkOn = safeGet("rainbowToolsDark","off") === "on";
  var themeButton = document.getElementById("theme-toggle");
  function paintTheme() { document.body.classList.toggle("dark", darkOn); themeButton.textContent = darkOn ? "Light mode" : "Dark mode"; themeButton.setAttribute("aria-pressed", darkOn ? "true" : "false"); }
  themeButton.onclick = function() { darkOn = !darkOn; safeSet("rainbowToolsDark", darkOn ? "on" : "off"); paintTheme(); beep(500,.07); };
  paintTheme();
  document.getElementById("year").textContent = new Date().getFullYear();
}());
