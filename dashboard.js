const visitsMetric = document.getElementById("visitsMetric");
const generateMetric = document.getElementById("generateMetric");
const zaloMetric = document.getElementById("zaloMetric");
const conversionMetric = document.getElementById("conversionMetric");
const topIndustries = document.getElementById("topIndustries");
const sheetStatus = document.getElementById("sheetStatus");

function renderTopIndustries(items) {
  topIndustries.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("li");
    empty.textContent = "Chưa có lượt generate.";
    topIndustries.appendChild(empty);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.industry}</strong><span>${item.count} lượt</span>`;
    topIndustries.appendChild(li);
  });
}

async function loadDashboard() {
  const response = await fetch("/api/dashboard");
  const data = await response.json();
  visitsMetric.textContent = data.visits;
  generateMetric.textContent = data.generates;
  zaloMetric.textContent = data.zaloClicks;
  conversionMetric.textContent = `${data.conversionRate}%`;
  renderTopIndustries(data.topIndustries || []);
  sheetStatus.textContent = data.googleSheetEnabled
    ? "Đang bật đồng bộ Google Sheet qua GOOGLE_SHEET_WEBHOOK_URL."
    : "Chưa cấu hình GOOGLE_SHEET_WEBHOOK_URL. Tracking vẫn được lưu local trong tracking_events.jsonl.";
}

loadDashboard().catch((error) => {
  sheetStatus.textContent = `Không tải được dashboard: ${error.message}`;
});

setInterval(loadDashboard, 10000);
