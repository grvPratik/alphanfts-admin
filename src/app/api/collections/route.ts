import { NextResponse } from "next/server";

import connect from "@/database/connect";
import Collection from "@/schema/collectionSchema";
import {
	addDays,
	endOfDay,
	format,
	isValid,
	parse,
	parseISO,
	startOfDay,
} from "date-fns";
import { getServerSession } from "next-auth";

// Define the Filter interface
interface Filter {
	name: {
		$regex: string;
		$options: string;
	};
	mintDate?:
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

// Define the SortOrder type
type SortOrder = 1 | -1;

function checkDateFormat(dateString: string) {
	const pattern = /^\d{4}-\d{2}-\d{2}$/;
	return pattern.test(dateString);
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

	// Check if the year is valid (arbitrary range used here)
	if (year < 1000 || year > 3000) {
		return false;
	}

	// Check if the month is between 1 and 12
	if (month < 1 || month > 12) {
		return false;
	}

	// Check if the day is within the valid range for the month and year
	const daysInMonth = new Date(year, month - 1, 0).getDate();
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

export async function GET(req: Request) {
	try {
		// Parse the request URL
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

		// Decode the search parameter
		const decodedSearch = decodeURIComponent(search);

		// Initialize the sortField object
		const sortField: { [key: string]: SortOrder } = {};

		// Set the sort field and order based on the sort parameter
		if (sort === "mintDate") {
			sortField.mintDate = order === "desc" ? -1 : 1;
		} else if (sort === "createdAt") {
			sortField.createdAt = order === "desc" ? -1 : 1;
		} else if (sort === "rating") {
			sortField.rating = order === "desc" ? -1 : 1;
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

		// Connect to the database
		await connect();

		// Initialize the filter object
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
			filter.mintDate = {
				$gte: exactDate ? startOfDay(new Date(exactDate)) : undefined,
				$lte: exactDayEnd ? endOfDay(new Date(exactDayEnd)) : undefined,
			};
		}
		if (startDate && !exactDate) {
			filter.mintDate = {
				$gte: startDate ? new Date(startDate) : undefined,
			};
		}
		if (endDate && !exactDate) {
			filter.mintDate = {
				$lte: endDate ? new Date(endDate) : undefined,
			};
		}
		if (startDate && endDate && !exactDate) {
			filter.mintDate = {
				$gte: startDate ? new Date(startDate) : undefined,
				$lte: endDate ? new Date(endDate) : undefined,
			};
		}

		if (blockchain) {
			filter.blockchain = blockchain;
		}

		// Query the database
		const Collections = await Collection.find(filter)
			.sort(sortField)
			.limit(perPage)
			.skip(skipCount);
		const total = await Collection.countDocuments(filter);

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
	try {
		// Authenticate the user
		const session = await getServerSession();
		// Check if the user is authenticated
		if (!session) {
			return new NextResponse("Unauthorised", { status: 403 });
		}
		// Parse the request body
		const body = await req.json();

		// Destructure properties from the request body
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

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}
		if (!slug) {
			return new NextResponse("Slug is required", { status: 400 });
		}
		if (!imageUrl) {
			return new NextResponse("ImageUrl is required", { status: 400 });
		}
		if (!bannerUrl) {
			return new NextResponse("BannerUrl is required", { status: 400 });
		}

		// Connect to the database
		connect();

		// Insert data into the database
		const newProject = await Collection.insertMany({
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
		});

		// Return the newly created Project
		return NextResponse.json(newProject);
	} catch (error) {
		console.log("Creation error", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
