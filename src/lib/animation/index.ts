import type { EasingFunction, TransitionConfig } from "svelte/transition";

export const transition =
	"linear(0,0.006,0.025 2.8%,0.101 6.1%,0.539 18.9%,0.721 25.3%,0.849 31.5%,0.937 38.1%,0.968 41.8%,0.991 45.7%,1.006 50.1%,1.015 55%,1.017 63.9%,1.001)";

export const duration = 500;

const remap = (
	value: number,
	low1: number,
	high1: number,
	low2: number,
	high2: number,
) => low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);

const choose = (
	direction: "in" | "out" | "both",
	defaultValue: number,
	inValue?: number,
	outValue?: number,
) =>
	direction !== "out"
		? typeof inValue === "number"
			? inValue
			: defaultValue
		: typeof outValue === "number"
			? outValue
			: defaultValue;

export const blur = (
	_: HTMLElement,
	config:
		| Partial<{
				blurMultiplier: number;
				duration: number;
				easing: EasingFunction;
				scale: {
					start: number;
					end: number;
				};
				x: {
					start: number;
					end: number;
				};
				y: {
					start: number;
					end: number;
				};
				delay: number;
				opacity: boolean;
		  }>
		| undefined,
	dir: {
		direction: "in" | "out" | "both";
	},
): TransitionConfig => {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	if (typeof config?.opacity === "undefined" && config) config.opacity = true;
	return {
		delay: config?.delay || 0,
		duration: prefersReducedMotion ? 0 : config?.duration || 300,
		css: (t) =>
			prefersReducedMotion
				? ""
				: `filter: blur(${(1 - t) * (config?.blurMultiplier || 1)}px); opacity: ${config?.opacity ? t : 1}; transform: translate(${remap(
						t,
						0,
						1,
						choose(
							dir.direction,
							0,
							config?.x?.start,
							config?.x?.end,
						),
						choose(
							dir.direction,
							0,
							config?.x?.end,
							config?.x?.start,
						),
					)}px, ${remap(
						t,
						0,
						1,
						choose(
							dir.direction,
							0,
							config?.y?.start,
							config?.y?.end,
						),
						choose(
							dir.direction,
							0,
							config?.y?.end,
							config?.y?.start,
						),
					)}px) scale(${remap(
						t,
						0,
						1,
						choose(
							dir.direction,
							0.9,
							config?.scale?.start,
							config?.scale?.end,
						),
						choose(
							dir.direction,
							1,
							config?.scale?.end,
							config?.scale?.start,
						),
					)});`,
		easing: config?.easing,
	};
};