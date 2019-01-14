const Hapi = require('hapi');
const Mongoose = require('mongoose');
const Painting = require('./models/Painting');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

Mongoose.connect('mongodb://amd64char:cursive9092@ds155864.mlab.com:55864/painting-api');

Mongoose.connection.once('open', () => {
    console.log('connected to database');
});

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
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
            handler: function(request, response) {
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
            handler: (request, response) => {
                return Painting.find();
            }
        },
        {
            method: 'GET',
            path: '/api/v1/paintings/{id}',
            config: {
                description: 'Get a painting by id',
                tags: ['api', 'v1', 'painting by id']
            },
            handler: (request, response) => {
                /*
                 * Grab incoming id parameter
                */
                const paintingId = request.params.id ? encodeURIComponent(request.params.id) : '';
                //return `Requesting paintingId ${paintingId}!`;
                return Painting.findById(paintingId);
            }
        },
        {
            method: 'POST',
            path: '/api/v1/paintings',
            config: {
                description: 'Create a new painting.',
                notes: 'Example POST: <br/> { <br/> "name": "Mona Lisa", <br/> "url": "https://en.wikipedia.org/wiki/Mona_Lisa#/media/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg", <br/> "techniques": ["Portrait"] <br/> }',
                tags: ['api', 'v1', 'add painting']
            },
            handler: (request, response) => {
                const {name, url, techniques} = request.payload;
                /*
                 * Setup our model
                */
                const painting = new Painting({
                    name,
                    url,
                    techniques
                });
                return painting.save();
            }
        },
        {
            method: 'PUT',
            path: '/api/v1/paintings',
            config: {
                description: 'Update an existing painting',
                tags: ['api', 'v1', 'update painting']
            },
            handler: (request, response) => {
                const {name, url, techniques} = request.payload;
                console.log(name, 'painting name');
                /*
                 * Setup our model
                */
                const painting = new Painting({
                    name,
                    url,
                    techniques
                });
                /*
                 * Find a matching painting and update it
                 * Issues a mongodb findAndModify update command
                */
                return painting.findOneAndUpdate({
                    name: name
                }, update, {
                    upsert: true,
                    new: true,
                }, function(err, model) {
                    console.log(err, 'update error');
                });
            }
        },
        {
            method: 'DELETE',
            path: '/api/v1/paintings/{id}',
            config: {
                description: 'Delete an existing painting',
                tags: ['api', 'v1', 'delete painting']
            },
            handler: (request, response) => {
                /*
                * Grab incoming id parameter
                */
                const paintingId = request.params.id ? encodeURIComponent(request.params.id) : '';
                return `Requesting paintingId ${paintingId} to be deleted!`;
                //return Painting.findOneAndDelete({ '_id': paintingId });
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
