"use client";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProjectClient = () => {
	const [url, setUrl] = useState<string>("");
	const [arr, setArr] = useState<String[]>([]);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: any) => {
		event.preventDefault(); // Prevent the default form submission behavior
		// const formData = new FormData(event.target);
		// console.log(event.target);
		// const enteredUrl = formData.get("url");
		try {
			setLoading(true);
	
			const response = await fetch("/api/projects", {
				method: "POST",
				body: JSON.stringify({ arr }), // Send the entered query as JSON
				headers: {
					"Content-Type": "application/json",
					// Add any additional headers required by your API
				},
			});

			if (!response.ok) {
				setLoading(false);
				toast.error("Network response was not ok.");
				throw new Error("Network response was not ok.");
			}

			const result = await response.json();
			setArr([]);
			// console.log(result);
			toast.success("successfully inserted"); // Update state with fetched data
		} catch (error) {
			console.error("There was a problem fetching the data:", error);
			toast.error("There was a problem fetching the data:");
		} finally {
			setLoading(false);
		}
	};
	const addClick = () => {
		if (arr) {
			const link = `https://nitter.cz/${url}`;
			setArr([...arr, link]);
			setUrl("");
		}
	};
	const itemDelete = (index: number) => {
		const newArr = arr.filter((_, i) => i !== index);
		setArr(newArr);
	};

	return (
		<div className="flex ">
			
			<div className="flex w-80 flex-col gap-4  px-4 "><h1 className=" font-semibold text-4xl">Add project username</h1>
				<Input
					type="url"
					name="url"
					placeholder="URL"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
				<Button variant="secondary" onClick={addClick} disabled={!url}>
					Add
				</Button>
				{arr.length > 0 && (
					<Button onClick={handleSubmit} disabled={loading}>
						{loading ? (
							<div className="flex items-center">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</div>
						) : (
							"Submit"
						)}
					</Button>
				)}
			</div>
			<div>
				{arr.length > 0 && (
					<ul className="flex flex-col gap-2">
						{arr.map((item, index: number) => (
							<li className="overflow-hidden  flex items-center" key={index}>
								<span className="mx-2 ">{index}.</span>
								<Link target="_blank" href={`${item}`}>
									{item}
								</Link>
								<Button
									onClick={() => itemDelete(index)}
									variant="destructive"
									className="mx-3"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default ProjectClient;
