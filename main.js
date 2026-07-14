/* ==========================================
   JJ OS
   MAIN ENGINE
   Version 0.2 Alpha
========================================== */

const OS = {
  version: "0.2 Alpha",

  apps: {},

  windows: new Map(),

  activeWindow: null,

  zIndex: 1000,

  settings: {
    theme: "dark",
  },
};

/* ==========================================
   DOM
========================================== */

OS.dom = {
  desktop: document.getElementById("desktop"),

  taskbar: document.getElementById("runningApps"),

  startMenu: document.getElementById("startMenu"),

  startButton: document.getElementById("startButton"),

  windowContainer: document.getElementById("windowContainer"),

  notifications: document.getElementById("notificationCenter"),

  template: document.getElementById("windowTemplate"),
};

/* ==========================================
   REGISTER APP
========================================== */

OS.registerApp = function (app) {
  this.apps[app.id] = app;
};

/* ==========================================
   OPEN APP
========================================== */

OS.launch = function (id) {
  const app = this.apps[id];

  if (!app) {
    this.notify("Error", `"${id}" is not installed.`);

    return;
  }

  if (this.windows.has(id)) {
    const existing = this.windows.get(id);

    existing.style.display = "block";

    existing.style.zIndex = ++this.zIndex;

    return;
  }

  const windowElement = this.createWindow(app);

  this.windows.set(id, windowElement);
};

/* ==========================================
   NOTIFICATIONS
========================================== */

OS.notify = function (title, message) {
  const card = document.createElement("div");

  card.className = "notification";

  card.innerHTML = `
        <strong>${title}</strong>
        <br>
        ${message}
    `;

  this.dom.notifications.appendChild(card);

  setTimeout(() => {
    card.remove();
  }, 4000);
};

/* ==========================================
   CLOCK
========================================== */

function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent = now.toLocaleTimeString([], {
    hour: "2-digit",

    minute: "2-digit",
  });
}

setInterval(updateClock, 1000);

updateClock();

/* ==========================================
   START MENU
========================================== */

OS.dom.startButton.onclick = () => {
  OS.dom.startMenu.style.display =
    OS.dom.startMenu.style.display === "flex" ? "none" : "flex";
};

document.addEventListener("click", (e) => {
  if (!OS.dom.startMenu.contains(e.target) && e.target !== OS.dom.startButton) {
    OS.dom.startMenu.style.display = "none";
  }
});

/* ==========================================
   BOOT
========================================== */

window.onload = () => {
  setTimeout(() => {
    document.getElementById("bootScreen").style.display = "none";

    OS.notify(
      "JJ OS",

      "System Ready.",
    );
  }, 2000);
};

console.log(`JJ OS ${OS.version} Loaded`);
