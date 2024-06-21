import ProductMongo from '../../models/mongo/productModel.js';

export default async function denormalizeProduct(product, models) {
    const Product = models.Product;
    const productDenormalized = await Product.findByPk(product.id, {
        attributes: { exclude: [] },
    });

    await ProductMongo.findByIdAndUpdate(
        product.id,
        productDenormalized.toJSON(),
        {
            upsert: true,
            new: true,
        }
    );
}
