import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const useGoogle = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

function devSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/(^\.|\.$)/g, "") || "invitado"
  );
}

// En producción: Google de verdad. En local sin credenciales: un proveedor
// "dev" que solo pide un nombre, para poder probar el flujo completo.
const providers = useGoogle
  ? [Google]
  : [
      Credentials({
        id: "dev",
        name: "Dev",
        credentials: { name: { label: "Nombre", type: "text" } },
        authorize(creds) {
          const name = String(creds?.name ?? "").trim();
          if (!name) return null;
          const slug = devSlug(name);
          return { id: slug, name, email: `${slug}@dev.local` };
        },
      }),
    ];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
  pages: { signIn: "/" },
});

export const usingDevAuth = !useGoogle;
