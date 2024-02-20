import React from "react";

import connect from "@/database/connect";
import Collection from "@/schema/collectionSchema";
import { CollectionProps } from "@/schema/collectionSchema";
import { ProjectForm } from "@/app/(dashboard)/collections/[slug]/components/collection-form";
const CollectionEditPage = async ({ params }: { params: { slug: string } }) => {
	await connect();
	const project = await Collection.findOne({ slug: params.slug });

	const projectDetail: CollectionProps = {
		slug: project?.slug,
		name: project.name,
		description: project?.description,
		blockchain: project?.blockchain,
		imageUrl: project?.imageUrl,
		bannerUrl: project?.bannerUrl,
		supply: project?.supply,
		rating: project?.rating,
		whitelist: project?.whitelist,
		featured: project?.featured,
		verified: project?.verified,
		requirement: project?.requirement,
		info: project?.info,
		roadmap: project?.roadmap,
		mintPrice: project?.mintPrice,
		mintDate: project?.mintDate,
		startTime: project?.startTime,
		
		x: project?.x,
		discord: project?.discord,
		website: project?.website,
	};

	const initialData = project ?projectDetail : undefined;
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProjectForm initialData={initialData} />
			</div>
		</div>
	);
};

export default CollectionEditPage;
