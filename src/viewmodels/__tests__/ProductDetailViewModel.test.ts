import type { ProductWithOptions } from "@/src/models";
import { ProductDetailViewModel } from "../ProductDetailViewModel";

describe("ProductDetailViewModel - Validation des options", () => {
  let viewModel: ProductDetailViewModel;

  beforeEach(() => {
    viewModel = new ProductDetailViewModel();
  });

  const createMockProduct = (optionGroups: any[] = []): ProductWithOptions => ({
    id: "1",
    name: "Burger",
    description: "Test burger",
    base_price: 10.0,
    category_id: "cat1",
    image_url: null,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ingredients: [],
    display_order: 0,
    option_groups: optionGroups,
  });

  describe("validateRequiredOptions", () => {
    it("devrait retourner true si aucun groupe d'options", () => {
      const product = createMockProduct([]);
      const result = viewModel.validateRequiredOptions(product, {});

      expect(result).toBe(true);
    });

    it("devrait retourner true si toutes les options requises sont sélectionnées", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Cuisson",
          is_required: true,
          min_selections: 1,
          max_selections: 1,
          allow_multiple: false,
          options: [
            { id: "opt1", name: "Saignant", price_modifier: 0 },
            { id: "opt2", name: "À point", price_modifier: 0 },
          ],
        },
      ]);

      const selectedOptions = {
        group1: ["opt1"],
      };

      const result = viewModel.validateRequiredOptions(
        product,
        selectedOptions
      );
      expect(result).toBe(true);
    });

    it("devrait retourner false si une option requise n'est pas sélectionnée", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Cuisson",
          is_required: true,
          min_selections: 1,
          max_selections: 1,
          allow_multiple: false,
          options: [
            { id: "opt1", name: "Saignant", price_modifier: 0 },
            { id: "opt2", name: "À point", price_modifier: 0 },
          ],
        },
      ]);

      const selectedOptions = {};

      const result = viewModel.validateRequiredOptions(
        product,
        selectedOptions
      );
      expect(result).toBe(false);
    });

    it("devrait valider les sélections multiples requises", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Garnitures",
          is_required: true,
          min_selections: 2,
          max_selections: 4,
          allow_multiple: true,
          options: [
            { id: "opt1", name: "Salade", price_modifier: 0 },
            { id: "opt2", name: "Tomate", price_modifier: 0 },
            { id: "opt3", name: "Oignon", price_modifier: 0 },
          ],
        },
      ]);

      // Pas assez de sélections
      let selectedOptions = {
        group1: ["opt1"],
      };
      expect(viewModel.validateRequiredOptions(product, selectedOptions)).toBe(
        false
      );

      // Nombre correct de sélections
      selectedOptions = {
        group1: ["opt1", "opt2"],
      };
      expect(viewModel.validateRequiredOptions(product, selectedOptions)).toBe(
        true
      );

      // Nombre correct dans la plage
      selectedOptions = {
        group1: ["opt1", "opt2", "opt3"],
      };
      expect(viewModel.validateRequiredOptions(product, selectedOptions)).toBe(
        true
      );
    });

    it("devrait ignorer les groupes non requis", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Cuisson",
          is_required: true,
          min_selections: 1,
          max_selections: 1,
          allow_multiple: false,
          options: [{ id: "opt1", name: "Saignant", price_modifier: 0 }],
        },
        {
          id: "group2",
          name: "Suppléments",
          is_required: false,
          min_selections: 0,
          max_selections: null,
          allow_multiple: true,
          options: [{ id: "opt2", name: "Bacon", price_modifier: 2.0 }],
        },
      ]);

      const selectedOptions = {
        group1: ["opt1"],
        // group2 non sélectionné mais pas requis
      };

      const result = viewModel.validateRequiredOptions(
        product,
        selectedOptions
      );
      expect(result).toBe(true);
    });

    it("devrait gérer plusieurs groupes requis", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Cuisson",
          is_required: true,
          min_selections: 1,
          max_selections: 1,
          allow_multiple: false,
          options: [{ id: "opt1", name: "Saignant", price_modifier: 0 }],
        },
        {
          id: "group2",
          name: "Sauce",
          is_required: true,
          min_selections: 1,
          max_selections: 1,
          allow_multiple: false,
          options: [{ id: "opt2", name: "Ketchup", price_modifier: 0 }],
        },
      ]);

      // Un seul groupe sélectionné
      let selectedOptions: Record<string, string[]> = {
        group1: ["opt1"],
      };
      expect(viewModel.validateRequiredOptions(product, selectedOptions)).toBe(
        false
      );

      // Les deux groupes sélectionnés
      selectedOptions = {
        group1: ["opt1"],
        group2: ["opt2"],
      };
      expect(viewModel.validateRequiredOptions(product, selectedOptions)).toBe(
        true
      );
    });

    it("devrait valider correctement avec max_selections null (illimité)", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Garnitures",
          is_required: true,
          min_selections: 1,
          max_selections: null, // Illimité
          allow_multiple: true,
          options: [
            { id: "opt1", name: "Salade", price_modifier: 0 },
            { id: "opt2", name: "Tomate", price_modifier: 0 },
            { id: "opt3", name: "Oignon", price_modifier: 0 },
            { id: "opt4", name: "Cornichon", price_modifier: 0 },
          ],
        },
      ]);

      const selectedOptions = {
        group1: ["opt1", "opt2", "opt3", "opt4"],
      };

      const result = viewModel.validateRequiredOptions(
        product,
        selectedOptions
      );
      expect(result).toBe(true);
    });
  });

  describe("calculateTotalPrice", () => {
    it("devrait calculer le prix de base sans options", () => {
      const product = createMockProduct([]);
      const price = viewModel.calculateTotalPrice(product, {}, 1);

      expect(price).toBe(10.0);
    });

    it("devrait ajouter les modificateurs de prix des options", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Suppléments",
          is_required: false,
          min_selections: 0,
          max_selections: null,
          allow_multiple: true,
          options: [
            { id: "opt1", name: "Fromage", price_modifier: 1.5 },
            { id: "opt2", name: "Bacon", price_modifier: 2.0 },
          ],
        },
      ]);

      const selectedOptions = {
        group1: ["opt1", "opt2"],
      };

      const price = viewModel.calculateTotalPrice(product, selectedOptions, 1);
      expect(price).toBe(13.5); // 10 + 1.5 + 2.0
    });

    it("devrait multiplier par la quantité", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Suppléments",
          is_required: false,
          min_selections: 0,
          max_selections: null,
          allow_multiple: true,
          options: [{ id: "opt1", name: "Fromage", price_modifier: 1.5 }],
        },
      ]);

      const selectedOptions = {
        group1: ["opt1"],
      };

      const price = viewModel.calculateTotalPrice(product, selectedOptions, 3);
      expect(price).toBe(34.5); // (10 + 1.5) * 3
    });
  });

  describe("toggleOption", () => {
    it("devrait sélectionner une option unique", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Cuisson",
          is_required: true,
          min_selections: 1,
          max_selections: 1,
          allow_multiple: false,
          options: [
            { id: "opt1", name: "Saignant", price_modifier: 0 },
            { id: "opt2", name: "À point", price_modifier: 0 },
          ],
        },
      ]);

      const result = viewModel.toggleOption({}, "group1", "opt1", product);
      expect(result.newSelections).toEqual({ group1: ["opt1"] });
      expect(result.error).toBeUndefined();
    });

    it("devrait remplacer la sélection pour les options uniques", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Cuisson",
          is_required: true,
          min_selections: 1,
          max_selections: 1,
          allow_multiple: false,
          options: [
            { id: "opt1", name: "Saignant", price_modifier: 0 },
            { id: "opt2", name: "À point", price_modifier: 0 },
          ],
        },
      ]);

      const currentSelections = { group1: ["opt1"] };
      const result = viewModel.toggleOption(
        currentSelections,
        "group1",
        "opt2",
        product
      );

      expect(result.newSelections).toEqual({ group1: ["opt2"] });
    });

    it("devrait ajouter des options multiples", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Garnitures",
          is_required: false,
          min_selections: 0,
          max_selections: null,
          allow_multiple: true,
          options: [
            { id: "opt1", name: "Salade", price_modifier: 0 },
            { id: "opt2", name: "Tomate", price_modifier: 0 },
          ],
        },
      ]);

      let selections = {};
      let result = viewModel.toggleOption(
        selections,
        "group1",
        "opt1",
        product
      );
      expect(result.newSelections).toEqual({ group1: ["opt1"] });

      result = viewModel.toggleOption(
        result.newSelections,
        "group1",
        "opt2",
        product
      );
      expect(result.newSelections).toEqual({ group1: ["opt1", "opt2"] });
    });

    it("devrait retirer une option multiple", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Garnitures",
          is_required: false,
          min_selections: 0,
          max_selections: null,
          allow_multiple: true,
          options: [
            { id: "opt1", name: "Salade", price_modifier: 0 },
            { id: "opt2", name: "Tomate", price_modifier: 0 },
          ],
        },
      ]);

      const currentSelections = { group1: ["opt1", "opt2"] };
      const result = viewModel.toggleOption(
        currentSelections,
        "group1",
        "opt1",
        product
      );

      expect(result.newSelections).toEqual({ group1: ["opt2"] });
    });

    it("devrait respecter le max_selections", () => {
      const product = createMockProduct([
        {
          id: "group1",
          name: "Garnitures",
          is_required: false,
          min_selections: 0,
          max_selections: 2,
          allow_multiple: true,
          options: [
            { id: "opt1", name: "Salade", price_modifier: 0 },
            { id: "opt2", name: "Tomate", price_modifier: 0 },
            { id: "opt3", name: "Oignon", price_modifier: 0 },
          ],
        },
      ]);

      const currentSelections = { group1: ["opt1", "opt2"] };
      const result = viewModel.toggleOption(
        currentSelections,
        "group1",
        "opt3",
        product
      );

      expect(result.newSelections).toEqual(currentSelections);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("2 option(s) maximum");
    });
  });
});
