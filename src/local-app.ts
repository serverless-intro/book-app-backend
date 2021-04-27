process.env.AWS_DYNAMODB_ENDPOINT = 'http://localhost:8000/';
process.env.AWS_BOOK_TABLE = 'book-table-int-db';
process.env.AWS_REGION = 'eu-central-1';

import app from './app';

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));
