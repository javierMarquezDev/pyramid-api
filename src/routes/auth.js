import express from 'express';
import jwt from 'jwt-simple';

const router = express.Router();

router.post('/', (req, res, next) => {
    const payload = {
        email: req.params.email
    }

    const token = jwt.encode(payload, req.app.locals.config.TOKEN)

    res.status(201).send(token);
})

export default router;