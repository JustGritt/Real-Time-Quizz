import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../lib/database.js';
import * as schema from '../lib/schema/realtime.js';
import { eq } from "drizzle-orm";

export const register = async (req, res) => {
    const user  = {
        display_name: req.body.display_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),

    };
    try {
        await db.insert(schema.users).values({...user});
        res.status(200).send({ message: 'User created successfully.'});
    } catch (error) {
        res.status(500).send({ message: 'An error occurred while creating the user.' });
    }
};

export const login = async (req, res) => {
    try {
        const user = await db.select().from(schema.users).where(eq(schema.users.email,req.body.email)).get();
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, accessToken: null, message: 'Invalid password.' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({ auth: true, accessToken: token });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred while logging in.' });
    }
}

export const me = async (req, res) => {
    try {
        const user = await db.select().from(schema.users).where(eq(schema.users.id, req.user.id)).get();
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        const safeUser = {
            id: user.id,
            display_name: user.display_name,
            email: user.email,
        };
        res.status(200).send(safeUser);
    } catch (error) {
        res.status(500).send({ message: 'An error occurred while retrieving the user.' });
    }
}