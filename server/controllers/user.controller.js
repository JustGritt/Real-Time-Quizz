import db from '../lib/database.js';
import * as schema from '../lib/schema/realtime.js';
import { eq } from "drizzle-orm";

export const findUser = async (req, res) => {
    try {
        const user = await db.select().from(schema.users).where(eq(schema.users.id, req.user.id)).get();
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: 'An error occurred while retrieving the user.' });
    }
}