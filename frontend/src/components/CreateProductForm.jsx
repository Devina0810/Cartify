import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import toast from "react-hot-toast";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		imageFile: null,
	});

	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			let imageUrl = "";

			if (newProduct.imageFile) {
				const formData = new FormData();
				formData.append("image", newProduct.imageFile);

				const response = await fetch(
					`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
					{ method: "POST", body: formData }
				);

				const data = await response.json();
				if (!data.success) throw new Error("Image upload failed");
				imageUrl = data.data.url;
			}

			await createProduct({
				name: newProduct.name,
				description: newProduct.description,
				price: newProduct.price,
				category: newProduct.category,
				image: imageUrl,
			});

			toast.success("Product created successfully!");
			setNewProduct({ name: "", description: "", price: "", category: "", imageFile: null });
		} catch (error) {
			console.error("Error creating product:", error);
			toast.error("Failed to create product.");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) setNewProduct({ ...newProduct, imageFile: file });
	};

	return (
		<motion.div
			className='bg-[#fefaf6] text-[#4b2e2e] font-serif shadow-xl rounded-2xl p-8 mb-10 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-3xl font-semibold mb-6 text-center'>Create New Product</h2>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Name */}
				<div>
					<label htmlFor='name' className='block text-sm mb-1'>Product Name</label>
					<input
						type='text'
						id='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='w-full border border-[#cbbfb4] rounded-lg py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#4b2e2e]'
						required
					/>
				</div>

				{/* Description */}
				<div>
					<label htmlFor='description' className='block text-sm mb-1'>Description</label>
					<textarea
						id='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='w-full border border-[#cbbfb4] rounded-lg py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#4b2e2e]'
						required
					/>
				</div>

				{/* Price */}
				<div>
					<label htmlFor='price' className='block text-sm mb-1'>Price</label>
					<input
						type='number'
						id='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='w-full border border-[#cbbfb4] rounded-lg py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#4b2e2e]'
						required
					/>
				</div>

				{/* Category */}
				<div>
					<label htmlFor='category' className='block text-sm mb-1'>Category</label>
					<select
						id='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='w-full border border-[#cbbfb4] rounded-lg py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#4b2e2e]'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>{cat}</option>
						))}
					</select>
				</div>

				{/* Image Upload */}
				<div>
					<label className='block text-sm mb-2'>Product Image (Optional)</label>
					<div className='flex items-center'>
						<input
							type='file'
							id='image'
							className='sr-only'
							accept='image/*'
							onChange={handleImageChange}
						/>
						<label
							htmlFor='image'
							className='cursor-pointer bg-white py-2 px-4 border border-[#cbbfb4] rounded-lg text-sm font-medium hover:bg-[#f0eae3] focus:ring-2 focus:ring-[#4b2e2e]'
						>
							<Upload className='inline-block mr-2 h-5 w-5 text-[#4b2e2e]' />
							Upload Image
						</label>
						{newProduct.imageFile && (
							<span className='ml-3 text-sm text-gray-600 italic'>
								{newProduct.imageFile.name}
							</span>
						)}
					</div>
				</div>

				{/* Submit */}
				<button
					type='submit'
					className='w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg text-white bg-[#4b2e2e] hover:bg-[#3a2424] focus:ring-2 focus:ring-offset-2 focus:ring-[#4b2e2e] disabled:opacity-50'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='animate-spin h-5 w-5' />
							Creating...
						</>
					) : (
						<>
							<PlusCircle className='h-5 w-5' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};

export default CreateProductForm;
