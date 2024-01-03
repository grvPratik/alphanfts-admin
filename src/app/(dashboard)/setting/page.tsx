"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/spinner";

const SettingPage = () => {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<div className=" min-h-screen flex items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="flex flex-col md:mx-[8rem] lg:mx-[12rem] gap-5 lg:gap-16 md:mt-16">
			<h1 className=" font-bold text-2xl md:text-5xl">Setting</h1>
			<div className="flex gap-3 md:flex-row flex-col items-center">
				<Avatar className="h-[7rem] w-[7rem]">
					<AvatarImage src={"/profile.jpg"} alt="Avatar" />
					<AvatarFallback>profile</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-2 text-lg font-semibold">
					<div className="flex gap-2">
						<span>Name:</span>
						{session?.user?.name}
					</div>{" "}
					<div className="flex gap-2"><span>Email:</span>{session?.user?.email}</div>
                </div>
               
			</div> <div><Button  variant="destructive" onClick={()=> signOut()}>Logout</Button></div>
		</div>
	);
};

export default SettingPage;
