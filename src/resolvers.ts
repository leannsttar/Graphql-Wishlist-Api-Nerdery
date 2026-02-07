import { GraphQLError } from "graphql";
import path from "node:path";
import { access, mkdir, writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import {
  WishlistItem,
  GetWishlistArgs,
  CreateItemInput,
  UpdateItemInput,
} from "./types";
import { wishlistData } from "./db";

export const resolvers = {
  Query: {
    wishlist: (_: unknown, args: GetWishlistArgs): WishlistItem[] => {
      let result = [...wishlistData];

      if (args.filterName) {
        const searchItem = args.filterName.toLowerCase();
        result = result.filter((item) => {
          return item.name.toLowerCase().includes(searchItem);
        });
      }

      if (args.sortByPrice) {
        result.sort((a, b) => {
          if (args.sortByPrice === "ASC") {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        });
      }

      // Pagination
      const page = args.page || 1;
      const limit = args.limit || 5;
      const start = (page - 1) * limit;
      const end = start + limit;

      result = result.slice(start, end);

      return result;
    },

    summary: () => {
      if (wishlistData.length < 1) {
        return null;
      }
      
      const totalItems = wishlistData.length;

      const totalCost = wishlistData.reduce((total, item) => {
        return total + item.price;
      }, 0);

      const mostExpensive = wishlistData.reduce((prev, current) => {
        if (prev.price > current.price) {
          return prev;
        } else {
          return current;
        }
      });

      return {
        totalItems,
        totalCost,
        averagePrice: totalCost / totalItems,
        mostExpensive,
      };
    },
  },

  Mutation: {
    addItem(_: unknown, args: CreateItemInput): WishlistItem {
      const { name, price, stock, store } = args.input;

      if (price <= 0) {
        throw new GraphQLError("Price must be positive");
      }
      if (stock < 0) {
        throw new GraphQLError("Stock cannot be negative");
      }

      const newItem: WishlistItem = {
        id: uuidv4(),
        name,
        price,
        stock,
        store,
        dateAdded: new Date().toISOString(),
      };

      wishlistData.push(newItem);
      return newItem;
    },

    updateItem(_: unknown, args: UpdateItemInput): WishlistItem {
      const { itemId, input } = args;
      const index = wishlistData.findIndex((item) => {
        return item.id === itemId;
      });

      if (index === -1) {
        throw new GraphQLError("Item not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (input.price !== undefined && input.price <= 0) {
        throw new GraphQLError("Price must be positive");
      }
      if (input.stock !== undefined && input.stock < 0) {
        throw new GraphQLError("Stock cannot be negative");
      }

      const updatedItem: WishlistItem = {
        ...wishlistData[index],
        ...input,
      };

      wishlistData[index] = updatedItem;
      return updatedItem;
    },

    deleteItem(_: unknown, args: { itemId: string }): string {
      const index = wishlistData.findIndex((item) => {
        return item.id === args.itemId;
      });

      if (index === -1) {
        throw new GraphQLError("Item not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      wishlistData.splice(index, 1);
      return args.itemId;
    },

    async generateCsv(): Promise<string> {
      try {
        const headers = "ID,Name,Price,Stock,Store,Date Added\n";
        const rows = wishlistData
          .map((item) => {
            return `${item.id},"${item.name}",${item.price},${item.stock},"${item.store}",${item.dateAdded}`;
          })
          .join("\n");

        const csvContent = headers + rows;
        const exportsDir = path.join(__dirname, "../exports");
        const filePath = path.join(exportsDir, "wishlist.csv");

        try {
          await access(exportsDir);
        } catch {
          await mkdir(exportsDir, { recursive: true });
        }

        await writeFile(filePath, csvContent, "utf-8");

        return `CSV file generated at: ${filePath}`;
      } catch (error) {
        throw new GraphQLError(`Failed to generate CSV: ${error}`);
      }
    },
  },
};