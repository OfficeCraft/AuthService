import express from 'express';
import { env } from './config/env';

const app = express();

//middleware for parsing json bodies
app.use(express.json());

app.get('/health', (req, res) => {
    res.send({message: 'Auth Service is running'});
})

app.listen(env.PORT, () => {
    console.log(`Auth service is running on port ${env.PORT}`);
});



