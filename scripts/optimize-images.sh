#!/bin/bash
# Optimize all gallery images for web performance
# Uses macOS built-in `sips` to resize and convert to JPEG

set -e

PHOTOS_DIR="static/photos"
MAX_WIDTH=2048
JPEG_QUALITY=82

echo "=== Gallery Image Optimizer ==="
echo "Max width: ${MAX_WIDTH}px | JPEG quality: ${JPEG_QUALITY}"
echo ""
echo "🔧 Optimizing images..."

find "$PHOTOS_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
    filename=$(basename "$img")
    dirname=$(dirname "$img")
    ext=$(echo "${filename##*.}" | tr '[:upper:]' '[:lower:]')
    name="${filename%.*}"
    original_size=$(stat -f%z "$img" 2>/dev/null || echo 0)

    # Get current width
    current_width=$(sips -g pixelWidth "$img" 2>/dev/null | tail -1 | awk '{print $2}')

    # Resize if wider than MAX_WIDTH
    if [ "$current_width" -gt "$MAX_WIDTH" ] 2>/dev/null; then
        echo "  📐 Resizing: $filename (${current_width}px → ${MAX_WIDTH}px)"
        sips --resampleWidth "$MAX_WIDTH" "$img" --out "$img" > /dev/null 2>&1
    fi

    # Convert PNG to JPEG
    if [ "$ext" = "png" ]; then
        new_path="${dirname}/${name}.jpg"
        echo "  🔄 PNG→JPG: $filename"
        sips -s format jpeg -s formatOptions "$JPEG_QUALITY" "$img" --out "$new_path" > /dev/null 2>&1
        rm "$img"
    elif [ "$ext" = "jpg" ] || [ "$ext" = "jpeg" ]; then
        # Re-compress JPEG at target quality
        sips -s formatOptions "$JPEG_QUALITY" "$img" --out "$img" > /dev/null 2>&1
    fi

    new_img="$img"
    if [ "$ext" = "png" ]; then
        new_img="${dirname}/${name}.jpg"
    fi
    new_size=$(stat -f%z "$new_img" 2>/dev/null || echo 0)
    
    orig_kb=$((original_size / 1024))
    new_kb=$((new_size / 1024))
    echo "    ${orig_kb}KB → ${new_kb}KB"
done

echo ""
echo "=== Done ==="
