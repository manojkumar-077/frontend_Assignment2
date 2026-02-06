export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    token?: string; // DummyJSON returns token in login response
}

export interface Bookmark {
    id: number;
    title: string;
    url: string;
    category: string;
    thumbnail?: string;
    userId: number;
    description?: string;
    rating?: number;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export type PaginatedResponse<T, K extends string> = {
    [key in K]: T[];
} & {
    total: number;
    skip: number;
    limit: number;
}

export type ProductsResponse = PaginatedResponse<Product, 'products'>;

