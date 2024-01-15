"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Modal } from "@/components/ui/modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { signIn } from "next-auth/react";

const formSchema = z.object({
	username: z.string().min(4),
	password: z.string().min(4),
});
const LoginModal = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const router = useRouter();
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		
		try {
			const { username, password } = values;
			setLoading(true);
			const res = await signIn("credentials", {
				username,
				password,
				redirect: false,
			});
			
			if (res?.error && res?.status === 401) {
				toast.error("invalid username or password");
			}
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		} finally {
			
			router.push("/projects");
			setLoading(false);
		}
	};
	return (
		<div>
			<Modal
				title="ADMIN LOGIN"
				description=""
				isOpen={true}
				onClose={() => {}}
			>
				<div className="space-y-4 py-2 ">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-6">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="username"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													autoComplete="password"
													type="password"
													disabled={loading}
													placeholder="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="pt-6 space-x-2 flex items-center justify-end w-full">
								<Button disabled={loading} type="submit">
									Continue
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</Modal>
		</div>
	);
};

export default LoginModal;
