import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { getAdmin, validOrigin } from "@/lib/auth";
import { models } from "@/lib/models";
import { schemas, type Collection } from "@/lib/validation";
type Context = { params: Promise<{ collection: string }> };
async function handle(request: Request, context: Context) {
  if (!validOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!(await getAdmin()))
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );
  const { collection } = await context.params;
  if (!Object.hasOwn(schemas, collection))
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const key = collection as Collection;
  try {
    const body = await request.json();
    const id = body._id;
    if (id && !isValidObjectId(id))
      return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    if (request.method === "DELETE") {
      if (key === "settings" || !id)
        return NextResponse.json(
          { error: "Invalid deletion" },
          { status: 400 },
        );
      const deleted = await models[key].findByIdAndDelete(id);
      if (!deleted)
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 },
        );
      return NextResponse.json({ ok: true });
    }
    const result = schemas[key].safeParse(body);
    if (!result.success)
      return NextResponse.json(
        {
          error: result.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        },
        { status: 400 },
      );
    const data = { ...result.data };
    if ("rating" in data && data.rating === "")
      delete (data as { rating?: unknown }).rating;
    const record =
      key === "settings"
        ? await models.settings.findOneAndUpdate(
            { key: "main" },
            { $set: data },
            { upsert: true, new: true, runValidators: true },
          )
        : id
          ? await models[key].findByIdAndUpdate(
              id,
              {
                $set: data,
                ...(key === "testimonials" && !("rating" in data)
                  ? { $unset: { rating: 1 } }
                  : {}),
              },
              { new: true, runValidators: true },
            )
          : await models[key].create(data);
    if (!record)
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    return NextResponse.json({ ok: true, record });
  } catch {
    return NextResponse.json(
      { error: "Unable to save. Please try again." },
      { status: 500 },
    );
  }
}
export const POST = handle;
export const DELETE = handle;
