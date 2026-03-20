source ~/.zshrc

git checkout main
git pull
npm install --include=dev
npm run build
pm2 restart maple_frontend

