import film from './routes/film.js'
import auth from './routes/auth.js'

export default app => {
    app.use('/film', film);
    app.use('/auth', auth)

    app.get('/', (req, res, next) => {
        res
            .status(201)
            .json({ data: 'metodo get' })
    })

    app.post('/', (req, res, next) => {
        res
            .status(201)
            .json({ data: 'metodo post' })
    })

    app.put('/', (req, res, next) => {
        res
            .status(201)
            .json({ data: 'metodo put' })
    })

    app.delete('/', (req, res, next) => {
        res
            .status(201)
            .json({ data: 'metodo delete' })
    })
}