/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore: esModuleInterop flag set in tsconfig.json
import express, { Router } from 'express';
import { addGetAllBooksRoute, addGetBookRoute, addSaveBookRoute, addUpdateBookRoute } from './adapter/in/web';
import { addNewBookFactory, getAllBooksFactory, getBookFactory, updateBookFactory } from './application/service';
import {
  loadAllBooksFactory,
  loadBookFactory,
  persistNewBookFactory,
  persistUpdatedBookFactory,
} from './adapter/out/persistence';
import { createAppWithFramesAround, createDynamoDbConfig } from './app-frames';

export = createAppWithFramesAround((app) => {
  app.use('/api', createBookRoutes());

  function createBookRoutes(): Router {
    const dynamoDbConfig = createDynamoDbConfig();
    console.log('DynamoDbConfig used: ', dynamoDbConfig);
    const bookRoutes = express.Router();
    addGetBookRoute(bookRoutes, getBookFactory(loadBookFactory(dynamoDbConfig)));
    addGetAllBooksRoute(bookRoutes, getAllBooksFactory(loadAllBooksFactory(dynamoDbConfig)));
    addUpdateBookRoute(bookRoutes, updateBookFactory(persistUpdatedBookFactory(dynamoDbConfig)));
    addSaveBookRoute(bookRoutes, addNewBookFactory(persistNewBookFactory(dynamoDbConfig)));
    return bookRoutes;
  }
});
