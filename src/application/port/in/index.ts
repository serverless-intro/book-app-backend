import { BookState, UpdateBookStateCommand, NewBookCommand } from '../../../domain/book';

export type getAllBooks = () => Promise<BookState[]>;
export type getBook = (id: string) => Promise<BookState>;
export type addNewBook = (newBookCommand: NewBookCommand) => Promise<void>;
export type updateBook = (updateBookStateCommand: UpdateBookStateCommand) => Promise<void>;
