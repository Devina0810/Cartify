import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = null;
		
		// Try to get from Redis if available
		if (redis) {
			try {
				featuredProducts = await redis.get("featured_products");
				if (featuredProducts) {
					return res.json(JSON.parse(featuredProducts));
				}
			} catch (redisError) {
				console.log("Redis error, falling back to database:", redisError.message);
			}
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access
		if (redis) {
			try {
				await redis.set("featured_products", JSON.stringify(featuredProducts));
			} catch (redisError) {
				console.log("Redis cache error:", redisError.message);
			}
		}

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		console.log("=== CREATE PRODUCT ENDPOINT HIT ===");
		console.log("User:", req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : "No user");
		console.log("Request body:", req.body);
		
		const { name, description, price, image, category } = req.body;

		console.log("Creating product with data:", { name, description, price, category, imageUrl: image });

		console.log("Creating product in database...");
		const product = await Product.create({
			name,
			description,
			price,
			image: image || "", // Use the image URL directly or empty string if no image
			category,
		});

		console.log("Product created successfully:", product._id);
		
		// Update cache if needed
		if (product.isFeatured) {
			await updateFeaturedProductsCache();
		}
		
		res.status(201).json(product);
	} catch (error) {
		console.log("=== ERROR IN CREATE PRODUCT ===");
		console.log("Error message:", error.message);
		console.log("Full error:", error);
		console.log("Stack trace:", error.stack);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Since we're using ImgBB, images are handled externally

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		
		if (redis) {
			try {
				await redis.set("featured_products", JSON.stringify(featuredProducts));
			} catch (redisError) {
				console.log("Redis cache update error:", redisError.message);
			}
		}
	} catch (error) {
		console.log("error in update cache function", error.message);
	}
}
