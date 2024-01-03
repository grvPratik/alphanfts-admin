import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectModel } from "@/schema/projectSchema";


export function RecentSales({ list }:{list:ProjectModel[]}) {
	return (
		<div className="space-y-8 mx-4">
			{(list.length > 0) &&
				list.map((item: any, index: number) => (
					<div key={index} className="flex items-center">
						<Avatar className="h-9 w-9">
							<AvatarImage src={item?.imageUrl} alt="Avatar" />
							<AvatarFallback>NF</AvatarFallback>
						</Avatar>
						<div className="ml-4 space-y-1">
							<p className="text-sm font-medium leading-none">{item?.name}</p>
							<p className="text-sm text-muted-foreground">@{item?.slug}</p>
						</div>
						<div className="ml-auto font-medium">
							{item?.currFollower}
							<div className="text-sm text-muted-foreground">
								{item?.prevFollower}
							</div>
						</div>
					</div>
				))}
		</div>
	);
}
