"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, XIcon } from "lucide-react";
import Link from "next/link";

const ArrayInput = ({
	arr,
	setArr,
}: {
	arr: string[];
	setArr: Dispatch<SetStateAction<string[]>>;
}) => {
	const [item, setItem] = useState("");

	const itemDelete = (index: number) => {
		const newArr = arr.filter((_: any, i: number) => i !== index);
		setArr(newArr);
	};


	const addClick = () => {
		if (arr) {
			setArr([...arr, item]);
			setItem("");
		}
	};

	return (
		<div className="flex  gap-4">
			<div className="flex w-80 flex-col gap-4  px-4 ">
				<Input
					type="text"
					name="tag"
					placeholder="Tags"
					value={item}
					onChange={(e) => setItem(e.target.value)}
				/>
				<Button variant="secondary" onClick={addClick} disabled={!item}>
					Add
				</Button>
			</div>
			<div>
				{arr.length > 0 && (
					<ul className="flex gap-2">
						{arr.map((item: string, index: number) => (
							<li key={index} className=" flex">
								<span className="bg-blue-500/25 rounded-full px-3 py-0.5 flex items-center">
									{item}
									<XIcon
										className="h-3 w-3 ml-1 cursor-pointer"
										onClick={() => itemDelete(index)}
									/>
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default ArrayInput;
