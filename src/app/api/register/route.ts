import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma"

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json().catch(() => ({}));

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua data wajib diisi" },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter" },
        { status: 400 }
      );
    }

    // Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash kata sandi lalu simpan
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil!", userId: user.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Gagal memproses pendaftaran" },
      { status: 500 }
    );
  }
}