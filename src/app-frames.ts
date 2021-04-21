import express from 'express';
import {NextFunction, Request, Response, Express} from 'express-serve-static-core';
import {ValidationError} from './domain/common';
import {ObjectNotFoundError} from './application/common';

export function createAppWithFramesAround(addAppElementsFn: (app: Express) => void): Express {
    const app = express();
    // Enable JSON use
    app.use(express.json());
    addAppElementsFn(app);
    // Global error handler. It must have exactly this signature, thus ignoring ESLint here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    app.use(globalErrorHandler);
    return app;

    // Global error handler. It must have exactly this signature, thus ignoring ESLint here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
        console.error(err);

        switch (err.name) {
            case ValidationError.NAME: res.status(400).send(err.message); break;
            case ObjectNotFoundError.NAME: res.status(404).send(err.message); break;
            default: res.status(500).send(err);
        }
    }
}
