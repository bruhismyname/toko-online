import supabase from "./init"

export async function addData(tableName: string, data: any) {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert([data])
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
  field: string,
  value: string
) {
  const { data: result, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(field, value);

  return { data: result || [], error };
}