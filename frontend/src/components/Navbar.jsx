import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();

	return (
		<header
  		className='fixed top-0 left-0 w-full z-50 font-[Cormorant Garamond]'
  		style={{
    		backgroundColor: '#e8e0d4',
    		borderBottom: '18px solid #e8e0d4', // force-match background
    		boxShadow: 'none' // remove default Tailwind shadow
			}}
		>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex justify-between items-center'>
					<Link to='/' className='text-3xl font-semibold text-[#5e412f] tracking-wide'>
						Maison Belle
					</Link>

					<nav className='flex items-center gap-5'>
						<Link
							to={"/"}
							className='text-[#5e412f] hover:text-[#9c7e5c] transition duration-300 ease-in-out'
						>
							Home
						</Link>

						{user && (
							<Link
								to={"/cart"}
								className='relative text-[#5e412f] hover:text-[#9c7e5c] transition duration-300 ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-[#9c7e5c] text-white rounded-full px-2 py-0.5 
									text-xs'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}

						{isAdmin && (
							<Link
								className='bg-[#9c7e5c] hover:bg-[#b69c82] text-white px-3 py-1 rounded-md 
								font-medium transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
							>
								<Lock className='inline-block mr-2' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className='bg-[#5e412f] hover:bg-[#4b3426] text-white py-2 px-4 
								rounded-md flex items-center transition duration-300 ease-in-out'
								onClick={logout}
							>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log Out</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-[#9c7e5c] hover:bg-[#b69c82] text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-[#5e412f] hover:bg-[#4b3426] text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Navbar;

