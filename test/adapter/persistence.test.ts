/**
 * @group int
 */
import { Book, BookId, BookState } from '../../src/domain/book';
import { loadBook, persistNewBook, persistUpdatedBook, loadAllBooks } from '../../src/application/port/out';
import {
  DynamoDbConfig,
  loadAllBooksFactory,
  loadBookFactory,
  persistNewBookFactory,
  persistUpdatedBookFactory,
} from '../../src/adapter/out/persistence';
import { ObjectNotFoundError } from '../../src/application/common';
import { createDynamoDbConfig } from '../../src/app-frames';

describe('Persistence Adapter', () => {
  let author: string, title: string, testBook: BookState, dynamodbConfig: DynamoDbConfig;

  beforeEach(() => {
    author = 'Test author';
    title = 'Test title';
    testBook = Book.createNew({ author, title }).currentState();
    dynamodbConfig = createDynamoDbConfig();
  });

  it('persists a new book and loads it', () => {
    // given
    const persistNewBook: persistNewBook = persistNewBookFactory(dynamodbConfig);
    const loadBook: loadBook = loadBookFactory(dynamodbConfig);
    const bookId = testBook.id;
    // when
    return persistNewBook(testBook).then(() =>
      loadBook(BookId.of(bookId))
        // then
        .then((savedBook) => {
          expect(savedBook).toEqual(testBook);
        }),
    );
  });

  it('persists a new book, updates and loads it', () => {
    // given
    const persistNewBook: persistNewBook = persistNewBookFactory(dynamodbConfig);
    const persistUpdatedBook: persistUpdatedBook = persistUpdatedBookFactory(dynamodbConfig);
    const loadBook: loadBook = loadBookFactory(dynamodbConfig);
    const bookId = testBook.id;
    const bookToUpdate = { ...testBook, title: 'Updated Title' };
    // when
    return persistNewBook(testBook)
      .then(() => persistUpdatedBook(bookToUpdate))
      .then(() =>
        loadBook(BookId.of(bookId))
          // then
          .then((updatedBook) => {
            expect(updatedBook).toEqual(bookToUpdate);
          }),
      );
  });

  it('persists a new book and finds it among all books loaded', () => {
    // given
    const persistNewBook: persistNewBook = persistNewBookFactory(dynamodbConfig);
    const loadAllBooks: loadAllBooks = loadAllBooksFactory(dynamodbConfig);
    // const bookId = testBook.id;
    // when
    return (
      persistNewBook(testBook)
        .then(() => loadAllBooks())
        // then
        .then((allBooks) => {
          expect(allBooks).toContainEqual(testBook);
        })
    );
  });

  it('rejects to load a book if one has not been persisted', () => {
    // given
    const loadBook: loadBook = loadBookFactory(dynamodbConfig);
    const idOfNotPersistedBook = BookId.generateNew();
    // when
    return (
      expect(loadBook(idOfNotPersistedBook))
        // then
        .rejects.toMatchObject({ name: ObjectNotFoundError.NAME })
    );
  });
});
