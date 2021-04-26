import { Book, BookAuthor, BookTitle } from '../../src/domain/book';
import { ValidationError } from '../../src/domain/common';

describe('Domain', () => {
  describe('Book', () => {
    let author: string, title: string, isbn: string;

    beforeEach(() => {
      author = 'Test author';
      title = 'Test title';
      isbn = '0123456789';
    });

    it('is created when all its properties are correct', () => {
      // given
      const book = Book.createNew({ author, title, isbn });
      // when
      const currentState = book.currentState();
      // then
      expect(currentState.id).toBeDefined();
      expect(currentState.author).toBe(author);
      expect(currentState.title).toBe(title);
    });

    it('fails to be created when title not provided', () => {
      // then
      expectErrorWithName(ValidationError.NAME).toBeThrownWhen(() => {
        // when
        Book.createNew({ author });
      });
    });

    it('fails to be created when title too long', () => {
      // given
      const tooLongTitle = generateSymbolLongerThan(BookTitle.maxLength);
      // then
      expectErrorWithName(ValidationError.NAME).toBeThrownWhen(() => {
        // when
        Book.createNew({ title: tooLongTitle });
      });
    });

    it('fails to be created when author not provided', () => {
      // then
      expectErrorWithName(ValidationError.NAME).toBeThrownWhen(() => {
        // when
        Book.createNew({ title });
      });
    });

    it('fails to be created when author too long', () => {
      // given
      const tooLongAuthor = generateSymbolLongerThan(BookAuthor.maxLength);
      // then
      expectErrorWithName(ValidationError.NAME).toBeThrownWhen(() => {
        // when
        Book.createNew({ author: tooLongAuthor });
      });
    });

    it('fails to be created when ISBN wrong', () => {
      // given
      const wrongIsbn = '012345678'; // too short
      // then
      expectErrorWithName(ValidationError.NAME).toBeThrownWhen(() => {
        // when
        Book.createNew({ author, title, isbn: wrongIsbn });
      });
    });

    it('is created from a state', () => {
      // given
      const book = Book.createNew({ author, title });
      const currentState = book.currentState();
      // when
      const recreatedBook = Book.from(currentState);
      // then
      expect(currentState).toEqual(recreatedBook.currentState());
    });

    it('fails to be created from state when ID not provided', () => {
      // then
      expectErrorWithName(ValidationError.NAME).toBeThrownWhen(() => {
        // when
        Book.from({ author, title });
      });
    });

    it('fails to be created from state when ID too long', () => {
      // given
      const book = Book.createNew({ author, title });
      const currentState = book.currentState();
      // then
      expectErrorWithName(ValidationError.NAME).toBeThrownWhen(() => {
        // when
        Book.from({ id: currentState.id + 'AB', author, title });
      });
    });

    it('fails to be created from state when ID corrupted', () => {
      // then
      expectErrorWithName(ValidationError.NAME).toBeThrownWhen(() => {
        // when
        Book.from({ id: 'corruptedId', author, title });
      });
    });
  });
});

function expectErrorWithName(errorName: string) {
  return {
    toBeThrownWhen(fn: () => void) {
      try {
        fn();
        fail(`${errorName} expected`);
      } catch (e) {
        // then
        expect(e.name).toBe(errorName);
      }
    },
  };
}

function generateSymbolLongerThan(length: number): string {
  let symbol = 'Test';
  while (symbol.length <= length) {
    symbol += symbol;
  }
  return symbol;
}
