

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
const ingredient = express.Router();
//Express prend en charge les méthodes de routage suivantes qui correspondent 
//aux méthodes HTTP : get, post, put, head, delete,
//create db
const db = require("../database/db");


// get All ingredients from 1 recette by id- OK 
ingredient.get("/One/:id", (req, res) => {
    // Find ingredient by id
    db.ingredient.findOne({

            attributes: {
                include: [],
                exclude: []
            },
        })
        //
        .then(ingredients => {
            // send back respose in json liste of ingredients
            res.json(ingredients)
        })
        // catch error if something happend
        .catch(err => {
            // send back error
            res.send("error" + err)
        })
});
//---------------------------------------------

ingredient.get("/getAll", (req, res) => {

    db.ingredient.findAll({
            all: true,
            //forcer la recuperation des données 
            attributes: {
                include: [],
                // don't need to show this filed
                exclude: []
            },

        })

        .then(todos => {

            res.json(todos);
        })
        // if error catch send back for user app to show him the error
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
});


//------------------------------------
ingredient.post("/add", (req, res) => {

    var ingredients = {
        quantite: req.body.quantite,
        equivalence_poids: req.body.equivalence_poids,
        nom_ingredient: req.body.nom_ingredient,


    };

    db.ingredient.findOne({
            where: {
                nom_ingredient: req.body.nom_ingredient
            }
        })
        .then(ingredient => {
            // if it doesn't exists so we create a new
            if (!ingredient) {


                // make create
                db.ingredient.create(ingredients)
                    .then(ingredient => {
                        // send back message to show that add in table
                        res.json({
                            message: 'ook',
                            ingredient
                        })
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "ingredient already exists"
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

ingredient.delete("/delete/:id", (req, res) => {

    db.ingredient.findOne({
            where: {
                id: req.params.id
            }
        }).then(ingredient => {

            if (ingredient) {

                ingredient.destroy().then(() => {

                        res.json("ingredient deleted")
                    })
                    // catch if error
                    .catch(err => {
                        // send back the error to info that in json
                        res.json("error" + err)
                    })
            } else {

                res.json({
                    error: "you can't delete this ingredient it not exist in you list of ingredients"
                })
            }
        })
        .catch(err => {
            // send back the message error
            res.json("error" + err);
        })
});





module.exports = ingredient;

