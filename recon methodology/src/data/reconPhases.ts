export interface ReconCommand {
  description: string;
  command: string;
}

export interface ReconPhase {
  id: number;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  commands: ReconCommand[];
  tips: string[];
}

export const reconPhases: ReconPhase[] = [
  {
    id: 1,
    title: "Start with DNS",
    shortTitle: "DNS",
    icon: "🌐",
    description: "Dump DNS records and WHOIS data. Learn about infrastructure before touching anything.",
    commands: [
      { description: "Dump all DNS records", command: "dig {target} any" },
      { description: "Get A record (IP)", command: "dig {target} A" },
      { description: "Mail servers", command: "dig {target} MX" },
      { description: "WHOIS lookup", command: "whois {target}" },
    ],
    tips: [
      "Check for Cloudflare/CDN — real IP might be hidden",
      "TXT records reveal email providers (Google, O365)",
      "NS records show hosting infrastructure",
    ],
  },
  {
    id: 2,
    title: "Go Back in Time",
    shortTitle: "Wayback",
    icon: "⏪",
    description: "Wayback Machine remembers everything. Find old endpoints, forgotten files, and deleted pages.",
    commands: [
      { description: "Dump all archived URLs", command: 'echo "{target}" | waybackurls' },
      { description: "Filter interesting files", command: 'echo "{target}" | waybackurls | grep -E "\\.(php|sql|bak|zip|env|log)$"' },
      { description: "Find old parameters", command: 'echo "{target}" | waybackurls | grep "?" | sort -u' },
    ],
    tips: [
      "Old robots.txt often lists paths they didn't want indexed",
      "Look for old API versions like /api/v1/ that might still be live",
      "Backup files (.bak, .zip, .sql) are goldmines",
    ],
  },
  {
    id: 3,
    title: "Subdomain Enumeration",
    shortTitle: "Subdomains",
    icon: "🔍",
    description: "The main target is usually hardened. The interesting stuff lives on subdomains.",
    commands: [
      { description: "Sublist3r", command: "python sublist3r.py -d {target} -o sub1.txt" },
      { description: "Assetfinder", command: "assetfinder --subs-only {target} > sub2.txt" },
      { description: "Merge & deduplicate", command: "cat sub1.txt sub2.txt | sort -u > all_subs.txt" },
    ],
    tips: [
      "dev/staging/old subdomains often have less security",
      "Check crt.sh for SSL cert transparency logs",
      "Use DNSDumpster for visual DNS maps",
    ],
  },
  {
    id: 4,
    title: "Dig Deeper — Sub-subdomains",
    shortTitle: "Deep Subs",
    icon: "🕳️",
    description: "Look for subdomains of subdomains. Found v2.dev.api.target.com with no auth once.",
    commands: [
      { description: "Generate permutations", command: "./altdns.py -i all_subs.txt -o permutations.txt -w words.txt -r -s resolved.txt" },
      { description: "Resolve the list", command: "cat permutations.txt | dnsx -a -resp" },
      { description: "Fuzz directories", command: "ffuf -u https://{target}/FUZZ -w /usr/share/wordlists/dirb/common.txt -fc 404" },
    ],
    tips: [
      "Use wordlist: dev, staging, test, prod, api, admin, internal, old, v1, v2, beta",
      "Deeper subdomains often have zero security",
    ],
  },
  {
    id: 5,
    title: "Check What's Alive",
    shortTitle: "Live Check",
    icon: "💚",
    description: "Don't waste time on dead subdomains. Filter first, then screenshot everything.",
    commands: [
      { description: "Check status codes & titles", command: "cat all_subs.txt | httpx -status-code -title -server" },
      { description: "Screenshot all live hosts", command: "./EyeWitness.py -f live_subs.txt --web --timeout 10" },
      { description: "Check subdomain takeover", command: "subzy run --targets all_subs.txt --hide-fails" },
    ],
    tips: [
      "Old server versions (Apache 2.2, nginx 1.14) = tons of CVEs",
      "401/403 responses are still worth investigating",
      "Subdomain takeover = free bounty",
    ],
  },
  {
    id: 6,
    title: "Find the IP Range",
    shortTitle: "IP Range",
    icon: "📡",
    description: "Find the company's full IP range to discover servers with no domain pointing to them.",
    commands: [
      { description: "WHOIS on known IP", command: "whois 93.184.216.34" },
      { description: "Shodan org search", command: 'shodan search org:"Target Company" --fields ip_str,port,hostnames' },
      { description: "Scan for live hosts", command: "nmap -sn 192.0.2.0/24" },
      { description: "Service detection", command: "nmap -sV -p 80,443,8080,8443 192.0.2.0/24" },
    ],
    tips: [
      "Use bgp.he.net to find ASN and all IP ranges",
      "Shodan finds exposed databases (MongoDB, Elasticsearch)",
      "Hosts without domains are completely off the radar",
    ],
  },
  {
    id: 7,
    title: "GitHub is a Goldmine",
    shortTitle: "GitHub",
    icon: "🔑",
    description: "Developers commit .env files, API keys, internal URLs — git history keeps everything.",
    commands: [
      { description: "Search for passwords", command: 'GitHub: "{target}" password' },
      { description: "Search for secrets", command: 'GitHub: "{target}" secret' },
      { description: "Search for .env files", command: 'GitHub: filename:.env "{target}"' },
      { description: "TruffleHog scan", command: "truffleHog https://github.com/target/repo" },
      { description: "Gitleaks scan", command: "gitleaks detect --source /path/to/repo" },
    ],
    tips: [
      "Even deleted commits are searchable",
      "Look for AWS keys, DB passwords, API tokens",
      "Check employee personal repos too",
    ],
  },
  {
    id: 8,
    title: "Content Discovery",
    shortTitle: "Content",
    icon: "📂",
    description: "Looking for admin panels, backup files, hidden directories using Google dorks and brute force.",
    commands: [
      { description: "Find PHP files", command: "site:{target} filetype:php" },
      { description: "Find env files", command: "site:{target} filetype:env" },
      { description: "Find admin panels", command: "site:{target} inurl:admin" },
      { description: "Gobuster scan", command: "gobuster dir -u https://{target} -w /usr/share/wordlists/dirb/common.txt -x php,html,txt,bak,js" },
      { description: "Dirsearch", command: "python3 dirsearch.py -u https://{target} -e php,asp,html -r" },
    ],
    tips: [
      "Google dorks are free and leave no trace",
      "Look for directory listing: intext:\"index of /\"",
      "Check for .bak, .sql, .zip backup files",
    ],
  },
  {
    id: 9,
    title: "Hidden Parameters",
    shortTitle: "Params",
    icon: "🎯",
    description: "Find undocumented parameters. debug=true enables verbose errors. admin=1 might do more.",
    commands: [
      { description: "Brute force GET params", command: "python3 arjun.py -u https://{target}/search" },
      { description: "Brute force POST params", command: "python3 arjun.py -u https://{target}/login -m POST" },
      { description: "Harvest from Wayback", command: "python3 paramspider.py --domain {target} --output params.txt" },
    ],
    tips: [
      "debug and admin parameters are always worth checking",
      "Try ?debug=true, ?test=1, ?admin=1 on every endpoint",
      "ParamSpider finds params from historical data",
    ],
  },
  {
    id: 10,
    title: "Read the JavaScript",
    shortTitle: "JS Files",
    icon: "📜",
    description: "JS files contain internal API endpoints, hardcoded keys, and auth logic that scanners miss.",
    commands: [
      { description: "Extract endpoints from JS", command: "./linkfinder.py -i https://{target} -d -o cli" },
      { description: "Find secrets in JS", command: "python3 SecretFinder.py -i https://{target}/app.js -o cli" },
    ],
    tips: [
      "Look for const API_KEY, const TOKEN, internal URLs",
      "Webpack source maps sometimes expose full source code",
      "Use Burp Suite to spider and collect all JS files",
    ],
  },
  {
    id: 11,
    title: "Vulnerability Scanning",
    shortTitle: "Vuln Scan",
    icon: "⚡",
    description: "After manual recon, let the automated scanners run against everything you found.",
    commands: [
      { description: "Nuclei critical/high", command: "cat all_subs.txt | nuclei -severity critical,high -o findings.txt" },
      { description: "Nuclei with rate limit", command: "cat all_subs.txt | nuclei -rate-limit 10 -severity critical,high" },
      { description: "Nikto web scan", command: "nikto -h https://{target} -o nikto_results.html -Format html" },
    ],
    tips: [
      "Write custom Nuclei templates for logic issues",
      "Rate limit to avoid detection",
      "Run after all other recon for maximum coverage",
    ],
  },
  {
    id: 12,
    title: "S3 Buckets",
    shortTitle: "S3",
    icon: "🪣",
    description: "Companies store everything in S3. Misconfiguration is extremely common.",
    commands: [
      { description: "Check common bucket names", command: "curl https://{target}-backup.s3.amazonaws.com/" },
      { description: "List public bucket", command: "aws s3 ls s3://{target}-backup --no-sign-request" },
      { description: "Download public bucket", command: "aws s3 sync s3://{target}-backup . --no-sign-request" },
      { description: "Automated scan", command: "s3scanner scan --buckets-file bucket_names.txt" },
    ],
    tips: [
      "Try: target-backup, target-dev, target-prod, target-assets",
      "Google: site:s3.amazonaws.com \"target\"",
      "Even listing permissions leak sensitive info",
    ],
  },
  {
    id: 13,
    title: "SSL Certificates",
    shortTitle: "SSL/TLS",
    icon: "🔒",
    description: "Every SSL cert is logged publicly. Free subdomain discovery even for deleted domains.",
    commands: [
      { description: "Get all cert subdomains", command: "curl -s \"https://crt.sh/?q=%.{target}&output=json\" | jq -r '.[].name_value' | sed 's/\\*\\.//g' | sort -u" },
      { description: "TLS vulnerability check", command: "./testssl.sh https://{target}" },
      { description: "Heartbleed check", command: "./testssl.sh --heartbleed {target}" },
    ],
    tips: [
      "crt.sh finds subdomains even if deleted from DNS",
      "Wildcard certs reveal naming patterns",
      "Old TLS versions = exploitable",
    ],
  },
  {
    id: 14,
    title: "Find Emails & Employees",
    shortTitle: "OSINT",
    icon: "👥",
    description: "Useful for social engineering tests and figuring out who has access to what.",
    commands: [
      { description: "theHarvester", command: "theHarvester -d {target} -b google,linkedin,shodan -f results.html" },
      { description: "LinkedIn engineers", command: "site:linkedin.com \"Target Company\" \"engineer\"" },
      { description: "LinkedIn devops", command: "site:linkedin.com \"Target Company\" \"devops\"" },
    ],
    tips: [
      "hunter.io reveals email format (first.last@target.com)",
      "DevOps/infra people reveal tech stack on LinkedIn",
      "Email format + names = credential stuffing targets",
    ],
  },
  {
    id: 15,
    title: "Tech Fingerprinting",
    shortTitle: "Tech Stack",
    icon: "🔧",
    description: "Know the exact CMS, framework, and version → go straight to the CVE list.",
    commands: [
      { description: "Fingerprint tech", command: "whatweb -a 3 https://{target}" },
      { description: "WordPress scan", command: "wpscan --url https://{target} --enumerate u,p,t" },
      { description: "Check response headers", command: "curl -I https://{target}" },
    ],
    tips: [
      "Old Apache/PHP versions = tons of CVEs",
      "X-Powered-By header often reveals framework version",
      "Server header shows web server and version",
    ],
  },
];

export interface ReconTool {
  name: string;
  purpose: string;
  url: string;
}

export const reconTools: ReconTool[] = [
  { name: "Sublist3r", purpose: "Subdomain enum (OSINT)", url: "https://github.com/aboul3la/Sublist3r" },
  { name: "assetfinder", purpose: "Subdomain enum (fast)", url: "https://github.com/tomnomnom/assetfinder" },
  { name: "altdns", purpose: "Deep subdomain permutations", url: "https://github.com/infosec-au/altdns" },
  { name: "dnsx", purpose: "DNS resolution / filtering", url: "https://github.com/projectdiscovery/dnsx" },
  { name: "httpx", purpose: "Check what's alive", url: "https://github.com/projectdiscovery/httpx" },
  { name: "EyeWitness", purpose: "Screenshots of live hosts", url: "https://github.com/FortyNorthSecurity/EyeWitness" },
  { name: "ffuf", purpose: "Fuzzing (dirs + vhosts)", url: "https://github.com/ffuf/ffuf" },
  { name: "Gobuster", purpose: "Directory brute force", url: "https://github.com/OJ/gobuster" },
  { name: "Arjun", purpose: "Hidden parameter discovery", url: "https://github.com/s0md3v/Arjun" },
  { name: "LinkFinder", purpose: "Endpoints in JS files", url: "https://github.com/GerbenJavado/LinkFinder" },
  { name: "SecretFinder", purpose: "Secrets in JS files", url: "https://github.com/m4ll0k/SecretFinder" },
  { name: "Nuclei", purpose: "Vulnerability scanning", url: "https://github.com/projectdiscovery/nuclei" },
  { name: "Nikto", purpose: "Web server scanning", url: "https://github.com/sullo/nikto" },
  { name: "truffleHog", purpose: "Git secret scanning", url: "https://github.com/trufflesecurity/trufflehog" },
  { name: "gitleaks", purpose: "Git history scanning", url: "https://github.com/zricethezav/gitleaks" },
  { name: "theHarvester", purpose: "Email/employee OSINT", url: "https://github.com/laramies/theHarvester" },
  { name: "whatweb", purpose: "Tech fingerprinting", url: "https://github.com/urbanadventurer/WhatWeb" },
  { name: "WPScan", purpose: "WordPress scanning", url: "https://github.com/wpscanteam/wpscan" },
  { name: "testssl.sh", purpose: "TLS vulnerability check", url: "https://github.com/drwetter/testssl.sh" },
  { name: "S3Scanner", purpose: "S3 bucket discovery", url: "https://github.com/sa7mon/S3Scanner" },
];

export interface UsefulSite {
  name: string;
  url: string;
  purpose: string;
}

export const usefulSites: UsefulSite[] = [
  { name: "DNSDumpster", url: "https://dnsdumpster.com", purpose: "Visual DNS map" },
  { name: "crt.sh", url: "https://crt.sh", purpose: "SSL cert transparency → subdomains" },
  { name: "bgp.he.net", url: "https://bgp.he.net", purpose: "ASN lookup → IP ranges" },
  { name: "Censys", url: "https://censys.io", purpose: "Internet scanning / cert search" },
  { name: "Shodan", url: "https://www.shodan.io", purpose: "Exposed services, IoT, databases" },
  { name: "Hunter.io", url: "https://hunter.io", purpose: "Email patterns" },
  { name: "Wayback Machine", url: "https://web.archive.org", purpose: "Historical pages" },
  { name: "grep.app", url: "https://grep.app", purpose: "Search across GitHub" },
  { name: "LeakIX", url: "https://leakix.net", purpose: "Exposed services / data leaks" },
  { name: "VirusTotal", url: "https://www.virustotal.com", purpose: "Passive DNS" },
];
