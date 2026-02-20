export interface FaqItem {
  id: string;
  question_zh: string;
  answer_zh: string;
  question_en: string;
  answer_en: string;
}

export const h1bFaqItems: FaqItem[] = [
  {
    id: "h1b-01",
    question_zh: "什么是 H-1B 签证？",
    answer_zh: "H-1B 是美国的一种非移民工作签证，用于允许美国公司雇佣从事「专业性工作（Specialty Occupation）」的外籍员工。这类工作通常要求至少本科学历或同等专业背景，常见于科技、工程、金融、医疗、教育等领域。",
    question_en: "What is the H-1B visa?",
    answer_en: "The H-1B is a U.S. nonimmigrant work visa that allows U.S. employers to hire foreign professionals in \"specialty occupations.\" These roles typically require at least a bachelor's degree (or equivalent) in a related field. Common industries include tech, engineering, finance, healthcare, and education."
  },
  {
    id: "h1b-02",
    question_zh: "申请 H-1B 需要满足哪些基本条件？",
    answer_zh: "一般需要：美国雇主担保；岗位属于专业性岗位；你具备相关本科学历或同等经验；雇主遵守劳工部的工资与工作条件要求。",
    question_en: "What are the basic requirements to qualify for H-1B?",
    answer_en: "In general, you'll need a U.S. employer willing to sponsor you, a role classified as a specialty occupation, a relevant bachelor's degree or higher (or equivalent experience), and employer compliance with Department of Labor wage and work-condition requirements."
  },
  {
    id: "h1b-03",
    question_zh: "H-1B 一定要先抽签吗？",
    answer_zh: "大多数申请人需要。通常流程是先电子注册、再随机抽签。中签后雇主才能递交完整申请。部分「免抽签」雇主（如某些高校或非营利研究机构）可能不受名额限制。",
    question_en: "Do I always need to go through the H-1B lottery?",
    answer_en: "Most applicants do. The process is typically electronic registration first, then random selection. Only those selected can proceed to file a full petition. Some employers may be cap-exempt (e.g., certain universities and nonprofit research organizations)."
  },
  {
    id: "h1b-04",
    question_zh: "每年有多少个 H-1B 名额？",
    answer_zh: "每年一般为 65,000 个常规名额 + 20,000 个美国硕士及以上名额，总计 85,000 个。",
    question_en: "How many H-1B visas are available each year?",
    answer_en: "The annual cap is typically 65,000 regular cap visas plus 20,000 additional visas for U.S. master's degree (or higher) holders, totaling 85,000 per fiscal year."
  },
  {
    id: "h1b-05",
    question_zh: "H-1B 中签率大概是多少？",
    answer_zh: "中签率每年波动，取决于注册人数。近年来常见区间约为 20%–30%，美国硕士学历通常略高一些。请以当年官方数据为准。",
    question_en: "What is the H-1B selection (lottery) rate?",
    answer_en: "Selection rates vary year to year based on the number of registrations. In recent years, overall selection has often been roughly in the 20%–30% range, and U.S. master's degree holders may have a slightly higher chance. Refer to official data for the specific year."
  },
  {
    id: "h1b-06",
    question_zh: "最早什么时候可以用 H-1B 开始工作？",
    answer_zh: "常见时间线：3 月注册与抽签；4–6 月递交完整申请；10 月 1 日 H-1B 生效并可开始以 H-1B 身份工作。",
    question_en: "When can I start working on H-1B?",
    answer_en: "A typical timeline is March registration and lottery, April–June petition filing (if selected), and an October 1 effective start date. Even if approved earlier, H-1B employment generally begins on or after October 1."
  },
  {
    id: "h1b-07",
    question_zh: "H-1B 最长可以用多久？",
    answer_zh: "通常首次批 3 年，可延长至最多 6 年。若在走职业移民流程、满足特定条件，可能有机会超过 6 年继续延期。",
    question_en: "How long can I stay on H-1B?",
    answer_en: "H-1B is usually granted for up to 3 years initially and can be extended to a maximum of 6 years. In some cases, extensions beyond 6 years may be possible if you are progressing through certain stages of the employment-based green card process."
  },
  {
    id: "h1b-08",
    question_zh: "H-1B 期间可以换工作/换雇主吗？",
    answer_zh: "可以。一般称为 H-1B transfer（转雇主）。很多情况下不需要重新抽签，新雇主递交新的 H-1B 申请后，你可能可以开始为新雇主工作（细节请咨询律师）。",
    question_en: "Can I change employers on H-1B?",
    answer_en: "Yes. This is often called an H-1B \"transfer\" (change of employer). In many cases, you do not need to re-enter the lottery, and you may be able to start working for the new employer after the new petition is filed (confirm details with your attorney)."
  },
  {
    id: "h1b-09",
    question_zh: "H-1B 期间可以申请绿卡吗？",
    answer_zh: "可以，而且很常见。H-1B 允许「双重意图（Dual Intent）」，你可以合法地一边保持 H-1B 身份，一边推进职业移民申请。",
    question_en: "Can I apply for a green card while on H-1B?",
    answer_en: "Yes. H-1B permits \"dual intent,\" meaning you can maintain H-1B status while pursuing permanent residency (a green card) without automatically jeopardizing your H-1B status."
  },
  {
    id: "h1b-10",
    question_zh: "如果没抽中，还有哪些选择？",
    answer_zh: "可考虑：下一年再抽签；评估 O-1、H-4 EAD、L-1 等其他签证；与雇主规划 EB-2/EB-3/EB-1 等移民路径；根据个人背景制定长期身份规划。",
    question_en: "What if I don't get selected—what are my options?",
    answer_en: "Many people prepare alternatives such as re-entering the lottery in a future cycle, exploring options like O-1, H-4 EAD, or L-1 (depending on eligibility), starting an employment-based green card strategy (EB-2/EB-3/EB-1) with an employer, and building a long-term immigration plan tailored to your background."
  }
];
