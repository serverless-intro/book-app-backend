import {addNewBookFactory, getAllBooksFactory, getBookFactory, updateBookFactory} from '../../src/application/service';
import {Book, BookState} from '../../src/domain/book';
import {ValidationError} from '../../src/domain/common';
import {loadBook} from '../../src/application/port/out';
import {ObjectNotFoundError} from '../../src/application/common';

describe('Application Services', () => {
    let author: string, title: string, testBook: BookState;

    beforeEach(() => {
        author = 'Test author';
        title = 'Test title';
        testBook = Book.createNew({author, title}).currentState();
    });

    describe('getAllBooks', () => {
        it('gets all books returned by a port', () => {
            // given
            const books = [testBook];
            const loadAllBooksMock = () => Promise.resolve(books);
            const getAllBooks = getAllBooksFactory(loadAllBooksMock);
            // when
            return expect(getAllBooks())
                // then
                .resolves.toEqual(books);
        });

        it('rejects if calling a port failed', () => {
            // given
            const error = new Error();
            const loadAllBooksMock = () => Promise.reject(error);
            const getAllBooks = getAllBooksFactory(loadAllBooksMock);
            // when
            return expect(getAllBooks())
                // then
                .rejects.toBe(error);
        });
    });

    describe('getBook', () => {
        it('gets a book returned by a port', () => {
            // given
            const bookId = testBook.id;
            const loadBookMock: loadBook = () => Promise.resolve(testBook);
            const getBook = getBookFactory(loadBookMock);
            // when
            return expect(getBook(bookId)).resolves.toEqual(testBook);
        });

        it('rejects if ID passed is not correct', () => {
            // given
            const bookId = 'notCorrect';
            const loadBookMock: loadBook = () => Promise.resolve(testBook);
            const getBook = getBookFactory(loadBookMock);
            // when
            return expect(getBook(bookId)).rejects.toMatchObject({name: ValidationError.NAME});
        });

        it('rejects if calling a port failed', () => {
            // given
            const bookId = testBook.id;
            const error = new ObjectNotFoundError<string>('Book', bookId);
            const loadBookMock: loadBook = () => Promise.reject(error);
            const getBook = getBookFactory(loadBookMock);
            // when
            return expect(getBook(bookId))
                // then
                .rejects.toBe(error);
        });
    });

    describe('addNewBook', () => {
        it('calls a port with new book', () => {
            // given
            const persistNewBookMock = jest.fn(() => Promise.resolve());
            const addNewBook = addNewBookFactory(persistNewBookMock);
            // when
            return addNewBook({title, author}).then(() => {
                const mockCalledWith = persistNewBookMock.mock.calls[0] as BookState[];
                expect(mockCalledWith[0]).toBeDefined();
                expect(mockCalledWith[0].id).toBeDefined();
                expect(mockCalledWith[0].author).toBe(author);
                expect(mockCalledWith[0].title).toBe(title);
            });
        });

        it('rejects if calling a port failed', () => {
            // given
            const error = new Error();
            const persistNewBookMock = jest.fn(() => Promise.reject(error));
            const addNewBook = addNewBookFactory(persistNewBookMock);
            // when
            return expect(addNewBook({title, author})).rejects.toBe(error);
        });

        it('rejects if book properties passed are not correct', () => {
            // given
            const persistNewBookMock = jest.fn(() => Promise.resolve());
            const addNewBook = addNewBookFactory(persistNewBookMock);
            // when
            return expect(addNewBook({title})).rejects.toMatchObject({name: ValidationError.NAME});
        });
    });

    describe('updateBook', () => {
        it('calls a port with book to be updated', () => {
            // given
            const updateBookStateCommand = {...testBook, title: 'Updated'};
            const persistUpdatedBookMock = jest.fn(() => Promise.resolve());
            const updateBook = updateBookFactory(persistUpdatedBookMock);
            // when
            return updateBook(updateBookStateCommand).then(() => {
                expect(persistUpdatedBookMock).toHaveBeenCalledWith(updateBookStateCommand);
            });
        });

        it('rejects if book properties passed are not correct', () => {
            // given
            const persistUpdatedBookMock = jest.fn(() => Promise.resolve());
            const updateBook = updateBookFactory(persistUpdatedBookMock);
            // when
            return expect(updateBook({title, author})).rejects.toMatchObject({name: ValidationError.NAME});
        });

        it('rejects if calling a port failed', () => {
            // given
            const error = new Error();
            const persistUpdatedBookMock = jest.fn(() => Promise.reject(error));
            const updateBookStateCommand = {...testBook, title: 'Updated'};
            const updateBook = updateBookFactory(persistUpdatedBookMock);
            // when
            return expect(updateBook(updateBookStateCommand)).rejects.toBe(error);
        });
    });
});


