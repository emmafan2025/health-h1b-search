import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import { useTranslation } from "@/contexts/TranslationContext";
import { resourceItems, ResourceItem } from "@/data/resourcesData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Search, ExternalLink, ShieldCheck } from "lucide-react";

const CATEGORIES = ["All", "H-1B", "Green Card", "Employer Compliance"] as const;

const Resources = () => {
  const { language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const isZh = language === "zh";

  const categoryLabels: Record<string, string> = isZh
    ? { All: "全部", "H-1B": "H-1B", "Green Card": "绿卡", "Employer Compliance": "雇主合规" }
    : { All: "All", "H-1B": "H-1B", "Green Card": "Green Card", "Employer Compliance": "Employer Compliance" };

  const filteredItems = useMemo(() => {
    let items = resourceItems;
    if (activeCategory !== "All") {
      items = items.filter((r) => r.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((r) => {
        const title = isZh ? r.title_zh : r.title_en;
        const desc = isZh ? r.desc_zh : r.desc_en;
        return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
      });
    }
    return items;
  }, [searchQuery, activeCategory, isZh]);

  const pageTitle = isZh
    ? "移民信息资源 | H1B for Healthcare"
    : "Immigration Resources | H1B for Healthcare";
  const pageDescription = isZh
    ? "H-1B 与绿卡相关的权威官方资源合集。"
    : "Authoritative official resources for H-1B and green card immigration.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary to-accent py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {isZh ? "移民信息资源" : "Immigration Resources"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              {isZh
                ? "精选 H-1B 与绿卡相关的权威官方链接，助你快速获取一手信息。"
                : "Curated official links for H-1B and green card immigration — get authoritative info fast."}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          <h2 className="sr-only">{isZh ? "资源列表" : "Resource List"}</h2>

          {/* Search + Category Filters */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isZh ? "搜索资源..." : "Search resources..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                >
                  {categoryLabels[cat]}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {isZh ? "没有找到匹配的资源。" : "No matching resources found."}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <ResourceCard key={item.id} item={item} isZh={isZh} categoryLabels={categoryLabels} />
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <footer className="mt-10 pt-6 border-t">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isZh
                ? "提示：以上链接为权威/官方资源入口。政策与页面可能更新，请以官网最新信息为准。"
                : "Note: These are authoritative/official resources. Pages and policies may change—please refer to the latest official updates."}
            </p>
          </footer>
        </section>
      </main>
    </>
  );
};

function ResourceCard({
  item,
  isZh,
  categoryLabels,
}: {
  item: ResourceItem;
  isZh: boolean;
  categoryLabels: Record<string, string>;
}) {
  const title = isZh ? item.title_zh : item.title_en;
  const desc = isZh ? item.desc_zh : item.desc_en;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="secondary">{categoryLabels[item.category]}</Badge>
          {item.is_official && (
            <Badge variant="outline" className="gap-1 text-primary border-primary/30 bg-primary/5">
              <ShieldCheck className="h-3 w-3" />
              {isZh ? "官方" : "Official"}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base leading-snug">{title}</CardTitle>
        <CardDescription className="mt-1.5 line-clamp-3">{desc}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {isZh ? "打开" : "Open"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Resources;
