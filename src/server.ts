import express from 'express';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
const app = express();

//middleware for parsing json bodies
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', healthRoutes);

app.listen(env.PORT, () => {
    console.log(`Auth service is running on port ${env.PORT}`);
});



