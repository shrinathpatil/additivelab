import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { Webhook } from "svix";
import { api } from "@/../convex/_generated/api";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headers = req.headers;
  const svix_id = headers.get("svix-id");
  const svix_timestamp = headers.get("svix-timestamp");
  const svix_signature = headers.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  if (eventType === "user.created") {
    const data = evt.data as UserJSON;
    const { id, username, first_name, last_name, email_addresses } = data;
    const name =
      username ||
      first_name ||
      last_name ||
      email_addresses[0].email_address.split("@")[0];

    const user = await fetchMutation(api.users.createUser, {
      clerkId: id,
      username: name,
      email: email_addresses[0].email_address,
    });

    if (!user) {
      return new Response("Something went wrong!", { status: 500 });
    }
    return new Response("User created in convex", { status: 201 });
  }
  return new Response("Webhook received", { status: 200 });
}
