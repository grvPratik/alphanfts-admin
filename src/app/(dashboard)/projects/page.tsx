import React from "react";

import connect from "@/database/connect";
import Project, { ProjectModel } from "@/schema/projectSchema";
import ReFetchFollower from "@/components/refetch-follower";
import FilterClient from "@/components/data-filter/client";
import { format, isDate, parseISO } from "date-fns";
import { ProductColumn } from "@/components/data-filter/columns";
import { RecentSales } from "@/components/dashboard/recent-sales";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import ProjectClient from "@/components/project-client";
import connectDB from "@/database/connect";

const ProjectPage = async () => {
	await connectDB();

	const queryResult = await Project.find().lean();

	const res = JSON.parse(JSON.stringify(queryResult));
	// console.log("res", res);

	const formattedData: ProductColumn[] = res.map((item: ProjectModel) => ({
		slug: item.slug,
		name: item.name,
		rating: item.rating,
		featured: item.featured,
		blockchain: item.blockchain,
		mintDate: item?.mintInfo?.mintDate
			? format(new Date(item?.mintInfo?.mintDate), "MMMM do, yyyy")
			: "not added",
		createdAt: item?.createdAt
			? format(new Date(item?.createdAt), "MMMM do, yyyy")
			: "not added",
	}));

	return (
		<>
			<FilterClient data={formattedData} title={"Projects"} />
			<article className="grid md:grid-cols-2 grid-cols-1 mt-4 mx-6 mb-12">
				<ProjectClient />
				<Card>
					<CardHeader>
						<CardTitle className="flex justify-between">
							All project follower
							<ReFetchFollower list={res} />
						</CardTitle>
						<CardDescription></CardDescription>
					</CardHeader>
					<CardContent className="h-[47rem] overflow-y-auto">
						<RecentSales list={res} />
					</CardContent>
				</Card>
			</article>
		</>
	);
};

export default ProjectPage;
