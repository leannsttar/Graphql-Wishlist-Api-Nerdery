# 🎁 Wishlist API - GraphQL

API GraphQL para gestionar una lista de deseos (wishlist) con operaciones CRUD completas, paginación, filtros, ordenamiento y exportación a CSV.

## 📋 Características

- ✅ **CRUD completo** - Crear, leer, actualizar y eliminar items
- 📄 **Paginación** - Navega por tu wishlist de forma eficiente
- 🔍 **Filtros** - Busca items por nombre
- 📊 **Ordenamiento** - Ordena por precio (ascendente/descendente)
- 📈 **Resumen estadístico** - Total de items, costos, promedios y más caro
- 📁 **Exportación CSV** - Genera archivos CSV de tu wishlist

## 🚀 Tecnologías

- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **Apollo Server** - Servidor GraphQL
- **GraphQL** - Lenguaje de consulta
- **UUID** - Generación de IDs únicos

## 📦 Instalación
```bash

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

```

## 🎮 Uso

El servidor correrá en: **http://localhost:4000**

Interfaz GraphQL (Apollo Studio): **http://localhost:4000/graphql**

## 📖 Esquema GraphQL

### Tipos
```graphql
type Item {
  id: ID!
  name: String!
  price: Float!
  stock: Int!
  store: String!
  dateAdded: String!
}

type WishlistSummary {
  mostExpensive: Item
  averagePrice: Float
  totalCost: Float
  totalItems: Int
}

enum Sorting {
  ASC
  DESC
}
```

## 🔍 Queries

### 1. Obtener todos los items (con paginación por defecto)
```graphql
query {
  wishlist {
    id
    name
    price
    stock
    store
    dateAdded
  }
}
```

**Nota:** Por defecto muestra 5 items por página.

### 2. Paginación personalizada
```graphql
# Primera página (10 items)
query {
  wishlist(page: 1, limit: 10) {
    id
    name
    price
  }
}

# Segunda página
query {
  wishlist(page: 2, limit: 10) {
    id
    name
    price
  }
}
```

### 3. Filtrar por nombre
```graphql
query {
  wishlist(filterName: "iPhone") {
    id
    name
    price
    store
  }
}

# Buscar productos de Apple
query {
  wishlist(filterName: "Apple") {
    id
    name
    price
  }
}
```

### 4. Ordenar por precio
```graphql
# Ascendente (más baratos primero)
query {
  wishlist(sortByPrice: ASC) {
    name
    price
  }
}

# Descendente (más caros primero)
query {
  wishlist(sortByPrice: DESC) {
    name
    price
  }
}
```

### 5. Combinar filtros, ordenamiento y paginación
```graphql
query {
  wishlist(
    filterName: "Pro"
    sortByPrice: DESC
    page: 1
    limit: 3
  ) {
    id
    name
    price
    stock
    store
  }
}
```

### 6. Obtener resumen estadístico
```graphql
query {
  summary {
    totalItems
    totalCost
    averagePrice
    mostExpensive {
      id
      name
      price
      store
    }
  }
}
```

## ✏️ Mutations

### 1. Agregar item
```graphql
mutation {
  addItem(input: {
    name: "iPhone 15 Pro"
    price: 999.99
    stock: 5
    store: "Apple Store"
  }) {
    id
    name
    price
    stock
    store
    dateAdded
  }
}
```

### 2. Actualizar item
```graphql
mutation {
  updateItem(
    itemId: "1"
    input: {
      price: 899.99
      stock: 10
    }
  ) {
    id
    name
    price
    stock
  }
}

# Actualizar solo el nombre
mutation {
  updateItem(
    itemId: "2"
    input: {
      name: "MacBook Pro M3 Max"
    }
  ) {
    id
    name
  }
}
```

### 3. Eliminar item
```graphql
mutation {
  deleteItem(itemId: "1")
}
```

### 4. Generar archivo CSV
```graphql
mutation {
  generateCsv
}
```

**Resultado:** El archivo CSV se guardará en la carpeta `exports/wishlist.csv` en la raíz del proyecto.

## 🗂️ Estructura del proyecto
```
wishlist-api-graphql/
├── src/
│   ├── server.ts       # Configuración de Apollo Server
│   ├── schema.ts       # Definición del esquema GraphQL
│   ├── resolvers.ts    # Lógica de negocio
│   ├── types.ts        # Tipos TypeScript
│   └── db.ts           # Base de datos en memoria
├── exports/            # Archivos CSV generados
│   └── wishlist.csv    # (se genera con la mutation)
├── dist/               # Código compilado (después de build)
├── node_modules/       # Dependencias
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Probando en Apollo Studio

1. Inicia el servidor: `npm run dev`
2. Abre tu navegador en: **http://localhost:4000/graphql**
3. Verás la interfaz de Apollo Studio
4. Usa el panel izquierdo para escribir queries/mutations
5. Click en el botón **▶️** (Query/Mutation) para ejecutar
6. Click en **"Documentation"** para explorar el esquema completo
7. Los resultados aparecerán en el panel derecho

### Usando variables en Apollo Studio

También puedes usar variables para hacer tus queries más reutilizables:

**Query:**
```graphql
query GetFilteredItems($filter: String, $sort: Sorting) {
  wishlist(filterName: $filter, sortByPrice: $sort) {
    name
    price
  }
}
```

**Variables (panel inferior):**
```json
{
  "filter": "iPhone",
  "sort": "DESC"
}
```

## 📊 Datos de ejemplo

Datos hardocded en memoria

## 📁 Exportación CSV

El archivo CSV generado tiene el siguiente formato:
```csv
ID,Name,Price,Stock,Store,Date Added
1,"iPhone 15 Pro Max",1199.99,5,"Apple Store",2024-01-15T00:00:00.000Z
2,"MacBook Air M2",1099.99,3,"Best Buy",2024-01-16T00:00:00.000Z
...
```

El archivo se guarda en: `exports/wishlist.csv`
