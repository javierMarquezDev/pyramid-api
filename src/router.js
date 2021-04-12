import film from './routes/film.js'

export default app => {
    app.use('/film', film);
}