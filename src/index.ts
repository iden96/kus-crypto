import * as dotenv from 'dotenv';
import app from './app/index';

dotenv.config();

const HTTP_PORT = process.env.SERVER_PORT || 3000;

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
