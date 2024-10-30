npm run build
mkdir -p dist/micro/
cd projects/sub-project/
npm run build
cd ../..
mv projects/sub-project/dist dist/micro/sub1

cd projects/react-project/
npm run build
cd ../..
mv projects/react-project/dist dist/micro/sub2