import { Request, Response } from "express";
import {products, Product} from "../models/post-model";

export const getProducts = (req: Request, res: Response) => {
    res.json(products);
};

export const createProducts = (req: Request, res: Response) => {
    const {productid, productname, content, price} = req.body;
    const newProduct: Product = {
        id: products.length + 1,
        productid,
        productname,
        content,
        price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
};

export const updateProduct = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { productname, content, price } = req.body;

    const product = products.find(p => p.id === id);
    if (product === undefined) {
        return res.status(404).json({ message: "Product not found" });
    }
    product.productname = productname ?? product.productname;
    product.content = content ?? product.content;
    product.price = price ?? product.price;

    res.json(product);
};

export const deleteProduct = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);
    const deletedProduct = products.splice(index, 1);
    res.json({ message: "Product deleted", product: deletedProduct[0] });
};
