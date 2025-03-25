// Background options for the app
export const solidBackgrounds = [
  { id: "emerald", name: "Emerald", color: "#10b981" },
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "purple", name: "Purple", color: "#8b5cf6" },
  { id: "amber", name: "Amber", color: "#f59e0b" },
  { id: "rose", name: "Rose", color: "#f43f5e" },
  { id: "slate", name: "Slate", color: "#64748b" },
];

export const gradientBackgrounds = [
  {
    id: "emerald-gradient",
    name: "Emerald Gradient",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  {
    id: "blue-gradient",
    name: "Ocean Blue",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
  {
    id: "purple-gradient",
    name: "Royal Purple",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  },
  {
    id: "night",
    name: "Night Sky",
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
];

export const patternBackgrounds = [
  {
    id: "dots",
    name: "Dots Pattern",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    baseColor: "#f8fafc",
  },
  {
    id: "islamic",
    name: "Islamic Pattern",
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    baseColor: "#f8fafc",
  },
  {
    id: "arabesque",
    name: "Arabesque",
    pattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
    baseColor: "#f8fafc",
  },
];

export type BackgroundOption =
  | { type: "solid"; id: string; name: string; color: string }
  | { type: "gradient"; id: string; name: string; gradient: string }
  | {
      type: "pattern";
      id: string;
      name: string;
      pattern: string;
      baseColor: string;
    };

export const getAllBackgrounds = (): BackgroundOption[] => {
  const solid = solidBackgrounds.map((bg) => ({
    type: "solid" as const,
    ...bg,
  }));
  const gradient = gradientBackgrounds.map((bg) => ({
    type: "gradient" as const,
    ...bg,
  }));
  const pattern = patternBackgrounds.map((bg) => ({
    type: "pattern" as const,
    ...bg,
  }));

  return [...solid, ...gradient, ...pattern];
};
