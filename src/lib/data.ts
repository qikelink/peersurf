import { supabase } from "./supabase";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  project_id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  slug: string;
  video?: boolean;
  video_url?: string | null;
  created_at?: string;
}

export interface BlogPostWithProject extends BlogPost {
  projects: Project;
}

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  console.log(data);
  return data as Project[];
};

export const getProjectBySlug = async (slug: string): Promise<Project> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Project;
};

export const getBlogPostsForProject = async (
  projectId: string
): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
};

export const getBlogPostBySlug = async (
  slug: string
): Promise<BlogPostWithProject> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, projects(*)")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as BlogPostWithProject;
};

export const getAllBlogPosts = async (): Promise<BlogPostWithProject[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, projects(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as BlogPostWithProject[];
};

export function shortenChar(address: string) {
  if (typeof address !== "string" || address.length < 9) {
    return address;
  }
  const firstFour = address.slice(0, 3);
  const lastFive = address.slice(-10);
  return `${firstFour}...${lastFive}`;
}

export function extractYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

export const sampleGenerations = [
  {
    id: 1,
    title: "Mythical tiger spirit",
    link: "https://daydream.live/?shared=shp_AcWWoo2bgECzyszG",
    excerpt:
      "Mythical tiger spirit prowling through a glowing jungle at night, bioluminescent plants lighting the path, mist swirling around ancient stone ruins, moonlight filtering through giant trees, cinematic style, 4K, ultra-realistic",
    image: "/sample/mythical-tiger.mp4",
    projects: { title: "Mythical tiger spirit" },
  },
  {
    id: 2,
    title: "Claymation Muppet",
    link: "https://daydream.live/?shared=shp_JFeWZjn4tJdkNEx8 ",
    excerpt:
      "sculpture ((claymation)) muppet sunglasses",
    image: "/sample/claymation.mp4",
    projects: { title: "Claymation Muppet" },
  },
  {
    id: 3,
    title: "Cubism Tesseract",
    link: "https://daydream.live/?shared=shp_G3QzzfCU5amrYeqr",
    excerpt:
      "((cubism)) tesseract ((flat colors))",
    image: "/sample/cubism.mp4",
    projects: { title: "Cubism Tesseract" },
  },
  {
    id: 4,
    title: "Keith Haring",
    link: "https://daydream.live/?shared=shp_QBSwdxZKWry32VKs",
    excerpt:
      "abstract pop art with bold black lines, vibrant colors, (((dark fantasy))), cartoon face elements, psychedelic and graffiti style ((Keith Haring))",
    image: "/sample/Keith-Haring.mp4",
    projects: { title: "Keith Haring" },
  },
  {
    id: 5,
    title: "Cat Woman",
    link: "https://daydream.live/?shared=shp_W3HZsC7yhSeXp4rD",
    excerpt:
      "catwoman with sharp cat ears in a brown and pink coat",
    image: "/sample/catwoman.mp4",
    projects: { title: "Cat Woman" },
  },
  {
    id: 6,
    title: "Ancient Dragon",
    link: "https://daydream.live/?shared=shp_SdRAAjnirhWkFtLK",
    excerpt:
      "Chinese (((dragon))), breathing fire, ancient chinese mountain landscape, sunshine, beautiful blue sky",
    image: "/sample/ancient-dragon.mp4",
    projects: { title: "Ancient Dragon" },
  },
];
