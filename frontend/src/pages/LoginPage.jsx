import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	return (
		<div className='flex flex-col justify-center py-16 sm:px-6 lg:px-8 font-[Cormorant Garamond] bg-[#fdfaf5] min-h-screen'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-4xl font-semibold text-[#5e412f]'>
					Welcome Back
				</h2>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-white py-10 px-6 shadow-xl rounded-2xl border border-[#e5d4c0]'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Email */}
						<div>
							<label htmlFor='email' className='block text-sm text-[#5e412f] mb-1'>
								Email address
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#bba089]'>
									<Mail className='h-5 w-5' aria-hidden='true' />
								</div>
								<input
									id='email'
									type='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='block w-full px-4 py-2 pl-10 bg-[#fdfaf5] border border-[#decab1] 
									 text-[#5e412f] rounded-md shadow-sm placeholder-[#bba089]
									 focus:outline-none focus:ring-[#7b5d42] focus:border-[#7b5d42] sm:text-sm'
									placeholder='you@example.com'
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label htmlFor='password' className='block text-sm text-[#5e412f] mb-1'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#bba089]'>
									<Lock className='h-5 w-5' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='block w-full px-4 py-2 pl-10 bg-[#fdfaf5] border border-[#decab1] 
									 text-[#5e412f] rounded-md shadow-sm placeholder-[#bba089]
									 focus:outline-none focus:ring-[#7b5d42] focus:border-[#7b5d42] sm:text-sm'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							disabled={loading}
							className='w-full flex justify-center items-center py-2 px-4 text-white 
								bg-[#5e412f] hover:bg-[#7b5d42] font-medium rounded-md transition duration-300
								disabled:opacity-50'
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' />
									Login
								</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-[#9c7e5c]'>
						Not a member?{" "}
						<Link
							to='/signup'
							className='text-[#7b5d42] hover:underline font-medium inline-flex items-center'
						>
							Sign up now <ArrowRight className='ml-1 h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default LoginPage;
