import {Router} from 'express';
import {addNewBook, getAllBooks, getBook, updateBook} from '../../../application/port/in';
import {NewBookCommand, UpdateBookStateCommand} from '../../../domain/book';

export function addGetAllBooksRoute(router: Router, getAllBooks: getAllBooks): void {
    router.get('/books', (req, res, next) => {
        getAllBooks().then(books => res.send(books)).catch(next);
    });
}

export function addGetBookRoute(router: Router, getBook: getBook): void {
    router.get('/books/:id', (req, res, next) => {
        getBook(req.params.id).then(book => res.send(book)).catch(next);
    });
}

export function addSaveBookRoute(router: Router, addNewBook: addNewBook): void {
    router.post('/books', (req, res, next) => {
        const newBookCommand = req.body as NewBookCommand;
        addNewBook(newBookCommand).then(() => res.sendStatus(201)).catch(next);
    });
}

export function addUpdateBookRoute(router: Router, updateBook: updateBook): void {
    router.put('/books/:id', (req, res, next) => {
        const id = req.params.id;
        const updateBookStateCommand = {id, ...req.body} as UpdateBookStateCommand;
        updateBook(updateBookStateCommand).then(() => res.sendStatus(200)).catch(next);
    });
}
