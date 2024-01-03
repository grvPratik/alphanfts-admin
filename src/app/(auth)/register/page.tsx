import RegisterModal from "@/components/modals/register-modal";
import { ModalProvider } from "@/provider/modal-provider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Register() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return redirect("/login");
	}
	return (
		<div>
			<ModalProvider>
				<RegisterModal />
			</ModalProvider>{" "}
		</div>
	);
}
