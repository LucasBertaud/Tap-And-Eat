/**
 * User Model
 * Interface TypeScript pour typer les données utilisateur
 */
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt?: Date;
}
