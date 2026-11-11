# Hero inspo references

Running log of concrete portfolio sites/screens found as inspiration for leveling up the hero's UX. Add new entries as they come up. See also the animation technique research (WebGPU, View Transitions, 3D scroll object, etc.) tracked separately  this file is "what it should feel like" (references), that one is "how to build it" (techniques/APIs).

All entries should stay consistent with the site's technical-drafting/blueprint identity  borrow the *feel* of the interaction, not the literal color/shape language of the reference.

## References

1. **Patrick Heng portfolio** (creative developer, Paris)  vertical scroll drives horizontal translation of the page content. Layered elements (giant name typography, big flat black circles of varying sizes, small dot accents) move at different horizontal speeds as you scroll, producing a parallax-depth effect while the page still scrolls normally (mouse wheel / trackpad, not a horizontal scrollbar). Flat bold color (orange/black), oversized display type with thick underline, minimal corner nav ("Work, About"), circular arrow affordance bottom-right.
   - Mechanism to research: scroll-linked transform (`translateX`) per layer, likely driven by a scroll-smoothing lib (Lenis) or native scroll progress, with each layer given a different speed multiplier for the parallax depth. Candidate implementations: native CSS scroll-driven animations (`animation-timeline: scroll()`) or GSAP ScrollTrigger.
   - What to borrow (not clone): the *feel* of scroll producing large, confident spatial movement instead of a simple fade/slide-up reveal  not the literal color/shape language.

2. **Samsy (samsy.ninja)**  Paris-based creative technologist. Portfolio is a navigable 3D world (WebGPU, 120+FPS) you move through in first-person to reach different projects, rather than a scroll page. Awwwards SOTD + Developer Award. Relevant as a ceiling reference for [[project_portfolio_animation_research]] item 2 (WebGPU/TSL)  not something to replicate wholesale (too big a lift / too far from the blueprint identity), but worth looking at for how they handle the WebGPU→WebGL fallback and first-person camera controls.

3. **Pacôme Pertant portfolio** (by Louis Bocquet & Colin Demouge)  motion/sound designer folio, Awwwards Developer Award + SOTD (2026-06-27). Known for a custom mouse-trail effect and a distinctive menu-open transition. Worth checking for the micro-interaction polish (cursor, menu) rather than the hero mechanism itself.

4. **Oryzo (oryzo.ai)**  single 3D hero object with inertial physics; scroll moves the camera through Z-axis depth rather than translating a flat layer. A good reference for [[project_portfolio_animation_research]] item 3 (real 3D scroll-driven object) since it's a single object staying "in scene" across the scroll, like the compass/drafting-instrument idea.

5. **Hubtown (hubtown.co.in)**  3D monolith hero scene where mouse movement (not scroll) progressively reveals geometric detail. Relevant to item 6 (cursor-driven displacement) as an alternative to a shader-based approach  reveal via geometry/lighting instead of a distortion shader.

6. **★ Guillaume Gouessan (guillaumegouessan.com)  flagged by the user as a strong reference, both for the mechanism and for the professional profile it represents.**
   - **Mechanism (About page):** a 3D room scene (desk, monitor, chair, desk lamp) that the camera pulls back/away from as you scroll  you start close on the desk and the scroll dollies the camera backward, revealing more of the room. Same family as the Oryzo Z-axis camera-scroll entry above, but staged as a literal "room" rather than an abstract object  reinforces [[project_portfolio_animation_research]] item 3 (real 3D scroll-driven object): a single persistent 3D scene the camera moves through, not per-section reset animations.
   - **Home hero:** decorative horizontal gradient bars standing in for nav/meta text at rest, name in large type, vertical side nav labels (Work/About/Twitter/Linkedin/Github/Email) printed sideways along the right edge  restrained, text-driven rather than shape-driven like Patrick Heng's hero.
   - **Profile/positioning (the part the user specifically wants to aim for):** self-described as "creative developer / software engineer"  stack is JS/TypeScript/Unity, career history is real senior/technical-lead engineering roles (not just visual-design freelance work). The identity being aimed at is "engineer who also does high-end interactive/creative work," not "designer who codes." Relevant beyond the hero  should inform how About/bio copy and case-study framing are written on this portfolio, not just the animation layer.

## Curated galleries to keep browsing

- [Awwwards  Best Portfolio Websites](https://www.awwwards.com/websites/portfolio/) and the [Scrolling collection](https://www.awwwards.com/websites/scrolling/)  filter by "Developer Award" for code-forward sites rather than pure visual design.
- [Utsubo  Best Three.js Websites 2026](https://www.utsubo.com/blog/best-threejs-websites-2026)  each entry names the specific technique (WebGPU/TSL, scroll-sequenced reveals, cinematic camera flythrough, etc.), useful for matching a technique to a feeling before implementing.
- [ThreeJS Resources  Portfolio showcase](https://threejsresources.com/showcase/portfolio)  filtered specifically to individual creative-dev portfolios (as opposed to agency/brand sites), closest category match to this project.
- [siteinspire.com](https://www.siteinspire.com/) and [Land-book](https://land-book.com/)  general curated galleries, filterable by style tag; good for volume-browsing beyond the three.js-specific niche.
