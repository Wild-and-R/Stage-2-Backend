export interface Product {
    id: number;
    productid: number;
    productname: string;
    content: string;
    price: number;
}

export const products: Product[] = [
    { id: 1, productid: 101, productname: 'Product Pertama', content: 'Ini konten untuk product pertama.', price: 10000 },
    { id: 2, productid: 102, productname: 'Product Kedua', content: 'Ini konten untuk product kedua.', price: 20000 },
];
