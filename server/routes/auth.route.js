import { register, login, me}  from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.guard.js';

export default (app) => {
    // Auth routes
    app.post('/api/register', register);
    app.post('/api/login', login);
    app.get('/api/me', verifyToken, me);
    app.get('/api/test', verifyToken, (req, res) => {
        res.status(200).send({ message: 'You are authorized.' });
    });
};