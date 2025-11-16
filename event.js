// ===============================
// DailyClassBoard - Final event.js
// ===============================

// ---------- Element references ----------
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const settingsOverlay = document.getElementById("settingsOverlay");
const closeSettings = document.getElementById("closeSettings");

const darkModeBtn = document.getElementById("darkModeBtn");
const lightModeBtn = document.getElementById("lightModeBtn");
const langBtn = document.getElementById("langBtn");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const studentLoginBtn = document.getElementById("studentLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginModal = document.getElementById("loginModal");
const loginSubmit = document.getElementById("loginSubmit");
const loginMsg = document.getElementById("loginMsg");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const viewBtn = document.getElementById("viewBtn");
const addBtn = document.getElementById("addBtn");
const addTypeModal = document.getElementById("addTypeModal");
const addNoticeBtn = document.getElementById("addNoticeBtn");
const addVoteBtn = document.getElementById("addVoteBtn");

const formModal = document.getElementById("formModal");
const formContainer = document.getElementById("formContainer");

const searchBox = document.getElementById("searchBox");
const searchSubmit = document.getElementById("searchSubmit");
const noticeList = document.getElementById("noticeList");

const deleteModal = document.getElementById("deleteModal");
const deletePassInput = document.getElementById("deletePass");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
const deleteMsg = document.getElementById("deleteMsg");

// ---------- App State ----------
let data = [
  {
    id: 1,
    type: "notice",
    title: "Exam Routine 2025 Published",
    body: "The final exam routine for 2025 has been published.",
    date: "2025-11-06",
  },
  {
    id: 2,
    type: "vote",
    title: "Vote for Class Representative",
    body: "Please vote below.",
    options: ["Rahim", "Karim", "Selina"],
  },
];

let currentUser = "guest";
let currentView = "student";
let isBangla = false;
let nextId = 3;
let pendingDeleteId = null;

// ---------- Language ----------
const TEXT = {
  bn: {
    title: "📋 DailyClassBoard",
    dark: "🌙 ডার্ক মোড",
    light: "☀️ লাইট মোড",
    language: "🌐 ভাষা",
    adminLogin: "🔐 অ্যাডমিন লগইন",
    loginAdminOK: "✅ লগইন সফল!",
    loginStudentOK: "✅ স্টুডেন্ট লগইন সফল!",
    loginInvalid: "❌ ভুল তথ্য!",
    addNotice: "📢 নোটিশ যোগ করুন",
    addVote: "🗳️ ভোট যোগ করুন",
    deleteFail: "❌ ভুল পাসওয়ার্ড",
    searchPlaceholder: "🔍 সার্চ করুন...",
    viewStudent: "👀 Student View",
    viewAdmin: "🧑‍🏫 Admin View",
  },
  en: {
    title: "📋 DailyClassBoard",
    dark: "🌙 Dark Mode",
    light: "☀️ Light Mode",
    language: "🌐 Language",
    adminLogin: "🔐 Admin Login",
    loginAdminOK: "✅ Admin logged in!",
    loginStudentOK: "✅ Student logged in!",
    loginInvalid: "❌ Invalid credentials!",
    addNotice: "📢 Add Notice",
    addVote: "🗳️ Add Vote",
    deleteFail: "❌ Incorrect password",
    searchPlaceholder: "🔍 Search...",
    viewStudent: "👀 Student View",
    viewAdmin: "🧑‍🏫 Admin View",
  },
};

function t(key) {
  return isBangla ? TEXT.bn[key] : TEXT.en[key];
}

// ---------- Settings Panel ----------
function closeSettingsPanel() {
  settingsPanel.classList.remove("open");
  settingsOverlay.style.display = "none";
}

settingsBtn.addEventListener("click", () => {
  const isOpen = settingsPanel.classList.toggle("open");
  settingsOverlay.style.display = isOpen ? "block" : "none";
});

settingsOverlay.addEventListener("click", closeSettingsPanel);
closeSettings.addEventListener("click", closeSettingsPanel);

document.querySelectorAll("#settingsPanel button").forEach((btn) =>
  btn.addEventListener("click", closeSettingsPanel)
);

// ---------- Auto Device Theme (First Load) ----------
function autoDeviceTheme() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", autoDeviceTheme);

// Run on first load
autoDeviceTheme();

// ---------- Manual Theme ----------
darkModeBtn.addEventListener("click", () => applyTheme("dark"));
lightModeBtn.addEventListener("click", () => applyTheme("light"));

function applyTheme(theme) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);

  const bgImg = theme === "dark" ? "darkmode.png" : "lightmode.png";
  document.body.style.backgroundImage = `url('${bgImg}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundAttachment = "fixed";

  settingsPanel.style.backgroundImage = `url('${bgImg}')`;
  settingsPanel.style.backgroundSize = "cover";
}

// ---------- Language ----------
langBtn.addEventListener("click", () => {
  isBangla = !isBangla;
  refreshLanguageUI();
});

function refreshLanguageUI() {
  document.querySelector("header h1").textContent = t("title");
  darkModeBtn.textContent = t("dark");
  lightModeBtn.textContent = t("light");
  adminLoginBtn.textContent = t("adminLogin");
  studentLoginBtn.textContent = "👨‍🎓 Student Login";
  logoutBtn.textContent = "🚪 Logout";
  langBtn.textContent = isBangla ? "🌐 Language: বাংলা" : "🌐 Language: English";
  searchBox.placeholder = t("searchPlaceholder");
  updateView();
}

// ---------- Login ----------
adminLoginBtn.addEventListener("click", () => (loginModal.style.display = "flex"));
studentLoginBtn.addEventListener("click", () => {
  loginModal.style.display = "flex";
  usernameInput.value = "student";
  passwordInput.value = "";
});

loginSubmit.addEventListener("click", () => {
  const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();

  if (u === "admin" && p === "1234") {
    currentUser = "admin";
    currentView = "admin";
    loginModal.style.display = "none";
  } else if (u === "student" && p === "0000") {
    currentUser = "student";
    currentView = "student";
    loginModal.style.display = "none";
  } else {
    loginMsg.textContent = t("loginInvalid");
  }

  updateView();
});

loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) loginModal.style.display = "none";
});

// ---------- Logout ----------
logoutBtn.addEventListener("click", () => {
  currentUser = "guest";
  currentView = "student";
  updateView();
});

// ---------- View Toggle ----------
viewBtn.addEventListener("click", () => {
  if (currentUser === "admin") {
    currentView = currentView === "admin" ? "student" : "admin";
  }
  updateView();
});

function updateView() {
  if (currentUser === "admin" && currentView === "admin") {
    viewBtn.textContent = t("viewAdmin");
    addBtn.style.display = "inline-block";
  } else {
    viewBtn.textContent = t("viewStudent");
    addBtn.style.display = "none";
  }
  renderNotices();
}

// ---------- Search ----------
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(html, query) {
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return html.replace(regex, "<mark>$1</mark>");
}

function searchNotices() {
  const query = searchBox.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".notice-card");

  cards.forEach((card) => {
    const original = card.dataset.original;
    if (!query) {
      card.innerHTML = original;
      card.style.display = "block";
    } else {
      const lower = original.toLowerCase();
      if (lower.includes(query)) {
        card.innerHTML = highlightText(original, query);
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    }
  });
}

searchSubmit.addEventListener("click", searchNotices);
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchNotices();
});

// ---------- Add Notice/Vote ----------
addBtn.addEventListener("click", () => {
  if (currentUser !== "admin") return;
  addTypeModal.style.display = "flex";
});

addTypeModal.addEventListener("click", (e) => {
  if (e.target === addTypeModal) addTypeModal.style.display = "none";
});

addNoticeBtn.addEventListener("click", () => {
  addTypeModal.style.display = "none";
  formModal.style.display = "flex";

  formContainer.innerHTML = `
    <h3>${t("addNotice")}</h3>
    <input id="noticeTitle" placeholder="Title" />
    <textarea id="noticeBody" placeholder="Details..."></textarea>
    <button id="submitNotice">Submit</button>
    <button id="cancelForm">Cancel</button>
  `;
});

addVoteBtn.addEventListener("click", () => {
  addTypeModal.style.display = "none";
  formModal.style.display = "flex";

  formContainer.innerHTML = `
    <h3>${t("addVote")}</h3>
    <input id="voteTitle" placeholder="Vote Title" />
    <input class="voteOption" placeholder="Option 1" />
    <input class="voteOption" placeholder="Option 2" />
    <button id="submitVote">Submit</button>
    <button id="cancelForm2">Cancel</button>
  `;
});

formModal.addEventListener("click", (e) => {
  if (e.target === formModal) formModal.style.display = "none";
});

document.addEventListener("click", (e) => {
  if (e.target.id === "cancelForm" || e.target.id === "cancelForm2") {
    formModal.style.display = "none";
  }

  if (e.target.id === "submitNotice") {
    const title = document.getElementById("noticeTitle").value.trim();
    const body = document.getElementById("noticeBody").value.trim();

    if (title && body) {
      data.unshift({
        id: nextId++,
        type: "notice",
        title,
        body,
        date: new Date().toISOString().split("T")[0],
      });
      formModal.style.display = "none";
      renderNotices();
    }
  }

  if (e.target.id === "submitVote") {
    const title = document.getElementById("voteTitle").value.trim();
    const options = Array.from(document.querySelectorAll(".voteOption"))
      .map((o) => o.value.trim())
      .filter((v) => v);

    if (title && options.length >= 2) {
      data.unshift({
        id: nextId++,
        type: "vote",
        title,
        body: "Please vote below.",
        options,
      });
      formModal.style.display = "none";
      renderNotices();
    }
  }
});

// ---------- Voting ----------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("vote-btn")) {
    const selected = e.target.dataset.vote;
    const parent = e.target.closest(".vote-options");

    parent.innerHTML = `<p>✅ You voted: <b>${selected}</b></p>`;
  }
});

// ---------- Delete ----------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    pendingDeleteId = Number(e.target.dataset.id);
    deleteModal.style.display = "flex";
  }
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

confirmDeleteBtn.addEventListener("click", () => {
  const pass = deletePassInput.value;

  if (pass === "1234") {
    data = data.filter((item) => item.id !== pendingDeleteId);
    deleteModal.style.display = "none";
    renderNotices();
  } else {
    deleteMsg.textContent = t("deleteFail");
    setTimeout(() => (deleteMsg.textContent = ""), 2000);
  }
});

// ---------- Render ----------
function escapeHtml(text) {
  return text.replace(/[&<>]/g, (tag) => ({ '&':"&amp;","<":"&lt;",">":"&gt;" }[tag]));
}

function renderNotices() {
  noticeList.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "notice-card";

    if (item.type === "notice") {
      card.innerHTML = `
        <h3>📢 ${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
        <small>${item.date}</small>`;
    } else {
      card.innerHTML = `
        <h3>🗳️ ${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
        <div class="vote-options">
          ${item.options
            .map(
              (opt) =>
                `<button class="vote-btn" data-vote="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`
            )
            .join("")}
        </div>`;
    }

    if (currentUser === "admin" && currentView === "admin") {
      const del = document.createElement("button");
      del.className = "delete-btn";
      del.dataset.id = item.id;
      del.innerHTML = "🗑️";
      card.appendChild(del);
    }

    card.dataset.original = card.innerHTML;
    noticeList.appendChild(card);
  });
}

// ---------- Init ----------
refreshLanguageUI();
renderNotices();
updateView();
settingsPanel.classList.remove("open");
settingsOverlay.style.display = "none";

// ---------- Home Button ----------
function goHome() {
  window.location.href = "home.html";
}
