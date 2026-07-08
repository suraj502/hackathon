import * as React from "react";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Award, Calendar, Check, CheckCircle2, ChevronDown, ChevronUp, Circle, Github, Linkedin, Loader2, Medal, Menu, Radio, RefreshCw, Rocket, Sparkles, Trophy, Twitter, X } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { io } from "socket.io-client";
import { z } from "zod";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region src/assets/iste_logo_1.png
var iste_logo_1_default = "/assets/iste_logo_1-4eh6oNYi.png";
//#endregion
//#region src/components/landing/Navbar.tsx
var NAV_LINKS = [
	{
		label: "About",
		href: "#about"
	},
	{
		label: "Timeline",
		href: "#timeline"
	},
	{
		label: "Tracks",
		href: "#tracks"
	},
	{
		label: "Results",
		href: "#results"
	},
	{
		label: "FAQ",
		href: "#faq"
	},
	{
		label: "Sponsors",
		href: "#sponsors"
	}
];
function Navbar() {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs("header", {
		className: "fixed inset-x-0 top-0 z-50 overflow-x-hidden border-b border-border/40 bg-background/70 backdrop-blur-xl",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-14 w-full max-w-7xl min-w-0 items-center justify-between px-2 sm:h-16 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ jsxs("a", {
					href: "#top",
					className: "group flex min-w-0 flex-1 items-center gap-2 md:flex-none",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/40 sm:h-9 sm:w-9",
						children: [/* @__PURE__ */ jsx(Rocket, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-md bg-primary/20 opacity-0 blur-md transition-opacity group-hover:opacity-100" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-col leading-none max-[360px]:hidden sm:flex",
						children: [/* @__PURE__ */ jsx("span", {
							className: "truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]",
							children: "NexTerra"
						}), /* @__PURE__ */ jsx("span", {
							className: "truncate font-mono text-xs font-bold tracking-tight text-foreground sm:text-sm",
							children: "ORBIT_HACK"
						})]
					})]
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: NAV_LINKS.map((link) => /* @__PURE__ */ jsx("a", {
						href: link.href,
						className: "rounded-md px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-primary",
						children: link.label
					}, link.href))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-2 flex shrink-0 items-center gap-1 sm:gap-3",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "hidden h-9 w-9 items-center justify-center rounded-full bg-primary min-[381px]:flex sm:h-12 sm:w-12",
							children: /* @__PURE__ */ jsx("img", {
								src: iste_logo_1_default,
								alt: "ISTE logo",
								className: "h-full w-full rounded-full object-contain flex justify-center items-center"
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "hidden md:block",
							children: /* @__PURE__ */ jsx(Button, {
								asChild: true,
								className: "font-mono text-xs uppercase tracking-wider shadow-glow",
								children: /* @__PURE__ */ jsx("a", {
									href: "#register",
									children: "Register →"
								})
							})
						}),
						/* @__PURE__ */ jsx("button", {
							"aria-label": "Toggle menu",
							onClick: () => setOpen((s) => !s),
							className: "rounded-md p-1.5 text-foreground md:hidden",
							children: open ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ jsx("div", {
			className: "border-t border-border/40 bg-background/95 md:hidden",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-h-[calc(100vh-3.5rem)] space-y-1 overflow-y-auto px-3 py-3 sm:max-h-[calc(100vh-4rem)] sm:px-4",
				children: [NAV_LINKS.map((link) => /* @__PURE__ */ jsx("a", {
					href: link.href,
					onClick: () => setOpen(false),
					className: "block rounded-md px-3 py-2.5 font-mono text-sm uppercase tracking-wider text-muted-foreground hover:bg-secondary/40 hover:text-primary",
					children: link.label
				}, link.href)), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					className: "mt-2 w-full font-mono text-xs uppercase tracking-wider",
					children: /* @__PURE__ */ jsx("a", {
						href: "#register",
						onClick: () => setOpen(false),
						children: "Register →"
					})
				})]
			})
		})]
	});
}
//#endregion
//#region src/components/landing/Hero.tsx
function Hero() {
	const letters = Array.from("NexTerra Orbit");
	return /* @__PURE__ */ jsxs("section", {
		id: "top",
		className: "relative isolate overflow-hidden pt-24 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-hero-gradient" }),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 grid-bg opacity-40" }),
			/* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-1/2 -z-10 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 bg-orbit-gradient" }),
			/* @__PURE__ */ jsx("div", {
				className: "pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2",
				children: [
					280,
					420,
					600,
					820
				].map((size, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						rotate: 0,
						opacity: 0
					},
					animate: {
						rotate: i % 2 ? -360 : 360,
						opacity: 1
					},
					transition: {
						rotate: {
							duration: 40 + i * 12,
							repeat: Infinity,
							ease: "linear"
						},
						opacity: {
							duration: 1.2,
							delay: i * .15
						}
					},
					className: `absolute rounded-full border border-primary/20 ${i > 1 ? "hidden sm:block" : ""}`,
					style: {
						width: size,
						height: size,
						left: -size / 2,
						top: -size / 2
					},
					children: /* @__PURE__ */ jsx("span", {
						className: "absolute h-2 w-2 rounded-full bg-primary shadow-glow",
						style: {
							top: -4,
							left: size / 2 - 4
						}
					})
				}, size))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
				children: [
					/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .6 },
						className: "mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-primary",
						children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-primary" }), "Edition 01 · 27 Jul → 29 Aug"]
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "text-center font-mono text-[2.5rem] font-extrabold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl",
						children: [/* @__PURE__ */ jsx("span", {
							className: "block",
							children: letters.map((ch, i) => /* @__PURE__ */ jsx(motion.span, {
								initial: {
									opacity: 0,
									y: 24
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: .5,
									delay: .2 + i * .04
								},
								className: "inline-block",
								children: ch === " " ? "\xA0" : ch
							}, i))
						}), /* @__PURE__ */ jsx(motion.span, {
							initial: {
								opacity: 0,
								y: 24
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								delay: .9
							},
							className: "mt-2 block text-primary text-glow",
							children: "Hackathon"
						})]
					}),
					/* @__PURE__ */ jsx(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							duration: .6,
							delay: 1.2
						},
						className: "mx-auto mt-6 max-w-2xl px-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:mt-8 sm:text-sm sm:tracking-[0.3em]",
						children: "// tagline coming soon — add yours here"
					}),
					/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .6,
							delay: 1.35
						},
						className: "mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row",
						children: [/* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							className: "w-full max-w-xs font-mono text-xs uppercase tracking-wider shadow-glow sm:w-auto sm:max-w-none",
							children: /* @__PURE__ */ jsxs("a", {
								href: "#register",
								children: ["Register Now ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })]
							})
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "w-full max-w-xs border-primary/40 bg-transparent font-mono text-xs uppercase tracking-wider text-foreground hover:bg-primary/10 sm:w-auto sm:max-w-none",
							children: /* @__PURE__ */ jsxs("a", {
								href: "#timeline",
								children: [/* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }), " View Timeline"]
							})
						})]
					}),
					/* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .6,
							delay: 1.5
						},
						className: "mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 divide-y divide-border/40 rounded-xl border border-border/40 bg-card/40 backdrop-blur sm:mt-16 sm:grid-cols-3 sm:divide-x sm:divide-y-0",
						children: [
							{
								k: "Rounds",
								v: "03"
							},
							{
								k: "Duration",
								v: "34 Days"
							},
							{
								k: "Status",
								v: "Open"
							}
						].map((stat) => /* @__PURE__ */ jsxs("div", {
							className: "px-4 py-5 text-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "font-mono text-2xl font-bold text-primary sm:text-3xl",
								children: stat.v
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: stat.k
							})]
						}, stat.k))
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/ui/badge.tsx
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region src/components/landing/Timeline.tsx
var MILESTONES = [
	{
		code: "M_01",
		date: "27 Jul — 4 Aug",
		title: "Round 1 · Idea Submission",
		description: "Form your team and submit your initial concept. Pitch the problem, your angle, and the impact.",
		status: "upcoming"
	},
	{
		code: "M_02",
		date: "8 Aug",
		title: "Round 1 · Results",
		description: "Shortlisted teams are announced and invited into the build phase.",
		status: "upcoming"
	},
	{
		code: "M_03",
		date: "8 Aug — 18 Aug",
		title: "Round 2 · Build Sprint",
		description: "Ten days to ship a working prototype. Mentor office hours, async reviews, and weekly check-ins.",
		status: "upcoming"
	},
	{
		code: "M_04",
		date: "20 Aug",
		title: "Round 2 · Results",
		description: "Finalists announced and matched with judging panels for the closing round.",
		status: "upcoming"
	},
	{
		code: "M_05",
		date: "29 Aug",
		title: "Final Round · Demo Day",
		description: "Live demos, jury Q&A, and the announcement of the Orbit champions.",
		status: "upcoming"
	}
];
function StatusIcon({ status }) {
	if (status === "done") return /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-primary" });
	if (status === "live") return /* @__PURE__ */ jsx(Radio, { className: "h-4 w-4 animate-pulse text-primary" });
	return /* @__PURE__ */ jsx(Circle, { className: "h-4 w-4 text-muted-foreground" });
}
function StatusBadge({ status }) {
	const s = {
		done: {
			label: "Completed",
			cls: "border-primary/30 bg-primary/10 text-primary"
		},
		live: {
			label: "Live",
			cls: "border-primary/50 bg-primary/20 text-primary"
		},
		upcoming: {
			label: "Upcoming",
			cls: "border-border bg-muted/30 text-muted-foreground"
		}
	}[status];
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: `font-mono text-[10px] uppercase tracking-widest ${s.cls}`,
		children: s.label
	});
}
function Timeline() {
	return /* @__PURE__ */ jsx("section", {
		id: "timeline",
		className: "relative py-20 sm:py-28 lg:py-32",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-12 text-center sm:mb-16",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary",
						children: "[ THE_ORBIT ]"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "font-mono text-3xl font-bold tracking-tight text-foreground sm:text-5xl",
						children: "From Launchpad to Landing"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto mt-4 max-w-2xl text-base text-muted-foreground",
						children: "Five checkpoints across thirty-four days. One mission: ship something that matters."
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute left-3 top-0 h-full w-px bg-linear-to-b from-transparent via-primary/40 to-transparent md:left-1/2" }), /* @__PURE__ */ jsx("div", {
					className: "space-y-12",
					children: MILESTONES.map((m, idx) => {
						const alignRight = idx % 2 === 1;
						return /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 24
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: {
								once: true,
								margin: "-80px"
							},
							transition: {
								duration: .5,
								delay: idx * .05
							},
							className: "relative md:grid md:grid-cols-2 md:gap-12",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute left-3 top-3 -translate-x-1/2 md:left-1/2",
								children: /* @__PURE__ */ jsxs("div", {
									className: "relative flex h-4 w-4 items-center justify-center",
									children: [/* @__PURE__ */ jsx("span", { className: "absolute h-4 w-4 rounded-full bg-primary/30 animate-ping" }), /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-primary shadow-glow" })]
								})
							}), /* @__PURE__ */ jsx("div", {
								className: alignRight ? "md:col-start-2" : "",
								children: /* @__PURE__ */ jsxs("div", {
									className: `ml-7 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur transition-colors hover:border-primary/40 sm:ml-10 sm:p-6 md:ml-0 ${alignRight ? "md:ml-8" : "md:mr-8 md:text-right"}`,
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: `flex flex-wrap items-center gap-2 ${alignRight ? "" : "md:justify-end"}`,
											children: [/* @__PURE__ */ jsx(StatusIcon, { status: m.status }), /* @__PURE__ */ jsxs("span", {
												className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:tracking-widest",
												children: [
													m.code,
													" · ",
													m.date
												]
											})]
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "mt-3 font-mono text-lg font-bold text-foreground sm:text-xl",
											children: m.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-2 text-sm leading-relaxed text-muted-foreground",
											children: m.description
										}),
										/* @__PURE__ */ jsx("div", {
											className: `mt-4 flex ${alignRight ? "" : "md:justify-end"}`,
											children: /* @__PURE__ */ jsx(StatusBadge, { status: m.status })
										})
									]
								})
							})]
						}, m.code);
					})
				})]
			})]
		})
	});
}
//#endregion
//#region src/components/ui/tabs.tsx
var Tabs = TabsPrimitive.Root;
var TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsPrimitive.Content.displayName;
//#endregion
//#region src/components/ui/card.tsx
var Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
//#endregion
//#region src/lib/hackathon-api.ts
var DEFAULT_API_BASE_URL = "http://localhost:5000/api";
var DEFAULT_SOCKET_URL = "http://localhost:5000";
var API_BASE_URL = normalizeBaseUrl(DEFAULT_API_BASE_URL);
var SOCKET_URL = normalizeBaseUrl(DEFAULT_SOCKET_URL);
function normalizeBaseUrl(url) {
	return url.replace(/\/$/, "");
}
async function request(path, init) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init?.headers || {}
		}
	});
	const payload = await response.json().catch(() => null);
	if (!response.ok || !payload || payload.success === false) {
		const message = payload && payload.success === false ? payload.message : "Request failed";
		const errors = payload && payload.success === false && payload.errors ? payload.errors : [];
		throw new Error(errors.length > 0 ? `${message}: ${errors.join(", ")}` : message);
	}
	return payload.data;
}
async function registerTeam(payload) {
	return request("/register", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
async function fetchResults(status) {
	return request(`/results/${status === "winner" ? "winners" : status}`);
}
//#endregion
//#region src/lib/socket.ts
var socket = null;
function getHackathonSocket() {
	if (!socket) socket = io(SOCKET_URL, {
		transports: ["websocket"],
		autoConnect: true,
		withCredentials: false
	});
	return socket;
}
//#endregion
//#region src/components/landing/Results.tsx
var PODIUM = [
	{
		place: "1st",
		icon: Trophy,
		label: "Champion"
	},
	{
		place: "2nd",
		icon: Medal,
		label: "Runner-up"
	},
	{
		place: "3rd",
		icon: Award,
		label: "Third Place"
	}
];
function TeamGrid({ teams, announceDate }) {
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "font-mono text-xs uppercase tracking-widest text-muted-foreground",
				children: "Shortlisted teams"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Compact view for rounds with many selections."
			})] }), /* @__PURE__ */ jsxs("div", {
				className: "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary/80",
				children: [
					/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
					" ",
					announceDate
				]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-4 max-h-80 overflow-y-auto pr-1",
			children: teams.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "rounded-2xl border border-dashed border-border/60 bg-background/50 px-4 py-8 text-center text-sm text-muted-foreground",
				children: "Awaiting announcement. Teams will appear here once admins publish results."
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: teams.map((team) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border/60 bg-background/70 px-4 py-3 shadow-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold text-foreground",
								children: team.teamName
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: team.collegeName
							})] }), /* @__PURE__ */ jsx("span", {
								className: "rounded-full border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary",
								children: team.status
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 text-xs text-muted-foreground",
							children: ["Leader: ", /* @__PURE__ */ jsx("span", {
								className: "text-foreground",
								children: team.leader.name
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: ["Track: ", /* @__PURE__ */ jsx("span", {
								className: "text-foreground",
								children: team.track
							})]
						})
					]
				}, team._id))
			})
		})]
	});
}
function PodiumGrid({ teams, announceDate }) {
	const topTeams = teams.slice(0, 3);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid gap-4 sm:grid-cols-3",
			children: PODIUM.map((podium, index) => {
				const team = topTeams[index];
				const Icon = podium.icon;
				return /* @__PURE__ */ jsxs(Card, {
					className: `relative overflow-hidden border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6 ${index === 0 ? "sm:-translate-y-2 sm:border-primary/40" : ""}`,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-muted-foreground",
								children: podium.place
							}), /* @__PURE__ */ jsx(Icon, { className: `h-5 w-5 ${index === 0 ? "text-primary" : "text-muted-foreground"}` })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-6 font-mono text-2xl font-bold text-foreground",
							children: team ? team.teamName : "TBA"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-1 text-sm text-muted-foreground",
							children: team ? team.collegeName : podium.label
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary/80",
							children: [
								/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
								" ",
								announceDate
							]
						})
					]
				}, podium.place);
			})
		}), teams.length > 3 && /* @__PURE__ */ jsxs(Card, {
			className: "border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground",
				children: "Additional winners"
			}), /* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: teams.slice(3).map((team) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border/60 bg-background/70 px-4 py-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-sm font-semibold text-foreground",
						children: team.teamName
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: team.collegeName
					})]
				}, team._id))
			})]
		})]
	});
}
function Results() {
	const [results, setResults] = useState({
		round1: [],
		round2: [],
		winners: []
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	useEffect(() => {
		let alive = true;
		const socket = getHackathonSocket();
		const syncResults = async () => {
			try {
				setError(null);
				const [round1, round2, winners] = await Promise.all([
					fetchResults("round1"),
					fetchResults("round2"),
					fetchResults("winner")
				]);
				if (!alive) return;
				setResults({
					round1: round1.teams,
					round2: round2.teams,
					winners: winners.teams
				});
			} catch (requestError) {
				if (!alive) return;
				setError(requestError instanceof Error ? requestError.message : "Failed to load results");
			} finally {
				if (alive) setLoading(false);
			}
		};
		const handleStatusUpdate = () => {
			syncResults();
		};
		const handleConnect = () => setIsConnected(true);
		const handleDisconnect = () => setIsConnected(false);
		socket.on("statusUpdated", handleStatusUpdate);
		socket.on("connect", handleConnect);
		socket.on("disconnect", handleDisconnect);
		syncResults();
		return () => {
			alive = false;
			socket.off("statusUpdated", handleStatusUpdate);
			socket.off("connect", handleConnect);
			socket.off("disconnect", handleDisconnect);
		};
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		id: "results",
		className: "relative py-20 sm:py-28 lg:py-32",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 grid-bg opacity-20" }), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 16
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: { duration: .5 },
				className: "mb-12 text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary",
						children: "[ RESULTS_FEED ]"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "font-mono text-3xl font-bold tracking-tight text-foreground sm:text-5xl",
						children: "Results & Announcements"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto mt-4 max-w-2xl text-base text-muted-foreground",
						children: "Live updates land here as each round closes. Bookmark this section."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx(Radio, { className: `h-3.5 w-3.5 ${isConnected ? "text-emerald-400" : "text-muted-foreground"}` }),
							isConnected ? "Live Socket Connected" : "Socket Connecting",
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => window.location.reload(),
								className: "inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80",
								children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-3 w-3" }), " Refresh"]
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs(Tabs, {
				defaultValue: "r1",
				className: "w-full",
				children: [
					/* @__PURE__ */ jsxs(TabsList, {
						className: "mx-auto mb-8 grid h-auto w-full max-w-md grid-cols-3 gap-1 bg-card/60 p-1 backdrop-blur sm:mb-10",
						children: [
							/* @__PURE__ */ jsx(TabsTrigger, {
								value: "r1",
								className: "px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] sm:text-xs sm:tracking-wider",
								children: "Round 1"
							}),
							/* @__PURE__ */ jsx(TabsTrigger, {
								value: "r2",
								className: "px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] sm:text-xs sm:tracking-wider",
								children: "Round 2"
							}),
							/* @__PURE__ */ jsx(TabsTrigger, {
								value: "final",
								className: "px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] sm:text-xs sm:tracking-wider",
								children: "Finals"
							})
						]
					}),
					/* @__PURE__ */ jsxs(TabsContent, {
						value: "r1",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-6 flex flex-col items-start justify-between gap-1.5 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-mono text-lg font-bold text-foreground",
									children: "Round 1 · Shortlist"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Announces 8 Aug"
								})]
							}),
							loading ? /* @__PURE__ */ jsx(LoadingPanel, {}) : error ? /* @__PURE__ */ jsx(ErrorPanel, { message: error }) : /* @__PURE__ */ jsx(TeamGrid, {
								teams: results.round1,
								announceDate: "8 Aug"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-6 text-center text-sm text-muted-foreground",
								children: results.round1.length > 0 ? "Round 1 selections are live from the backend." : "Awaiting announcement. Shortlisted teams will be listed here in a compact grid."
							})
						]
					}),
					/* @__PURE__ */ jsxs(TabsContent, {
						value: "r2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-6 flex flex-col items-start justify-between gap-1.5 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-mono text-lg font-bold text-foreground",
									children: "Round 2 · Finalists"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Announces 20 Aug"
								})]
							}),
							loading ? /* @__PURE__ */ jsx(LoadingPanel, {}) : error ? /* @__PURE__ */ jsx(ErrorPanel, { message: error }) : /* @__PURE__ */ jsx(TeamGrid, {
								teams: results.round2,
								announceDate: "20 Aug"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-6 text-center text-sm text-muted-foreground",
								children: results.round2.length > 0 ? "Finalists are synced from the backend in real time." : "Awaiting announcement. Finalists will appear as team-name boxes instead of large cards."
							})
						]
					}),
					/* @__PURE__ */ jsxs(TabsContent, {
						value: "final",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-6 flex flex-col items-start justify-between gap-1.5 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-mono text-lg font-bold text-foreground",
									children: "Finals · Champions"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Announces 29 Aug"
								})]
							}),
							loading ? /* @__PURE__ */ jsx(LoadingPanel, {}) : error ? /* @__PURE__ */ jsx(ErrorPanel, { message: error }) : /* @__PURE__ */ jsx(PodiumGrid, {
								teams: results.winners,
								announceDate: "29 Aug"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-6 text-center text-sm text-muted-foreground",
								children: results.winners.length > 0 ? "Winners are now streamed from the backend and Socket.IO updates will refresh this section instantly." : "Awaiting announcement. Champions will be revealed live on Demo Day."
							})
						]
					})
				]
			})]
		})]
	});
}
function LoadingPanel() {
	return /* @__PURE__ */ jsx(Card, {
		className: "border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "animate-pulse space-y-4",
			children: [/* @__PURE__ */ jsx("div", { className: "h-4 w-40 rounded bg-muted/60" }), /* @__PURE__ */ jsxs("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ jsx("div", { className: "h-24 rounded-2xl bg-muted/50" }),
					/* @__PURE__ */ jsx("div", { className: "h-24 rounded-2xl bg-muted/50" }),
					/* @__PURE__ */ jsx("div", { className: "h-24 rounded-2xl bg-muted/50" })
				]
			})]
		})
	});
}
function ErrorPanel({ message }) {
	return /* @__PURE__ */ jsx(Card, {
		className: "border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive sm:p-6",
		children: message
	});
}
//#endregion
//#region src/components/landing/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		id: "sponsors",
		className: "border-t border-border/40 bg-background/80",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center justify-between gap-8 text-center md:flex-row md:items-center md:text-left",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/40",
							children: /* @__PURE__ */ jsx(Rocket, { className: "h-4 w-4 text-primary" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-mono text-sm font-bold text-foreground",
							children: "NEXTERRA_ORBIT"
						}), /* @__PURE__ */ jsx("div", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Hackathon · Edition 01"
						})] })]
					}),
					/* @__PURE__ */ jsxs("nav", {
						className: "flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-muted-foreground md:justify-start",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#about",
								className: "hover:text-primary",
								children: "About"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#timeline",
								className: "hover:text-primary",
								children: "Timeline"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#results",
								className: "hover:text-primary",
								children: "Results"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#faq",
								className: "hover:text-primary",
								children: "FAQ"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#register",
								className: "hover:text-primary",
								children: "Register"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: [
							Github,
							Twitter,
							Linkedin
						].map((Icon, i) => /* @__PURE__ */ jsx("a", {
							href: "#",
							"aria-label": "Social link",
							className: "flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
							children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
						}, i))
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground md:flex-row md:items-center md:text-left",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" NexTerra Orbit Hackathon. All rights reserved."
				] }), /* @__PURE__ */ jsx("span", {
					className: "font-mono uppercase tracking-widest",
					children: "Powered by NexTerra"
				})]
			})]
		})
	});
}
//#endregion
//#region src/components/ui/input.tsx
var Input = React.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ jsx("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
//#region src/components/ui/label.tsx
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = LabelPrimitive.Root.displayName;
//#endregion
//#region src/components/ui/textarea.tsx
var Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
//#region src/components/ui/select.tsx
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
		asChild: true,
		children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollUpButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollDownButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(SelectPrimitive.Content, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
		/* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ jsx(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })]
}));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
//#endregion
//#region src/components/landing/Registration.tsx
var GENDER_OPTIONS = [
	{
		value: "male",
		label: "Male"
	},
	{
		value: "female",
		label: "Female"
	},
	{
		value: "other",
		label: "Other"
	},
	{
		value: "prefer_not_to_say",
		label: "Prefer not to say"
	}
];
var memberKeys = [
	{
		number: 2,
		nameKey: "member2Name",
		emailKey: "member2Email",
		branchKey: "member2Branch",
		yearKey: "member2Year",
		genderKey: "member2Gender"
	},
	{
		number: 3,
		nameKey: "member3Name",
		emailKey: "member3Email",
		branchKey: "member3Branch",
		yearKey: "member3Year",
		genderKey: "member3Gender"
	},
	{
		number: 4,
		nameKey: "member4Name",
		emailKey: "member4Email",
		branchKey: "member4Branch",
		yearKey: "member4Year",
		genderKey: "member4Gender"
	}
];
var schema = z.object({
	teamName: z.string().trim().min(2, "Team name is required").max(60, "Team name too long"),
	collegeName: z.string().trim().min(2, "College is required").max(120, "College name too long"),
	teamSize: z.enum([
		"1",
		"2",
		"3",
		"4"
	], { message: "Select a team size" }),
	track: z.enum([
		"ai",
		"web3",
		"climate",
		"open"
	], { message: "Pick a track" }),
	leaderName: z.string().trim().min(2, "Leader name is required").max(80, "Name too long"),
	leaderEmail: z.string().trim().email("Enter a valid email").max(255, "Email too long"),
	leaderPhone: z.string().trim().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
	leaderBranch: z.string().trim().min(2, "Leader branch is required").max(80, "Branch too long"),
	leaderYear: z.string().trim().min(1, "Leader year is required").max(20, "Year too long"),
	leaderGender: z.enum([
		"male",
		"female",
		"other",
		"prefer_not_to_say"
	], { message: "Select a gender" }),
	ideaPitch: z.string().trim().min(20, "Tell us at least 20 characters about your idea").max(1e3, "Keep it under 1000 characters"),
	member2Name: z.string().trim().max(80, "Name too long"),
	member2Email: z.string().trim().email("Enter a valid email").or(z.literal("")),
	member2Branch: z.string().trim().max(80, "Branch too long"),
	member2Year: z.string().trim().max(20, "Year too long"),
	member2Gender: z.enum([
		"male",
		"female",
		"other",
		"prefer_not_to_say",
		""
	], { message: "Select a gender" }),
	member3Name: z.string().trim().max(80, "Name too long"),
	member3Email: z.string().trim().email("Enter a valid email").or(z.literal("")),
	member3Branch: z.string().trim().max(80, "Branch too long"),
	member3Year: z.string().trim().max(20, "Year too long"),
	member3Gender: z.enum([
		"male",
		"female",
		"other",
		"prefer_not_to_say",
		""
	], { message: "Select a gender" }),
	member4Name: z.string().trim().max(80, "Name too long"),
	member4Email: z.string().trim().email("Enter a valid email").or(z.literal("")),
	member4Branch: z.string().trim().max(80, "Branch too long"),
	member4Year: z.string().trim().max(20, "Year too long"),
	member4Gender: z.enum([
		"male",
		"female",
		"other",
		"prefer_not_to_say",
		""
	], { message: "Select a gender" })
});
var initial = {
	teamName: "",
	collegeName: "",
	teamSize: "",
	track: "",
	leaderName: "",
	leaderEmail: "",
	leaderPhone: "",
	leaderBranch: "",
	leaderYear: "",
	leaderGender: "",
	ideaPitch: "",
	member2Name: "",
	member2Email: "",
	member2Branch: "",
	member2Year: "",
	member2Gender: "",
	member3Name: "",
	member3Email: "",
	member3Branch: "",
	member3Year: "",
	member3Gender: "",
	member4Name: "",
	member4Email: "",
	member4Branch: "",
	member4Year: "",
	member4Gender: ""
};
var STEPS = [
	{
		title: "Team Information",
		fields: [
			"teamName",
			"teamSize",
			"track",
			"collegeName"
		]
	},
	{
		title: "Leader Details",
		fields: [
			"leaderName",
			"leaderEmail",
			"leaderPhone",
			"leaderBranch",
			"leaderYear",
			"leaderGender"
		]
	},
	{
		title: "Members & Idea",
		fields: ["ideaPitch"]
	},
	{
		title: "Review & Submit",
		fields: []
	}
];
function Registration() {
	const [values, setValues] = useState(initial);
	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState("idle");
	const [step, setStep] = useState(0);
	const [submitArmed, setSubmitArmed] = useState(false);
	const [serverMessage, setServerMessage] = useState(null);
	const memberCount = Math.max(0, Math.min(3, (Number(values.teamSize) || 0) - 1));
	const update = (key, val) => {
		if (key === "teamSize") {
			const nextCount = Math.max(0, Math.min(3, (Number(val) || 0) - 1));
			setValues((current) => {
				const next = {
					...current,
					teamSize: val
				};
				for (const member of memberKeys.slice(nextCount)) {
					next[member.nameKey] = "";
					next[member.emailKey] = "";
					next[member.branchKey] = "";
					next[member.yearKey] = "";
					next[member.genderKey] = "";
				}
				return next;
			});
			setErrors((current) => {
				const next = { ...current };
				for (const member of memberKeys.slice(nextCount)) {
					next[member.nameKey] = void 0;
					next[member.emailKey] = void 0;
					next[member.branchKey] = void 0;
					next[member.yearKey] = void 0;
					next[member.genderKey] = void 0;
				}
				return next;
			});
			return;
		}
		setValues((current) => ({
			...current,
			[key]: val
		}));
		if (errors[key]) setErrors((current) => ({
			...current,
			[key]: void 0
		}));
	};
	const validateSelectedMembers = () => {
		const errorsToApply = {};
		const selected = memberKeys.slice(0, memberCount);
		for (const member of selected) {
			const nameValue = values[member.nameKey].trim();
			const emailValue = values[member.emailKey].trim();
			const branchValue = values[member.branchKey].trim();
			const yearValue = values[member.yearKey].trim();
			if (nameValue.length < 2) errorsToApply[member.nameKey] = `Member ${member.number} name is required`;
			if (!emailValue) errorsToApply[member.emailKey] = `Member ${member.number} email is required`;
			if (!branchValue) errorsToApply[member.branchKey] = `Member ${member.number} branch is required`;
			if (!yearValue) errorsToApply[member.yearKey] = `Member ${member.number} year is required`;
			if (!values[member.genderKey]) errorsToApply[member.genderKey] = `Select gender for member ${member.number}`;
		}
		if (![values.leaderGender, ...selected.map((member) => values[member.genderKey])].some((gender) => gender === "female") && (selected.length > 0 || values.leaderGender)) {
			const femaleField = selected[0]?.genderKey ?? "leaderGender";
			errorsToApply[femaleField] = "At least one female member is required in the team";
		}
		const emails = [values.leaderEmail.trim().toLowerCase(), ...selected.map((member) => values[member.emailKey].trim().toLowerCase())].filter(Boolean);
		const names = [values.leaderName.trim().toLowerCase(), ...selected.map((member) => values[member.nameKey].trim().toLowerCase())].filter(Boolean);
		if (new Set(emails).size !== emails.length) errorsToApply.leaderEmail = errorsToApply.leaderEmail || "Duplicate emails are not allowed";
		if (new Set(names).size !== names.length) errorsToApply.leaderName = errorsToApply.leaderName || "Duplicate member names are not allowed";
		setErrors((current) => {
			const next = { ...current };
			for (const member of memberKeys) {
				next[member.nameKey] = void 0;
				next[member.emailKey] = void 0;
				next[member.branchKey] = void 0;
				next[member.yearKey] = void 0;
				next[member.genderKey] = void 0;
			}
			next.leaderEmail = void 0;
			next.leaderName = void 0;
			return {
				...next,
				...errorsToApply
			};
		});
		return Object.keys(errorsToApply).length === 0;
	};
	const validateFields = (fields) => {
		const parsed = schema.safeParse(values);
		if (parsed.success) {
			setErrors((current) => {
				const next = { ...current };
				for (const field of fields) next[field] = void 0;
				return next;
			});
			return true;
		}
		const stepErrors = {};
		for (const issue of parsed.error.issues) {
			const field = issue.path[0];
			if (fields.includes(field) && !stepErrors[field]) stepErrors[field] = issue.message;
		}
		setErrors((current) => ({
			...current,
			...stepErrors
		}));
		return Object.keys(stepErrors).length === 0;
	};
	const nextStep = () => {
		if (step === 2) {
			if (!validateSelectedMembers()) return;
			if (!validateFields(STEPS[step].fields)) return;
		} else if (!validateFields(STEPS[step].fields)) return;
		setStep((current) => Math.min(current + 1, STEPS.length - 1));
	};
	const prevStep = () => {
		setStep((current) => Math.max(current - 1, 0));
	};
	const buildPayload = () => ({
		teamName: values.teamName.trim(),
		collegeName: values.collegeName.trim(),
		track: values.track,
		teamSize: Number(values.teamSize),
		ideaPitch: values.ideaPitch.trim(),
		leader: {
			name: values.leaderName.trim(),
			email: values.leaderEmail.trim().toLowerCase(),
			phone: values.leaderPhone.trim(),
			branch: values.leaderBranch.trim(),
			year: values.leaderYear.trim(),
			gender: values.leaderGender
		},
		members: memberKeys.slice(0, memberCount).map((member) => ({
			name: values[member.nameKey].trim(),
			email: values[member.emailKey].trim().toLowerCase(),
			branch: values[member.branchKey].trim(),
			year: values[member.yearKey].trim(),
			gender: values[member.genderKey]
		}))
	});
	const onSubmit = async (e) => {
		e.preventDefault();
		if (step !== STEPS.length - 1) return;
		if (!submitArmed) return;
		setSubmitArmed(false);
		setServerMessage(null);
		if (!validateSelectedMembers()) {
			setStep(2);
			return;
		}
		const parsed = schema.safeParse(values);
		if (!parsed.success) {
			const fieldErrors = {};
			for (const issue of parsed.error.issues) {
				const key = issue.path[0];
				if (!fieldErrors[key]) fieldErrors[key] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}
		setStatus("submitting");
		try {
			const response = await registerTeam(buildPayload());
			setStatus("success");
			setServerMessage(`Team ${response.team.teamName} registered successfully.`);
		} catch (requestError) {
			setStatus("error");
			setServerMessage(requestError instanceof Error ? requestError.message : "Registration failed");
		}
	};
	const reset = () => {
		setValues(initial);
		setErrors({});
		setStatus("idle");
		setStep(0);
		setSubmitArmed(false);
		setServerMessage(null);
	};
	const current = STEPS[step];
	return /* @__PURE__ */ jsxs("section", {
		id: "register",
		className: "relative border-t border-border/40 py-20 sm:py-24",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-grid opacity-30" }), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-10 text-center",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-[0.3em] text-primary",
						children: "[ REGISTER_04 ]"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
						children: "Lock in your orbit slot"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base",
						children: "Submissions open until 27 July. Spin up your team, pick a track, drop your idea."
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-4 shadow-glow backdrop-blur sm:p-10",
				children: status === "success" ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center py-10 text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40",
							children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8 text-primary" })
						}),
						/* @__PURE__ */ jsxs("h3", {
							className: "mt-5 font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl",
							children: [
								"You're in orbit, ",
								values.teamName,
								"!"
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 max-w-md text-sm text-muted-foreground",
							children: /* @__PURE__ */ jsx("span", {
								className: "font-mono text-primary",
								children: serverMessage
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							onClick: reset,
							variant: "outline",
							className: "mt-6 font-mono text-xs uppercase tracking-wider",
							children: "Register another team"
						})
					]
				}) : /* @__PURE__ */ jsxs("form", {
					onSubmit,
					noValidate: true,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-border/60 bg-background/30 px-4 py-3",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "font-mono text-xs uppercase tracking-[0.2em] text-primary",
									children: [
										"Step ",
										step + 1,
										" of ",
										STEPS.length
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 font-mono text-[11px] text-muted-foreground",
									children: "-----------------"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "mt-2 font-mono text-lg font-bold text-foreground",
									children: current.title
								})
							]
						}),
						serverMessage && status === "error" && /* @__PURE__ */ jsx("div", {
							className: "rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive",
							children: serverMessage
						}),
						step === 0 && /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2 sm:gap-5",
							children: [
								/* @__PURE__ */ jsx(Field, {
									label: "Team name",
									error: errors.teamName,
									className: "sm:col-span-1",
									children: /* @__PURE__ */ jsx(Input, {
										value: values.teamName,
										onChange: (e) => update("teamName", e.target.value),
										placeholder: "Orbital Foxes",
										maxLength: 60,
										"aria-invalid": !!errors.teamName
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Team size",
									error: errors.teamSize,
									className: "sm:col-span-1",
									children: /* @__PURE__ */ jsxs(Select, {
										value: values.teamSize,
										onValueChange: (v) => update("teamSize", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											"aria-invalid": !!errors.teamSize,
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select size" })
										}), /* @__PURE__ */ jsxs(SelectContent, { children: [
											/* @__PURE__ */ jsx(SelectItem, {
												value: "1",
												children: "Solo"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "2",
												children: "2 members"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "3",
												children: "3 members"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "4",
												children: "4 members"
											})
										] })]
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Track",
									error: errors.track,
									className: "sm:col-span-2",
									children: /* @__PURE__ */ jsxs(Select, {
										value: values.track,
										onValueChange: (v) => update("track", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											"aria-invalid": !!errors.track,
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose your track" })
										}), /* @__PURE__ */ jsxs(SelectContent, { children: [
											/* @__PURE__ */ jsx(SelectItem, {
												value: "ai",
												children: "AI & Agents"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "web3",
												children: "Web3 & Infra"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "climate",
												children: "Climate Tech"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "open",
												children: "Open Innovation"
											})
										] })]
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "College",
									error: errors.collegeName,
									className: "sm:col-span-2",
									children: /* @__PURE__ */ jsx(Input, {
										value: values.collegeName,
										onChange: (e) => update("collegeName", e.target.value),
										placeholder: "Your college or university",
										maxLength: 120,
										"aria-invalid": !!errors.collegeName
									})
								})
							]
						}),
						step === 1 && /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2 sm:gap-5",
							children: [
								/* @__PURE__ */ jsx(Field, {
									label: "Leader name",
									error: errors.leaderName,
									className: "sm:col-span-1",
									children: /* @__PURE__ */ jsx(Input, {
										value: values.leaderName,
										onChange: (e) => update("leaderName", e.target.value),
										placeholder: "Ada Lovelace",
										maxLength: 80,
										"aria-invalid": !!errors.leaderName
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Leader email",
									error: errors.leaderEmail,
									className: "sm:col-span-1",
									children: /* @__PURE__ */ jsx(Input, {
										type: "email",
										value: values.leaderEmail,
										onChange: (e) => update("leaderEmail", e.target.value),
										placeholder: "you@domain.com",
										maxLength: 255,
										"aria-invalid": !!errors.leaderEmail
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Leader phone",
									error: errors.leaderPhone,
									className: "sm:col-span-1",
									children: /* @__PURE__ */ jsx(Input, {
										value: values.leaderPhone,
										onChange: (e) => update("leaderPhone", e.target.value),
										placeholder: "+919876543210",
										maxLength: 16,
										"aria-invalid": !!errors.leaderPhone
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Leader branch",
									error: errors.leaderBranch,
									className: "sm:col-span-1",
									children: /* @__PURE__ */ jsx(Input, {
										value: values.leaderBranch,
										onChange: (e) => update("leaderBranch", e.target.value),
										placeholder: "Computer Science",
										maxLength: 80,
										"aria-invalid": !!errors.leaderBranch
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Leader year",
									error: errors.leaderYear,
									className: "sm:col-span-1",
									children: /* @__PURE__ */ jsx(Input, {
										value: values.leaderYear,
										onChange: (e) => update("leaderYear", e.target.value),
										placeholder: "3",
										maxLength: 20,
										"aria-invalid": !!errors.leaderYear
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Leader gender",
									error: errors.leaderGender,
									className: "sm:col-span-1",
									children: /* @__PURE__ */ jsxs(Select, {
										value: values.leaderGender,
										onValueChange: (v) => update("leaderGender", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											"aria-invalid": !!errors.leaderGender,
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select gender" })
										}), /* @__PURE__ */ jsx(SelectContent, { children: GENDER_OPTIONS.map((option) => /* @__PURE__ */ jsx(SelectItem, {
											value: option.value,
											children: option.label
										}, option.value)) })]
									})
								})
							]
						}),
						step === 2 && /* @__PURE__ */ jsxs("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary",
									children: [
										"Leader counts as member 1. Add the remaining ",
										memberCount,
										" member",
										memberCount === 1 ? "" : "s",
										" below."
									]
								}),
								memberCount === 0 && /* @__PURE__ */ jsx("div", {
									className: "rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-muted-foreground",
									children: "Solo teams skip this step. Add your idea pitch below."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-4 sm:grid-cols-2 sm:gap-5",
									children: [memberKeys.slice(0, memberCount).map((member) => /* @__PURE__ */ jsxs("div", {
										className: "contents",
										children: [
											/* @__PURE__ */ jsx(Field, {
												label: `Member ${member.number} name`,
												error: errors[member.nameKey],
												className: "sm:col-span-1",
												children: /* @__PURE__ */ jsx(Input, {
													value: values[member.nameKey],
													onChange: (e) => update(member.nameKey, e.target.value),
													placeholder: `Member ${member.number} full name`,
													maxLength: 80,
													"aria-invalid": !!errors[member.nameKey]
												})
											}),
											/* @__PURE__ */ jsx(Field, {
												label: `Member ${member.number} email`,
												error: errors[member.emailKey],
												className: "sm:col-span-1",
												children: /* @__PURE__ */ jsx(Input, {
													type: "email",
													value: values[member.emailKey],
													onChange: (e) => update(member.emailKey, e.target.value),
													placeholder: `member${member.number}@domain.com`,
													maxLength: 255,
													"aria-invalid": !!errors[member.emailKey]
												})
											}),
											/* @__PURE__ */ jsx(Field, {
												label: `Member ${member.number} branch`,
												error: errors[member.branchKey],
												className: "sm:col-span-1",
												children: /* @__PURE__ */ jsx(Input, {
													value: values[member.branchKey],
													onChange: (e) => update(member.branchKey, e.target.value),
													placeholder: "Computer Science",
													maxLength: 80,
													"aria-invalid": !!errors[member.branchKey]
												})
											}),
											/* @__PURE__ */ jsx(Field, {
												label: `Member ${member.number} year`,
												error: errors[member.yearKey],
												className: "sm:col-span-1",
												children: /* @__PURE__ */ jsx(Input, {
													value: values[member.yearKey],
													onChange: (e) => update(member.yearKey, e.target.value),
													placeholder: "3",
													maxLength: 20,
													"aria-invalid": !!errors[member.yearKey]
												})
											}),
											/* @__PURE__ */ jsx(Field, {
												label: `Member ${member.number} gender`,
												error: errors[member.genderKey],
												className: "sm:col-span-2",
												children: /* @__PURE__ */ jsxs(Select, {
													value: values[member.genderKey],
													onValueChange: (v) => update(member.genderKey, v),
													children: [/* @__PURE__ */ jsx(SelectTrigger, {
														"aria-invalid": !!errors[member.genderKey],
														children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select gender" })
													}), /* @__PURE__ */ jsx(SelectContent, { children: GENDER_OPTIONS.map((option) => /* @__PURE__ */ jsx(SelectItem, {
														value: option.value,
														children: option.label
													}, option.value)) })]
												})
											})
										]
									}, `member-${member.number}`)), /* @__PURE__ */ jsx(Field, {
										label: "Idea pitch",
										error: errors.ideaPitch,
										hint: `${values.ideaPitch.length}/1000`,
										className: "sm:col-span-2",
										children: /* @__PURE__ */ jsx(Textarea, {
											value: values.ideaPitch,
											onChange: (e) => update("ideaPitch", e.target.value),
											placeholder: "In a sentence or two - what are you building?",
											rows: 5,
											maxLength: 1e3,
											"aria-invalid": !!errors.ideaPitch
										})
									})]
								})
							]
						}),
						step === 3 && /* @__PURE__ */ jsxs("div", {
							className: "space-y-4 rounded-xl border border-border/60 bg-background/30 p-4",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: "Review details before submit"
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 text-sm sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Team Name",
										value: values.teamName
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Team Size",
										value: values.teamSize
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Track",
										value: trackLabel(values.track)
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "College",
										value: values.collegeName
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Leader",
										value: values.leaderName
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Leader Email",
										value: values.leaderEmail
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Leader Phone",
										value: values.leaderPhone
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Leader Branch",
										value: values.leaderBranch
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Leader Year",
										value: values.leaderYear
									}),
									/* @__PURE__ */ jsx(ReviewItem, {
										label: "Leader Gender",
										value: genderLabel(values.leaderGender)
									}),
									memberKeys.slice(0, memberCount).map((member) => /* @__PURE__ */ jsx(ReviewItem, {
										label: `Member ${member.number}`,
										value: `${values[member.nameKey]} · ${values[member.emailKey]} · ${values[member.branchKey]} · ${values[member.yearKey]} · ${genderLabel(values[member.genderKey])}`
									}, `review-${member.number}`)),
									/* @__PURE__ */ jsx("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ jsx(ReviewItem, {
											label: "Idea",
											value: values.ideaPitch
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:justify-between",
							children: [step > 0 ? /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								onClick: prevStep,
								className: "w-full font-mono text-xs uppercase tracking-wider sm:w-auto",
								children: "Back"
							}) : /* @__PURE__ */ jsx("div", { className: "hidden sm:block" }), step < STEPS.length - 1 ? /* @__PURE__ */ jsx(Button, {
								type: "button",
								onClick: nextStep,
								className: "w-full font-mono text-xs uppercase tracking-wider shadow-glow sm:w-auto",
								children: "Next"
							}) : /* @__PURE__ */ jsx(Button, {
								type: "submit",
								onClick: () => setSubmitArmed(true),
								disabled: status === "submitting",
								className: "w-full font-mono text-xs uppercase tracking-wider shadow-glow sm:w-auto",
								children: status === "submitting" ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Launching..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Rocket, { className: "h-4 w-4" }), " Submit registration"] })
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "By registering you agree to the NexTerra Orbit code of conduct."
						})
					]
				})
			})]
		})]
	});
}
function ReviewItem({ label, value }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
		className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ jsx("p", {
		className: "mt-1 wrap-break-word text-foreground",
		children: value || "-"
	})] });
}
function trackLabel(track) {
	if (track === "ai") return "AI & Agents";
	if (track === "web3") return "Web3 & Infra";
	if (track === "climate") return "Climate Tech";
	if (track === "open") return "Open Innovation";
	return "-";
}
function genderLabel(gender) {
	if (gender === "male") return "Male";
	if (gender === "female") return "Female";
	if (gender === "other") return "Other";
	if (gender === "prefer_not_to_say") return "Prefer not to say";
	return "-";
}
function Field({ label, error, hint, className, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-1.5 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx(Label, {
					className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
					children: label
				}), hint && /* @__PURE__ */ jsx("span", {
					className: "font-mono text-[10px] text-muted-foreground",
					children: hint
				})]
			}),
			children,
			error && /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 font-mono text-[11px] text-destructive",
				children: error
			})
		]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Index() {
	return /* @__PURE__ */ jsxs("main", {
		className: "min-h-screen overflow-x-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx(Hero, {}),
			/* @__PURE__ */ jsx(Timeline, {}),
			/* @__PURE__ */ jsx(Results, {}),
			/* @__PURE__ */ jsx(Registration, {}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { Index as component };
