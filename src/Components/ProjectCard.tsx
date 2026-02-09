// Small, reusable card for the "Top Projects" preview on Home.

type Project = {
  title: string;
  tagline?: string;
  stack?: string[];
  hrefLive?: string;
  hrefCode?: string;
};
export default function ProjectCard({ project }: { project: Project }) {
  const hasStack = Array.isArray(project.stack) && project.stack.length > 0;

  return (
    <article className="project-card">
      <h3>{project.title}</h3>
      {project.tagline && <p className="tagline">{project.tagline}</p>}

      {hasStack && (
        <ul className="stack">
          {project.stack!.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}

      <div className="links">
        {project.hrefLive && (
          <a
            className="btn"
            href={project.hrefLive}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} live demo`}
          >
            Live
          </a>
        )}
        {project.hrefCode && (
          <a
            className="btn secondary"
            href={project.hrefCode}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} source code`}
          >
            Code
          </a>
        )}
      </div>
    </article>
  );
}
