"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "./modals/alert-modal";
import { Heading } from "./heading";

import ArrayInput from "./arr-input";
import { ProjectDetail } from "@/app/(dashboard)/projects/[slug]/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
const formSchema = z.object({
	slug: z.string().min(1).max(255),
	name: z.string().min(1).max(255),
	description: z.string().min(1).max(255),
	imageUrl: z.string().min(1).max(255),
	bannerUrl: z.string().min(1).max(255),
	blockchain: z.string().min(1).max(255),
	rating: z.coerce.number().gte(1).lte(9999999999),
	whitelist: z.boolean(),
	featured: z.boolean(),
	verified: z.boolean(),
	mintDate: z.date().optional(),
	startTime:z.string().optional(),
	supply: z.number().optional(),
	x: z.string().min(1).max(255),
	discord: z.string().min(1).max(255).optional(),
	website: z.string().optional(),
	marketplace: z.string().optional(),
	review: z.string().optional(),
});

export function ProjectEditForm({
	initialData,
}: {
	initialData?: ProjectDetail;
	}) {
	const router =useRouter()
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [tag, setTag] = useState(initialData?.tags ||[]);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			slug: "",
			name: "",
			description: "",
			blockchain: "",
			imageUrl: "",
			bannerUrl: "",
			supply: undefined,
			rating: undefined,
			whitelist: undefined,
			featured: undefined,
			verified: undefined,
			mintPrice: undefined,
			mintDate: undefined,
			startTime: "", // Assuming startTime is a string
			x: "",
			discord: "",
			website: "",
			marketplace: "",
			tags: [],
		},
	});
	const onDelete = async () => {};
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		
		try {setLoading(true);
			// console.log(params.slug);
			
			const data = { ...values, tags:tag }
			
			if (initialData) {
				await axios.patch(`/api/projects/${params.slug}`, data);
			} else {
				await axios.post("/api/project", values);
			}
			
			router.refresh();
			router.push(`/projects`);
		} catch (error) {
			toast.error("something went wrong see console")
			console.error("Axios Error",error)
		} finally {
			setLoading(false);
			toast.success("successfully updated")
		}

		// router.refresh();
	};

	const blockchain: any = ["solana", "ethereum", "bitcoin"];
	return (
		<div className="md:mx-8 mx-4 mb-8">
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between mb-10 mt-4">
				<Heading
					title={"Edit Proejct"}
					description={"Edit The project info "}
				/>
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="sm"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>

			<Form {...form}>
				<form
					noValidate
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					{" "}
					<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>slug</FormLabel>
									<FormControl>
										<Input
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>name</FormLabel>
									<FormControl>
										<Input
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="rating"
							render={({ field }) => (
								<FormItem>
									<FormLabel>rating</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>{" "}
					<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
						<FormField
							control={form.control}
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>imageUrl</FormLabel>
									<FormControl>
										<Input
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bannerUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>bannerUrl</FormLabel>
									<FormControl>
										<Input
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="blockchain"
							render={({ field }) => (
								<FormItem>
									<FormLabel>blockchain</FormLabel>
									<FormControl>
										<Select
											disabled={loading}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue
														defaultValue={field.value}
														placeholder="Select a blockchain"
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{blockchain.map((blockchain?: any, index?: number) => (
													<SelectItem key={index} value={blockchain}>
														{blockchain}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>description</FormLabel>

								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="project description"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="review"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Review</FormLabel>

								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="Project review"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
						<FormField
							control={form.control}
							name="whitelist"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											disabled={loading}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Whitelist</FormLabel>
										<FormDescription>whitelist open</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="featured"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											disabled={loading}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Featured</FormLabel>
										<FormDescription>
											This Collection will appear on the home page
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="verified"
							render={({ field }) => (
								<FormItem className="flex flex-row  items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											disabled={loading}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Verified</FormLabel>
										<FormDescription>Verified Collection</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>
					<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4  ">
						<FormField
							control={form.control}
							name="mintDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>
										<div>mintDate</div>
									</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													disabled={loading}
													variant={"outline"}
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												// disabled={(date) =>
												//   date > new Date() || date < new Date("1900-01-01")
												// }
												initialFocus
											/>
										</PopoverContent>
									</Popover>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mint Start</FormLabel>
									<FormControl>
										<Input
											type="time"
											disabled={loading}
											placeholder="Select a time"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="supply"
							render={({ field }) => (
								<FormItem>
									<FormLabel>supply</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
											placeholder="4444"
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

					
					</div>
					<div className=" grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
						<FormField
							control={form.control}
							name="discord"
							render={({ field }) => (
								<FormItem>
									<FormLabel>discord</FormLabel>
									<FormControl>
										<Input
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="website"
							render={({ field }) => (
								<FormItem>
									<FormLabel>website</FormLabel>
									<FormControl>
										<Input
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="marketplace"
							render={({ field }) => (
								<FormItem>
									<FormLabel>marketplace</FormLabel>
									<FormControl>
										<Input
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="x"
							render={({ field }) => (
								<FormItem>
									<FormLabel>x</FormLabel>
									<FormControl>
										<Input
											placeholder="Placeholder"
											disabled={loading}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/></div>
					<ArrayInput arr={tag} setArr={setTag} />
					<Button type="submit" disabled={loading}>
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
}
