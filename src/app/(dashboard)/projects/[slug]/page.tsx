import connect from "@/database/connect";
import Project, { ProjectModel } from "@/schema/projectSchema";
import React from "react";

import { ProjectEditForm } from "@/components/project-edit";
import connectDB from "@/database/connect";

export interface ProjectDetail {
	slug?: string;
	name?: string;
	description?: string;
	blockchain?: string;
	imageUrl?: string;
	bannerUrl?: string;
	supply?: number | undefined;
	rating?: number | undefined;
	whitelist?: boolean | undefined;
	featured?: boolean | undefined;
	verified?: boolean | undefined;
	mintPrice?: number | undefined;
	mintDate?: Date | undefined;
	startTime?: string; // Assuming mintDate can be undefined
	x?: string | undefined;
	discord?: string | undefined;
	website?: string | undefined;
	marketplace?: string | undefined;
	tags?: string[] | [];
}

const ProjectEditPage = async ({ params }: { params: { slug: string } }) => {
	await connectDB();
	const project = await Project.findOne({ slug: params.slug });
	if (!project) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				{" "}
				not found{" "}
			</div>
		);
	}
	// const data:ProjectModel  = JSON.parse(JSON.stringify(project));
	const projectDetail: ProjectDetail = {
		slug: project?.slug,
		name: project?.name,
		description: project?.description,
		blockchain: project?.blockchain,
		imageUrl: project?.imageUrl,
		bannerUrl: project?.bannerUrl,
		supply: project?.mintinfo?.supply,
		rating: project?.rating,
		whitelist: project?.whitelist,
		featured: project?.featured,
		verified: project?.verified,

		mintPrice: project?.mintinfo?.mintPrice,
		mintDate: project?.mintDate,
		startTime: project?.mintinfo?.startTime,

		x: project?.social?.x,
		discord: project?.social?.discord,
		website: project?.social?.website,
		marketplace: project?.social?.market,
		tags: project?.tags,
	};

	const initialData = project ? projectDetail : undefined;
	// console.log(initialData)
	return (
		<main>
			<ProjectEditForm initialData={initialData} />
		</main>
	);
};

export default ProjectEditPage;
