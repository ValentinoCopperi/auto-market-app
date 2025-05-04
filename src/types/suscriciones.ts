


export interface ResponseSuscripcionUsuario {
    id: number
    fecha_inicio: Date
    fecha_fin: Date
    estado: string
    tipo_suscripcion: {
        nombre: string
    }
}


export type Planes = "plan_ocasion" | "plan_vendedor" | "plan_agencia"

//Types para mostrar los datos de cada plan
export interface Tipo_Suscripcion {
    id: number;
    nombre: string;
    precio: number;
    max_publicaciones: number;
    max_publicaciones_por_vehiculo: number;
    publicaciones_destacadas: boolean | null;
}

export type EstadoSuscripcion = "activa" | "vencida" | "cancelada"

export const planes_precios = {
    "plan_ocasion": 100,
    "plan_vendedor": 200,
    "plan_agencia": 300,
}

export const max_fotos = {
    "plan_ocasion": 10,
    "plan_vendedor": 30,
    "plan_agencia": 50,
}

//Function para obtener el nombre del plan convertido
export const getPlanName = (plan: Planes) => {
    switch (plan) {
        case "plan_ocasion":
            return "Plan Ocasión"
        case "plan_vendedor":
            return "Plan Vendedor"
        case "plan_agencia":
            return "Plan Agencia"
        default:
            return "Plan Desconocido"
    }
}
export const planes = [
    {
        id: "plan_ocasion",
        nombre: "Plan Ocasión",
        descripcion: "Perfecto para publicar un único vehículo",
        precio: planes_precios.plan_ocasion,
        tipoPago: "/mes",
        destacado: false,
        features: [
            "1 publicación activa en simultáneo",
            "Posicionamiento máximo",
            "Duración ilimitada de la publicación",
            "Hasta 10 fotos por vehículo",
            "Chat con compradores",
            "Recibe ofertas directas",
            "Estadísticas básicas de visitas",
            "Renovación automática",
            "Soporte vía email",
            "Perfil de vendedor personalizado"
        ]
    },
    {
        id: "plan_vendedor",
        nombre: "Plan Vendedor",
        descripcion: "Ideal para vendedores frecuentes",
        precio: planes_precios.plan_vendedor,
        tipoPago: "/mes",
        destacado: true,
        features: [
            "Hasta 3 publicaciones simultáneas",
            "Duración ilimitada de publicaciones",
            "30 fotos por vehículo",
            "Publicaciones destacadas",
            "Chat y ofertas",
            "Estadísticas detalladas",
            "Posicionamiento máximo preferencial",
            "Soporte prioritario",
            "Badge de Vendedor Verificado",
            "Renovación automática opcional",
            "Perfil de concesionaria personalizado"
        ]
    },
    {
        id: "plan_agencia",
        nombre: "Plan Agencia",
        descripcion: "Solución completa para profesionales",
        precio: planes_precios.plan_agencia,
        tipoPago: "/mes",
        destacado: false,
        features: [
            "Publicaciones ilimitadas",
            "Duración ilimitada de publicaciones",
            "Máxima visibilidad en búsquedas",
            "Ilimitado fotos + video por vehículo",
            "Todas las publicaciones destacadas",
            "Panel de administración profesional",
            "Perfil de concesionaria personalizado",
            "Estadísticas avanzadas y reportes",
            "Soporte 24/7 prioritario",
            "Badge de Vendedor Profesional",
            "Herramientas de marketing incluidas",
            "Acceso a datos de mercado"
        ]
    }
];
