import { SITE } from '~content/site';

export function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-4 px-4">
      <h1 className="font-bold text-4xl">{SITE.name}</h1>
      <p className="text-lg text-neutral-600">{SITE.description}</p>
    </main>
  );
}
