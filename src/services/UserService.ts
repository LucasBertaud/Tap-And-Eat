import { User, UserModel } from "../models";

/**
 * User Service
 * Gère les appels API et la logique d'accès aux données pour les utilisateurs
 */
export class UserService {
  private apiUrl = "https://api.example.com/users"; // À remplacer par votre API

  /**
   * Récupère tous les utilisateurs
   */
  async fetchUsers(): Promise<UserModel[]> {
    try {
      // Simulation d'un appel API
      // const response = await fetch(this.apiUrl);
      // const data = await response.json();

      // Données mockées pour l'exemple
      const mockData: User[] = [
        {
          id: "1",
          name: "Jean Dupont",
          email: "jean@example.com",
          age: 28,
          createdAt: new Date(),
        },
        {
          id: "2",
          name: "Marie Martin",
          email: "marie@example.com",
          age: 32,
          createdAt: new Date(),
        },
      ];

      return mockData.map((user) => new UserModel(user));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async fetchUserById(id: string): Promise<UserModel> {
    try {
      // const response = await fetch(`${this.apiUrl}/${id}`);
      // const data = await response.json();

      // Données mockées
      const mockUser: User = {
        id,
        name: "Jean Dupont",
        email: "jean@example.com",
        age: 28,
        createdAt: new Date(),
      };

      return new UserModel(mockUser);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur " + id + ":",
        error
      );
      throw error;
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(user: Omit<User, "id">): Promise<UserModel> {
    try {
      // const response = await fetch(this.apiUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(user),
      // });
      // const data = await response.json();

      // Simulation de la création
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      return new UserModel(newUser);
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      throw error;
    }
  }

  /**
   * Met à jour un utilisateur existant
   */
  async updateUser(id: string, updates: Partial<User>): Promise<UserModel> {
    try {
      // const response = await fetch(`${this.apiUrl}/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates),
      // });
      // const data = await response.json();

      const updatedUser: User = {
        id,
        name: updates.name || "Jean Dupont",
        email: updates.email || "jean@example.com",
        age: updates.age,
        createdAt: new Date(),
      };

      return new UserModel(updatedUser);
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'utilisateur ${id}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id: string): Promise<void> {
    try {
      // await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
      console.log(`Utilisateur ${id} supprimé`);
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'utilisateur ${id}:`,
        error
      );
      throw error;
    }
  }
}

export const userService = new UserService();
