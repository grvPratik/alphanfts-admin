import { NextResponse } from "next/server";

import connect from "@/database/connect";
import Collection from "@/schema/collectionSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		if (!params.slug) {
			return new NextResponse("slug is required", { status: 400 });
		}

		connect();

		const project = await Collection.findOne({ slug: params.slug });
		// console.log(project)

		if (!project) {
			return new NextResponse("not found", { status: 400 });
		}
		return NextResponse.json(project);
	} catch (error) {
		console.log("GET ERROR", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		// Authenticate the user
		const session = await getServerSession(authOptions);
		// Check if the user is authenticated
		if (!session) {
			return new NextResponse("Unauthorised", { status: 403 });
		}
		

		if (!params.slug) {
			return new NextResponse("slug is required", { status: 400 });
		}

		const deleteProject = await Collection.deleteOne({
			slug: params.slug,
		});

		return NextResponse.json(deleteProject);
	} catch (error) {
		console.log("[DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		// Authenticate the user
		const session = await getServerSession(authOptions);
		// Check if the user is authenticated
		if (!session) {
			return new NextResponse("Unauthorised", { status: 403 });
		}
		// const { userId } = auth();

		const body = await req.json();
		// console.log(body)
		const {
			slug,
			name,
			description,
			blockchain,
			imageUrl,
			bannerUrl,
			supply,
			rating,
			whitelist,
			featured,
			verified,
			requirement,
			info,
			roadmap,
			mintPrice,
			mintDate,
			startTime,
			x,
			discord,
			website,
		} = body;

		// if (!userId) {
		//   return new NextResponse("Unauthenticated", { status: 403 });
		// }

		if (!params.slug) {
			return new NextResponse("slug is required", { status: 400 });
		}

		if (!name) {
			return new NextResponse("collection name are required", { status: 400 });
		}

		if (!blockchain) {
			return new NextResponse("blockchain is required", { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse("img id is required", { status: 400 });
		}

		const data = await Collection.findOne({ slug: params.slug });

		// console.log(data);

		if (!data) {
			return new NextResponse("Document not found", { status: 404 });
		}
		data.slug = slug;
		data.name = name;
		data.description = description;
		data.blockchain = blockchain;
		data.imageUrl = imageUrl;
		data.bannerUrl = bannerUrl;
		data.supply = supply;
		data.rating = rating;
		data.whitelist = whitelist;
		data.featured = featured;
		data.verified = verified;
		data.requirement = requirement;
		data.info = info;
		data.roadmap = roadmap;
		data.mintPrice = mintPrice;
		data.mintDate = mintDate;
		data.startTime = startTime;

		data.x = x;
		data.discord = discord;
		data.website = website;

		await data.save();

		return NextResponse.json(data);
	} catch (error) {
		console.log("[PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}


