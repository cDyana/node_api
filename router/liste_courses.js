
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
const liste_courses = express.Router();
//Express prend en charge les méthodes de routage suivantes qui correspondent 
//aux méthodes HTTP : get, post, put, head, delete,
//create db
const db = require("../database/db");



//-----------get liste de courses - OK
liste_courses.get("/AllProduits", (req, res) => {
    db.liste_courses.findAll({
            all: true,

        })
        .then(liste => {
            res.json(liste);
        })
        .catch(err => {
            res.json({
                error: error + "Il n'y a pas d'ingredients dans cette recette et liste"
            })
        })
});
//---------------------------------------
//-----------get liste de courses avec ingredients - 
liste_courses.get("/listWithProducts", (req, res) => {
    db.liste_courses.findOne({
            where: {
                nom_ingredient_liste: req.params.nom_ingredient_liste
            },
            include: [{
                model: db.ingredient,
            }],
        })
        .then(list => {
            res.json(list);
        })
        .catch(err => {
            res.json({
                error: error + "Il n'y a pas d'ingredients dans cette liste"
            })
        })
});


//------------------------------------------------
liste_courses.get("/getAll", (req, res) => {

    db.liste_courses.findAll({
            all: true,
            //forcer la recuperation des données 
            attributes: {
                include: [],
                // don't need to show this filed
                exclude: []
            },

        })

        .then(courses => {

            res.json(courses);
        })
        // if error catch send back for user app to show him the error
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
});


//------------------------------------
liste_courses.post("/add/liste", (req, res) => {

    var liste_courses = {
        quantite_liste: req.body.quantite_liste,
        equivalence_poids_liste: req.body.equivalence_poids_liste,
        nom_ingredient_liste: req.body.nom_ingredient_liste
    };

    db.liste_courses.findOne({
            where: {
                nom_ingredient_liste: req.body.nom_ingredient_liste
            }
        })
        .then(produit => {
            if (!produit) {
                // make-create
                db.liste_courses.create(liste_courses)
                    .then(produit => {
                        // send back message to show that add in table
                        res.json({
                            message: 'ook',
                            produit
                        })
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "produit already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});
//______________________________________

liste_courses.delete("/delete/:id", (req, res) => {
    // find the produit you want you delete
    db.liste_courses.findOne({
            where: {
                id: req.params.id
            }
        }).then(produit => {
            // if produit exist so
            if (produit) {
                // delete this produit
                produit.destroy().then(() => {
                        // send back the  confirmation of produit is deleted
                        res.json("ingredient deleted")
                    })
                    // catch if error
                    .catch(err => {
                        // send back the error to info that in json
                        res.json("error" + err)
                    })
            } else {
                // send back the error message to info that you can't deleted this produit it not exist in your database
                res.json({
                    error: "you can't delete this ingredient it not exist in you list of liste courses"
                })
            }
        })
        .catch(err => {
            // send back the message error
            res.json("error" + err);
        })
});
module.exports = liste_courses;

