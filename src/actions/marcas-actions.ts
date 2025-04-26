"use server"

import { unstable_cache, unstable_cacheLife, unstable_cacheTag } from "next/cache";
import prisma from "@/lib/prisma"
import { Marca } from "@/types/publicaciones";

export const getMarcas = unstable_cache(async () => {
  try {
    const marcas = await prisma.marca.findMany({
      orderBy: {
        nombre: "asc",
      },
    });
    return marcas as Marca[];

  } catch (error) {
    console.error(error);
    return [];
  }
}, ["marcas"], {revalidate: 3600})


export const getMarcasByCantidadPublicaciones = unstable_cache(async () => {
  "use cache"
  unstable_cacheLife({revalidate: 600})
  unstable_cacheTag("marcas")


  try {
    const marcas = await prisma.marca.findMany({
      where: {
        OR: [
          {
            nombre: {
              equals: "toyota",
              mode: "insensitive"
            }
          },
          {
            nombre: {
              equals: "chevrolet",
              mode: "insensitive"
            }
          },
          {
            nombre: {
              equals: "ford",
              mode: "insensitive"
            }
          },
          {
            nombre: {
              equals: "honda",
              mode: "insensitive"
            }
          },
          {
            nombre: {
              equals: "fiat",
              mode: "insensitive"
            }
          },
          {
            nombre: {
              equals: "peugeot",
              mode: "insensitive"
            }
          },
          {
            nombre: {
              equals: "volkswagen",
              mode: "insensitive"
            }
          }
        ]
      },
      orderBy: {
        cantidad_publicaciones: "desc",
      },
    });
    return marcas as Marca[];
  } catch (error) {
    console.error(error);
    return [];
  }
}, ["marcas"], {revalidate: 600})





