const CLIENT_ID = "fqIXidsH6gWK4vD2";
const DEFAULT_ROOM = "general";
const bots = {};

function initBots() {
  // Initialize bots
  bots["tictactoe"] = TicTacToeBot;
  bots["help"] = HelpBot;
}

function sendBotCommand(botKey) {
  const bot = bots[botKey];
  const input = document.getElementById(botKey + "-input");
  const msg = input.value.trim();
  if (!msg) return;
  bot.send(msg);
  addMessage(bot.messagesEl, "You: " + msg);
  input.value = "";
}

function addMessage(el, msg) {
  const p = document.createElement("p");
  p.textContent = msg;
  el.appendChild(p);
  el.scrollTop = el.scrollHeight;
}

window.addEventListener("load", () => {
  initBots();

  // Configure Help Bot
  bots["help"].setConfig(CLIENT_ID, DEFAULT_ROOM, document.getElementById("help-messages"));
  
  // Configure TicTacToe Bot
  bots["tictactoe"].setConfig(CLIENT_ID, DEFAULT_ROOM, document.getElementById("ttt-messages"));
});
