import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, PlusCircle, Search, Clock, Eye, Filter, User, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  category: string;
  views: number;
  created_at: string;
  updated_at: string;
  reply_count: number;
}

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
}

interface NewPost {
  title: string;
  content: string;
  category: string;
}

const Forum = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState<NewPost>({
    title: "",
    content: "",
    category: "general"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();

  const categories = [
    { value: "general", label: t.forum.categories.general },
    { value: "h1b-process", label: t.forum.categories.h1bProcess },
    { value: "job-search", label: t.forum.categories.jobSearch },
    { value: "visa-issues", label: t.forum.categories.visaIssues },
    { value: "career-advice", label: t.forum.categories.careerAdvice },
    { value: "immigration-law", label: t.forum.categories.immigrationLaw },
    { value: "success-stories", label: t.forum.categories.successStories }
  ];

  // Fetch forum posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["forum-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_forum_posts_with_reply_counts");
      if (error) throw error;
      return data as ForumPost[];
    },
  });

  // Create new post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: NewPost) => {
      if (!user) throw new Error("User not logged in");
      
      // Get user profile for username
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      
      const { data, error } = await supabase
        .from("forum_posts")
        .insert([{
          title: post.title,
          content: post.content,
          category: post.category,
          author_name: profile?.username || `User_${user.id.substring(0, 8)}`,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      setIsNewPostOpen(false);
      setNewPost({
        title: "",
        content: "",
        category: "general"
      });
      toast({
        title: t.forum.toast.postCreated,
        description: t.forum.toast.postCreatedDesc,
      });
    },
    onError: (error) => {
      toast({
        title: t.forum.toast.errorCreating,
        description: t.forum.toast.errorCreatingDesc,
        variant: "destructive",
      });
    },
  });

  // Filter posts
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: t.forum.toast.pleaseLogin,
        description: t.forum.toast.pleaseLoginDesc,
        variant: "destructive",
      });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: t.forum.toast.fillRequired,
        description: t.forum.toast.fillRequiredDesc,
        variant: "destructive",
      });
      return;
    }
    
    createPostMutation.mutate(newPost);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "general": "bg-gray-100 text-gray-800",
      "h1b-process": "bg-blue-100 text-blue-800",
      "job-search": "bg-green-100 text-green-800",
      "visa-issues": "bg-red-100 text-red-800",
      "career-advice": "bg-purple-100 text-purple-800",
      "immigration-law": "bg-yellow-100 text-yellow-800",
      "success-stories": "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {t.forum.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.forum.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{posts?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">{t.forum.totalPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {new Set(posts?.map(p => p.author_name)).size || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">{t.forum.activeMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {posts?.reduce((sum, post) => sum + post.views, 0) || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">{t.forum.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t.forum.searchAndFilter}
              </CardTitle>
              {user ? (
                <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      {t.forum.createNewPost}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{t.forum.createPost.title}</DialogTitle>
                      <DialogDescription>
                        {t.forum.createPost.subtitle}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">{t.forum.createPost.titleLabel}</label>
                        <Input
                          placeholder={t.forum.createPost.titlePlaceholder}
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">{t.forum.createPost.category}</label>
                        <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">{t.forum.createPost.contentLabel}</label>
                        <Textarea
                          placeholder={t.forum.createPost.contentPlaceholder}
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          rows={6}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                          {t.forum.createPost.cancel}
                        </Button>
                        <Button onClick={handleCreatePost} disabled={createPostMutation.isPending}>
                          {createPostMutation.isPending ? t.forum.createPost.publishing : t.forum.createPost.publish}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button asChild className="flex items-center gap-2">
                  <Link to="/auth">
                    <LogIn className="h-4 w-4" />
                    {t.forum.loginToPost}
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder={t.forum.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.forum.filterByCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.forum.allCategories}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading forum posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.forum.noPostsYet}</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? t.forum.tryAdjusting
                  : t.forum.beFirstToPost
                }
              </p>
              {user ? (
                <Button onClick={() => setIsNewPostOpen(true)}>
                  {t.forum.createFirstPost}
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/auth">{t.forum.loginToPost}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(post.category)}>
                          {categories.find(c => c.value === post.category)?.label || post.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {t.forum.author}: {post.author_name}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 hover:text-primary cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {post.content}
                      </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.reply_count} {t.forum.replies}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views} {t.forum.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(post.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        {t.forum.viewDiscussion}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;