import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body?.name as string | undefined)?.trim();

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

    const existing = await prisma.user.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json(
        { error: "Ese nombre de usuario ya está en uso." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: { name },
      select: { id: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error interno al registrar usuario." },
      { status: 500 }
    );
  }
}
