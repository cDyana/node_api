
const express = require("express");
const bodyParser = require("body-parser");
//require prends le nom du module comme un string et le return en module

// require router
//REQUIRES THE ROUTER TABLES
const categorie = require("./router/categorie");
const image = require("./router/image");
const ingredient = require("./router/ingredient");
const etape_preparation = require("./router/etape_preparation");
const liste_courses = require("./router/liste_courses");
const article = require("./router/article");
const recette = require("./router/recette");
const user = require("./router/user");


const cors = require("cors");
//CORS (Cross Origin Resource Sharing)-est un mécanisme qui permet à 
//des resources restreintes d'une page web , d'être récupérées par un autre domaine
const port = process.env.PORT || 3000;
//quelque soit la variable PORT, ou port 3000 si il y a rien d'autre
const app = express();
app.use(cors());

app.use(bodyParser.json());
//App.use BODY PARSER JSON-prise en charge de l'analyse des données de publication de type application / json

app.use(bodyParser.urlencoded({
    extended: false
}));
//App.use URLENCODED -prends en charge l'analyse des données de poste application / x-www-form-urlencoded

app.use("/categorie", categorie);
app.use("/image", image);
app.use("/ingredient", ingredient);
app.use("/etape_preparation", etape_preparation);
app.use("/liste_courses", liste_courses);
app.use("/article", article);
app.use("/recette", recette);
app.use("/user", user);

// var path = require('path');


// app.get('/', function(req, res) {
//     res.sendFile(path.join('/index.html'));
// });

// app.listen(80);


app.listen(port, function () {
    console.log("server start on " + port)
});
//Ecoute le port declaré plus haut 