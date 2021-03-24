# Ringface Angular and Express backend

This is an nx project for all the javascript of the solution. 

## How to run
```bash
npm install
# start the backend for frontend (express)
npm run bff
# start the webpack bundled angular
ng s
```

After this, you can visit the GUI at http://localhost:4200

For the full functionality, you will need to start the processes in the [db](https://github.com/ring-face/ringface-db), [classifier](https://github.com/ring-face/ringface-classifier) and [connector](https://github.com/ring-face/ringface-connector) projects. 

Also, you must adjust your DATA_DIR in the [.env](.env) file. The data dir point to the shared volume with the images and videos.
