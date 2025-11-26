import { useState } from "react";
import { UserModel } from "../models";
import { userService } from "../services";

/**
 * User ViewModel
 * Gère l'état et la logique métier pour la gestion des utilisateurs
 * Fait le lien entre le Model (User) et la View (composants React)
 */
export class UserViewModel {
  // État
  private _users: UserModel[] = [];
  private _loading: boolean = false;
  private _error: string | null = null;
  private _selectedUser: UserModel | null = null;

  // Callbacks pour notifier les changements à la Vue
  private updateView: () => void;

  constructor(updateView: () => void) {
    this.updateView = updateView;
  }

  // Getters
  get users(): UserModel[] {
    return this._users;
  }

  get loading(): boolean {
    return this._loading;
  }

  get error(): string | null {
    return this._error;
  }

  get selectedUser(): UserModel | null {
    return this._selectedUser;
  }

  // Actions
  async loadUsers(): Promise<void> {
    this._loading = true;
    this._error = null;
    this.updateView();

    try {
      this._users = await userService.fetchUsers();
    } catch (error) {
      this._error = "Impossible de charger les utilisateurs";
      console.error(error);
    } finally {
      this._loading = false;
      this.updateView();
    }
  }

  async loadUserById(id: string): Promise<void> {
    this._loading = true;
    this._error = null;
    this.updateView();

    try {
      this._selectedUser = await userService.fetchUserById(id);
    } catch (error) {
      this._error = "Impossible de charger l'utilisateur";
      console.error(error);
    } finally {
      this._loading = false;
      this.updateView();
    }
  }

  async createUser(name: string, email: string, age?: number): Promise<void> {
    this._loading = true;
    this._error = null;
    this.updateView();

    try {
      const newUser = await userService.createUser({ name, email, age });
      this._users.push(newUser);
    } catch (error) {
      this._error = "Impossible de créer l'utilisateur";
      console.error(error);
    } finally {
      this._loading = false;
      this.updateView();
    }
  }

  async updateUser(id: string, updates: Partial<UserModel>): Promise<void> {
    this._loading = true;
    this._error = null;
    this.updateView();

    try {
      const updatedUser = await userService.updateUser(id, updates);
      const index = this._users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this._users[index] = updatedUser;
      }
      if (this._selectedUser?.id === id) {
        this._selectedUser = updatedUser;
      }
    } catch (error) {
      this._error = "Impossible de mettre à jour l'utilisateur";
      console.error(error);
    } finally {
      this._loading = false;
      this.updateView();
    }
  }

  async deleteUser(id: string): Promise<void> {
    this._loading = true;
    this._error = null;
    this.updateView();

    try {
      await userService.deleteUser(id);
      this._users = this._users.filter((u) => u.id !== id);
      if (this._selectedUser?.id === id) {
        this._selectedUser = null;
      }
    } catch (error) {
      this._error = "Impossible de supprimer l'utilisateur";
      console.error(error);
    } finally {
      this._loading = false;
      this.updateView();
    }
  }

  selectUser(user: UserModel | null): void {
    this._selectedUser = user;
    this.updateView();
  }

  clearError(): void {
    this._error = null;
    this.updateView();
  }
}

/**
 * Hook personnalisé pour utiliser le UserViewModel dans les composants React
 */
export const useUserViewModel = () => {
  const [, forceUpdate] = useState({});

  // Crée une instance du ViewModel qui persiste entre les rendus
  const [viewModel] = useState(() => {
    return new UserViewModel(() => forceUpdate({}));
  });

  return viewModel;
};
