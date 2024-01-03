import { NextResponse } from "next/server";

import connect from "@/database/connect";
import Project from "@/schema/projectSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/database/connect";

export async function GET(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		if (!params.slug) {
			return new NextResponse("slug is required", { status: 400 });
		}

		await connectDB();

		const projectData = await Project.findOne({ slug: params.slug });
		if (!projectData) {
			return NextResponse.json({
				success: false,
				result: "Not found",
			});
		}
		return NextResponse.json(projectData);
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

		const deleteProject = await Project.deleteOne({
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

		const body = await req.json();
		// console.log(body)
		const {
			slug,
			name,
			description,
			blockchain,
			imageUrl,
			bannerUrl,
			review,
			rating,
			whitelist,
			featured,
			verified,

			tags,

			supply,
			mintPrice,
			mintDate,
			startTime,

			x,
			discord,
			website,
			marketplace,
		} = body;

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
		const avail = await Project.findOne({ slug: params.slug });
		if (!avail) {
			return new NextResponse("not found", { status: 400 });
		}
		const result = await Project.findOneAndUpdate(
			{ slug: params.slug }, // Query condition
			{
				$set: {
					slug,
					name,
					description,
					blockchain,
					imageUrl,
					bannerUrl,
					review,
					rating,
					whitelist,
					featured,
					verified,
					"mintInfo.supply": supply,
					"mintInfo.mintPrice": mintPrice,
					"mintInfo.startTime": startTime,
					"mintInfo.mintDate": mintDate,
					"social.discord": discord,
					"social.x": x,
					"social.marketplace": marketplace,
					"social.website": website,
					tags,
				},
			},
			{ new: true }
		);
		// console.log(result.matchedCount);
		// console.log(result.acknowledged);
		// console.log(result);
		// console.log(result.upsertedCount);
	
		return NextResponse.json(result);
	} catch (error) {
		console.log("[PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
