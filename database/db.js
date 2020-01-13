const Sequelize = require('sequelize');
// SEQUELIZE- c'est un ORM- Object relationnal mapping- fait la connection entre la base de donnée 
// et les objets du langage(framework) utilisé
const db = {};

const dbinfo = new Sequelize("cuisine1", "root", "root", {
    //une instance Sequelize avec une connexion pool min 0 connexion et maximum 5
    // IDLE- A connection in the pool will be qualified as idle if it is unused for 10 seconds or more
    // ACQUIRE- The pool when invoked for a connection will wait a maximum of 30 seconds before throwing a Timeout error
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
});

dbinfo.authenticate()

    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

db.categorie = require('../models/categorie')(dbinfo, Sequelize);
db.image = require('../models/image')(dbinfo, Sequelize);
db.ingredient = require('../models/ingredient')(dbinfo, Sequelize);
db.etape_preparation = require('../models/etape_preparation')(dbinfo, Sequelize);
db.liste_courses = require('../models/liste_courses')(dbinfo, Sequelize);
db.article = require('../models/article')(dbinfo, Sequelize);
db.recette = require('../models/recette')(dbinfo, Sequelize);
db.user = require('../models/user')(dbinfo, Sequelize);


db.recette.hasMany(db.image, {
    foreignKey: "recetteId"
});

db.recette.hasMany(db.etape_preparation, {
    foreignKey: "recetteId"
});

db.recette.hasMany(db.liste_courses, {
    foreignKey: "recetteId"
});

db.categorie.hasMany(db.recette, {
    foreignKey: "categorieId"
});

db.user.hasMany(db.liste_courses, {
    foreignKey: "userId"
})

db.recette.hasMany(db.user, {
    foreignKey: "recetteId"
})

db.recette.hasMany(db.ingredient, {
    foreignKey: "recetteId"
})

db.ingredient.hasMany(db.liste_courses, {
    foreignKey: "ingredientId"
})

db.dbinfo = dbinfo;
db.Sequelize = Sequelize;

// dbinfo.sync({force:true});

module.exports = db;