import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { AppDataSource } from './data-source';
import { EmployeeController } from './controller/EmployeeController';

// Initialize TypeORM connection
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

// Create an Express app
const app = createExpressServer({
    controllers: [EmployeeController],
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
