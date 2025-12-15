import {
  calculateCartTotal,
  calculateItemPrice,
  calculateItemTotal,
  type CartItem,
} from "../Cart";
import type { Product } from "../Menu";

describe("Cart - Calcul du total du panier", () => {
  const mockProduct: Product = {
    id: "1",
    name: "Burger Classic",
    description: "Un délicieux burger",
    base_price: 10.0,
    category_id: "cat1",
    image_url: null,
    is_available: true,
    ingredients: [],
    display_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe("calculateItemPrice", () => {
    it("devrait calculer le prix de base sans options", () => {
      const item: CartItem = {
        id: "item1",
        product: mockProduct,
        selectedOptions: [],
        quantity: 1,
      };

      const price = calculateItemPrice(item);
      expect(price).toBe(10.0);
    });

    it("devrait ajouter le prix des options au prix de base", () => {
      const item: CartItem = {
        id: "item1",
        product: mockProduct,
        selectedOptions: [
          {
            optionId: "opt1",
            optionGroupId: "group1",
            name: "Fromage",
            priceModifier: 1.5,
          },
          {
            optionId: "opt2",
            optionGroupId: "group1",
            name: "Bacon",
            priceModifier: 2.0,
          },
        ],
        quantity: 1,
      };

      const price = calculateItemPrice(item);
      expect(price).toBe(13.5); // 10 + 1.5 + 2.0
    });

    it("devrait gérer les options avec prix négatif (réduction)", () => {
      const item: CartItem = {
        id: "item1",
        product: mockProduct,
        selectedOptions: [
          {
            optionId: "opt1",
            optionGroupId: "group1",
            name: "Sans sauce",
            priceModifier: -0.5,
          },
        ],
        quantity: 1,
      };

      const price = calculateItemPrice(item);
      expect(price).toBe(9.5);
    });
  });

  describe("calculateItemTotal", () => {
    it("devrait multiplier le prix par la quantité", () => {
      const item: CartItem = {
        id: "item1",
        product: mockProduct,
        selectedOptions: [],
        quantity: 3,
      };

      const total = calculateItemTotal(item);
      expect(total).toBe(30.0); // 10 * 3
    });

    it("devrait calculer correctement avec options et quantité", () => {
      const item: CartItem = {
        id: "item1",
        product: mockProduct,
        selectedOptions: [
          {
            optionId: "opt1",
            optionGroupId: "group1",
            name: "Fromage",
            priceModifier: 1.5,
          },
        ],
        quantity: 2,
      };

      const total = calculateItemTotal(item);
      expect(total).toBe(23.0); // (10 + 1.5) * 2
    });
  });

  describe("calculateCartTotal", () => {
    it("devrait retourner 0 pour un panier vide", () => {
      const total = calculateCartTotal([]);
      expect(total).toBe(0);
    });

    it("devrait calculer le total pour un seul article", () => {
      const items: CartItem[] = [
        {
          id: "item1",
          product: mockProduct,
          selectedOptions: [],
          quantity: 2,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe(20.0);
    });

    it("devrait calculer le total pour plusieurs articles", () => {
      const mockProduct2: Product = {
        ...mockProduct,
        id: "2",
        name: "Frites",
        base_price: 3.5,
      };

      const items: CartItem[] = [
        {
          id: "item1",
          product: mockProduct,
          selectedOptions: [
            {
              optionId: "opt1",
              optionGroupId: "group1",
              name: "Fromage",
              priceModifier: 1.5,
            },
          ],
          quantity: 2,
        },
        {
          id: "item2",
          product: mockProduct2,
          selectedOptions: [],
          quantity: 1,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe(26.5); // (10 + 1.5) * 2 + 3.5 * 1
    });

    it("devrait gérer un panier complexe avec plusieurs articles et options", () => {
      const mockProduct2: Product = {
        ...mockProduct,
        id: "2",
        name: "Pizza",
        base_price: 12.0,
      };

      const items: CartItem[] = [
        {
          id: "item1",
          product: mockProduct,
          selectedOptions: [
            {
              optionId: "opt1",
              optionGroupId: "group1",
              name: "Fromage",
              priceModifier: 1.5,
            },
            {
              optionId: "opt2",
              optionGroupId: "group2",
              name: "Bacon",
              priceModifier: 2.0,
            },
          ],
          quantity: 1,
        },
        {
          id: "item2",
          product: mockProduct2,
          selectedOptions: [
            {
              optionId: "opt3",
              optionGroupId: "group3",
              name: "Extra fromage",
              priceModifier: 3.0,
            },
          ],
          quantity: 2,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe(43.5); // (10 + 1.5 + 2.0) * 1 + (12 + 3.0) * 2
    });
  });
});
