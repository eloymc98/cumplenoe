import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export interface Post {
  slug: string;
  date: string; // ISO
  author: string;
  handle: string;
  avatar?: string;
  contentHtml: string;
  raw: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

const MAX_CHARS = 2000;

/** Lee todos los posts del feed, ordenados del más nuevo al más antiguo. */
export async function getPosts(): Promise<Post[]> {
  let files: string[];
  try {
    files = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (file): Promise<Post> => {
        const full = path.join(POSTS_DIR, file);
        const source = await fs.readFile(full, "utf8");
        const { data, content } = matter(source);
        const trimmed = content.trim().slice(0, MAX_CHARS);
        const contentHtml = await marked.parse(trimmed);
        return {
          slug: file.replace(/\.md$/, ""),
          date: String(data.date ?? ""),
          author: String(data.author ?? "Noe"),
          handle: String(data.handle ?? "@noe"),
          avatar: data.avatar ? String(data.avatar) : undefined,
          contentHtml,
          raw: trimmed,
        };
      }),
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
