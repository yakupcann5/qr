"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc/client";
import {
  createBlogPostSchema,
  type CreateBlogPostInput,
  type CreateBlogPostFormInput,
} from "@/lib/validators/blog";

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBlogPage() {
  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.blog.listAll.useQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    author: string;
    tags: string[];
    isPublished: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
  } | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      utils.blog.listAll.invalidate();
      setDialogOpen(false);
    },
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.listAll.invalidate();
      setEditingPost(null);
    },
  });

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => {
      utils.blog.listAll.invalidate();
      setDeletingPostId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Yönetimi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Blog yazılarını oluşturun, düzenleyin ve yayınlayın.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" />
              Yeni Yazı
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni Blog Yazısı</DialogTitle>
            </DialogHeader>
            <BlogForm
              onSubmit={(data) => createPost.mutate(data as CreateBlogPostInput)}
              isPending={createPost.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Yazar</TableHead>
                <TableHead>Etiketler</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Henüz blog yazısı yok.
                  </TableCell>
                </TableRow>
              ) : (
                posts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{post.title}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          /blog/{post.slug}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.author}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.isPublished ? (
                        <Badge className="bg-green-100 text-xs text-green-700">
                          <Eye className="mr-1 size-3" />
                          Yayında
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          <EyeOff className="mr-1 size-3" />
                          Taslak
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {post.isPublished && (
                          <Button variant="ghost" size="icon" className="size-7" asChild>
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            setEditingPost({
                              id: post.id,
                              title: post.title,
                              slug: post.slug,
                              excerpt: post.excerpt,
                              content: post.content,
                              coverImage: post.coverImage,
                              author: post.author,
                              tags: post.tags,
                              isPublished: post.isPublished,
                              metaTitle: post.metaTitle,
                              metaDescription: post.metaDescription,
                            })
                          }
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:text-destructive"
                          onClick={() => setDeletingPostId(post.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      {editingPost && (
        <Dialog open onOpenChange={(open) => { if (!open) setEditingPost(null); }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yazıyı Düzenle</DialogTitle>
            </DialogHeader>
            <BlogForm
              defaultValues={editingPost}
              onSubmit={(data) =>
                updatePost.mutate({ id: editingPost.id, ...(data as CreateBlogPostInput) })
              }
              isPending={updatePost.isPending}
              submitLabel="Güncelle"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingPostId}
        onOpenChange={(open) => { if (!open) setDeletingPostId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yazıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu blog yazısı kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deletingPostId) deletePost.mutate({ id: deletingPostId });
              }}
            >
              {deletePost.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Sil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BlogForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Oluştur",
}: {
  defaultValues?: CreateBlogPostFormInput;
  onSubmit: (data: CreateBlogPostFormInput) => void;
  isPending: boolean;
  submitLabel?: string;
}) {
  const form = useForm<CreateBlogPostFormInput>({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues: defaultValues ?? {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      author: "QR Menü",
      tags: [],
      isPublished: false,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const tag = tagInput.trim();
    if (!tag) return;
    const current = form.getValues("tags") ?? [];
    if (!current.includes(tag)) {
      form.setValue("tags", [...current, tag], { shouldDirty: true });
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    const current = form.getValues("tags") ?? [];
    form.setValue(
      "tags",
      current.filter((t) => t !== tag),
      { shouldDirty: true }
    );
  }

  const tags = form.watch("tags") ?? [];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Başlık</Label>
          <Input id="title" {...form.register("title")} placeholder="QR Menü Nedir?" />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} placeholder="qr-menu-nedir" />
          {form.formState.errors.slug && (
            <p className="text-xs text-destructive">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Özet</Label>
        <Input
          id="excerpt"
          {...form.register("excerpt")}
          placeholder="Kısa açıklama..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">İçerik</Label>
        <Textarea
          id="content"
          rows={10}
          {...form.register("content")}
          placeholder="Blog yazı içeriği..."
          className="font-mono text-sm"
        />
        {form.formState.errors.content && (
          <p className="text-xs text-destructive">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">Yazar</Label>
          <Input id="author" {...form.register("author")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverImage">Kapak Görseli (URL)</Label>
          <Input
            id="coverImage"
            {...form.register("coverImage")}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Etiketler</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Etiket ekle..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>
            Ekle
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <details className="rounded-lg border px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium">
          SEO Ayarları
        </summary>
        <div className="mt-3 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Başlık</Label>
            <Input id="metaTitle" {...form.register("metaTitle")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Açıklama</Label>
            <Textarea
              id="metaDescription"
              rows={2}
              {...form.register("metaDescription")}
            />
          </div>
        </div>
      </details>

      {/* Publish toggle */}
      <div className="flex items-center justify-between rounded-lg border px-4 py-3">
        <div>
          <p className="text-sm font-medium">Yayınla</p>
          <p className="text-xs text-muted-foreground">
            Aktif edilince yazı herkese açık olacak.
          </p>
        </div>
        <Switch
          checked={form.watch("isPublished")}
          onCheckedChange={(v) => form.setValue("isPublished", v)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : submitLabel}
      </Button>
    </form>
  );
}
