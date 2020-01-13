
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
const image = express.Router();
//Express prend en charge les méthodes de routage suivantes qui correspondent 
//aux méthodes HTTP : get, post, put, head, delete,
//create db
const db = require("../database/db");

image.get("/One/:id", (req, res) => {

    db.image.findOne({
      attributes: {
                include: [],
                exclude: []
            },

        })

        .then(image => {

            res.json(image)
        })

        .catch(err => {

            res.send("error" + err)
        })
});


image.get("/ALL", (req, res) => {

    db.image.findAll({

            attributes: {
                include: [],

                exclude: []
            },
            include: {
                all: true,
                nested: true
            }

        })

        .then(image => {

            res.json(image)
        })

        .catch(err => {

            res.send("error" + err)
        })
});

//------------------POUR PAGE ADMIN----------
image.post("/add", (req, res) => {
    // create data atelier
    var images = {
        image: req.body.image,


    };
    // find if image exists  or not
    db.image.findOne({
            where: {
                image: req.body.image
            }
        })
        .then(image => {
            // if it doesn't exists so we create a new
            if (!image) {

                // insert into "image"
                // make create
                db.image.create(images)
                    .then(image => {
                        // send back message to show that add in table
                        res.json({
                            message: 'ook',
                            image
                        })
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "image already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});



module.exports = image;
