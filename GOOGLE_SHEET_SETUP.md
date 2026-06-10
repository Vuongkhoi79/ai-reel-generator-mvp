# Lưu tracking vào Google Sheet

App hỗ trợ gửi tracking sang Google Sheet qua biến môi trường:

```text
GOOGLE_SHEET_WEBHOOK_URL
```

Nếu biến này chưa có, tracking vẫn được lưu local trong:

```text
tracking_events.jsonl
```

## 1. Tạo Google Sheet

Tạo file Google Sheet mới, đặt tên ví dụ:

```text
AI Reel Tracking
```

Tạo sheet đầu tiên tên:

```text
Events
```

Thêm hàng tiêu đề:

```text
timestamp | eventType | sessionId | industryName | productName | painPoint | goalName | angleName | duration | source | mode | ip | userAgent
```

## 2. Tạo Apps Script

Trong Google Sheet:

1. Chọn `Extensions`.
2. Chọn `Apps Script`.
3. Dán code này:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Events');
  const event = JSON.parse(e.postData.contents);
  const payload = event.payload || {};

  sheet.appendRow([
    event.timestamp || '',
    event.eventType || '',
    payload.sessionId || '',
    payload.industryName || '',
    payload.productName || '',
    payload.painPoint || '',
    payload.goalName || '',
    payload.angleName || '',
    payload.duration || '',
    payload.source || '',
    payload.mode || '',
    event.ip || '',
    event.userAgent || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy Apps Script

1. Chọn `Deploy`.
2. Chọn `New deployment`.
3. Chọn type `Web app`.
4. Execute as: `Me`.
5. Who has access: `Anyone`.
6. Bấm `Deploy`.
7. Copy `Web app URL`.

## 4. Thêm vào Render

Trong Render Web Service, vào `Environment`, thêm:

```text
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/xxx/exec
```

Deploy lại service.

## 5. Kiểm tra

Mở tool public:

1. Vào trang chủ để ghi event `visit`.
2. Bấm `TẠO REEL` để ghi event `generate`.
3. Bấm nút Zalo để ghi event `zalo_click`.
4. Mở Google Sheet, kiểm tra sheet `Events`.
5. Mở dashboard:

```text
/dashboard.html
```
