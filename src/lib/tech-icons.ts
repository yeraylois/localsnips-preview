/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : tech-icons.ts                                  *
 *   Purpose : TECHNOLOGY ICONS DATABASE & LOOKUP UTILITIES   *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

/**
 * MAPS TECHNOLOGY NAMES TO SIMPLE ICONS SLUGS AND BRAND COLORS.
 * ORGANIZED BY CATEGORY: LANGUAGES, DEVOPS, OS, DATABASES, ETC.
 */
export const TECH_ICONS: Record<string, { slug: string; color: string }> = {
  // =====================
  // LANGUAGES
  // =====================
  "python": { slug: "python", color: "#3776AB" },
  "javascript": { slug: "javascript", color: "#F7DF1E" },
  "typescript": { slug: "typescript", color: "#3178C6" },
  "java": { slug: "openjdk", color: "#E01F3B" }, // JAVA ICON OFTEN REMOVED, USE OPENJDK
  "go": { slug: "go", color: "#00ADD8" },
  "golang": { slug: "go", color: "#00ADD8" },
  "rust": { slug: "rust", color: "#000000" },
  "c": { slug: "c", color: "#A8B9CC" },
  "cpp": { slug: "cplusplus", color: "#00599C" },
  "c++": { slug: "cplusplus", color: "#00599C" },
  "csharp": { slug: "csharp", color: "#239120" },
  "c#": { slug: "csharp", color: "#239120" },
  "swift": { slug: "swift", color: "#F05138" },
  "kotlin": { slug: "kotlin", color: "#7F52FF" },
  "ruby": { slug: "ruby", color: "#CC342D" },
  "php": { slug: "php", color: "#777BB4" },
  "perl": { slug: "perl", color: "#39457E" },
  "scala": { slug: "scala", color: "#DC322F" },
  "haskell": { slug: "haskell", color: "#5D4F85" },
  "elixir": { slug: "elixir", color: "#4B275F" },
  "lua": { slug: "lua", color: "#2C2D72" },
  "r": { slug: "r", color: "#276DC3" },
  "julia": { slug: "julia", color: "#9558B2" },
  "dart": { slug: "dart", color: "#0175C2" },
  "zig": { slug: "zig", color: "#F7A41D" },
  
  // =====================
  // DEVOPS & INFRASTRUCTURE
  // =====================
  "docker": { slug: "docker", color: "#2496ED" },
  "kubernetes": { slug: "kubernetes", color: "#326CE5" },
  "k8s": { slug: "kubernetes", color: "#326CE5" },
  "ansible": { slug: "ansible", color: "#EE0000" },
  "terraform": { slug: "terraform", color: "#7B42BC" },
  "vagrant": { slug: "vagrant", color: "#1868F2" },
  "puppet": { slug: "puppet", color: "#FFAE1A" },
  "chef": { slug: "chef", color: "#F09820" },
  "jenkins": { slug: "jenkins", color: "#D24939" },
  "gitlab": { slug: "gitlab", color: "#FC6D26" },
  "github": { slug: "github", color: "#6e5494" },
  "circleci": { slug: "circleci", color: "#161616" },
  "argocd": { slug: "argo", color: "#EF7B4D" },
  "helm": { slug: "helm", color: "#0F1689" },
  "prometheus": { slug: "prometheus", color: "#E6522C" },
  "grafana": { slug: "grafana", color: "#F46800" },
  "traefik": { slug: "traefikproxy", color: "#24A1C1" },
  "consul": { slug: "consul", color: "#F24C53" },
  "istio": { slug: "istio", color: "#466BB0" },
  
  // =====================
  // OPERATING SYSTEMS
  // =====================
  "linux": { slug: "linux", color: "#FCC624" },
  "ubuntu": { slug: "ubuntu", color: "#E95420" },
  "debian": { slug: "debian", color: "#A81D33" },
  "centos": { slug: "centos", color: "#262577" },
  "redhat": { slug: "redhat", color: "#EE0000" },
  "fedora": { slug: "fedora", color: "#51A2DA" },
  "arch": { slug: "archlinux", color: "#1793D1" },
  "alpine": { slug: "alpinelinux", color: "#0D597F" },
  "macos": { slug: "macos", color: "#000000" },
  "windows": { slug: "windows", color: "#0078D4" },
  
  // =====================
  // DATABASES
  // =====================
  "postgresql": { slug: "postgresql", color: "#4169E1" },
  "postgres": { slug: "postgresql", color: "#4169E1" },
  "mysql": { slug: "mysql", color: "#4479A1" },
  "mariadb": { slug: "mariadb", color: "#003545" },
  "mongodb": { slug: "mongodb", color: "#47A248" },
  "redis": { slug: "redis", color: "#DC382D" },
  "elasticsearch": { slug: "elasticsearch", color: "#005571" },
  "sqlite": { slug: "sqlite", color: "#003B57" },
  "cassandra": { slug: "apachecassandra", color: "#1287B1" },
  "neo4j": { slug: "neo4j", color: "#008CC1" },
  "dynamodb": { slug: "amazondynamodb", color: "#4053D6" },
  
  // =====================
  // CLOUD PROVIDERS
  // =====================
  "aws": { slug: "amazonaws", color: "#FF9900" },
  "amazon": { slug: "amazonaws", color: "#FF9900" },
  "gcp": { slug: "googlecloud", color: "#4285F4" },
  "google cloud": { slug: "googlecloud", color: "#4285F4" },
  "azure": { slug: "microsoft", color: "#0078D4" },
  "digitalocean": { slug: "digitalocean", color: "#0080FF" },
  "heroku": { slug: "heroku", color: "#430098" },
  "vercel": { slug: "vercel", color: "#5c5c5c" },
  "netlify": { slug: "netlify", color: "#00C7B7" },
  "cloudflare": { slug: "cloudflare", color: "#F38020" },
  "linode": { slug: "linode", color: "#00A95C" },
  "ovh": { slug: "ovh", color: "#123F6D" },
  
  // =====================
  // WEB FRAMEWORKS (FRONTEND)
  // =====================
  "react": { slug: "react", color: "#61DAFB" },
  "vue": { slug: "vuedotjs", color: "#4FC08D" },
  "vuejs": { slug: "vuedotjs", color: "#4FC08D" },
  "angular": { slug: "angular", color: "#DD0031" },
  "svelte": { slug: "svelte", color: "#FF3E00" },
  "nextjs": { slug: "nextdotjs", color: "#000000" },
  "next": { slug: "nextdotjs", color: "#000000" },
  "nuxt": { slug: "nuxt", color: "#00DC82" },
  "gatsby": { slug: "gatsby", color: "#663399" },
  "astro": { slug: "astro", color: "#FF5D01" },
  "tailwind": { slug: "tailwindcss", color: "#06B6D4" },
  "tailwindcss": { slug: "tailwindcss", color: "#06B6D4" },
  "bootstrap": { slug: "bootstrap", color: "#7952B3" },
  "sass": { slug: "sass", color: "#CC6699" },
  "less": { slug: "less", color: "#1D365D" },
  "webpack": { slug: "webpack", color: "#8DD6F9" },
  "vite": { slug: "vite", color: "#646CFF" },
  "rollup": { slug: "rollupdotjs", color: "#EC4A3F" },
  "esbuild": { slug: "esbuild", color: "#FFCF00" },
  
  // =====================
  // WEB FRAMEWORKS (BACKEND)
  // =====================
  "django": { slug: "django", color: "#092E20" },
  "flask": { slug: "flask", color: "#000000" },
  "fastapi": { slug: "fastapi", color: "#009688" },
  "express": { slug: "express", color: "#000000" },
  "nodejs": { slug: "nodedotjs", color: "#339933" },
  "node": { slug: "nodedotjs", color: "#339933" },
  "rails": { slug: "rubyonrails", color: "#CC0000" },
  "spring": { slug: "spring", color: "#6DB33F" },
  "laravel": { slug: "laravel", color: "#FF2D20" },
  "dotnet": { slug: "dotnet", color: "#512BD4" },
  ".net": { slug: "dotnet", color: "#512BD4" },
  
  // =====================
  // MOBILE
  // =====================
  "ios": { slug: "ios", color: "#000000" },
  "android": { slug: "android", color: "#3DDC84" },
  "flutter": { slug: "flutter", color: "#02569B" },
  "reactnative": { slug: "react", color: "#61DAFB" },
  "swiftui": { slug: "swift", color: "#F05138" },
  
  // =====================
  // TOOLS & UTILITIES
  // =====================
  "git": { slug: "git", color: "#F05032" },
  "vim": { slug: "vim", color: "#019733" },
  "neovim": { slug: "neovim", color: "#57A143" },
  "vscode": { slug: "visual-studio-code", color: "#007ACC" },
  "ssh": { slug: "gnubash", color: "#4EAA25" },
  "bash": { slug: "gnubash", color: "#4EAA25" },
  "zsh": { slug: "zsh", color: "#F15A24" },
  "tmux": { slug: "tmux", color: "#1BB91F" },
  "nginx": { slug: "nginx", color: "#009639" },
  "apache": { slug: "apache", color: "#D22128" },
  "caddy": { slug: "caddy", color: "#1F88C0" },
  "intellij": { slug: "intellijidea", color: "#000000" },
  "webstorm": { slug: "webstorm", color: "#00CDD7" },
  "pycharm": { slug: "pycharm", color: "#21D789" },
  "sublime": { slug: "sublimetext", color: "#FF9800" },
  "atom": { slug: "atom", color: "#66595C" },
  "emacs": { slug: "gnuemacs", color: "#7F5AB6" },
  "postman": { slug: "postman", color: "#FF6C37" },
  "insomnia": { slug: "insomnia", color: "#4000BF" },
  
  // =====================
  // DATA & ML
  // =====================
  "numpy": { slug: "numpy", color: "#013243" },
  "pandas": { slug: "pandas", color: "#150458" },
  "tensorflow": { slug: "tensorflow", color: "#FF6F00" },
  "pytorch": { slug: "pytorch", color: "#EE4C2C" },
  "jupyter": { slug: "jupyter", color: "#F37626" },
  "spark": { slug: "apachespark", color: "#E25A1C" },
  "kafka": { slug: "apachekafka", color: "#231F20" },
  "airflow": { slug: "apacheairflow", color: "#017CEE" },
  
  // =====================
  // APIs & PROTOCOLS
  // =====================
  "graphql": { slug: "graphql", color: "#E10098" },
  "rest": { slug: "openapiinitiative", color: "#6BA539" },
  "grpc": { slug: "grpc", color: "#244C5A" },
  "websocket": { slug: "socketdotio", color: "#010101" },
  "oauth": { slug: "oauth", color: "#000000" },
  
  // =====================
  // SECURITY
  // =====================
  "ssl": { slug: "letsencrypt", color: "#003A70" },
  "tls": { slug: "letsencrypt", color: "#003A70" },
  "vault": { slug: "vault", color: "#FFEC6E" },
  "keycloak": { slug: "keycloak", color: "#4D4D4D" },
  
  // =====================
  // MESSAGING & QUEUES
  // =====================
  "rabbitmq": { slug: "rabbitmq", color: "#FF6600" },
  "nats": { slug: "nats.io", color: "#27AAE1" },
  "zeromq": { slug: "zeromq", color: "#DF0000" },
  
  // =====================
  // TESTING
  // =====================
  "jest": { slug: "jest", color: "#C21325" },
  "cypress": { slug: "cypress", color: "#17202C" },
  "selenium": { slug: "selenium", color: "#43B02A" },
  "playwright": { slug: "testinglibrary", color: "#2EAD33" },
  "mocha": { slug: "mocha", color: "#8D6748" },
  "pytest": { slug: "pytest", color: "#0A9EDC" },
  
  // =====================
  // MISC
  // =====================
  "openai": { slug: "openai", color: "#412991" },
  "chatgpt": { slug: "openai", color: "#74AA9C" },
  "supabase": { slug: "supabase", color: "#3FCF8E" },
  "firebase": { slug: "firebase", color: "#FFCA28" },
  "stripe": { slug: "stripe", color: "#635BFF" },
  "twilio": { slug: "twilio", color: "#F22F46" },
  "slack": { slug: "slack", color: "#4A154B" },
  "discord": { slug: "discord", color: "#5865F2" },
  "figma": { slug: "figma", color: "#F24E1E" },
  "notion": { slug: "notion", color: "#fff" },
  "markdown": { slug: "markdown", color: "#fff" },
  "yaml": { slug: "yaml", color: "#CB171E" },
  "json": { slug: "json", color: "#fff" },
};

// FALLBACK ICON CATEGORIES FOR UNKNOWN TECHNOLOGIES
export const FALLBACK_ICONS = [
  { slug: "code", label: "Code" },
  { slug: "file", label: "File" },
  { slug: "folder", label: "Folder" },
  { slug: "terminal", label: "Terminal" },
];

/**
 * BUILDS CDN URL FOR SIMPLE ICONS WITH OPTIONAL BRAND COLOR.
 * @param slug SIMPLE ICONS SLUG NAME
 * @param color OPTIONAL HEX COLOR (WITH OR WITHOUT #)
 * @returns CDN URL STRING FOR THE ICON
 */
export const getTechIconUrl = (slug: string, color?: string) => {
  // SIMPLE ICONS CDN WITH OPTIONAL COLOR
  if (color) {
    const hex = color.replace('#', '');
    return `https://cdn.simpleicons.org/${slug}/${hex}`;
  }
  return `https://cdn.simpleicons.org/${slug}`;
};

/**
 * DETECTS TECHNOLOGY FROM COLLECTION PATH OR TAGS.
 * SEARCHES FOR EXACT AND PARTIAL MATCHES IN TECH_ICONS DATABASE.
 * @param collection COLLECTION PATH (E.G., "LANGUAGES/PYTHON")
 * @param tags ARRAY OF TAGS TO SEARCH
 * @returns TECHNOLOGY INFO WITH NAME, SLUG, AND COLOR, OR NULL
 */
export const detectTechnology = (
  collection?: string | null,
  tags?: string[] | null
): { name: string; slug: string; color: string } | null => {
  if (!collection && (!tags || tags.length === 0)) return null;
  
  const searchTerms: string[] = [];
  
  // ADD COLLECTION PARTS
  if (collection) {
    collection.split('/').forEach(part => {
      searchTerms.push(part.toLowerCase().trim());
    });
  }
  
  // ADD TAGS
  if (tags) {
    tags.forEach(tag => {
      searchTerms.push(tag.toLowerCase().trim());
    });
  }
  
  // SEARCH FOR MATCHING TECHNOLOGY
  for (const term of searchTerms) {
    // EXACT MATCH FIRST
    if (TECH_ICONS[term]) {
      return { name: term, ...TECH_ICONS[term] };
    }
    
    // PARTIAL MATCH
    for (const [tech, data] of Object.entries(TECH_ICONS)) {
      if (term.includes(tech) || tech.includes(term)) {
        return { name: tech, ...data };
      }
    }
  }
  
  return null;
};
