import React from "react";
import format from "date-fns/format";

import connect from "@/database/connect";
import FilterClient from "@/components/data-filter/client";
import Collection from "@/schema/collectionSchema";
import { ProductColumn } from "@/components/data-filter/columns";

const CollectionPage = async () => {
	await connect();
	const collections = await Collection.find();

	// console.log(JSON.parse(JSON.stringify(collections)))
	const formattedData: ProductColumn[] = collections.map((item) => ({
		slug: item.slug,
		name: item.name,
		rating: item.rating,
		featured: item.featured,
		blockchain: item.blockchain,
		mintDate: item.mintDate
			? format(item.mintDate, "MMMM do, yyyy")
			: "not added",
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<FilterClient data={formattedData} title={"Collection"} />
			</div>
		</div>
	);
};

export default CollectionPage;
