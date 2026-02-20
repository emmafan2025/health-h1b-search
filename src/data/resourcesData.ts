export interface ResourceItem {
  id: string;
  category: "H-1B" | "Green Card" | "Employer Compliance";
  title_zh: string;
  desc_zh: string;
  title_en: string;
  desc_en: string;
  url: string;
  is_official: boolean;
}

export const resourceItems: ResourceItem[] = [
  {
    id: "res-uscis-h1b",
    category: "H-1B",
    title_zh: "USCIS：H-1B Specialty Occupations",
    desc_zh: "H-1B 的官方定义、适用岗位、基础要求与政策说明（移民局一手信息）。",
    title_en: "USCIS: H-1B Specialty Occupations",
    desc_en: "Official USCIS overview of H-1B specialty occupations, eligibility basics, and program guidance.",
    url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
    is_official: true,
  },
  {
    id: "res-uscis-h1b-cap",
    category: "H-1B",
    title_zh: "USCIS：H-1B Cap Season / 电子注册流程",
    desc_zh: "H-1B 抽签季官方页面：名额、注册流程、关键时间点与相关更新。",
    title_en: "USCIS: H-1B Cap Season / Electronic Registration",
    desc_en: "Official USCIS guidance for the H-1B cap season, registration process, timelines, and updates.",
    url: "https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations/h-1b-cap-season",
    is_official: true,
  },
  {
    id: "res-dos-visa-bulletin",
    category: "Green Card",
    title_zh: "美国国务院：Visa Bulletin（绿卡排期）",
    desc_zh: "绿卡排期官方月报（Final Action Dates / Dates for Filing）。查看最新月度排期变动。",
    title_en: "U.S. Department of State: Visa Bulletin",
    desc_en: "Official monthly Visa Bulletin with Final Action Dates and Dates for Filing for immigrant visas.",
    url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
    is_official: true,
  },
  {
    id: "res-uscis-priority-dates",
    category: "Green Card",
    title_zh: "USCIS：如何使用排期表（Priority Dates / Filing Charts）",
    desc_zh: "移民局解释 I-485 应该使用 Visa Bulletin 哪张表，以及如何判断\u201C能否递交/批准\u201D。",
    title_en: "USCIS: Visa Availability & Priority Dates / Filing Charts",
    desc_en: "USCIS guidance on which Visa Bulletin chart to use for I-485 filing and how visa availability works.",
    url: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin",
    is_official: true,
  },
  {
    id: "res-dol-flag-lca",
    category: "Employer Compliance",
    title_zh: "美国劳工部：FLAG - LCA（H-1B 劳工条件申请）",
    desc_zh: "雇主提交 LCA 的官方系统与规则说明（H-1B 申请关键步骤之一）。",
    title_en: "U.S. Department of Labor: FLAG - LCA",
    desc_en: "Official DOL portal and guidance for Labor Condition Applications (LCA), a key step in H-1B sponsorship.",
    url: "https://flag.dol.gov/programs/LCA",
    is_official: true,
  },
];
