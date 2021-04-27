import { loadAllBooks, loadBook, persistNewBook, persistUpdatedBook } from '../../../application/port/out';
import { BookId, BookState } from '../../../domain/book';
import { ObjectNotFoundError } from '../../../application/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk';

let books: BookState[] = [
  { id: '5VVGTSPMKHH3A8', author: 'Douglas Crockford', title: 'JavaScript: The Good Parts', isbn: '9780596517748' },
  { id: '5VVGTSPMKHH3A9', author: 'Joshua Bloch', title: 'Effective Java', isbn: '9780134685991' },
  { id: '5VVGTSPMKHH3A0', author: 'Robert C. Martin', title: 'Clean Code', isbn: '9780132350884' },
  { id: '5VVGTSPMKHH3A1', author: 'Eric Evans', title: 'Domain-Driven Design', isbn: '9780321125217' },
];

export interface DynamoDbConfig {
  endpoint?: string;
  region: string;
  table: string;
}

export function loadBookFactory(): loadBook {
  return function (id: BookId): Promise<BookState> {
    const book = books.find((book) => book.id === id.value);
    return book ? Promise.resolve(book) : Promise.reject(new ObjectNotFoundError<string>('Book', id.value));
  };
}

export function loadAllBooksFactory({ endpoint, region, table }: DynamoDbConfig): loadAllBooks {
  const dynamodb: DocumentClient = new AWS.DynamoDB.DocumentClient({
    region,
    endpoint,
  });

  return function (): Promise<BookState[]> {
    return dynamodb
      .scan({
        TableName: table,
      })
      .promise()
      .then((books) => {
        console.log(books.Items);
        return books.Items as BookState[];
      });
  };
}

export function persistUpdatedBookFactory(): persistUpdatedBook {
  return function (bookToUpdate: BookState): Promise<void> {
    books = books.map((book) => (book.id === bookToUpdate.id ? bookToUpdate : book));
    return Promise.resolve();
  };
}

export function persistNewBookFactory(): persistNewBook {
  return function (bookToAdd: BookState): Promise<void> {
    books = [...books, bookToAdd];
    return Promise.resolve();
  };
}
