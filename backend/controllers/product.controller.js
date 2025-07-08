import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
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

		console.log("Creating product with data:", { name, description, price, category, hasImage: !!image });
		console.log("Environment check:", {
			cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
			hasCloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
			hasCloudinarySecret: !!process.env.CLOUDINARY_API_SECRET
		});

		// First, try to create the product without image to test basic functionality
		if (!image) {
			console.log("Creating product without image...");
			const product = await Product.create({
				name,
				description,
				price,
				image: "",
				category,
			});
			console.log("Product created successfully without image:", product._id);
			return res.status(201).json(product);
		}

		let cloudinaryResponse = null;

		if (image) {
			console.log("Uploading image to Cloudinary...");
			console.log("Image data length:", image.length);
			console.log("Image data preview:", image.substring(0, 50) + "...");
			
			try {
				cloudinaryResponse = await cloudinary.uploader.upload(image, { 
					folder: "products",
					resource_type: "auto",
					quality: "auto:low"
				});
				console.log("Cloudinary upload successful:", cloudinaryResponse.secure_url);
			} catch (cloudinaryError) {
				console.log("Cloudinary upload error:", cloudinaryError);
				console.log("Cloudinary error details:", cloudinaryError.message);
				throw new Error("Image upload failed: " + cloudinaryError.message);
			}
		}

		console.log("Creating product in database...");
		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		console.log("Product created successfully:", product._id);
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

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

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
