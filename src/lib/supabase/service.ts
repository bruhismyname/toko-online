import supabase from "./init"

export async function addData(tableName: string, data: any) {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert([data])
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