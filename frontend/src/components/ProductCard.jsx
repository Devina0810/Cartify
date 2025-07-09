import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		addToCart(product);
	};

	return (
		<div className="flex flex-col w-full bg-[#f5f1ec] rounded-2xl border border-[#cabaa5] shadow-md overflow-hidden transition duration-300 hover:shadow-lg font-[Cormorant Garamond]">
			<div className="relative h-64 overflow-hidden">
				<img
					src={product.image}
					alt={product.name}
					className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
				/>
			</div>

			<div className="p-5 text-[#5e412f]">
				<h5 className="text-2xl font-semibold mb-2">{product.name}</h5>

				<div className="flex items-center justify-between mb-4">
					<span className="text-xl font-bold text-[#8d6e63]">Rs{product.price}</span>
				</div>

				<button
					className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#8d6e63] hover:bg-[#7b5e55] text-white px-4 py-2.5 text-sm tracking-wide transition duration-300"
					onClick={handleAddToCart}
				>
					<ShoppingCart size={20} />
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
