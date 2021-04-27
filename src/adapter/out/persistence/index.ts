import { loadAllBooks, loadBook, persistNewBook, persistUpdatedBook } from '../../../application/port/out';
import { BookId, BookState } from '../../../domain/book';
import { ObjectNotFoundError } from '../../../application/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk';

export interface DynamoDbConfig {
  endpoint?: string;
  region: string;
  table: string;
}

export function loadBookFactory(config: DynamoDbConfig): loadBook {
  const dynamodb = createDynamoDbClient(config);

  return function (id: BookId): Promise<BookState> {
    return dynamodb
      .get({
        TableName: config.table,
        Key: { id: id.value },
      })
      .promise()
      .then(({ Item: book }) => {
        if (!book) {
          throw new ObjectNotFoundError<string>('Book', id.value);
        }
        return book as BookState;
      });
  };
}

export function loadAllBooksFactory(config: DynamoDbConfig): loadAllBooks {
  const dynamodb = createDynamoDbClient(config);

  return function (): Promise<BookState[]> {
    return dynamodb
      .scan({
        TableName: config.table,
      })
      .promise()
      .then((books) => books.Items as BookState[]);
  };
}

export const persistUpdatedBookFactory = saveOrUpdateFactory;

export const persistNewBookFactory = saveOrUpdateFactory;

function saveOrUpdateFactory(config: DynamoDbConfig): persistUpdatedBook | persistNewBook {
  const dynamodb = createDynamoDbClient(config);

  return function (book: BookState): Promise<void> {
    return dynamodb
      .put({
        TableName: config.table,
        Item: book,
      })
      .promise()
      .then(() => undefined);
  };
}

function createDynamoDbClient({ region, endpoint }: DynamoDbConfig): DocumentClient {
  return new AWS.DynamoDB.DocumentClient({ region, endpoint });
}
