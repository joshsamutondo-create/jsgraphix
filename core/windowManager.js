/* ==========================================
   JJ OS
   WINDOW MANAGER
========================================== */

OS.createWindow = function (app) {
  const template = this.dom.template.content.cloneNode(true);

  const win = template.querySelector(".window");

  const title = win.querySelector(".windowName");

  const icon = win.querySelector(".windowIcon");

  const content = win.querySelector(".windowContent");

  title.textContent = app.title;

  icon.textContent = app.icon;

  content.innerHTML = app.content || "";

  win.dataset.app = app.id;

  win.style.left = 120 + Math.random() * 120 + "px";

  win.style.top = 70 + Math.random() * 80 + "px";

  win.style.zIndex = ++this.zIndex;

  this.dom.windowContainer.appendChild(win);

  this.makeDraggable(win);

  this.attachControls(win);

  this.createTaskbarButton(app, win);

  return win;
};

/* ==========================================
   DRAGGING
========================================== */

OS.makeDraggable = function (win) {
  const bar = win.querySelector(".titleBar");

  let dragging = false;

  let offsetX = 0;

  let offsetY = 0;

  bar.addEventListener("mousedown", (e) => {
    dragging = true;

    offsetX = e.clientX - win.offsetLeft;

    offsetY = e.clientY - win.offsetTop;

    win.style.zIndex = ++this.zIndex;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    win.style.left = e.clientX - offsetX + "px";

    win.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
};

/* ==========================================
   WINDOW CONTROLS
========================================== */

OS.attachControls = function (win) {
  const id = win.dataset.app;

  win.querySelector(".close").onclick = () => {
    this.windows.delete(id);

    win.remove();

    const task = document.querySelector(`.runningApp[data-app="${id}"]`);

    if (task) task.remove();
  };

  win.querySelector(".minimize").onclick = () => {
    win.style.display = "none";
  };

  win.querySelector(".maximize").onclick = () => {
    if (win.classList.contains("max")) {
      win.classList.remove("max");

      win.style.left = "160px";

      win.style.top = "90px";

      win.style.width = "700px";

      win.style.height = "480px";
    } else {
      win.classList.add("max");

      win.style.left = "0";

      win.style.top = "0";

      win.style.width = "100%";

      win.style.height = "calc(100% - 78px)";
    }
  };
};

/* ==========================================
   TASKBAR
========================================== */

OS.createTaskbarButton = function (app, win) {
  const button = document.createElement("div");

  button.className = "runningApp";

  button.dataset.app = app.id;

  button.textContent = app.icon;

  button.onclick = () => {
    if (win.style.display === "none") {
      win.style.display = "block";

      win.style.zIndex = ++this.zIndex;
    } else {
      win.style.display = "none";
    }
  };

  this.dom.taskbar.appendChild(button);
};

/* ==========================================
   DESKTOP ICONS
========================================== */

document.querySelectorAll(".desktopIcon").forEach((icon) => {
  icon.ondblclick = () => {
    OS.launch(icon.dataset.app);
  };
});

/* ==========================================
   START MENU APPS
========================================== */

document.querySelectorAll(".appButton").forEach((button) => {
  button.onclick = () => {
    OS.launch(button.dataset.app);

    OS.dom.startMenu.style.display = "none";
  };
});
