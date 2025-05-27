import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Phone, ExternalLink, MessageSquare, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContactoForm from "./contacto-form"

export const metadata: Metadata = {
  title: "Contacto | CarMarket",
  description: "Ponte en contacto con nuestro equipo de soporte. Estamos aquí para ayudarte con cualquier consulta sobre compra, venta o uso de nuestra plataforma.",
  keywords: ["contacto", "ayuda", "soporte", "atención al cliente", "consultas"],
  alternates: {
    canonical: "https://carmarket.com.ar/contacto",
  },
  openGraph: {
    title: "Contacto | CarMarket",
    description: "Ponte en contacto con nuestro equipo de soporte. Estamos aquí para ayudarte.",
    url: "https://carmarket.com.ar/contacto",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Encabezado de la página */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Contacto</h1>
            <p className="text-muted-foreground max-w-2xl">
              Estamos aquí para ayudarte. Contacta con nuestro equipo para cualquier consulta, soporte técnico o
              información adicional.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Tabs de navegación */}
          <Tabs defaultValue="contacto" className="w-full mb-8">
            <TabsList className="flex flex-wrap w-full gap-2 bg-transparent p-2 rounded-lg">
              <TabsTrigger
                value="contacto"
                className="flex-1 min-w-[100px] sm:min-w-[120px] flex items-center justify-center gap-2 py-4 px-3 text-xs sm:text-sm font-medium rounded-md bg-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-gray-200 transition-colors duration-200"
                aria-label="Contacto"
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:inline">Contacto</span>
              </TabsTrigger>
              <TabsTrigger
                value="equipo"
                className="flex-1 min-w-[100px] sm:min-w-[120px] flex items-center justify-center gap-2 py-4 px-3 text-xs sm:text-sm font-medium rounded-md bg-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-gray-200 transition-colors duration-200"
                aria-label="Equipo"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:inline">Equipo</span>
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="flex-1 min-w-[100px] sm:min-w-[120px] flex items-center justify-center gap-2 py-4 px-3 text-xs sm:text-sm font-medium rounded-md bg-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-gray-200 transition-colors duration-200"
                aria-label="Preguntas frecuentes"
              >
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:inline">Preguntas frecuentes</span>
              </TabsTrigger>
            </TabsList>

          
            {/* Contenido de la pestaña Contacto */}
            <TabsContent value="contacto" className="mt-12">
              <ContactoForm  />
            </TabsContent>

           

            {/* Contenido de la pestaña Equipo */}
            <TabsContent value="equipo" className="mt-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Nuestro equipo</h2>
                <p className="text-muted-foreground mb-8">
                  Conoce a las personas detrás de AutoMarket. Nuestro equipo está formado por profesionales apasionados
                  por crear la mejor plataforma de compra y venta de vehículos.
                </p>

                <div className="gap-8 mb-12">
                  {/* Propietario */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-600">VC</span>
                        </div>
                        <div>
                          <CardTitle>Valentino Copperi</CardTitle>
                          <CardDescription>Desarrollador Full Stack</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Desarrollador Full Stack
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">valentinocopperi@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">+54 9 2494 628279</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <Link
                            href="https://www.linkedin.com/in/valentinocopperi/"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            LinkedIn
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Contacto para colaboraciones</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ¿Interesado en colaborar con AutoMarket? Estamos abiertos a asociaciones estratégicas, integraciones
                    técnicas y oportunidades de crecimiento conjunto.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-600 pointer-events-none">
                    <Mail className="h-4 w-4 mr-2" />
                    Contactar para colaboraciones
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Contenido de la pestaña FAQ */}
            <TabsContent value="faq" className="mt-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h2>
                <p className="text-muted-foreground mb-8">
                  Encuentra respuestas a las preguntas más comunes sobre AutoMarket, nuestros servicios y cómo funciona
                  nuestra plataforma.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>¿Cómo puedo publicar mi vehículo en AutoMarket?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-2">Para publicar tu vehículo, sigue estos pasos:</p>
                      <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                        <li>Inicia sesión en tu cuenta (o crea una si aún no tienes)</li>
                        <li>Haz clic en el botón "Publicar" en la barra superior</li>
                        <li>Completa todos los detalles de tu vehículo</li>
                        <li>Sube fotos de buena calidad (mínimo 3 fotos)</li>
                        <li>Establece un precio y revisa tu publicación</li>
                        <li>Haz clic en "Publicar" y ¡listo!</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>¿Cuánto cuesta publicar en AutoMarket?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Publicar un vehículo en AutoMarket es completamente gratuito para publicaciones básicas.
                        Ofrecemos planes premium que incluyen mayor visibilidad, destacados en búsquedas y más fotos por
                        publicación. Puedes ver todos nuestros planes y precios en la sección "Suscripción".
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>¿Cómo me contactan los compradores interesados?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Los compradores pueden contactarte directamente a través de nuestro sistema de chat integrado.
                        Recibirás notificaciones por email cuando alguien te envíe un mensaje. También puedes optar por
                        mostrar tu número de teléfono en la publicación si lo prefieres.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>¿Cómo puedo destacar mi publicación?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">Puedes destacar tu publicación de varias formas:</p>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                        <li>Adquiriendo un plan premium</li>
                        <li>Comprando la opción "Destacado" individualmente</li>
                        <li>Utilizando el servicio "Impulsamos Juntos" para promoción adicional</li>
                      </ul>
                      <p className="text-muted-foreground mt-2">
                        Las publicaciones destacadas aparecen en los primeros resultados de búsqueda y tienen un
                        distintivo visual que las hace más atractivas.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>¿Cómo puedo verificar que un vendedor es confiable?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        En AutoMarket contamos con un sistema de verificación de vendedores. Los perfiles verificados
                        muestran una insignia azul. Además, puedes revisar las calificaciones y comentarios de otros
                        compradores. Siempre recomendamos verificar la documentación del vehículo antes de realizar
                        cualquier pago.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>¿AutoMarket cobra comisión por las ventas?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        No, AutoMarket no cobra comisión por las ventas realizadas. Nuestro modelo de negocio se basa en
                        los servicios premium y publicaciones destacadas. La transacción se realiza directamente entre
                        comprador y vendedor sin nuestra intervención.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>¿Cómo puedo eliminar mi publicación?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">Para eliminar una publicación, sigue estos pasos:</p>
                      <ol className="list-decimal pl-5 space-y-1 text-muted-foreground mt-2">
                        <li>Inicia sesión en tu cuenta</li>
                        <li>Ve a "Mis publicaciones"</li>
                        <li>Selecciona la publicación que deseas eliminar</li>
                        <li>Haz clic en el botón "Eliminar" que aparece en la página de detalles</li>
                        <li>Confirma la eliminación</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger>¿Puedo editar mi publicación después de publicarla?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Sí, puedes editar tu publicación en cualquier momento. Ve a "Mis publicaciones", selecciona la
                        que deseas modificar y haz clic en "Editar". Puedes cambiar la descripción, precio, fotos y casi
                        todos los detalles. Sin embargo, algunos cambios sustanciales (como el modelo del vehículo)
                        pueden requerir una nueva publicación.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-10 bg-muted p-6 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2">¿No encuentras lo que buscas?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Si tienes alguna pregunta que no está respondida aquí, no dudes en contactarnos.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">Contactar soporte</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
