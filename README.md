# Máy Tạo Reel AI MVP

Web 1 trang, mobile-first, đọc dữ liệu từ:

`D:\AI thực chiến 30 ngày\DATABASE_MARKETING.xlsx`

## Chạy local

```powershell
cd "D:\AI thực chiến 30 ngày\AI_REEL_GENERATOR_MVP"
python server.py
```

Mở trình duyệt:

```text
http://127.0.0.1:8088
```

Dashboard tracking:

```text
http://127.0.0.1:8088/dashboard.html
```

## Chạy với OpenAI API

Nếu chưa có API key, tool tự chạy Demo Mode.

Nếu có API key:

```powershell
$env:OPENAI_API_KEY="sk-..."
$env:OPENAI_MODEL="gpt-4.1-mini"
python server.py
```

## Link Zalo

Link mặc định:

```text
https://zalo.me/g/9uomhrx1pwhmhosltoze
```

Có thể đổi link Zalo bằng biến môi trường:

```powershell
$env:ZALO_URL="https://zalo.me/g/your-real-group"
python server.py
```

## Tracking

App đo:

- Visits
- Generate
- Click Zalo
- Conversion Rate
- Ngành nghề được generate nhiều nhất

Tracking local lưu vào:

```text
tracking_events.jsonl
```

Muốn lưu vào Google Sheet, cấu hình:

```powershell
$env:GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/xxx/exec"
python server.py
```

Xem chi tiết trong `GOOGLE_SHEET_SETUP.md`.

## File chính

- `server.py`: đọc Excel, tạo prompt, gọi OpenAI API hoặc Demo Mode.
- `index.html`: giao diện 1 trang.
- `styles.css`: giao diện mobile-first.
- `app.js`: dropdown phụ thuộc theo ngành, gọi API, render kết quả, copy từng phần.

## Output tạo ra

- 3 Reel hoàn chỉnh đúng thời lượng, mỗi Reel có HOOK + timeline + Cảnh + Voice + Text
- 10 Caption
- 5 CTA
- 3 Prompt tạo ảnh/thumbnail
- 1 hướng dẫn dựng trong CapCut
