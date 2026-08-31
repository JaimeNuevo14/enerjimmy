import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body?.name as string | undefined)?.trim();
    const password = body?.password as string | undefined;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio." },
        { status: 400 }
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        { error: "El nombre debe tener al menos 3 caracteres." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json(
        { error: "Ese nombre de usuario ya está en uso." },
        { status: 409 }
      );
    }

    // Raw insert: see the comment in lib/auth.ts about passwordHash not
    // being in the (stale, pre-existing-in-this-sandbox) generated client
    // types yet.
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.$executeRaw`
      INSERT INTO "User" ("id", "name", "passwordHash", "createdAt")
      VALUES (${id}, ${name}, ${passwordHash}, CURRENT_TIMESTAMP)
    `;

    return NextResponse.json({ user: { id, name } }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error interno al registrar usuario." },
      { status: 500 }
    );
  }
}
