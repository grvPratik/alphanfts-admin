import { JSDOM } from "jsdom";

import {
	convertToFullUrl,
	convertToFullHttps,
	slugify,
	nitterFromSlug,
} from "@/lib/utils";

const scrapeTwitterAccounts = async (url: string) => {
	try {
		const response = await fetch(url);
		
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		const tweets: any = Array.from(dom.querySelectorAll(".profile-tabs")).map(
			(tweetNode) => {
				
				// Extract tweet data here from tweetNode
				// Example: const tweetText = tweetNode.querySelector('.tweet-text').textContent;
				// Build the object with tweet information
				// Example: return { text: tweetText };
				const fullName =
					(tweetNode.querySelector(".profile-card-fullname") as HTMLDivElement)
						?.title || "";
				const username =
					(tweetNode.querySelector(".profile-card-username") as HTMLDivElement)
						?.title || "";
				const slugId = slugify(username);
				const bio =
					tweetNode.querySelector(".profile-bio p")?.textContent || "";
				const join =
					(tweetNode.querySelector(".profile-joindate span") as HTMLDivElement)
						?.title || "";
				const fCount =
					(
						tweetNode.querySelector(
							".followers .profile-stat-num"
						) as HTMLSpanElement
					)?.textContent || "0";
				
				const followers = parseInt(fCount.replace(/,/g, ""));
				const avatarx =
					(tweetNode.querySelector(".profile-card-avatar") as HTMLAnchorElement)
						?.href || "";
				const avatar = convertToFullHttps(decodeURIComponent(avatarx)) || "";
				const bannerx =
					(tweetNode.querySelector(".profile-banner img") as HTMLImageElement)
						?.src || "";
				const banner = convertToFullUrl(decodeURIComponent(bannerx)) || "";
				const website =
					(
						tweetNode.querySelector(
							".profile-website span a"
						) as HTMLAnchorElement
					)?.href || "";
				return {
					slugId,
					fullName,
					avatar,
					banner,
					bio,
					join,
					followers,
					website,
				};
			}
		);

		const followersUpdated = tweets.map((tweet: any) => ({
			slug: tweet.slugId,
			name: tweet.fullName,
			description: tweet.bio,
			blockchain: "",
			imageUrl: tweet.avatar,
			bannerUrl: tweet.banner,
			rating: 5,
			whitelist: false,
			featured: false,
			verified: false,
			prevFollower: tweet.followers,
			currFollower: tweet.followers,
			accountCreated: new Date(),
			mintInfo: {
				mintDate: null,
				supply:0
			},
			
			social: {
				x: `https://twitter.com/${tweet.slugId}`,
				website: tweet.website,
			},
			tags:["nft"]
		}));console.log("follower updated",followersUpdated)
		return followersUpdated;
		
	} catch (error) {
		console.error("Error scraping:", error);
		throw new Error("Scraping error");
	}
};
export default scrapeTwitterAccounts;

export async function scrapeAccountFollowers(acc:any) {
	try {
		const url = nitterFromSlug(acc.slug);
		const response = await fetch(url);
		
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		const tweets: any = Array.from(dom.querySelectorAll(".profile-tabs")).map(
			(tweetNode) => {
				
				// Extract tweet data here from tweetNode
				// Example: const tweetText = tweetNode.querySelector('.tweet-text').textContent;
				// Build the object with tweet information
				// Example: return { text: tweetText };

				const fCount =
					(
						tweetNode.querySelector(
							".followers .profile-stat-num"
						) as HTMLSpanElement
					)?.textContent || "0";
				
				const followers = parseInt(fCount.replace(/,/g, ""));

				return followers;

				
			}
		);

		const followersUpdated = tweets.map((tweet: any) => ({
			id: acc.id,
			slug: acc.slug,
			prevFollower: acc.currFollower,
			currFollower:tweet
		}));
		return followersUpdated;
	} catch (error) {
		console.error("Error scraping:", error);
		throw new Error("Scraping error");
	}
}
