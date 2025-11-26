import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../models";
import UserService from "../services/UserService";

/**
 * UserViewModel
 * Gère l'état et la logique métier pour les utilisateurs
 * Utilise MobX pour rendre l'état observable
 */
class UserViewModel {
  // État observable
  users: User[] = [];
  selectedUser: User | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    // Rend automatiquement toutes les propriétés observables
    makeAutoObservable(this);
  }

  /**
   * Charge tous les utilisateurs
   */
  async loadUsers() {
    this.loading = true;
    this.error = null;

    try {
      const users = await UserService.fetchUsers();
      runInAction(() => {
        this.users = users;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Impossible de charger les utilisateurs";
        this.loading = false;
      });
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(name: string, email: string, age?: number) {
    this.loading = true;
    this.error = null;

    try {
      const newUser = await UserService.createUser({ name, email, age });
      runInAction(() => {
        this.users.push(newUser);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Impossible de créer l'utilisateur";
        this.loading = false;
      });
    }
  }

  /**
   * Met à jour un utilisateur existant
   */
  async updateUser(id: string, updates: Partial<User>) {
    this.loading = true;
    this.error = null;

    try {
      const updatedUser = await UserService.updateUser(id, updates);
      runInAction(() => {
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        if (this.selectedUser?.id === id) {
          this.selectedUser = updatedUser;
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Impossible de mettre à jour l'utilisateur";
        this.loading = false;
      });
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id: string) {
    this.loading = true;
    this.error = null;

    try {
      await UserService.deleteUser(id);
      runInAction(() => {
        this.users = this.users.filter((u) => u.id !== id);
        if (this.selectedUser?.id === id) {
          this.selectedUser = null;
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Impossible de supprimer l'utilisateur";
        this.loading = false;
      });
    }
  }

  /**
   * Sélectionne un utilisateur pour l'édition
   */
  selectUser(user: User | null) {
    this.selectedUser = user;
  }

  /**
   * Efface l'erreur
   */
  clearError() {
    this.error = null;
  }

  /**
   * Réinitialise l'état
   */
  reset() {
    this.users = [];
    this.selectedUser = null;
    this.loading = false;
    this.error = null;
  }
}

export default UserViewModel;
