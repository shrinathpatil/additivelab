import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { fetchMutation } from "convex/nextjs";
import { NextRequest } from "next/server";
import { api } from "@/../convex/_generated/api";
import { UserJSON } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    const data = evt.data as UserJSON;
    const { id, username, email_addresses, first_name } = data;

    let name =
      username || first_name || email_addresses[0].email_address.split("@")[0];

    if (eventType === "user.created") {
      const user = await fetchMutation(api.users.createUser, {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: name,
      });

      if (user) {
        return new Response("User Created!", { status: 201 });
      }
      return new Response("Something went wrong!", { status: 500 });
    }

    return new Response(`Webhook event ${eventType} received`, { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
