import { Metadata } from "next"

import DashboardContent from "./components/dashboard-content";


export const metadata: Metadata = {
  title: "Dashboard",
  description: "",
}

export default function DashboardPage() {
	return (
		<div className="flex-col flex">
				<DashboardContent/>
			</div>
		
	);
}
