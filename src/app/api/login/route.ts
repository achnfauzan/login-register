import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body: LoginBody = await req.json().catch(() => ({}));

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    // Cari pengguna berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });

    // Pesan error dibuat sama agar tidak membocorkan email mana yang terdaftar
    const invalidCredentials = NextResponse.json(
      { error: "Email atau kata sandi salah" },
      { status: 401 }
    );

    if (!user) return invalidCredentials;

    // Verifikasi kata sandi
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) return invalidCredentials;

    return NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Gagal memproses login" },
      { status: 500 }
    );
  }
}