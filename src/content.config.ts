import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      line: z.string(),
      order: z.number().int(),
      thumb: image(),
      tone: z.enum(["light", "dark", "navy"]),
      platform: z.string(),
      team: z.string(),
      stack: z.array(z.string()).min(1),
      link: z.url().optional(),
      // Shown beside "Code is private" when there is no link; defaults to the class-project note.
      privateNote: z.string().optional(),
      images: z
        .array(
          z.object({
            src: image(),
            caption: z.string(),
            video: z.object({ mp4: z.string(), webm: z.string() }).optional(),
          }),
        )
        .min(1),
      featured: z.object({
        art: z.enum(["tabi", "shot", "phones"]),
        shot: image().optional(),
      }),
    }),
});

const jobs = defineCollection({
  loader: file("src/content/jobs.json"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      org: z.string(),
      logo: image(),
      current: z.boolean(),
      order: z.number().int(),
      tools: z.array(z.string()).min(1),
      desc: z.string(),
      // Keep dialogs skimmable: at most 4 highlights of ~60 words each.
      highlights: z
        .array(z.object({ title: z.string(), body: z.string().max(400) }))
        .max(4)
        .optional(),
    }),
});

const skills = defineCollection({
  loader: file("src/content/skills.json"),
  schema: z.object({
    label: z.string(),
    icon: z.string().regex(/^si[A-Z]/, "simple-icons export name, e.g. siTypescript"),
    color: z.string().regex(/^#[0-9a-f]{6}$/i),
    order: z.number().int(),
  }),
});

const site = defineCollection({
  loader: file("src/content/site.json"),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    employer: z.string(),
    subtitle: z.string(),
    email: z.email(),
    github: z.url(),
    linkedin: z.url(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
  }),
});

export const collections = { projects, jobs, skills, site };
