
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
const categorie = express.Router();
//Express prend en charge les méthodes de routage  qui correspondent 
//aux méthodes HTTP : get, post, put, head, delete,
//create db
const db = require("../database/db");

// get ALL categories-OKKKKKK
categorie.get("/getAll", (req, res) => {
    // Find all categories
    db.categorie.findAll({

            // if need to use include and exclude
            attributes: {
                include: [],
                exclude: []
            },
        })
        // get list of ALL categories in database
        .then(categories => {
            // send back respose in json list of categories
            res.json(categories)
        })
        // catch error if somethings wrong
        .catch(err => {
            // send back error
            res.send("error" + ": Les categories ne peuvent pas être affichées")
        })
});

//----------------------------------------------------------
// get category by id -OK
categorie.get("/Find/:id", (req, res) => {
    // find category by id
    db.categorie.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(categorie => {
            res.json(categorie)
        })
        .catch(err => {
            // display this error if there is not a category with that id in the database
            res.json(error + "Il y a pas de categorie avec ce id");
        })
});


categorie.get("/Find/", (req, res) => {
    // find category 
    db.categorie.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(categorie => {
            res.json(categorie)
        })
        .catch(err => {
            // display this error if there is not a category in the database
            res.json(error + "Il y a pas de categorie avec ce id");
        })
});
//---------------------------------------------------
// get category by name and the recipes for this category
categorie.get("/FindByName/:nom_categorie", (req, res) => {
    // find category with recipes
    db.categorie.findOne({
            where: {
                nom_categorie: req.params.nom_categorie
            },
            include: [{
                    model: db.recette,
                },

            ],
        }).then(categorie => {
            // if category exists 
            if (categorie) {
                res.json({
                    categorie: categorie
                })
            } else {
                // display this error if there is not a category with a recipe in the database
                res.json({
                    error: ": il n'y a pas de categorie et des recettes pour cette categorie"
                })
            }
        })
        .catch(err => {
            // send back the message error
            res.json(error + ": il n'y a pas de categorie et des recettes pour cette categorie");
        })
});

//-----------------POUR LA PAGE ADMIN----------------------------------
categorie.post("/add", (req, res) => {
    // create data categorie
    var categories = {
        nom_categorie: req.body.nom_categorie,
    };
    // find if category exists or not
    db.categorie.findOne({
            where: {
                nom_categorie: req.body.nom_categorie
            }
        })
        .then(categorie => {
            // if it doesn't exist we create a new one
            if (!categorie) {
                // insert into "categories"
                // and create
                db.categorie.create(categories)
                    .then(categorie => {
                        // send back a message to show that category is added in the table categories
                        res.json({
                            message: 'ook',
                            categorie
                        })
                    })
                    .catch(err => {
                        //if there is an error send the error
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "categorie already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});
//__________________________DELETE
categorie.delete("/delete/:id", (req, res) => {

    db.categorie.findOne({
            where: {
                id: req.params.id
            }
        }).then(categorie => {

            if (categorie) {

                categorie.destroy().then(() => {

                        res.json("categorie deleted")
                    })
                    // catch if error
                    .catch(err => {
                        // send back the error to info that in json
                        res.json("error" + err)
                    })
            } else {

                res.json({
                    error: "you can't delete this categorie it not exist in you list of categorie"
                })
            }
        })
        .catch(err => {
            // send back the message error
            res.json("error" + err);
        })
});

module.exports = categorie;

