import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import { useTranslation } from "@/contexts/TranslationContext";
import { h1bFaqItems } from "@/data/h1bFaqData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, ChevronsUpDown } from "lucide-react";

const H1BFaq = () => {
  const { language, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const isZh = language === "zh";

  const pageTitle = isZh
    ? "H-1B 常见问题 FAQ | H1B for Healthcare"
    : "H-1B FAQ | H1B for Healthcare";
  const pageDescription = isZh
    ? "关于 H-1B 签证的常见问题解答，涵盖申请条件、抽签流程、有效期、换雇主、绿卡申请等热门话题。"
    : "Frequently asked questions about the H-1B visa, covering eligibility, lottery process, duration, employer transfers, green card applications, and more.";

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return h1bFaqItems;
    const q = searchQuery.toLowerCase();
    return h1bFaqItems.filter((item) => {
      const question = isZh ? item.question_zh : item.question_en;
      return question.toLowerCase().includes(q);
    });
  }, [searchQuery, isZh]);

  const allIds = filteredItems.map((item) => item.id);

  const expandAll = () => setOpenItems(allIds);
  const collapseAll = () => setOpenItems([]);

  // JSON-LD structured data for both languages
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: h1bFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question_en,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer_en,
      },
    })),
  };

  const jsonLdZh = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: h1bFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question_zh,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer_zh,
      },
    })),
  };

  const disclaimer = isZh
    ? "免责声明：本文仅用于一般信息分享，不构成法律建议。移民政策可能变化，个案结果取决于具体事实与材料。请在做决定前咨询合格移民律师。"
    : "Disclaimer: This content is for general informational purposes only and does not constitute legal advice. Immigration rules may change, and outcomes depend on individual facts. Consult a qualified immigration attorney before making decisions.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdZh)}</script>
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary to-accent py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {isZh ? "H-1B 常见问题" : "H-1B Frequently Asked Questions"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              {isZh
                ? "关于 H-1B 签证你最想知道的问题，我们都整理好了。"
                : "Everything you need to know about the H-1B visa, all in one place."}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
          <h2 className="sr-only">
            {isZh ? "常见问题列表" : "FAQ List"}
          </h2>

          {/* Search + controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isZh ? "搜索问题..." : "Search questions..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                <ChevronsUpDown className="h-4 w-4 mr-1" />
                {isZh ? "展开全部" : "Expand All"}
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                {isZh ? "收起全部" : "Collapse All"}
              </Button>
            </div>
          </div>

          {/* Accordion */}
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {isZh ? "没有找到匹配的问题。" : "No matching questions found."}
            </p>
          ) : (
            <Accordion
              type="multiple"
              value={openItems}
              onValueChange={setOpenItems}
              className="space-y-2"
            >
              {filteredItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border rounded-lg px-4 bg-card"
                >
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    {isZh ? item.question_zh : item.question_en}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {isZh ? item.answer_zh : item.answer_en}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* Disclaimer */}
          <footer className="mt-10 pt-6 border-t">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {disclaimer}
            </p>
          </footer>
        </section>
      </main>
    </>
  );
};

export default H1BFaq;
