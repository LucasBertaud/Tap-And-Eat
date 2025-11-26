import { User } from "../models";

/**
 * User Service
 * Gère les appels API et la logique d'accès aux données
 */
class UserService {
  private apiUrl = "https://api.example.com/users";

  /**
   * Récupère tous les utilisateurs depuis l'API
   */
  async fetchUsers(): Promise<User[]> {
    try {
      // TODO: Remplacer par un vrai appel API
      // const response = await fetch(this.apiUrl);
      // return await response.json();

      // Données mockées pour la démo
      return [
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
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    try {
      // TODO: Appel API POST
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      return newUser;
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      throw error;
    }
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      // TODO: Appel API PUT
      const updatedUser: User = {
        id,
        name: updates.name || "User",
        email: updates.email || "user@example.com",
        age: updates.age,
        createdAt: new Date(),
      };
      return updatedUser;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      throw error;
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id: string): Promise<void> {
    try {
      // TODO: Appel API DELETE
      console.log("Utilisateur supprimé:", id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw error;
    }
  }
}

export default new UserService();
