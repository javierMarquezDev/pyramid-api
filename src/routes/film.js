import express from 'express';
const router = express.Router();
import Sequelize from 'sequelize';
import QueryTypes from 'sequelize';
import { auth } from '../middlewares.js';
//import { send as wSend } from '../socket.js';
var conn;
var query;

router.use((req, res, next) => {

    conn = new Sequelize('pyramid', 'postgres', '7383', {
        host: 'localhost',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    })

    next();

})

router.get('/', async(req, res, next) => {
    query = await conn.query(`SELECT * FROM public.\"Film\" `, { type: QueryTypes.SELECT });

    next();
})

router.get('/:filmid' /*, auth*/ , async(req, res, next) => {

    query = await conn.query(`SELECT * FROM public.\"Film\" WHERE id=${req.params.filmid}`, { type: QueryTypes.SELECT });

    //wSend(req.method, req.url, JSON.stringify(query[0]));

    next();

})

router.get('/:filmid/:field' /*, auth*/ , async(req, res, next) => {

    query = await conn.query(`SELECT ${req.params.field} FROM public.\"Film\" WHERE id=${req.params.filmid}`, { type: QueryTypes.SELECT });

    next();

})

//SHOW QUERY
router.use((req, res, next) => {

    return res.status(200).json(query[0]);

})

export default router;