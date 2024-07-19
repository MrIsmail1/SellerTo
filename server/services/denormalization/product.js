import ProductMongo from "../../models/mongo/productModel.js";

export default async function denormalizeProduct(productId, models) {
  const Product = models.Product;
  const Images = models.Images;

  try {
    // Fetch the product and associated images using the alias
    const productDenormalized = await Product.findByPk(productId, {
      include: {
        model: Images,
        as: "images", // Use the alias defined in the association
        attributes: ["url"], // Only include the 'url' attribute
      },
      attributes: { exclude: [] },
    });
    if (!productDenormalized) {
      throw new Error(`Product with id ${productId} not found`);
    }

    // Convert product to JSON
    const productJSON = productDenormalized.toJSON();

    // Map images to include only the URL
    const imageUrls = productJSON.images
      ? productJSON.images.map((image) => image.url)
      : [];

    // Include image URLs in the product document
    productJSON.imageUrls = imageUrls;

    // Remove the images key as it's now part of productJSON.imageUrls
    delete productJSON.images;

    console.log(productJSON, productId);
    await ProductMongo.findByIdAndUpdate(productId, productJSON, {
      upsert: true,
      new: true,
    });
  } catch (error) {
    console.log(error);
  }
}
