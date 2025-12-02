window.TicTacToeBot = (function() {
  let drone = null;
  let room = null;
  let roomName = "";
  let messagesEl = null;

  const DEFAULT_CLIENT_ID = "fqIXidsH6gWK4vD2";
  let board = Array(9).fill(null);

  function log(msg) {
    if (!messagesEl) return;
    const p = document.createElement("p");
    p.textContent = msg;
    messagesEl.appendChild(p);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setConfig(clientID, roomNameArg, messagesElement) {
    messagesEl = messagesElement;
    roomName = roomNameArg;

    if (drone) try { drone.close(); } catch {}

    drone = new Scaledrone(clientID || DEFAULT_CLIENT_ID, {
      data: { name: "ttt-bot", color: "#4d79ff" }
    });

    drone.on("open", err => {
      if (err) { log("Connection error: " + err); return; }

      log("[TTT] Connected");

      room = drone.subscribe("observable-" + roomName);

      room.on("message", event => {
        const { data, member } = event;
        if (!data || (member && member.id === drone.clientId)) return;

        if (typeof data === "string" && data.startsWith("!ttt")) {
          const pos = Math.floor(Math.random() * 9);
          if (!board[pos]) board[pos] = "O";
          send("TTT move: " + pos);
          log("Played move at " + pos);
        }
      });
    });
  }

  function send(msg) {
    if (!room) return;
    drone.publish({ room: "observable-" + roomName, message: msg });
  }

  return { setConfig, send, messagesEl };
})();
