import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string) {
	return str
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-");
}
  
export function convertToFullUrl (inputString:string){
	const modifiedString = inputString.replace("/pic/", "");
	return modifiedString;
};
  
export function convertToFullHttps (inputString:string){
	const modifiedString = inputString.replace("/pic/", "");
	const completeUrl = `https://${modifiedString}`;
	return completeUrl;
};
  
export function nitterFromSlug(str: string) {
	const url = `https://nitter.net/${str}`
	return url
}