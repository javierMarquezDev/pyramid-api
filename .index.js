// //const Sequelize = require('sequelize');
// import Express from 'express';
// import morgan from 'morgan';
// import bodyParser from 'body-parser';
// import path from 'path';
// //const React = require('react');
// import fs from 'fs';
import router from './src/router.js'
import config from './config.js';

// const app = Express();

// //SETTINGS
// app.disable('x-powered-by');
// app.set('env', 'development');

// //MIDDLEWARE
// app.use(morgan('tiny'));
// app.use(Express.static('public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))
//     // app.use((req, res, next) => {
//     //     res.send('404');
//     //     next();
//     // })

// //ROUTES
// router(app);


// //INITIALIZE
// app.listen('9000', () => {
//     console.log('Server up on port 9000');
// })

// // const sequelize = new Sequelize('pyramid', 'postgres', '7383', {
// //     host: 'localhost',
// //     dialect: 'postgres',
// //     pool: {
// //         max: 5,
// //         min: 0,
// //         idle: 10000
// //     }
// // })

// // const Film = sequelize.define(
// //     'Film', {
// //         id: {
// //             type: Sequelize.INTEGER,
// //             autoIncrement: true,
// //             field: 'id',
// //             primaryKey: true
// //         },
// //         title: {
// //             type: Sequelize.STRING,
// //             field: 'title'
// //         },
// //         description: {
// //             type: Sequelize.STRING,
// //             field: 'description'
// //         }
// //     }, {
// //         freezeTableName: true
// //     }
// // )

// // Film.sync({ force: true }).then(() => Film.create({
// //     title: 'Star Wars',
// //     description: 'Una peli muy chula :p'
// // }))

import express from 'express';
import { connect } from './src/socket.js';

let _server

const server = {
    start() {
        const app = express();

        //CONFIG
        config(app);

        //ACTIONS
        router(app);

        //SOCKET
        connect();

        _server = app.listen(app.locals.config.PORT, () => {
            console.log(`Server up on port ${app.locals.config.PORT}`);
        })
    },
    close() {
        _server.close();
    }
}

export default server

//if (!module.parent)
server.start();