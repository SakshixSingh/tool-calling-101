import 'dotenv/config' 
import express from 'express'
import cors from 'cors'
import { searchRouter } from './routes/search_lcel';
import { env } from './shared/env';

const app = express();

app.use(
    cors({
        origin : env.ALLOWED_ORIGINS
    })
);

app.use(express.json());

app.use('/search',searchRouter);

const port = Number(env.PORT);

app.listen(port, () => {
    console.log(`Server is now running on port ${port}`);
});

