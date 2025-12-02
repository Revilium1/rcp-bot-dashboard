window.HelpBot = (function() {
  let drone = null;
  let room = null;
  let roomName = "";
  let messagesEl = null;
  let tipInterval = null;

  const DEFAULT_CLIENT_ID = "fqIXidsH6gWK4vD2";
  const tips = [
    "Try /help to see commands!",
    "Try !ttt for TicTacToe-Bot!",
    "Use /whoami to check your profile!",
    "Use /shrug for ¯\\_(ツ)_/¯"
  ];

  function log(msg) {
    if (!messagesEl) return;
    const p = document.createElement("p");
    p.textContent = msg;
    messagesEl.appendChild(p);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function send(msg) {
    if (!room) return;
    drone.publish({ room: "observable-" + roomName, message: msg });
  }

  function setConfig(clientID, roomNameArg, messagesElement) {
    messagesEl = messagesElement;
    roomName = roomNameArg;

    log("[help-bot] Initializing…");

    if (tipInterval) clearInterval(tipInterval);
    if (drone) try { drone.close(); } catch {}

    drone = new Scaledrone(clientID || DEFAULT_CLIENT_ID, {
      data: { name: "help-bot", color: "#ff4d4d" }
    });

    drone.on("open", err => {
      if (err) {
        log("Connection error: " + err);
        return;
      }

      log("[help-bot] Connected using Client ID: " + (clientID || DEFAULT_CLIENT_ID));

      room = drone.subscribe("observable-" + roomName);

      room.on("open", err => {
        if (err) log("Room error: " + err);
        else log("[help-bot] Joined room: " + roomName);
      });

      room.on("message", event => {
        const { data, member } = event;
        if (member && member.id === drone.clientId) return;

        if (typeof data === "string" && data.trim() === "!help") {
          const reply = "Help-bot: commands → !help, !ttt, !spai";
          send(reply);
          log("Replied: " + reply);
        }
      });

      // Start sending automatic tips every ~1 minute
      tipInterval = setInterval(() => {
        const tip = tips[Math.floor(Math.random() * tips.length)];
        send(tip);
        log("Tip sent: " + tip);
      }, 30000); // 60,000 ms = 1 minute
    });
  }

  // Stop the interval if needed
  function stopTips() {
    if (tipInterval) clearInterval(tipInterval);
  }

  return { setConfig, send, messagesEl, stopTips };
})();
