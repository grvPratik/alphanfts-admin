import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connect from "@/database/connect";
import Project from "@/schema/projectSchema";
import scrapeTwitterAccounts, {
	scrapeAccountFollowers,
} from "../../../lib/scrap";
import { authOptions } from "@/lib/auth";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import connectDB from "@/database/connect";
//
const tagOptions = ["nft", "free"];
//
interface Filter {
	name: {
		$regex: string;
		$options: string;
	};
	"mintInfo.mintDate"?:
		| {
				$gte?: Date | undefined;
				$lte?: Date | undefined;
		  }
		| Date;
	blockchain?: string;
	verified?: boolean | null;
	whitelist?: boolean | null;
	featured?: boolean | null;
}
function is_valid_date(str: string) {
	const parts = str.split("-");
	const day = parseInt(parts[2], 10);
	const month = parseInt(parts[1], 10);
	const year = parseInt(parts[0], 10);

	if (isNaN(year) || isNaN(month) || isNaN(day)) {
		// Invalid input format
		return false;
	}

	// Check if the year is valid (updated range used here)
	if (year < 1000 || year > 3000) {
		return false;
	}

	// Check if the month is between 1 and 12
	if (month < 1 || month > 12) {
		return false;
	}

	// Check if the day is within the valid range for the month and year
	const daysInMonth = new Date(year, month, 0).getDate();
	if (day < 1 || day > daysInMonth) {
		return false;
	}

	return true;
}

function parseDateString(dateString: string): Date | undefined | string {
	if (is_valid_date(dateString) && dateString) {
		const parsedDate = format(new Date(dateString), "yyyy,MM,dd");

		return parsedDate;
	}
	return undefined;
}
function getNextDay(dateString: string) {
	if (dateString && is_valid_date(dateString)) {
		const nextDay = addDays(new Date(dateString), 1);
		return format(nextDay, "yyyy,MM,dd");
	}
}
type SortOrder = 1 | -1;

export async function GET(req: Request, res: Response) {
	try {
		const { searchParams } = new URL(req.url);

		// Extract parameters from the URL
		const featured = searchParams.get("featured");
		const verified = searchParams.get("verified");
		const rating = searchParams.get("rating");
		const whitelist = searchParams.get("whitelist");
		const search = searchParams.get("search") || "";
		const sort = searchParams.get("sort") || "";
		const order = searchParams.get("order");
		const startDateString = searchParams.get("startdate") || "";
		const endDateString = searchParams.get("enddate") || "";
		const blockchain = searchParams.get("blockchain") || "";
		const pageString = searchParams.get("page");
		const perPageString = searchParams.get("items");
		const exactDateString = searchParams.get("date") || "";
		let tagsQuery: any = searchParams.get("tags") || "All";

		// Decode the search parameter
		const decodedSearch = decodeURIComponent(search);
		// Initialize the sortField object
		const sortField: { [key: string]: SortOrder } = {};

		tagsQuery = tagsQuery === "All" ? [...tagOptions] : tagsQuery.split(",");

		// Set the sort field and order based on the sort parameter
		if (sort === "mintDate") {
			sortField.mintDate = order === "desc" ? -1 : 1;
		} else if (sort === "createdAt") {
			sortField.createdAt = order === "desc" ? -1 : 1;
		} else if (sort === "rating") {
			sortField.rating = order === "desc" ? -1 : 1;
		} else if (sort === "follower") {
			sortField.currFollower = order === "desc" ? -1 : 1;
		}

		// Parse the page and perPage parameters
		const page = parseInt(pageString || "1", 10);
		const perPage = parseInt(perPageString || "10", 10);

		// Validate the page and perPage parameters
		if (isNaN(page) || page <= 0) {
			console.error("Invalid page number:", pageString);
			return NextResponse.json({
				success: false,
				message: "Invalid page number",
			});
		}
		if (isNaN(perPage) || perPage <= 0) {
			console.error("Invalid item per page:", perPageString);
			return NextResponse.json({
				success: false,
				message: "Invalid item per page",
			});
		}

		// Calculate the number of documents to skip
		const skipCount = (page - 1) * perPage;

		await connectDB();
		const filter: Filter = { name: { $regex: decodedSearch, $options: "i" } };

		// Set the filter fields based on the parameters
		if (verified === "true") {
			filter.verified = true;
		} else if (verified === "false") {
			filter.verified = false;
		}
		if (whitelist === "true") {
			filter.whitelist = true;
		} else if (whitelist === "false") {
			filter.whitelist = false;
		}
		if (featured === "true") {
			filter.featured = true;
		} else if (featured === "false") {
			filter.featured = false;
		}

		if (exactDateString && !is_valid_date(exactDateString)) {
			return NextResponse.json({
				success: false,
				message: "Invalid date format",
			});
		}
		if (startDateString && !is_valid_date(startDateString)) {
			return NextResponse.json({
				success: false,
				message: "Invalid date format",
			});
		}
		if (endDateString && !is_valid_date(endDateString)) {
			return NextResponse.json({
				success: false,
				message: "Invalid date format",
			});
		}

		const exactDate = parseDateString(exactDateString);

		const startDate = parseDateString(startDateString);

		const endDate = parseDateString(endDateString);

		const exactDayEnd = getNextDay(exactDateString);
		if (exactDate && !startDate && !endDate) {
			filter["mintInfo.mintDate"] = {
				$gte: exactDate ? startOfDay(new Date(exactDate)) : undefined,
				$lte: exactDayEnd ? endOfDay(new Date(exactDayEnd)) : undefined,
			};
		}
		if (startDate && !exactDate) {
			filter["mintInfo.mintDate"] = {
				$gte: startDate ? new Date(startDate) : undefined,
			};
		}
		if (endDate && !exactDate) {
			filter["mintInfo.mintDate"] = {
				$lte: endDate ? new Date(endDate) : undefined,
			};
		}
		if (startDate && endDate && !exactDate) {
			filter["mintInfo.mintDate"] = {
				$gte: startDate ? new Date(startDate) : undefined,
				$lte: endDate ? new Date(endDate) : undefined,
			};
		}

		if (blockchain) {
			filter.blockchain = blockchain;
		}

		// Query the database
		const Collections = await Project.find(filter)
			.where("tags")
			.in([...tagsQuery])
			.sort(sortField)
			.limit(perPage)
			.skip(skipCount);
		const total = await Project.countDocuments({
			...filter,
			tags: { $in: [...tagsQuery] },
		});

		// Return the query results
		return NextResponse.json({
			success: true,
			total,
			result: Collections,
		});
	} catch (error) {
		console.log("[Collection_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function POST(req: Request, res: Response) {
	// Authenticate the user
	const session = await getServerSession();
	// Check if the user is authenticated
	if (!session) {
		return new NextResponse("Unauthorised", { status: 403 });
	}

	try {
		const body = await req.json();
		const { arr } = body;
		

		let allAccounts: any[] = [];
		for (const url of arr) {
			const scrapedData = await scrapeTwitterAccounts(url);
			console.log("scrapedData", scrapedData);
			allAccounts.push(...scrapedData);
		}
	

		await connectDB();

		const promises = allAccounts.map(async (data) => {
			try {
				const newProject = new Project(data);
				const savedProject = await newProject.save();
				
				return savedProject;
			} catch (error) {
				console.error("Error inserting:", error);
				throw new Error("Insertion error");
				// return new NextResponse("Insertion Failed Database error", { status: 500 });
			}
		});
		try {
			const insertedProjects = await Promise.all(promises);
		
			// Proceed with further operations if needed
		} catch (error) {
			console.error("At least one insertion failed:", error);
			return new NextResponse("Insertion Failed", { status: 500 });
		}
		return NextResponse.json(
			{
				message: "Inserted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Creation error", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(req: Request) {
	try {
		// Authenticate the user
		const session = await getServerSession(authOptions);
		// Check if the user is authenticated
		if (!session) {
			return new NextResponse("Unauthorised", { status: 403 });
		}

		const accounts = await req.json();
		let allAccounts: any[] = [];
		for (const account of accounts) {
			const updatedData = await scrapeAccountFollowers(account);
			allAccounts.push(...updatedData);
		}
		

		await connectDB();
		const promises = allAccounts.map(async (data) => {
			try {
				const updateProject = Project.findByIdAndUpdate(
					data.id,
					{
						$set: {
							prevFollower: data.prevFollower,
							currFollower: data.currFollower,
						},
					},
					{ new: true }
				);

				return updateProject;
			} catch (error) {
				console.error("Error Updating", error);
				throw new Error("Updating error");
				// return new NextResponse("Insertion Failed Database error", { status: 500 });
			}
		});
		try {
			const updatedProjects = await Promise.all(promises);
			// console.log("All records updated successfully:", updatedProjects);
			// Proceed with further operations if needed
		} catch (error) {
			console.error("At least one refatched failed:", error);
			return new NextResponse("update Failed", { status: 500 });
		}
		return NextResponse.json({
			message: "updated successfully",
		});
	} catch (error) {
		console.log("[PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
