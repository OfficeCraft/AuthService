import express from 'express';
import cookieparser from 'cookie-parser';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import { checkForConnectedToDB } from './models/user.model';
const app = express();

//middleware for parsing json bodies
app.use(express.json());
app.use(cookieparser());

app.use('/auth', authRoutes);
app.use('/', healthRoutes);

async function startServer() {
   await checkForConnectedToDB();
   console.log("Connected to the database successfully.");
    app.listen(env.PORT, () => { 
        console.log(`Server is running on port ${env.PORT}`);
    });
}

startServer()
.catch((error) => {
    console.error("Error starting the server:", error);
    process.exit(1);
});



