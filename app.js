const state = {
  data: null,
  lastResultText: "",
};

const els = {
  form: document.getElementById("generatorForm"),
  industry: document.getElementById("industrySelect"),
  product: document.getElementById("productSelect"),
  pain: document.getElementById("painSelect"),
  goal: document.getElementById("goalSelect"),
  angle: document.getElementById("angleSelect"),
  duration: document.getElementById("durationSelect"),
  generateButton: document.getElementById("generateButton"),
  modeBadge: document.getElementById("modeBadge"),
  emptyState: document.getElementById("emptyState"),
  loadingState: document.getElementById("loadingState"),
  resultContent: document.getElementById("resultContent"),
  reels: document.getElementById("reelsOutput"),
  captions: document.getElementById("captionsOutput"),
  ctas: document.getElementById("ctasOutput"),
  imagePrompts: document.getElementById("imagePromptsOutput"),
  capcut: document.getElementById("capcutOutput"),
  copyAll: document.getElementById("copyAllButton"),
  zaloTop: document.getElementById("zaloTop"),
  zaloBottom: document.getElementById("zaloBottom"),
  zaloPopup: document.getElementById("zaloPopup"),
  popupClose: document.getElementById("popupClose"),
  zaloPopupButton: document.getElementById("zaloPopupButton"),
  zaloLaterButton: document.getElementById("zaloLaterButton"),
};

function getSessionId() {
  const key = "ai_reel_session_id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, value);
  }
  return value;
}

function selectedTrackingPayload(extra = {}) {
  return {
    sessionId: getSessionId(),
    industryId: els.industry.value,
    productId: els.product.value,
    painId: els.pain.value,
    goalId: els.goal.value,
    angleId: els.angle.value,
    duration: els.duration.value,
    ...extra,
  };
}

function track(eventType, payload = {}) {
  const body = JSON.stringify({eventType, sessionId: getSessionId(), ...payload});
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], {type: "application/json"}));
    return;
  }
  fetch("/api/track", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body,
    keepalive: true,
  }).catch(() => {});
}

function trackZaloPageClickSafe(source = "zalo") {
  try {
    track("zalo_page_click", selectedTrackingPayload({source}));
  } catch (error) {}
}

function trackZaloGroupClickSafe(source = "zalo") {
  try {
    track("zalo_group_click", selectedTrackingPayload({source}));
  } catch (error) {}
}

function option(value, label) {
  const item = document.createElement("option");
  item.value = value;
  item.textContent = label;
  return item;
}

function fillSelect(select, items) {
  select.innerHTML = "";
  items.forEach((item) => select.appendChild(option(item.id, item.name)));
}

function getIndustryId() {
  return Number(els.industry.value);
}

function refreshDependentSelects() {
  const industryId = getIndustryId();
  fillSelect(els.product, state.data.products[industryId] || []);
  fillSelect(els.pain, state.data.pains[industryId] || []);
  fillSelect(els.goal, state.data.goals[industryId] || []);
  fillSelect(els.angle, state.data.angles[industryId] || []);
}

function setDefaultTestCase() {
  const spaIndustry = state.data.industries.find((item) => {
    const name = item.name.toLowerCase();
    return name.includes("spa") || name.includes("mỹ phẩm");
  });
  if (!spaIndustry) return;

  els.industry.value = String(spaIndustry.id);
  refreshDependentSelects();

  chooseByText(els.product, ["trị mụn", "mụn"]);
  chooseByText(els.pain, ["mụn"]);
  chooseByText(els.goal, ["inbox", "kéo inbox"]);
  chooseByText(els.angle, ["sai lầm"]);
  els.duration.value = "25s";
}

function chooseByText(select, keywords) {
  const options = Array.from(select.options);
  const found = options.find((item) => {
    const text = item.textContent.toLowerCase();
    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  });
  if (found) select.value = found.value;
}

function showLoading(isLoading) {
  els.generateButton.disabled = isLoading;
  els.generateButton.textContent = isLoading ? "ĐANG TẠO..." : "TẠO REEL";
  els.loadingState.classList.toggle("hidden", !isLoading);
  els.emptyState.classList.add("hidden");
}

function showError(message) {
  els.resultContent.classList.add("hidden");
  els.emptyState.classList.remove("hidden");
  els.emptyState.innerHTML = `<span class="error">${escapeHtml(message)}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderList(container, items) {
  container.innerHTML = "";
  (items || []).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    container.appendChild(li);
  });
}

function renderReels(scripts, hooks) {
  els.reels.innerHTML = "";
  (scripts || []).forEach((script, index) => {
    const card = document.createElement("section");
    card.className = "reel-card";

    const title = document.createElement("h4");
    title.textContent = `🎬 REEL #${index + 1}`;
    card.appendChild(title);

    const hook = document.createElement("div");
    hook.className = "reel-hook";
    hook.innerHTML = `<strong>HOOK:</strong><br>${escapeHtml(script.hook || hooks?.[index] || script.title || "")}`;
    card.appendChild(hook);

    (script.scenes || []).forEach((scene) => {
      const block = document.createElement("div");
      block.className = "scene";
      block.innerHTML = `
        <div class="scene-time">${escapeHtml((scene.time || "").toUpperCase())}</div>
        <div><strong>Cảnh:</strong><br>${escapeHtml(scene.visual || "")}</div>
        <div><strong>Voice:</strong><br>${escapeHtml(scene.voice || "")}</div>
        <div><strong>Text:</strong><br>${escapeHtml(scene.overlay || "")}</div>
      `;
      card.appendChild(block);
    });

    const cta = document.createElement("p");
    cta.innerHTML = `<strong>CTA:</strong> ${escapeHtml(script.cta || "")}`;
    card.appendChild(cta);
    els.reels.appendChild(card);
  });
}

function stringifyOutput(response) {
  const result = response.result;
  return [
    "3 REEL HOÀN CHỈNH",
    ...(result.scripts || []).flatMap((script, index) => [
      "================================",
      `🎬 REEL #${index + 1}`,
      "",
      "HOOK:",
      script.hook || result.hooks?.[index] || script.title || "",
      "",
      ...(script.scenes || []).flatMap((scene) => [
        String(scene.time || "").toUpperCase(),
        "",
        "Cảnh:",
        scene.visual || "",
        "",
        "Voice:",
        scene.voice || "",
        "",
        "Text:",
        scene.overlay || "",
        "",
      ]),
      "CTA:",
      script.cta || "",
      "",
    ]),
    "================================",
    "",
    "10 CAPTION",
    ...(result.captions || []).map((item, index) => `${index + 1}. ${item}`),
    "",
    "5 CTA",
    ...(result.ctas || []).map((item, index) => `${index + 1}. ${item}`),
    "",
    "3 PROMPT ẢNH/THUMBNAIL",
    ...(result.imagePrompts || []).map((item, index) => `${index + 1}. ${item}`),
    "",
    "HƯỚNG DẪN CAPCUT",
    ...(result.capcutGuide || []).map((item, index) => `${index + 1}. ${item}`),
  ].join("\n");
}

function renderResult(response) {
  const result = response.result;
  renderReels(result.scripts, result.hooks);
  renderList(els.captions, result.captions);
  renderList(els.ctas, result.ctas);
  renderList(els.imagePrompts, result.imagePrompts);
  renderList(els.capcut, result.capcutGuide);
  state.lastResultText = stringifyOutput(response);

  const modeText = response.mode === "openai" ? "OpenAI API" : "Demo Mode";
  els.modeBadge.textContent = `Chế độ: ${modeText}`;
  els.emptyState.classList.add("hidden");
  els.resultContent.classList.remove("hidden");
  showZaloPopup();
}

function blockTextById(id) {
  const el = document.getElementById(id);
  if (!el) return "";

  if (el.tagName === "OL") {
    return Array.from(el.querySelectorAll("li"))
      .map((li, index) => `${index + 1}. ${li.textContent.trim()}`)
      .join("\n");
  }

  if (id === "reelsOutput") {
    return Array.from(el.querySelectorAll(".reel-card"))
      .map((card) => card.innerText.trim())
      .join("\n\n");
  }

  return el.textContent.trim();
}

async function copyText(text, button) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
  const oldText = button.textContent;
  button.textContent = "Đã copy";
  setTimeout(() => {
    button.textContent = oldText;
  }, 1200);
}

async function submitForm(event) {
  event.preventDefault();
  showLoading(true);
  els.resultContent.classList.add("hidden");

  const payload = {
    industryId: els.industry.value,
    productId: els.product.value,
    painId: els.pain.value,
    goalId: els.goal.value,
    angleId: els.angle.value,
    duration: els.duration.value,
  };

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Không tạo được nội dung.");
    renderResult(data);
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

function showZaloPopup() {
  if (!els.zaloPopup) return;
  els.zaloPopup.classList.remove("hidden");
}

function hideZaloPopup() {
  if (!els.zaloPopup) return;
  els.zaloPopup.classList.add("hidden");
}

function closeGiftPopupSafe() {
  try {
    hideZaloPopup();
    document.body.classList.remove("modal-open", "popup-open");
    document.body.style.overflow = "";
  } catch (error) {}
}

async function init() {
  try {
    const response = await fetch("/api/options");
    state.data = await response.json();
    fillSelect(els.industry, state.data.industries);
    refreshDependentSelects();
    setDefaultTestCase();
    els.modeBadge.textContent = state.data.demoMode ? "Chế độ: Demo Mode" : "Chế độ: OpenAI API";
    track("visit", {page: "home"});
  } catch (error) {
    showError(`Không đọc được database: ${error.message}`);
  }
}

els.industry.addEventListener("change", refreshDependentSelects);
els.form.addEventListener("submit", submitForm);
els.copyAll.addEventListener("click", () => copyText(state.lastResultText, els.copyAll));
els.popupClose.addEventListener("click", hideZaloPopup);
els.zaloLaterButton.addEventListener("click", hideZaloPopup);
els.zaloPopup.addEventListener("click", (event) => {
  if (event.target === els.zaloPopup) hideZaloPopup();
});
[els.zaloTop, els.zaloBottom].forEach((button) => {
  button.addEventListener("click", () => {
    trackZaloPageClickSafe(button.id || "zalo");
    showZaloPopup();
  });
});
els.zaloPopupButton.addEventListener("click", () => {
  trackZaloGroupClickSafe("zaloPopupButton");
  closeGiftPopupSafe();
});
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-target]");
  if (!button) return;
  copyText(blockTextById(button.dataset.copyTarget), button);
});

init();
