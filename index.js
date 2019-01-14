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
            handler: function(request, reply) {
                return `<h1>My painting api</h1>`;
            }
        },
        {
            method: 'GET',
            path: '/api/v1/paintings',
            config: {
                description: 'Get all the paintings',
                tags: ['api', 'v1', 'paintings']
            },
            handler: (request, reply) => {
                return Painting.find();
            }
        },
        {
            method: 'POST',
            path: '/api/v1/paintings',
            config: {
                description: 'Create a new painting',
                tags: ['api', 'v1', 'painting']
            },
            handler: (request, reply) => {
                const {name, url, techniques} = request.payload;
                const painting = new Painting({
                    name,
                    url,
                    techniques
                });
                return painting.save();
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
