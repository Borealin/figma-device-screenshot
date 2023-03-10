export type Result<T> =
  | {
      data: T;
    }
  | {
      error: CustomError;
    };

export class CustomError {
  constructor(public code: number, public msg: string) {}
}
