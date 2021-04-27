/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore: esModuleInterop flag set in tsconfig.json
import express, { Router } from 'express';
import { addGetAllBooksRoute, addGetBookRoute, addSaveBookRoute, addUpdateBookRoute } from './adapter/in/web';
import { addNewBookFactory, getAllBooksFactory, getBookFactory, updateBookFactory } from './application/service';
import {
  DynamoDbConfig,
  loadAllBooksFactory,
  loadBookFactory,
  persistNewBookFactory,
  persistUpdatedBookFactory,
} from './adapter/out/persistence';
import { createAppWithFramesAround } from './app-frames';

export = createAppWithFramesAround((app) => {
  app.use('/api', createBookRoutes());

  function createBookRoutes(): Router {
    const dynamoDbConfig = createDynamoDbConfig();
    console.log('DynamoDbConfig used: ', dynamoDbConfig);
    const bookRoutes = express.Router();
    addGetBookRoute(bookRoutes, getBookFactory(loadBookFactory()));
    addGetAllBooksRoute(bookRoutes, getAllBooksFactory(loadAllBooksFactory(dynamoDbConfig)));
    addUpdateBookRoute(bookRoutes, updateBookFactory(persistUpdatedBookFactory()));
    addSaveBookRoute(bookRoutes, addNewBookFactory(persistNewBookFactory()));
    return bookRoutes;
  }

  function createDynamoDbConfig(): DynamoDbConfig {
    const region = process.env.AWS_REGION;
    if (!region) {
      throw new Error('AWS_REGION env variable not provided!');
    }
    const table = process.env.AWS_BOOK_TABLE;
    if (!table) {
      throw new Error('AWS_BOOK_TABLE env variable not set!');
    }
    return {
      endpoint: process.env.AWS_DYNAMODB_ENDPOINT || undefined,
      region,
      table,
    };
  }
});
