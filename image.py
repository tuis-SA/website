from PIL import Image

# 画像読み込み
image_path = "C:\\Users\\nishineko\\Desktop\\backimage_school.jpg"
original_image = Image.open(image_path)

# 元のサイズとアスペクト比
width, height = original_image.size
original_ratio = height / width
target_ratio = 16 / 9  # スマホ向け比率（縦長）

# 上部20%の画像を切り出す
top_20_height = int(height * 0.2)
top_20_image = original_image.crop((0, 0, width, top_20_height))

# 必要な高さを計算（9:16を満たすまで）
required_height = int(width * target_ratio)
extra_height_needed = max(0, required_height - height)

# 上部20%画像を何回繰り返せばよいか
repeat_count = (extra_height_needed + top_20_height - 1) // top_20_height

# 新しい高さ（繰り返した分 + 元画像）
new_height = repeat_count * top_20_height + height

# 新しい画像作成
new_image = Image.new("RGB", (width, new_height))

# 上部20%を繰り返し貼り付け
for i in range(repeat_count):
    new_image.paste(top_20_image, (0, i * top_20_height))

# 元画像をその下に貼り付け
new_image.paste(original_image, (0, repeat_count * top_20_height))

# 表示
new_image.show()

# 保存する場合は以下を有効に
# new_image.save("C:\\Users\\nishineko\\Desktop\\backimage_school_vertical_extended.jpg")
