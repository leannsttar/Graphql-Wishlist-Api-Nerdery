export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  store: string;
  dateAdded: string;
}

export interface GetWishlistArgs {
  page?: number;
  limit?: number;
  filterName?: string;
  sortByPrice?: "ASC" | "DESC";
}

export interface CreateItemInput {
  input: {
    name: string;
    price: number;
    stock: number;
    store: string;
  };
}

export interface UpdateItemInput {
  itemId: string;
  input: {
    name?: string;
    price?: number;
    stock?: number;
    store?: string;
  };
}
