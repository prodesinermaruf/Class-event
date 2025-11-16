// ===============================
// Final event.js for DailyClassBoard (Dark/Light BG Image Version)
// Default Language: English 🌐
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

// ---------- App state ----------
let data = [
  {
    id: 1,
    type: "notice",
    title: "Exam Routine 2025 Published",
    body: "The final exam routine for 2025 has been published. Please check the notice board.",
    date: "2025-11-06",
  },
  {
    id: 2,
    type: "vote",
    title: "Vote for Class Representative",
    body: "Please select your class representative by voting below.",
    options: ["Rahim", "Karim", "Selina"],
  },
];

let currentUser = "guest";
let currentView = "student";
let isBangla = false; // ⬅️ Default language set to English
let nextId = 3;
let pendingDeleteId = null;

// ---------- Language text ----------
const TEXT = {
  bn: {
    title: "📋 DailyClassBoard",
    dark: "🌙 ডার্ক মোড",
    light: "☀️ লাইট মোড",
    language: "🌐 ভাষা",
    adminLogin: "🔐 অ্যাডমিন লগইন",
    loginAdminOK: "✅ অ্যাডমিন লগইন সফল!",
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
    studentLogin: "🎓 Student Login",
    logout: "🚪 Logout",
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

// ---------- Helpers ----------
function closeSettingsPanel() {
  settingsPanel.classList.remove("open");
  settingsOverlay.style.display = "none";
}
document.querySelectorAll("#settingsPanel button").forEach((btn) =>
  btn.addEventListener("click", closeSettingsPanel)
);

// ---------- Settings open/close ----------
settingsBtn.addEventListener("click", () => {
  const isOpen = settingsPanel.classList.toggle("open");
  settingsOverlay.style.display = isOpen ? "block" : "none";
});
closeSettings.addEventListener("click", closeSettingsPanel);
settingsOverlay.addEventListener("click", closeSettingsPanel);

// ---------- Theme (dark/light + bg image) ----------
function applyTheme(theme) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);

  const bgImg = theme === "dark" ? "darkmode.png" : "lightmode.png";
  document.body.style.backgroundImage = `url('${bgImg}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundAttachment = "fixed";
  settingsPanel.style.backgroundImage = `url('${bgImg}')`;
  settingsPanel.style.backgroundSize = "cover";
}
darkModeBtn.addEventListener("click", () => applyTheme("dark"));
lightModeBtn.addEventListener("click", () => applyTheme("light"));
window.addEventListener("load", () => {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
});

// ---------- Language ----------
langBtn.addEventListener("click", () => {
  isBangla = !isBangla;
  refreshLanguageUI();
});
function refreshLanguageUI() {
  document.querySelector("header h1").textContent = t("title");
  darkModeBtn.textContent = t("dark");
  lightModeBtn.textContent = t("light");
  langBtn.textContent = isBangla ? "🌐 Language: বাংলা" : "🌐 Language: English";
  adminLoginBtn.textContent = t("adminLogin");
  studentLoginBtn.textContent = t("studentLogin");
  logoutBtn.textContent = t("logout");
  searchBox.setAttribute("placeholder", t("searchPlaceholder"));
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
    loginMsg.textContent = t("loginAdminOK");
    loginModal.style.display = "none";
  } else if (u === "student" && p === "0000") {
    currentUser = "student";
    currentView = "student";
    loginMsg.textContent = t("loginStudentOK");
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

// ---------- View toggle ----------
viewBtn.addEventListener("click", () => {
  if (currentUser === "admin") {
    currentView = currentView === "admin" ? "student" : "admin";
  } else currentView = "student";
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
  if (!query) return html;
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
      } else card.style.display = "none";
    }
  });
}
searchSubmit.addEventListener("click", searchNotices);
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchNotices();
});

// ---------- Add Notice/Vote ----------
addBtn.addEventListener("click", () => {
  if (currentUser !== "admin" || currentView !== "admin") return;
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
    <input id="noticeTitle" placeholder="${isBangla ? "শিরোনাম" : "Title"}" />
    <textarea id="noticeBody" placeholder="${isBangla ? "বিস্তারিত লিখুন..." : "Details..."}"></textarea>
    <div style="margin-top:10px;display:flex;gap:8px;justify-content:center;">
      <button id="submitNotice">${isBangla ? "দাখিল করুন" : "Submit"}</button>
      <button id="cancelForm">Cancel</button>
    </div>`;
});
addVoteBtn.addEventListener("click", () => {
  addTypeModal.style.display = "none";
  formModal.style.display = "flex";
  formContainer.innerHTML = `
    <h3>${t("addVote")}</h3>
    <input id="voteTitle" placeholder="${isBangla ? "ভোট শিরোনাম" : "Vote Title"}" />
    <div id="voteOptionsContainer" style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
      <input class="voteOption" placeholder="${isBangla ? 'অপশন 1' : 'Option 1'}" />
      <input class="voteOption" placeholder="${isBangla ? 'অপশন 2' : 'Option 2'}" />
    </div>
    <div style="margin-top:8px;display:flex;gap:8px;align-items:center;justify-content:center;">
      <img src="add2.png" id="addVoteOption" style="width:28px;cursor:pointer;" />
      <button id="submitVote">${isBangla ? 'দাখিল করুন' : 'Submit'}</button>
      <button id="cancelForm2">Cancel</button>
    </div>`;
  const container = document.getElementById("voteOptionsContainer");
  const addOptionBtn = document.getElementById("addVoteOption");
  addOptionBtn.addEventListener("click", () => {
    const count = container.querySelectorAll(".voteOption").length;
    if (count < 10) {
      const input = document.createElement("input");
      input.className = "voteOption";
      input.placeholder = `${isBangla ? 'অপশন ' : 'Option '}${count + 1}`;
      container.appendChild(input);
    }
  });
});
formModal.addEventListener("click", (e) => {
  if (e.target === formModal) formModal.style.display = "none";
});
document.addEventListener("click", (e) => {
  if (e.target.id === "cancelForm" || e.target.id === "cancelForm2") formModal.style.display = "none";
  if (e.target.id === "submitNotice") {
    const title = document.getElementById("noticeTitle").value.trim();
    const body = document.getElementById("noticeBody").value.trim();
    if (title && body) {
      data.unshift({ id: nextId++, type: "notice", title, body, date: new Date().toISOString().split("T")[0] });
      renderNotices();
      formModal.style.display = "none";
    }
  }
  if (e.target.id === "submitVote") {
    const title = document.getElementById("voteTitle").value.trim();
    const options = Array.from(document.querySelectorAll(".voteOption")).map(i => i.value.trim()).filter(v => v);
    if (title && options.length >= 2) {
      data.unshift({ id: nextId++, type: "vote", title, body: "Please vote below.", options });
      renderNotices();
      formModal.style.display = "none";
    }
  }
});

// ---------- Vote ----------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("vote-btn")) {
    const selected = e.target.dataset.vote;
    const parent = e.target.closest(".vote-options");
    if (parent) parent.innerHTML = `<p>✅ ${isBangla ? "আপনি ভোট দিয়েছেন" : "You voted"}: <b>${selected}</b></p>`;
  }
});

// ---------- Delete ----------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    pendingDeleteId = Number(e.target.dataset.id);
    deleteModal.style.display = "flex";
  }
});
cancelDeleteBtn.addEventListener("click", () => (deleteModal.style.display = "none"));
confirmDeleteBtn.addEventListener("click", () => {
  const pass = deletePassInput.value;
  if (pass === "1234" && pendingDeleteId != null) {
    data = data.filter((item) => item.id !== pendingDeleteId);
    deleteModal.style.display = "none";
    renderNotices();
  } else {
    deleteMsg.textContent = t("deleteFail");
    setTimeout(() => (deleteMsg.textContent = ""), 2000);
  }
});

// ---------- Render ----------
function escapeHtml(unsafe) {
  return (unsafe + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function renderNotices() {
  noticeList.innerHTML = "";
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "notice-card";
    card.innerHTML =
      item.type === "notice"
        ? `<h3>📢 ${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p><small>📅 ${item.date || ""}</small>`
        : `<h3>🗳️ ${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p><div class="vote-options">${item.options
            .map((opt) => `<button class="vote-btn" data-vote="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`)
            .join("")}</div>`;
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

// 🏠 Go Home Function
function goHome() {
  window.location.href = "home.html";
}

// ✅ Load saved theme globally
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.remove("light", "dark");
  document.body.classList.add(savedTheme);
});
