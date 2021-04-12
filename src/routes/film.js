import express from 'express';
const router = express.Router();
import Sequelize from 'sequelize';
import QueryTypes from 'sequelize';

router.get('/', async function(req, res) {
    const conn = new Sequelize('pyramid', 'postgres', '7383', {
        host: 'localhost',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    })

    const query = await conn.query("SELECT * FROM public.\"Film\"", { type: QueryTypes.SELECT });



    res.json(query[0]);

})

export default router;