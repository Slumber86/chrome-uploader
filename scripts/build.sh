# Build zip file for Chrome Web Store
rm -rf dist.zip
rm -rf dist
NODE_ENV=production node_modules/.bin/webpack -p --progress --colors --output-path dist/build
node scripts/cat-config.js > dist/build/config.js
cp manifest.json dist/
cp main.js dist/
cp index.html dist/
mkdir -p dist/images
cp images/*.png dist/images/
cp images/*.gif dist/images/
cp images/*.jpg dist/images/
mkdir -p dist/fonts
cp fonts/* dist/fonts
mkdir -p dist/sounds
cp sounds/* dist/sounds/
zip -r dist.zip dist
echo "Build complete: dist.zip"
