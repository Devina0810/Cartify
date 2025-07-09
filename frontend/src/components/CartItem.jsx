import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className='rounded-2xl border p-4 shadow-md border-[#cabaa5] bg-[#fdfaf5] font-[Cormorant Garamond] md:p-6'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				<div className='shrink-0 md:order-1'>
					<img
						className='h-24 md:h-36 rounded-xl object-cover border border-[#cabaa5]'
						src={item.image}
						alt={item.name}
					/>
				</div>

				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-3'>
						<button
							className='inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#a68a7f] bg-[#e9e2d5] hover:bg-[#d7c7b4]'
							onClick={() => updateQuantity(item._id, item.quantity - 1)}
						>
							<Minus className='text-[#5e412f]' size={14} />
						</button>
						<p className='text-[#5e412f] font-semibold'>{item.quantity}</p>
						<button
							className='inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#a68a7f] bg-[#e9e2d5] hover:bg-[#d7c7b4]'
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
						>
							<Plus className='text-[#5e412f]' size={14} />
						</button>
					</div>

					<div className='text-end md:order-4 md:w-32'>
						<p className='text-lg font-bold text-[#5e412f]'>Rs{item.price}</p>
					</div>
				</div>

				<div className='w-full min-w-0 flex-1 space-y-3 md:order-2 md:max-w-md'>
					<p className='text-lg font-semibold text-[#5e412f] hover:text-[#947c6a] hover:underline'>
						{item.name}
					</p>
					<p className='text-sm text-[#a68a7f]'>{item.description}</p>

					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium text-red-500 hover:text-red-400 hover:underline'
							onClick={() => removeFromCart(item._id)}
						>
							<Trash size={16} className='mr-1' /> Remove
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
