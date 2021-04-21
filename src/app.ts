/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore: esModuleInterop flag set in tsconfig.json
import express, {Router} from 'express';
import {addGetAllBooksRoute, addGetBookRoute, addSaveBookRoute, addUpdateBookRoute} from './adapter/in/web';
import {addNewBookFactory, getAllBooksFactory, getBookFactory, updateBookFactory} from './application/service';
import {
    loadAllBooksFactory,
    loadBookFactory,
    persistNewBookFactory,
    persistUpdatedBookFactory
} from './adapter/out/persistence';
import {createAppWithFramesAround} from './app-frames';

export = createAppWithFramesAround(app => {
    app.use('/api', createBookRoutes());

    function createBookRoutes(): Router {
        const bookRoutes = express.Router();
        addGetBookRoute(bookRoutes, getBookFactory(loadBookFactory()));
        addGetAllBooksRoute(bookRoutes, getAllBooksFactory(loadAllBooksFactory()));
        addUpdateBookRoute(bookRoutes, updateBookFactory(persistUpdatedBookFactory()));
        addSaveBookRoute(bookRoutes, addNewBookFactory(persistNewBookFactory()));
        return bookRoutes;
    }
});


