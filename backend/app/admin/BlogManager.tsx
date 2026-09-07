"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { BlogEditor } from "./BlogEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { SafeBlogPost } from "@/lib/storage";

function statusLabel(status: string) {
  return status === "published" ? "Published" : status === "scheduled" ? "Scheduled" : "Draft";
}

export function BlogManager({ adminName }: { adminName: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SafeBlogPost | null>(null);

  const postsQuery = useQuery<SafeBlogPost[]>({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const response = await fetch("/api/admin/blog");
      if (!response.ok) throw new Error("Failed to load blog posts");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (post: SafeBlogPost) => {
      const response = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to move article to trash");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      setEditorOpen(false);
      setEditingPost(null);
      toast({ title: "Article moved to trash" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  if (editorOpen) {
    return (
      <BlogEditor
        key={editingPost?.id ?? "new"}
        post={editingPost}
        adminName={adminName}
        onClose={() => { setEditorOpen(false); setEditingPost(null); }}
        onSaved={(saved) => setEditingPost(saved)}
        onDelete={editingPost ? () => deleteMutation.mutate(editingPost) : undefined}
      />
    );
  }

  const posts = postsQuery.data ?? [];
  return (
    <div className="space-y-6" data-testid="blog-manager">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight" data-testid="text-blog-heading">Blog content</h2>
          <p className="mt-1 text-sm text-gray-500">Create, edit, schedule, and publish academy articles.</p>
        </div>
        <Button onClick={() => { setEditingPost(null); setEditorOpen(true); }} data-testid="button-create-blog-post"><Plus className="mr-2 h-4 w-4" /> New article</Button>
      </div>

      {postsQuery.isLoading ? (
        <div className="py-12 text-center text-gray-500">Loading blog posts...</div>
      ) : postsQuery.isError ? (
        <div className="py-12 text-center text-red-600">Unable to load blog posts. Refresh and try again.</div>
      ) : posts.length === 0 ? (
        <Card><CardContent className="py-14 text-center"><h3 className="text-xl font-bold uppercase">No articles yet</h3><p className="mt-2 text-gray-500">Create the first approved article without adding placeholder content.</p><Button className="mt-5" onClick={() => { setEditingPost(null); setEditorOpen(true); }}>Create article</Button></CardContent></Card>
      ) : (
        <div className="overflow-hidden border border-gray-200">
          <Table>
            <TableHeader className="bg-gray-100"><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Visibility</TableHead><TableHead>Categories</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} data-testid={`row-blog-post-${post.id}`}>
                  <TableCell><div className="font-semibold">{post.title}</div><div className="text-xs text-gray-500">/blog/{post.slug}</div></TableCell>
                  <TableCell><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${post.status === "published" ? "bg-green-100 text-green-800" : post.status === "scheduled" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"}`}>{statusLabel(post.status)}</span></TableCell>
                  <TableCell className="capitalize">{post.visibility === "password" ? "Password protected" : post.visibility}</TableCell>
                  <TableCell>{post.categories.map((category) => category.name).join(", ") || "—"}</TableCell>
                  <TableCell className="text-sm text-gray-500">{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => { setEditingPost(post); setEditorOpen(true); }} data-testid={`button-edit-blog-post-${post.id}`}><Pencil className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={() => window.confirm(`Move "${post.title}" to trash?`) && deleteMutation.mutate(post)} data-testid={`button-delete-blog-post-${post.id}`}><Trash2 className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}