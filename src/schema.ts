export const typeDefs = `#graphql
    	enum Sorting {
		ASC
		DESC
	}
	
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

    input CreateItemInput {
        name: String!
        price: Float!
        stock: Int!
        store: String!
    }

	input UpdateItemInput {
		name: String
		price: Float
		stock: Int
		store: String
	}

    type Query {
        wishlist(
            page: Int
			limit: Int
			filterName: String
			sortByPrice: Sorting
        ): [Item!]!

		summary: WishlistSummary
    }

    type Mutation {
        addItem(input: CreateItemInput): Item!
		updateItem(itemId: ID!, input: UpdateItemInput!): Item
		deleteItem(itemId: ID!): ID
		generateCsv: String!
    }
`