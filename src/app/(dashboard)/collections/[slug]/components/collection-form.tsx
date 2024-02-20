"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { CollectionProps } from "@/schema/collectionSchema";
import { Textarea } from "@/components/ui/textarea";
import { format, isValid } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, slugify } from "@/lib/utils";

const formSchema = z.object({
	slug: z
		.string()
		.min(3, { message: "Slug must be at least 3 characters long" }),
	name: z
		.string()
		.min(5, { message: "Name must be at least 5 characters long" }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters long" }),
	blockchain: z.string(),
	imageUrl: z.string(),
	bannerUrl: z.string(),
	supply: z.coerce.number(),
	rating: z.coerce.number().positive(),
	whitelist: z.boolean(),
	featured: z.boolean(),
	verified: z.boolean(),
	requirement: z.string(),
	info: z.string(),
	roadmap: z.string(),
	mintPrice: z.coerce.number(),
	mintDate: z.date().optional(),
	startTime: z.string().optional(),
	x: z.string(),
	discord: z.string(),
	website: z.string(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
	initialData?: CollectionProps | undefined;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? "Edit Project" : "Create Project";
	const description = initialData ? "Edit a Project." : "Add a new Project";
	const toastMessage = initialData ? "Project updated." : "Project created.";
	const action = initialData ? "Save changes" : "Create";

	const blockchain: any = ["Solana", "Ethereum", "Bitcoin"];


	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			slug: "",
			name: "",
			description: "",
			blockchain: "",
			imageUrl: "",
			bannerUrl: "",
			supply: 0,
			rating: 0,
			whitelist: false,
			featured: false,
			verified: false,
			requirement: "",
			info: "",
			roadmap: "",
			mintPrice: 0,
			mintDate: undefined,
			startTime: "",
			x: "",
			discord: "",
			website: "",
		},
	});
	
	const onSubmit = async (data: any) => {
		
		try {
			setLoading(true);
			
			if (initialData) {
				await axios.patch(`/api/collections/${params.slug}`, data);
			} else {
				await axios.post("/api/collections", data);
			}
			router.refresh();
			router.push(`/collections`);
			toast.success(toastMessage);
		} catch (error: any) {
			toast.error("see console")
			console.log(error, "[POST_ERROR]");
			console.log("message",error?.response?.data);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/collections/${params.id}`);
			router.refresh();
			router.push(`/collections`);
			toast.success("Project deleted.");
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				// Axios error with more detailed information
				console.error("Axios Error:", error.message);
				console.error("Status Code:", error.response?.status);
				console.error("Response Data:", error.response?.data);
			} else {
				// Other types of errors
				console.error("Other Error:", error);
			}
			console.log("error", error);
			toast.error("Something went wrong.");
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
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
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-12 w-full"
				>
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel> image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url: string) => field.onChange(url)}
										onRemove={() => field.onChange("")}
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
								<FormLabel>banner image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url: string) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="md:grid md:grid-cols-3 gap-8 flex flex-col">
						{" "}
						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Project Slug</FormLabel>
									<FormControl>
										<Input
											value={slugify(field.value)}
											onChange={(e) => field.onChange(slugify(e.target.value))}
											disabled={loading}
											placeholder="project slug"
											
											onBlur={field.onBlur}
											ref={field.ref}
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
									<FormLabel> Project Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="project name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Collection Desc</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Collection description"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="mintPrice"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mint Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
											placeholder="9.99"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="mintDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Mint Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
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
												// 	date > new Date() || date < new Date("1900-01-01")
												// }
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>Select the Mint Date</FormDescription>
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
									<FormLabel>Supply</FormLabel>
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
						<FormField
							control={form.control}
							name="blockchain"
							render={({ field }) => (
								<FormItem>
									<FormLabel>blockchain</FormLabel>
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="rating"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Rating</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
											placeholder="1-10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
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
							name="whitelist"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Whitelist</FormLabel>
										<FormDescription>Whitelist Open</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="verified"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Verified</FormLabel>
										<FormDescription>Is collection verified</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="discord"
							render={({ field }) => (
								<FormItem>
									<FormLabel> Disord</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Discord link"
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
									<FormLabel> x</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder="x link" {...field} />
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
									<FormLabel>Website</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="website link"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="requirement"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Requirement</FormLabel>
								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="wl requirement"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="info"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Info</FormLabel>
								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="project info"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="roadmap"
						render={({ field }) => (
							<FormItem>
								<FormLabel>roadmap</FormLabel>
								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="project roadmap"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};
