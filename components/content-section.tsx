import Link from "next/link";
import type { ContentSection as Section, ContentImage } from "@/lib/content-types";

export function SectionBody({ section }: { section: Section }) {
  return <>
    {section.paragraphs?.map(text => <p key={text}>{text}</p>)}
    {section.bullets && <ul>{section.bullets.map(text => <li key={text}>{text}</li>)}</ul>}
    {section.table && <><p className="table-scroll-hint">На телефоне таблицу можно прокрутить вправо.</p><div className="guide-table-scroll" role="region" aria-label={section.table.caption} tabIndex={0}>
      <table className="guide-table">
        <caption>{section.table.caption}</caption>
        <thead><tr>{section.table.headers.map(text => <th scope="col" key={text}>{text}</th>)}</tr></thead>
        <tbody>{section.table.rows.map((row, index) => <tr key={index}>{row.map((text, cell) => cell === 0
          ? <th scope="row" key={cell}>{text}</th> : <td key={cell}>{text}</td>)}</tr>)}</tbody>
      </table>
    </div></>}
    {section.links && <ul className="guide-links">{section.links.map(link => <li key={link.href}>
      {link.href.startsWith("/") ? <Link href={link.href}>{link.label} →</Link> : <a href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>}
    </li>)}</ul>}
  </>;
}

export function GuideSections({ sections }: { sections?: Section[] }) {
  if (!sections?.length) return null;
  return <div className="section-shell guide-sections">{sections.map(section => <section className="guide-section" key={section.title}>
    <h2>{section.title}</h2><SectionBody section={section} />
  </section>)}</div>;
}

export function ProjectGallery({ images }: { images?: ContentImage[] }) {
  if (!images?.length) return null;
  return <div className="section-shell project-gallery">{images.map(image => <figure key={image.src}>
    <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
    <figcaption>{image.caption}</figcaption>
  </figure>)}</div>;
}
