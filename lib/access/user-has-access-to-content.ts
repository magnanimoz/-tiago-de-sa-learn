import { createClient } from "@/lib/supabase/server";

export type ContentType = "song" | "course" | "pack";

type UserHasAccessToContentParams = {
  userId: string;
  contentType: ContentType;
  contentId: string;
};

export async function userHasAccessToContent({
  userId,
  contentType,
  contentId,
}: UserHasAccessToContentParams): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("content_access")
    .select("id")
    .eq("user_id", userId)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar acesso ao conteúdo:", error);

    return false;
  }

  return Boolean(data);
}
