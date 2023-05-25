declare namespace Service {
  interface login {
    id: number;
    name: string;
    <T = any>(date: T): Promise<T>;
  }
}

// declare module "jsonwebtoken";
