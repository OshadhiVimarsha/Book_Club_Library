export type Lending = {
  _id: string;
  readerId: {
    readerId: string;
    name: string;
    email: string;
  }
  borrowedDate: string;
  isReturned: boolean;
  dueDate: string;
  bookId: string;
  books: {
    _id: any;
    bookId: string;
    title: string;
    author: string;
    isReturned: boolean;
    dueDate?: string;
  }[];
}



export type LendingBook = {
  _id: string;
  readerId: {
    readerId: string;
    name: string;
    email: string;
  }
  borrowedDate: string;
  isReturned: boolean;
  dueDate: string;
  bookId: {
    bookId: string;
    title: string;
    author: string;
  }[];
}
