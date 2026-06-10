function getZaloSessionId() {
  const key = "ai_reel_session_id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, value);
  }
  return value;
}

function trackZaloPage(eventType, payload = {}) {
  const body = JSON.stringify({eventType, sessionId: getZaloSessionId(), page: "zalo", ...payload});
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

trackZaloPage("zalo_page_view");

document.getElementById("zaloGroupButton").addEventListener("click", () => {
  trackZaloPage("zalo_group_click", {source: "zalo_html_button"});
});
