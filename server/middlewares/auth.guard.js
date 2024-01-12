import jwt from 'jsonwebtoken';
import db from '../lib/database.js';
import * as schema from '../lib/schema/realtime.js';
import { eq } from "drizzle-orm";
 
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.body.token || req.headers['authorization'];
        if (!token) {
            return res.status(401).send({ message: 'No token provided.' });
        }
        if (token.startsWith('Bearer ')) {
            token = token.replace('Bearer ', '');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.select().from(schema.users).where(eq(schema.users.id, decoded.id)).get();

        if (!user) {
            return res.status(401).send({ message: 'Invalid token.' });
        }

        req.user = {
            id: user.id,
            displayName: user.display_name,
            email: user.email,
        };

        next();
    } catch (error) {
        res.status(500).send({ message: 'An error occurred while verifying the token.' });
    }
};