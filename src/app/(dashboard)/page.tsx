import { Metadata } from "next";

import DashboardContent from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Dashoard page for Alphanft",
};

export default async function DashboardPage() {

	return (
		<main className="flex-col flex">
			<DashboardContent />
		</main>
	);
}
