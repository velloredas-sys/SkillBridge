import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders the AI/fallback 8-week plan as clean, well-spaced markdown —
 * proper headings, bold, and bullet lists instead of raw "**Week 1-2**"
 * asterisks leaking into the UI.
 */
export function PlanMarkdown({ text }: { text: string }) {
  return (
    <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h3 className="mt-6 border-b border-border pb-2 font-sans text-base font-semibold first:mt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="mt-6 border-b border-border pb-2 font-sans text-base font-semibold first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mt-5 font-sans text-sm font-semibold text-foreground first:mt-0">{children}</h4>
          ),
          p: ({ children }) => <p className="text-sm leading-relaxed text-foreground">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          ul: ({ children }) => <ul className="ml-4 list-disc space-y-1.5 marker:text-primary">{children}</ul>,
          ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1.5 marker:text-primary">{children}</ol>,
          li: ({ children }) => <li className="text-sm leading-relaxed text-foreground">{children}</li>,
          hr: () => <hr className="my-4 border-border" />,
          code: ({ children }) => (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{children}</code>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
