import {BookId, BookState} from '../../../domain/book';

export type loadBook = (id: BookId) => Promise<BookState>;
export type persistUpdatedBook = (bookToUpdate: BookState) => Promise<void>;
export type persistNewBook = (bookToAdd: BookState) => Promise<void>;
export type loadAllBooks = () => Promise<BookState[]>;
