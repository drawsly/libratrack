export type Loan = {
  id: string;
  book_id: string;
  reader_id: string;
  loan_date: Date;
  return_date: Date | null;
};
