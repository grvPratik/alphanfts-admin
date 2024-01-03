import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



import TeamSwitcher from "@/components/dashboard/team-switcher";
import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";
import { UserNav } from "@/components/dashboard/user-nav";
import { authOptions } from "@/lib/auth";


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await getServerSession(authOptions);
	if (!session) {
		 return redirect("/login");
	}
	return (
		<div className="flex flex-col">
			<header>
				<div className="border-b">
					<div className="flex h-16 items-center px-4">
						<TeamSwitcher />
						<MainNav className="mx-6" />
						<div className="ml-auto flex items-center space-x-4">
							<Search />
							<UserNav />
						</div>
					</div>
				</div>
			</header>
			{children}
		</div>
	);
};

export default DashboardLayout;
