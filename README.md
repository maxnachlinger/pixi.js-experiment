pixi.js experiment
==================

Install dependencies:
```shell
npm i -g webpack gulp; npm i; cd server; npm i;
```

Develop:
```shell
node server/index.js & gulp
```
Then go to: [http://localhost:8080/](http://localhost:8080/)  

Deploy:
```shell
gulp deploy # writes things to /client/dist
```

Shiny things used on the client:
- PixiJS
- Webpack

Shiny things used on the server:
- Hapi

Shiny things used in the build:
- Gulp
- Webpack