import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { signup, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
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
					Create your account
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
						{[
							{ id: "name", label: "Full Name", type: "text", icon: <User /> },
							{ id: "email", label: "Email address", type: "email", icon: <Mail /> },
							{ id: "password", label: "Password", type: "password", icon: <Lock /> },
							{ id: "confirmPassword", label: "Confirm Password", type: "password", icon: <Lock /> },
						].map((field) => (
							<div key={field.id}>
								<label htmlFor={field.id} className='block text-sm text-[#5e412f] mb-1'>
									{field.label}
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#bba089]'>
										{field.icon}
									</div>
									<input
										id={field.id}
										type={field.type}
										required
										value={formData[field.id]}
										onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
										className='block w-full px-4 py-2 pl-10 bg-[#fdfaf5] border border-[#decab1] 
										 text-[#5e412f] rounded-md shadow-sm placeholder-[#bba089]
										 focus:outline-none focus:ring-[#7b5d42] focus:border-[#7b5d42] sm:text-sm'
										placeholder={`Enter ${field.label.toLowerCase()}`}
									/>
								</div>
							</div>
						))}

						<button
							type='submit'
							disabled={loading}
							className='w-full flex justify-center items-center py-2 px-4 rounded-md text-white 
								bg-[#5e412f] hover:bg-[#7b5d42] transition duration-300 font-medium disabled:opacity-50'
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' />
									Loading...
								</>
							) : (
								<>
									<UserPlus className='mr-2 h-5 w-5' />
									Sign up
								</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-[#9e8570]'>
						Already have an account?{" "}
						<Link
							to='/login'
							className='text-[#7b5d42] hover:underline font-medium inline-flex items-center'
						>
							Login here <ArrowRight className='ml-1 h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
