# Tap-And-Eat 🍽️

Application React Native développée avec Expo et suivant l'architecture **MVVM** (Model-View-ViewModel).

## 🏗️ Architecture MVVM

Ce projet suit le pattern MVVM pour une séparation claire des responsabilités :

```
├── models/          # Modèles de données (interfaces TypeScript)
│   ├── Auth.ts
│   └── User.ts
├── services/        # Services pour les appels API/Supabase
│   ├── AuthService.ts
│   └── UserService.ts
├── viewmodels/      # ViewModels avec logique métier (MobX)
│   ├── AuthViewModel.ts
│   └── UserViewModel.ts
├── views/           # Composants de vue réutilisables
│   ├── AuthView.tsx
│   └── ...
├── app/             # Routes Expo Router
├── components/      # Composants UI réutilisables
├── hooks/           # Custom React Hooks
└── providers/       # Context Providers (Auth, etc.)
```

### Flux de données MVVM

1. **Model** : Définit la structure des données (interfaces TypeScript)
2. **Service** : Gère les appels API et la logique d'accès aux données
3. **ViewModel** : Contient l'état et la logique métier (observable avec MobX)
4. **View** : Affiche l'UI et interagit avec le ViewModel

## 🚀 Démarrage

### Prérequis

- Node.js (v18+)
- npm ou yarn
- Expo CLI
- Compte Supabase configuré

### Installation

1. Cloner le dépôt
   ```bash
   git clone <repository-url>
   cd Tap-And-Eat
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement
   - Créer un fichier `.env` à la racine
   - Ajouter vos credentials Supabase :
     ```
     EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
     ```

4. Lancer l'application
   ```bash
   npx expo start
   ```

## 🔐 Authentification

L'authentification est gérée par **Supabase** avec l'architecture MVVM :

- **Model** : `Auth.ts` - Interfaces pour les credentials et erreurs
- **Service** : `AuthService.ts` - Appels Supabase (signIn, signUp, signOut)
- **ViewModel** : `AuthViewModel.ts` - Logique métier et état observable
- **View** : `AuthView.tsx` - UI du formulaire de connexion/inscription
- **Provider** : `AuthProvider.tsx` - Context global de l'authentification

### Utilisation

```typescript
// Dans un composant
import { useAuthContext } from '@/hooks/use-auth-context'

function MyComponent() {
  const { session, isLoggedIn, profile } = useAuthContext()
  // ...
}
```

## 📦 Technologies utilisées

- **React Native** - Framework mobile
- **Expo** - Toolchain et développement
- **TypeScript** - Typage statique
- **MobX** - Gestion d'état réactive
- **Supabase** - Backend (auth, database)
- **Expo Router** - Navigation file-based

## 🎯 Ajouter une nouvelle fonctionnalité (MVVM)

### Exemple : Ajouter une gestion de produits

1. **Créer le Model** (`models/Product.ts`)
```typescript
export interface Product {
  id: string
  name: string
  price: number
}
```

2. **Créer le Service** (`services/ProductService.ts`)
```typescript
class ProductService {
  async fetchProducts(): Promise<Product[]> {
    // Appel API
  }
}
export default new ProductService()
```

3. **Créer le ViewModel** (`viewmodels/ProductViewModel.ts`)
```typescript
import { makeAutoObservable } from 'mobx'

class ProductViewModel {
  products: Product[] = []
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  async loadProducts() {
    this.loading = true
    this.products = await ProductService.fetchProducts()
    this.loading = false
  }
}
export default ProductViewModel
```

4. **Créer la View** (`views/ProductListView.tsx`)
```typescript
import { observer } from 'mobx-react-lite'

const ProductListView = observer(({ viewModel }: Props) => {
  // UI qui observe viewModel.products
})
```

5. **Utiliser dans une route** (`app/(tabs)/products.tsx`)
```typescript
const viewModel = useMemo(() => new ProductViewModel(), [])
return <ProductListView viewModel={viewModel} />
```

## 📝 Scripts disponibles

- `npm start` - Lancer le serveur Expo
- `npm run android` - Lancer sur Android
- `npm run ios` - Lancer sur iOS
- `npm run web` - Lancer sur le web
- `npm run lint` - Linter le code

## 🤝 Contribution

Les contributions sont les bienvenues ! Assurez-vous de suivre l'architecture MVVM établie.

## 📄 Licence

MIT