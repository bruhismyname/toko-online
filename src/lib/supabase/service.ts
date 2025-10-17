import supabase from "./init"
import supabaseAdmin from "./admin-service";

export async function addData(tableName: string, data: any) {
  const payload = Array.isArray(data) ? data : [data];

  const { data: result, error } = await supabase
    .from(tableName)
    .insert(payload)
    .select("*");

  return { data: result ?? [], error };
}


export async function updateData(tableName: string, id: string, data: any) {
  const { data: result, error } = await supabase
    .from(tableName)
    .update(data)
    .eq("id", id)
    .select("*");

  return { data: result ?? [], error }; 
}

export async function deleteData(tableName: string, id: string) {
  const { data: result, error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("*");

  return { data: result ?? [], error }; 
}

export async function RetrieveData(tableName: string) {
  const { data: result, error } = await supabase.from(tableName).select("*");
  return { data: result, error };
}

export async function RetrieveDataById(tableName: string, id: string) {
  const { data: result, error } = await supabase.from(tableName).select("*").eq("id", id);
  return { data: result, error };
}

export async function RetrieveDataByField(
  tableName: string,
  filters: { [key: string]: string | number | boolean }
) {
  let query = supabase.from(tableName).select("*");

  Object.entries(filters).forEach(([field, value]) => {
    query = query.eq(field, value);
  });

  const { data: result, error } = await query;
  return { data: result ?? [], error };
}

export async function RetrieveDataWithJoin(
  tableName: string,
  relation: string, 
  fields: string[] = ["*"], 
  relationFields: string[] = ["*"], 
  filters?: { [key: string]: string | number | boolean } 
) {
  let query = supabase
    .from(tableName)
    .select(`${fields.join(",")}, ${relation} (${relationFields.join(",")})`);

  if (filters) {
    Object.entries(filters).forEach(([field, value]) => {
      query = query.eq(field, value);
    });
  }

  const { data: result, error } = await query;
  return { data: result ?? [], error };
}


export const uploadImage = async (
  file: Buffer | File,
  bucket: string,
  fullname: string,
  mimeType?: string
) => {
  let fileExt = "";
  let fileName = "";

  if (file instanceof File) {
    fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    fileName = `${fullname}.${fileExt}`;
  } else {
    const fallbackExt = mimeType?.split("/")[1] || "png";
    fileExt = fallbackExt;
    fileName = `${fullname}.${fileExt}`;
  }

  const filePath = fileName;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: mimeType ?? (file instanceof File ? file.type : "image/png"),
    });

  if (error) {
    console.error("Error uploading image:", error.message);
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    path: data?.path,
    publicUrl: publicUrlData?.publicUrl,
  };
};


