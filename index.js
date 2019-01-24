const Hapi = require('hapi');
const Boom = require('boom');
const Mongoose = require('mongoose');
const Painting = require('./models/Painting');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
require('dotenv').config();


Mongoose.connect(process.env.DB_CONN);

Mongoose.connection.once('open', () => {
    console.log('connected to database');
});

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST
});

const init = async () => {
    
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Paintings API Documentation',
                    version: Pack.version
                }
            }
        }
    ]);

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: function(request, reply) {
                return `<h1>My painting api</h1>`;
            }
        },
        {
            method: 'GET',
            path: '/api/v1/paintings',
            config: {
                description: 'Get all the paintings',
                tags: ['api', 'v1', 'all paintings']
            },
            handler: async (request, reply) => {
                /*
                 * Grab the querystring parameters
                 * page and limit to handle our pagination
                */
                var pageOptions = {
                    page: parseInt(request.query.page) - 1 || 0, 
                    limit: parseInt(request.query.limit) || 10
                }
                /*
                 * Apply our sort and limit
                */
               try {
                    return await Painting.find()
                        .sort({dateCreated: 1, dateModified: -1})
                        .skip(pageOptions.page * pageOptions.limit)
                        .limit(pageOptions.limit)
                        .exec();
               } catch(err) {
                   return Boom.badRequest(Pack.errorMessages.getPaintingsAll);
               }

            }
        },
        {
            method: 'GET',
            path: '/api/v1/paintings/{id}',
            config: {
                description: 'Get a painting by id',
                tags: ['api', 'v1', 'painting by id']
            },
            handler: async (request, reply) => {
                /*
                 * Grab incoming id parameter
                */
                const paintingId = request.params.id ? encodeURIComponent(request.params.id) : '';
                /*
                 * Find our painting based on id
                */
                const painting = await Painting.findById(paintingId);
                //console.log(painting, 'found painting');
                /*
                 * Test if we found painting
                */
                if (painting === null) { 
                    return Boom.notFound(Pack.errorMessages.getPaintingById);
                } else {
                    return painting;
                }
            }
        },
        {
            method: 'POST',
            path: '/api/v1/paintings',
            config: {
                description: 'Create a new painting.',
                notes: 'Example POST: <br/> { <br/> "name": "Mona Lisa", <br/> "artist": "Vincent Van Gogh", <br/> "url": "https://en.wikipedia.org/wiki/Mona_Lisa#/media/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg", <br/> "techniques": ["Portrait"] <br/> }',
                tags: ['api', 'v1', 'add painting']
            },
            handler: (request, reply) => {
                const {name, artist, url, techniques} = request.payload;
                /*
                 * Setup our model
                */
                const painting = new Painting({
                    name,
                    artist,
                    url,
                    techniques
                });
                /*
                 * Test for schema validation errors before insert
                */
                var error = painting.validateSync();
                if(error) {
                    return Boom.badData(error.message);
                } else {
                    return painting.save();
                }
            }
        },
        {
            method: 'PUT',
            path: '/api/v1/paintings/{id}',
            config: {
                description: 'Update an existing painting',
                notes: 'Example PUT: <br/> { <br/> "artist": "Vincent Van Gogh", <br/> "techniques": ["Portrait", "Oil on canvas"] <br/> }',
                tags: ['api', 'v1', 'update painting']
            },
            handler: async (request, reply) => {
                /*
                * Grab incoming id parameter
                */
                const paintingId = request.params.id ? encodeURIComponent(request.params.id) : '';
                /*
                * Define our search criteria for the update. We're using the passed in id.
                */
                const searchQuery = { _id: paintingId };
                /*
                * Update options
                * new: If true, return the modified document rather than the original.
                * runValidators: If true, run any update validator operations against the model schema.
                */
                const updateOptions = { new: true, runValidators: true };
                /*
                * Find a matching document, update it according to the search query, passing any options, and return the found document
                */
                try {
                    return await Painting.findOneAndUpdate(searchQuery, request.payload, updateOptions);
               } catch(err) {
                   return Boom.badRequest(err.message);
               }
            }
        },
        {
            method: 'DELETE',
            path: '/api/v1/paintings/{id}',
            config: {
                description: 'Delete an existing painting',
                tags: ['api', 'v1', 'delete painting']
            },
            handler: async (request, reply) => {
                /*
                * Grab incoming id parameter
                */
                const paintingId = request.params.id ? encodeURIComponent(request.params.id) : '';
                /*
                * Define our search criteria for the delete. We're using the passed in id.
                */
               const searchQuery = { _id: paintingId };
               /*
               * Delete options
               */
               const deleteOptions = {};
               /*
               * Find a matching document, removes it according to the search query, passing any options, and return the found document
               */
               try {
                   return await Painting.findOneAndRemove(searchQuery, deleteOptions);
              } catch(err) {
                  return Boom.badRequest(err.message);
              }
            }
        }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
