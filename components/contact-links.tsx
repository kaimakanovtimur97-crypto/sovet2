import { MessagesSquare, Phone, Send } from "lucide-react";
import { site } from "@/lib/site-data";

type ContactLinksProps = {
  compact?: boolean;
  className?: string;
};

export function ContactLinks({ compact = false, className = "" }: ContactLinksProps) {
  return (
    <div className={`contact-links${compact ? " contact-links-compact" : ""}${className ? ` ${className}` : ""}`}>
      <a className="pill-button" href={site.phoneHref} aria-label={`Позвонить: ${site.phone}`}>
        <Phone size={17} /> Позвонить
      </a>
      <a className="ghost-button" href={site.telegramHref} target="_blank" rel="noopener noreferrer">
        <Send size={17} /> Telegram
      </a>
      <a className="ghost-button" href={site.maxHref} target="_blank" rel="noopener noreferrer">
        <MessagesSquare size={17} /> MAX
      </a>
    </div>
  );
}
