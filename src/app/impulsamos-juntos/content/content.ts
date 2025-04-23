// Esto debe estar en el "nivel raíz" del archivo .ts
export interface IMPULSEMOS_JUNTOS_CONTENT_TYPE {
  instagram_url: string;
  hero_section: {
    image: string;
  };
  data_slug: {
    title: string;
    description: string;
    image: string;
    features: string[];
  };
}


export const IMPULSEMOS_JUNTOS_CONTENT: Record<string, IMPULSEMOS_JUNTOS_CONTENT_TYPE> = {
  motorpoint: {
    instagram_url: "https://www.instagram.com/",
    hero_section: {
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    data_slug: {
      title: "MotorPoint",
      description: "Conocé el estado real del vehículo usado que te interesa y tomá la mejor decisión con toda la información necesaria.",
      image: "/motor-point.webp",
      features: [
        "Inspección de vehículos.",
        "Revisión pre y post compra de vehículos usados a domicilio.",
        "Asesoramiento personalizado.",
        "Garantía de calidad.",
      ],
    },
  },
  rstronic: {
    instagram_url: "https://www.instagram.com/",
    hero_section: {
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    data_slug: {
      title: "RSTRONIC",
      description: "Taller de potenciación y servicios para automóviles, camiones y motocicletas.",
      image: "/rstronic.jpg",
      features: [
        "Videos con pruebas reales, sonido de motores y manejo en ruta que muestran el antes y después de cada proyecto.",
        "Especialistas en reprogramaciones ECU/TCU y mejoras como Big Turbo. Potencian vehículos como la Ranger Raptor o Amarok V6 hasta 450 hp.",
      ],
    },
  },
  "esp-off-performance": {
    instagram_url: "https://www.instagram.com/",
    hero_section: {
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    data_slug: {
      title: "ESP OFF PERFORMANCE",
      description: "Venta, importación e instalación de accesorios y repuestos de alta gama. De cualquier parte del mundo hasta la puerta de tu casa.",
      image: "/esp-off-performance.png",
      features: [
        "Creamos sistemas de escape personalizados para cada vehículo, diseñados para mejorar el sonido, el rendimiento y la estética.",
        "Nuestros servicios están pensados para verdaderos fanáticos del automovilismo que buscan exclusividad, potencia y una experiencia de manejo única.",
      ],
    },
  },
};

