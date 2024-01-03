import { Schema, Model, models, Document, model } from "mongoose";

interface Social {
  x?: string;
  discord?: string;
  website?: string;
  marketplace?: string;
}

const socialSchema = new Schema<Social>({
  x: {
    type: String,
  },
  discord: {
    type: String,
  },
  website: {
    type: String,
  },
  marketplace: {
    type: String,
  },
});

interface MintInfo {
  supply?: number;
  mintPrice?: number;
  startTime?: string;
  mintDate?: Date;
}

const mintSchema = new Schema<MintInfo>({
  supply: {
    type: Number,
  },
  mintPrice: {
    type: Number,
  },
  startTime: {
    type: String,
    default: "",
  },
  mintDate: {
    type: Date,
  },
});

export interface ProjectModel extends Document {
	slug: string;
	name: string;
	description: string;
	blockchain?: string;
	imageUrl?: string;
	bannerUrl?: string;
	review?: string;
	rating?: number;
	whitelist: boolean;
	featured: boolean;
	verified: boolean;
	prevFollower?: number;
	currFollower?: number;
	accountCreated?: Date;
	mintInfo?: MintInfo;
	social?: Social;
	tags?: string[];

	createdAt?: Date;
	updatedAt?: Date;
}

const projectSchema = new Schema<ProjectModel>(
  {
    slug: {
      type: String,
      unique: true,
      required: [true, "Slug required"],
    },
    name: {
      type: String,
      required: [true, "Name required"],
    },
    description: {
      type: String,
      required: [true, "Description required"],
    },
    blockchain: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    bannerUrl: {
      type: String,
    },
    review: {
      type: String,
    },
    rating: {
      type: Number,
    },
    whitelist: {
      type: Boolean,
      required: true,
      default: false,
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    prevFollower: {
      type: Number,
    },
    currFollower: {
      type: Number,
    },
    accountCreated: {
      type: Date,
    },
    mintInfo: { type: mintSchema },
    social: { type: socialSchema },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Project = models.Project || model<ProjectModel>("Project", projectSchema);

export default Project;


const dummyData = [
	{
		slug: "my-awesome-project",
		name: "Awesome Project",
		description: "This is an amazing project.",
		blockchain: "Ethereum",
		imageUrl: "https://example.com/image.jpg",
		bannerUrl: "https://example.com/banner.jpg",
		rating: 4.5,
		whitelist: false,
		featured: true,
		verified: true,
		prevFollower: 1000,
		currFollower: 1500,
		accountCreated: new Date("2022-01-01"),
		mintDate: new Date("2023-02-15"),
		mintinfo: {
			supply: 10000,
			mintPrice: 0.05,
			startTime: "2023-02-01",
		},
		social: {
			x: "Some value for X",
			discord: "https://discord.gg/example",
			website: "https://example.com",
			market: "https://marketplace.example",
		},
		tags: ["NFT", "Blockchain", "Art"],
	},
	{
		slug: "crypto-nft",
		name: "CryptoNFT",
		description: "A platform for trading digital collectibles.",
		blockchain: "Binance Smart Chain",
		imageUrl: "https://example.com/crypto-nft.jpg",
		bannerUrl: "https://example.com/crypto-nft-banner.jpg",
		rating: 4.0,
		whitelist: true,
		featured: false,
		verified: true,
		prevFollower: 500,
		currFollower: 700,
		accountCreated: new Date("2022-05-10"),
		mintDate: new Date("2023-03-20"),
		mintinfo: {
			supply: 5000,
			mintPrice: 0.1,
			startTime: "2023-03-01",
		},
		social: {
			x: "Another value for X",
			discord: "https://discord.gg/cryptonft",
			website: "https://cryptonft.io",
			market: "https://market.cryptonft.io",
		},
		tags: ["NFT", "Trading", "Cryptocurrency"],
	},
	{
		slug: "digital-art-market",
		name: "ArtMarket",
		description: "An online marketplace for digital art.",
		blockchain: "Polygon",
		imageUrl: "https://example.com/artmarket.png",
		bannerUrl: "https://example.com/artmarket-banner.png",
		rating: 4.8,
		whitelist: true,
		featured: true,
		verified: true,
		prevFollower: 2000,
		currFollower: 2500,
		accountCreated: new Date("2021-11-20"),
		mintDate: new Date("2023-04-05"),
		mintinfo: {
			supply: 8000,
			mintPrice: 0.08,
			startTime: "2023-03-15",
		},
		social: {
			x: "Value X for ArtMarket",
			discord: "https://discord.gg/artmarket",
			website: "https://artmarket.com",
			market: "https://marketplace.artmarket.com",
		},
		tags: ["Digital Art", "Marketplace", "Creative"],
	},
	// Add more dummy data as needed
];
