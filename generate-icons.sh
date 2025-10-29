# Save this as generate-icons.sh
#!/bin/bash
cd ios/App/App/Assets.xcassets/AppIcon.appiconset

if [ ! -f "Icon-1024.png" ]; then
  echo "Error: Icon-1024.png not found!"
  exit 1
fi

# Generate iPad icons
sips -z 20 20 Icon-1024.png --out Icon-20.png
sips -z 29 29 Icon-1024.png --out Icon-29.png
sips -z 40 40 Icon-1024.png --out Icon-40.png
sips -z 76 76 Icon-1024.png --out Icon-76.png
sips -z 152 152 Icon-1024.png --out Icon-76@2x.png
sips -z 167 167 Icon-1024.png --out Icon-83.5@2x.png

echo "✅ iPad icons generated!"