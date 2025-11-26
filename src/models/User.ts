/**
 * User Model
 * Représente la structure de données d'un utilisateur
 */
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt?: Date;
}

export class UserModel implements User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt?: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.age = data.age;
    this.createdAt = data.createdAt;
  }

  // Méthodes métier liées au modèle
  getDisplayName(): string {
    return `${this.name} (${this.email})`;
  }

  isAdult(): boolean {
    return (this.age ?? 0) >= 18;
  }
}
