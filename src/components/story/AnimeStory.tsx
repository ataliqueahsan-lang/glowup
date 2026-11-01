"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SCENE_ART } from "./art/scenes";
import { STORY_SCENES, STORY_TITLE } from "./storyData";

const N = STORY_SCENES.length;
/** Extra scroll distance (in screens) at the start where the hero copy is shown. */
const INTRO = 0.55;

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerReduced = () => false;

/**
 * Scroll-driven illustrated story. The hero copy (children) is shown over the
 * first scene, then the five scenes play as the page scrolls. With reduced
 * motion the scenes are shown as a plain stack of illustrated figures.
 */
export default function AnimeStory({ children }: { children: React.ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, getReduced, getServerReduced);
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [heroOn, setHeroOn] = useState(true);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const dist = Math.max(1, rect.height - vh);
      const t = Math.min(1, Math.max(0, -rect.top / dist));
      const sp = t * (N + INTRO);
      const body = Math.max(0, sp - INTRO);
      const idx = Math.min(N - 1, Math.floor(body));
      const lp = idx === N - 1 ? Math.min(1, body - idx) : body - idx;
      // Only the visible scene is updated, so scrolling never restyles the whole page.
      sceneRefs.current[idx]?.style.setProperty("--lp", lp.toFixed(3));
      setActive((p) => (p === idx ? p : idx));
      setHeroOn((p) => {
        const on = sp < INTRO * 0.85;
        return p === on ? p : on;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const dist = track.offsetHeight - window.innerHeight;
      const target = (INTRO + i + 0.02) / (N + INTRO);
      const top = track.getBoundingClientRect().top + window.scrollY + dist * target;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  const replay = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const scene = STORY_SCENES[active];
  const showCaption = reduced || !heroOn;

  if (reduced) {
    return (
      <section id="story" aria-labelledby="story-title" className="story story-static">
        <div className="container-page py-12 sm:py-16">
          {children}
          <h2 id="story-title" className="section-heading mt-16">
            {STORY_TITLE}
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {SCENE_ART.map((Art, i) => (
              <figure key={i} className="glass overflow-hidden">
                <div className="story-frame relative aspect-[16/9] w-full overflow-hidden">
                  <Art />
                </div>
                <figcaption className="p-5">
                  <p className="eyebrow">Scene {STORY_SCENES[i].chapter}</p>
                  <h3 className="mt-1 font-serif text-xl text-foreground">{STORY_SCENES[i].title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{STORY_SCENES[i].caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tools" className="btn btn-primary">
              Open GlowUp tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="story" aria-label={`${STORY_TITLE}, an illustrated story`} className="story">
      <div ref={trackRef} className="story-track" style={{ height: `${(N + INTRO + 1) * 100}svh` }}>
        <div className="story-stage" data-hero={heroOn ? "on" : "off"}>
          <h2 className="sr-only">{STORY_TITLE}</h2>

          {SCENE_ART.map((Art, i) => {
            const near = Math.abs(i - active) <= 1;
            const state = i === active ? "active" : i < active ? "past" : "next";
            return (
              <div
                key={i}
                ref={(el) => {
                  sceneRefs.current[i] = el;
                }}
                className="story-scene"
                data-state={state}
                data-pan={STORY_SCENES[i].pan ? "true" : undefined}
                aria-hidden={i === active ? undefined : true}
                style={{ ["--shift"]: `${STORY_SCENES[i].shift}%` } as React.CSSProperties}
              >
                {near ? <Art /> : null}
              </div>
            );
          })}
          <div className="story-scrim" aria-hidden="true" />

          <div className="story-hero container-page" aria-hidden={heroOn ? undefined : true} inert={heroOn ? undefined : true}>
            {children}
          </div>

          <div className="story-ui container-page">
            <a href="#tools" className="story-skip glass-pill">
              Skip story
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <nav aria-label="Story scenes" className="story-dots glass-pill">
              {STORY_SCENES.map((s, i) => (
                <button
                  key={s.chapter}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to scene ${s.chapter}: ${s.title}`}
                  aria-current={i === active && !heroOn ? "step" : undefined}
                  className="story-dot"
                  data-on={i === active && !heroOn ? "true" : "false"}
                />
              ))}
            </nav>
          </div>

          <div className="story-caption-wrap container-page" aria-live="polite">
            {showCaption ? (
              <div key={active} className="story-caption glass">
                <p className="eyebrow">
                  Scene {scene.chapter} · {STORY_TITLE}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-medium text-foreground sm:text-3xl">{scene.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">{scene.caption}</p>
                {active === N - 1 ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/tools" className="btn btn-primary">
                      Open GlowUp tools
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <button type="button" onClick={replay} className="btn btn-secondary">
                      Replay the story
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
