try {
    require('dotenv').config();
} catch {
    console.warn('.env config failed.');
}
import { App } from './App';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new App();

app.listen(port);