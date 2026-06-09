# Deploy Máy Tạo Reel AI lên Render

## 1. Chuẩn bị GitHub repo

Mở PowerShell:

```powershell
cd "D:\AI thực chiến 30 ngày\AI_REEL_GENERATOR_MVP"
git init
git add .
git commit -m "Deploy AI Reel Generator MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-reel-generator-mvp.git
git push -u origin main
```

Nếu repo đã tồn tại và đã có remote:

```powershell
cd "D:\AI thực chiến 30 ngày\AI_REEL_GENERATOR_MVP"
git add .
git commit -m "Prepare Render deploy"
git push
```

## 2. Tạo Web Service trên Render

1. Vào `https://dashboard.render.com`.
2. Chọn `New`.
3. Chọn `Web Service`.
4. Connect GitHub.
5. Chọn repo `ai-reel-generator-mvp`.
6. Render sẽ đọc `render.yaml` nếu dùng Blueprint, hoặc bạn nhập thủ công các lệnh bên dưới.

## 3. Cấu hình service

Runtime:

```text
Python
```

Build Command:

```text
pip install -r requirements.txt
```

Start Command:

```text
python server.py
```

## 4. Biến môi trường

Trong tab `Environment`, thêm:

```text
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
```

Tùy chọn:

```text
ZALO_URL=https://zalo.me/g/9uomhrx1pwhmhosltoze
```

Nếu không có `OPENAI_API_KEY`, app vẫn chạy Demo Mode.

## 5. Lấy URL public

Sau khi Render build xong và service chuyển sang trạng thái `Live`, URL public nằm ở đầu trang service, dạng:

```text
https://ai-reel-generator-mvp.onrender.com
```

Kiểm tra:

```text
https://ai-reel-generator-mvp.onrender.com/
https://ai-reel-generator-mvp.onrender.com/api/options
```

Test generate bằng giao diện web hoặc gọi `POST /api/generate`.
