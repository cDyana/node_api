

const express = require("express");
/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * client.METHOD (PATH, HANDLER)
 *
 *  GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.[24]
 * DELETE : The DELETE method deletes the specified resource.
 * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
 * PATCH : The PATCH method applies partial modifications to a resource.
 *
 * @type { Router }
 */
const recette = express.Router();
//Express prend en charge les méthodes de routage suivantes qui correspondent 
//aux méthodes HTTP : get, post, put, head, delete,
//create db
const db = require("../database/db");



//recette all
recette.get("/getAll", (req, res) => {

    db.recette.findAll({
            all: true,
            //forcer la recuperation des données 
            attributes: {
                include: [],
                // don't need to show this filed
                exclude: []
            },

        })
        // get clients
        .then(rec => {

            res.json(rec);
        })
        // if error catch send back for user app to show him the error
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
});

//  get ONE recette by ID- OKKKKKK
recette.get("/findAll/recipes", (req, res) => {
    db.recette.findAll({

            include: [{
                    model: db.image,
                },
                {
                    model: db.ingredient,
                },
                {
                    model: db.etape_preparation,
                },

            ]

        })
        .then(rec => {
            res.json(rec)
        })
        .catch(err => {
            res.send(error + "il n'y a pas de recette avec cette id")
        })
});





//-----------get one recette avec ingredients et etape preparation- OK
recette.get("/toute/:id", (req, res) => {
    db.recette.findOne({
            all: true,
            include: [{
                    model: db.image,
                },
                {
                    model: db.ingredient,
                },
                {
                    model: db.etape_preparation,
                }
            ],
            where: {
                id: req.params.id
            }
        })
        .then(toute => {
            res.json(toute);
        })
        .catch(err => {
            res.json({
                error: error + "il n'y a pas de recette"
            })
        })
});
//-----------------------------------------------
recette.get("/forSearch", (req, res) => {
    db.recette.findOne({
            all: true,
            include: [{
                    model: db.image,
                },
                {
                    model: db.ingredient,
                },
                {
                    model: db.etape_preparation,
                }
            ],
            where: {
                id: req.params.id
            }
        })
        .then(search => {
            res.json(search);
        })
        .catch(err => {
            res.json({
                error: error + "il n'y a pas de recette"
            })
        })
});
//_____________________________________________
recette.post("/newRecette/toute", (req, res) => {
    db.recette.findOne({
            all: true,
            include: [{}],
        })
        .then(newRecette => {
            if (newRecette) {
                recette.post({
                    nom_recette: req.body.nom_recette,
                    description: req.body.description,
                    temp_preparation: req.body.temp_preparation,
                    temp_cuisson: req.body.temp_cuisson,
                    quantite: req.body.quantite,
                    niveau_difficulte: req.body.niveau_difficulte,
                })
            } else {
                res.json({
                    error: "can't post this recipe"
                })
            }
        })
        .catch(err => {
            res.json({
                error: error + "can't post this recipe"
            })
        })
});

//------------------------------
recette.post("/add/recipe", (req, res) => {

    const recette = {
        nom_recette: req.body.nom_recette,
        description: req.body.description,
        temp_preparation: req.body.temp_preparation,
        temp_cuisson: req.body.temp_cuisson,
        quantite: req.body.quantite,
        niveau_difficulte: req.body.niveau_difficulte,
    };

    db.recette.findOne({
            where: {
                nom_recette: req.body.nom_recette
            }

        })
        .then(recipe => {

            if (!recipe) {
                // make create
                db.recette.create(recette)

                    .then(recipe => {

                        db.ingredient.findOne({
                                where: {
                                    nom_ingredient: req.body.nom_ingredient
                                },
                            })
                            .then(ingredient => {
                                if (!ingredient) {
                                    const ingredients = {
                                        quantite: req.body.quantite,
                                        equivalence_poids: req.body.equivalence_poids,
                                        nom_ingredient: req.body.nom_ingredient,

                                    };
                                    db.ingredient.create(ingredients)
                                        .then(ingredient => {

                                            db.etape_preparation.findOne({
                                                    where: {
                                                        etape: req.body.etape
                                                    }
                                                })
                                                .then(etape => {
                                                    if (!etape) {
                                                        const etapes = {
                                                            etape: req.body.etape,

                                                        }
                                                        db.etape_preparation.create(etapes)
                                                            .then(etape => {

                                                                res.json({
                                                                    etape: etape
                                                                })
                                                            })
                                                            .catch(err => {
                                                                res.json({
                                                                    error: "error" + err
                                                                })
                                                            })
                                                    }
                                                })
                                                .catch(err => {
                                                    res.json({
                                                        error: "error" + err
                                                    })
                                                })

                                        })
                                        .catch(err => {
                                            res.json({
                                                error: "error" + err
                                            })
                                        })
                                }
                            })
                            .catch(err => {
                                res.json({
                                    error: "error" + err
                                })
                            })
                    })
                    .catch(err => {
                        res.json({
                            error: "error" + err
                        })
                    })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
})






module.exports = recette;
