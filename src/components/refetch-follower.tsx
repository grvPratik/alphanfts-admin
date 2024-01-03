"use client";
import { Button } from "@/components/ui/button";
import { ProjectModel } from "@/schema/projectSchema";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface FetchFollowerProps {
	list: ProjectModel[];
}

const ReFetchFollower = ({ list }: FetchFollowerProps) => {
	const [loading, setLoading] = useState(false);
	const followerData = list.map((item: ProjectModel) => {
		return {
			id: item._id,
			slug: item.slug,
			currFollower: item.currFollower,
			prevFollower: item.prevFollower,
		};
	});

	const handleFetchData = async () => {
		
		try {
			setLoading(true);
			const response = await axios.patch("/api/projects", followerData, {
				headers: { "Content-Type": "application/json" },
			});
			toast.success("patch request sent successfully");
			
		} catch (error) {
			console.error("There was a problem fetching the follower", error);
			toast.error("There was a problem fetching the follower");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div>
			<div>
				<Button
					onClick={handleFetchData}
					className="font-bold text-white"
					disabled={loading}
				>
					{" "}
					<RefreshCw className="h-4 w-4 mx-2 text-white" />
					{loading ? "Fetching.." : " Refetch Follower"}
				</Button>
			</div>
		</div>
	);
};

export default ReFetchFollower;
