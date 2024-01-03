"use client";
import { Heading } from "@/components/heading";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ProductColumn, columns } from "./columns";
import Link from "next/link";

interface ProductsClientProps {
	data: ProductColumn[];
	title: string;
}

const FilterClient: React.FC<ProductsClientProps> = ({ data, title }) => {
	const router = useRouter();
	
	return (
		<div className="p-4 ">
			<div className="flex items-center justify-between pb-7">
				<Heading
					title={title}
					description="Manage NFT Collection for your website"
				/>
				
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<div className="py-6">
				<Separator />
			</div>
		</div>
	);
};

export default FilterClient;
