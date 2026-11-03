import { youtubeId } from "@/lib/format";

// Mise en forme simple et sûre du texte saisi dans l'administration (aucun HTML interprété) :
// "## " titre, "### " sous-titre, "- " liste, "> " citation, **gras**, [texte](https://lien),
// une ligne contenant seulement un lien YouTube devient une vidéo intégrée.
function inline(text: string, key: string) {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={`${key}-b${i++}`}>{m[1]}</strong>);
    else parts.push(<a key={`${key}-a${i++}`} href={m[3]} target="_blank" rel="noopener noreferrer">{m[2]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function YoutubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="my-8 aspect-video overflow-hidden rounded-2xl bg-ink">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}

export default function ArticleBody({ body }: { body: string }) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-mgs text-[17px] text-ink/90">
      {blocks.map((block, i) => {
        const key = `b${i}`;
        const yt = /^https?:\/\/\S+$/.test(block) ? youtubeId(block) : null;
        if (yt) return <YoutubeEmbed key={key} id={yt} title="Vidéo" />;
        if (block.startsWith("### ")) return <h3 key={key}>{inline(block.slice(4), key)}</h3>;
        if (block.startsWith("## ")) return <h2 key={key}>{inline(block.slice(3), key)}</h2>;
        if (block.startsWith("> ")) return <blockquote key={key}>{inline(block.replace(/^> ?/gm, ""), key)}</blockquote>;
        if (block.split("\n").every((l) => l.startsWith("- "))) {
          return <ul key={key}>{block.split("\n").map((l, j) => <li key={j}>{inline(l.slice(2), `${key}-${j}`)}</li>)}</ul>;
        }
        return (
          <p key={key}>
            {block.split("\n").map((line, j, arr) => (
              <span key={j}>{inline(line, `${key}-${j}`)}{j < arr.length - 1 && <br />}</span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
