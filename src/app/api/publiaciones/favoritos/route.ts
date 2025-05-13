import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getSession } from "@/lib/session/session";
import prisma from "@/lib/prisma";


// Tipo para el cuerpo de la solicitud
interface RequestBody {
  publicacionId: number;
  userId: string | undefined;
}




//Obtener si una publicación es favorita del usuario logueado
//Es post porque se pasan datos por el body
export async function POST(request: NextRequest){

  try {
    const { publicacionId, userId } = (await request.json()) as RequestBody;
    
    
    const formattedUserId = Number(userId);
    const formattedPublicacionId = Number(publicacionId);

    if (!formattedPublicacionId || !formattedUserId) {
      return NextResponse.json({ error: true, esFavorito: false, message: "El ID de la publicación es inválido" }, { status: 400 });
    }
    
    const favorito = await prisma.favorito.findFirst({
      where: {
        cliente_id: formattedUserId,
        publicacion_id: formattedPublicacionId,
      },
    });
    const esFavorito = favorito !== null;

    return NextResponse.json({ error: false, esFavorito }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: true, message: "Error interno al obtener favoritos" }, { status: 500 });
  }

}

