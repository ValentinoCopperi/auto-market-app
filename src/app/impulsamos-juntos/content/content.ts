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
  "esp-off-performance": {
    instagram_url: "https://www.instagram.com/espoff.performance/",
    hero_section: {
      image: "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  "dynaco-consulting": {
    instagram_url: "https://www.instagram.com/dynaco_consulting/  ",
    hero_section: {
      image: "/dynaco.png",
    },
    data_slug: {
      title: "DYNACO CONSULTING",
      description: "Ayudamos a que compres tu auto usado sin sorpresas, con inspecciones detalladas y asesoría personalizada. Detectamos lo que no se ve para que tomes decisiones con confianza.",
      image: "/dynaco.png",
      features: [
        "Inspección presencial con checklist de más de 120 ítems.",
        "Asesoría personalizada para encontrar el auto que mejor se adapta a vos."
      ],
    }
  },
}

