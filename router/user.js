
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
const user = express.Router();
//Express prend en charge les méthodes de routage qui correspondent 
//aux méthodes HTTP : get, post, put, head, delete,
//create db
const db = require("../database/db");

process.env.SECRET_KEY = "cuisine";


//  register -OKKKK
user.post("/register", (req, res) => {

    const userdata = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: "user"
    };
    // find if user exists or not

    db.user.findOne({
            where: {
                email: req.body.email
            },

        })
        .then(user => {
            if (!user) {
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(userdata.password, 10);
                //salt 10- facteur de cout, c'est le nombre d'iteration de la fonction de derivation de cle utilisés
                userdata.password = hash;
                db.user.create(userdata)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            //process.env.SECRET_KEY est un objet global qui fournit des informations et controle 
                            //le processus Node
                            expiresIn: 1440
                        });
                        res.json({
                            token: token
                        })
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "user already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});


// login-OK
user.post("/login", (req, res) => {
    db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                      //process.env.SECRET_KEY est un objet global qui fournit des informations et controle 
                            //le processus Node
                    expiresIn: 1440
                });
                res.json({
                    token: token
                })
                console.log(token)
            } else {
                res.send('error mail or error password')
                
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});


// update-OK
user.post("/update", (req, res) => {
    db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (user) {
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(req.body.password, 10);
                 //salt 10- facteur de cout, c'est le nombre d'iteration de la fonction de derivation de cle utilisés
                user.update({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,


                })
            } else {
                res.json({
                    error: "can't update this employe hi is not your employe"
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});


//delete user-OK
user.delete("/delete/:id", (req, res) => {
    // find the user you want to delete
    db.user.findOne({
            where: {
                id: req.params.id
            }
        }).then(user => {
            // if user exists
            if (user) {
                // delete the user
                user.destroy().then(() => {
                        // send back the confirmation that the user is deleted
                        res.json("user deleted")
                    })
                    // catch if there is an error
                    .catch(err => {
                        // send back the error
                        res.json("error" + err)
                    })
            } else {
                // send back the error message to info that you can't deleted this user if not exists in your database
                res.json({
                    error: "Le user ne peut pas être supprimer car il n'existe pas"
                })
            }
        })
        .catch(err => {
            // send back the message error
            res.json("error" + err);
        })
});

// get All users-OK
user.get("/All", (req, res) => {
    // Find all users
    db.user.findAll({
            attributes: {
                include: [],
                exclude: []
            },
        })
        // get list of All users in your database
        .then(users => {
            // send back respose in json list of users
            res.json(users)
        })
        // catch error if somethings wrong
        .catch(err => {
            // send back error
            res.send("error" + err)
        })
});


module.exports = user;

