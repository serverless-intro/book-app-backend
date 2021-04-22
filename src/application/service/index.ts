import { addNewBook, getAllBooks, getBook, updateBook } from '../port/in';
import { Book, BookId, BookState, NewBookCommand, UpdateBookStateCommand } from '../../domain/book';
import { loadAllBooks, loadBook, persistNewBook, persistUpdatedBook } from '../port/out';

export function getAllBooksFactory(loadAllBooks: loadAllBooks): getAllBooks {
  return function (): Promise<BookState[]> {
    return loadAllBooks().then((books) => books.map(mapFromUntrustedStateToTrustedOne));
  };
}

export function getBookFactory(loadBook: loadBook): getBook {
  return function (id: string): Promise<BookState> {
    try {
      const bookId = BookId.of(id);
      return loadBook(bookId).then(mapFromUntrustedStateToTrustedOne);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

export function addNewBookFactory(persistNewBook: persistNewBook): addNewBook {
  return function (newBookCommand: NewBookCommand): Promise<void> {
    try {
      const book = Book.createNew(newBookCommand);
      return persistNewBook(book.currentState());
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

export function updateBookFactory(persistUpdatedBook: persistUpdatedBook): updateBook {
  return function (updateBookStateCommand: UpdateBookStateCommand): Promise<void> {
    try {
      const book = Book.from(updateBookStateCommand);
      return persistUpdatedBook(book.currentState());
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function mapFromUntrustedStateToTrustedOne(book: BookState): BookState {
  return Book.from(book).currentState();
}
