const siteRouter = require('./site');
const adminRouter = require('./admin');
const apiRouter = require('./api');
const uploadRouter = require('./upload');
const userRouter = require('./user');

function route(app) {
    app.get('/admin/:slug', adminRouter);
    app.get('/admin', adminRouter);
    app.get('/san-pham/:slug', siteRouter);
    app.get('/bai-viet/:slug', siteRouter);
    app.get('/api/:slug', apiRouter);
    app.get('/user/:slug', userRouter);
    app.get('/san-pham', siteRouter);
    app.get('/lien-he', siteRouter);
    app.get('/tin-tuc', siteRouter);
    app.get('/home', siteRouter);
    app.get('/:slug', siteRouter);
    app.get('/', siteRouter);

    app.post('/api/:slug', apiRouter);
    app.post('/admin/:slug', adminRouter);
    app.post('/upload/images/:slug', uploadRouter);
    app.post('/upload/:slug', uploadRouter);
    app.post('/user/:slug', userRouter);
}
module.exports = route;
