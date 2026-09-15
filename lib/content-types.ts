export type ContentLink = { label: string; href: string };
export type ContentImage = { src: string; alt: string; width: number; height: number; caption: string };
export type ContentSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { caption: string; headers: string[]; rows: string[][] };
  links?: ContentLink[];
};
