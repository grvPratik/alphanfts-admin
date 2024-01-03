import connect from "@/database/connect";
import Admin from "@/schema/adminSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/database/connect";

export async function POST(req: NextRequest) {
	try {
		const { email, username, password } = await req.json();
		const hashedPassword = await bcrypt.hash(password, 10);
		await connectDB();
		await Admin.create({ email, username, password: hashedPassword });

		return NextResponse.json({ message: "Admin registered." }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: "An error occurred while registering the Admin." },
			{ status: 500 }
		);
	}
}
