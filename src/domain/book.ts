import { customAlphabet } from 'nanoid';
import { assert } from './common';

export type NewBookCommand = Omit<UpdateBookStateCommand, 'id'>;

export type UpdateBookStateCommand = Partial<BookState>;

export interface BookState {
  id: string;
  author: string;
  title: string;
  isbn?: string;
}

export class Book {
  private constructor(
    private readonly id: BookId,
    private readonly title: BookTitle,
    private readonly author: BookAuthor,
    private readonly isbn?: ISBN,
  ) {}

  static from(state: UpdateBookStateCommand | BookState): Book {
    return new Book(
      BookId.of(state.id),
      BookTitle.of(state.title),
      BookAuthor.of(state.author),
      state.isbn ? ISBN.of(state.isbn) : undefined,
    );
  }

  static createNew(newBookCommand: NewBookCommand): Book {
    return new Book(
      BookId.generateNew(),
      BookTitle.of(newBookCommand.title),
      BookAuthor.of(newBookCommand.author),
      newBookCommand.isbn ? ISBN.of(newBookCommand.isbn) : undefined,
    );
  }

  currentState(): BookState {
    const state: BookState = {
      id: this.id.value,
      author: this.author.value,
      title: this.title.value,
    };
    if (this.isbn) {
      state.isbn = this.isbn.value;
    }
    return state;
  }
}

export class BookId {
  static readonly size = 14;
  static readonly alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static readonly alphabetRegExp = new RegExp(`^[0-9A-Z]{${BookId.size}}$`);
  private static readonly generateId = customAlphabet(BookId.alphabet, BookId.size);

  private constructor(public readonly value: string) {}

  static of(value?: string): BookId {
    assert('bookId').of(value).isNotEmpty().isNotLongerThan(BookId.size).matches(BookId.alphabetRegExp);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new BookId(value!);
  }

  static generateNew(): BookId {
    return new BookId(BookId.generateId());
  }
}

export class BookAuthor {
  static readonly maxLength = 20;

  private constructor(public readonly value: string) {}

  static of(value?: string): BookAuthor {
    assert('bookAuthor').of(value).isNotEmpty().isNotLongerThan(BookAuthor.maxLength);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new BookAuthor(value!);
  }
}

export class BookTitle {
  static readonly maxLength = 30;

  private constructor(public readonly value: string) {}

  static of(value?: string): BookTitle {
    assert('bookTitle').of(value).isNotEmpty().isNotLongerThan(BookTitle.maxLength);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new BookTitle(value!);
  }
}

export class ISBN {
  static readonly regExp = /(^[0-9]{10}$)|(^[0-9]{13}$)/;

  private constructor(public readonly value: string) {}

  static of(value?: string): BookTitle {
    assert('bookIsbn').of(value).isNotEmpty().matches(ISBN.regExp);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new ISBN(value!);
  }
}
