npm init
npm install node-sass --save-dev

#add to package.json
"scripts": {
    "compile:sass": "node-sass sass/main.sccs css/style.css -w"
  },

#to compile sass

#type this from root of project (eg onemillionyearsbc)
npm run compile:sass