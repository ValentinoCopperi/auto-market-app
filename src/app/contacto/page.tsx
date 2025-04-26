import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Phone, MapPin, ExternalLink, MessageSquare, AlertTriangle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Contacto | AutoMarket",
  description: "Contacta con el equipo de AutoMarket para cualquier consulta, soporte técnico o información adicional.",
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="contacto" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Contacto</span>
              </TabsTrigger>
              <TabsTrigger value="reportar" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Reportar</span>
              </TabsTrigger>
              <TabsTrigger value="equipo" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Equipo</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Preguntas frecuentes</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenido de la pestaña Contacto */}
            <TabsContent value="contacto" className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Ponte en contacto</h2>
                  <p className="text-muted-foreground mb-6">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible. También puedes
                    contactarnos directamente a través de los canales que aparecen a continuación.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">contacto@automarket.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Teléfono</p>
                        <p className="font-medium">+54 11 5555-5555</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dirección</p>
                        <p className="font-medium">Av. Corrientes 1234, Buenos Aires, Argentina</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Horario de atención</h3>
                    <p className="text-sm text-muted-foreground mb-2">Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-sm text-muted-foreground">Sábados: 10:00 - 14:00</p>
                  </div>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Formulario de contacto</CardTitle>
                      <CardDescription>Completa el formulario y te responderemos a la brevedad.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="nombre" className="text-sm font-medium">
                              Nombre
                            </label>
                            <Input id="nombre" placeholder="Tu nombre" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="apellido" className="text-sm font-medium">
                              Apellido
                            </label>
                            <Input id="apellido" placeholder="Tu apellido" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input id="email" type="email" placeholder="tu@email.com" />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="asunto" className="text-sm font-medium">
                            Asunto
                          </label>
                          <Input id="asunto" placeholder="Asunto de tu mensaje" />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="mensaje" className="text-sm font-medium">
                            Mensaje
                          </label>
                          <Textarea id="mensaje" placeholder="Escribe tu mensaje aquí..." rows={5} />
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Enviar mensaje</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Contenido de la pestaña Reportar */}
            <TabsContent value="reportar" className="pt-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Reportar un problema</h2>
                <p className="text-muted-foreground mb-6">
                  Si has encontrado algún problema en nuestra plataforma, una publicación inadecuada o quieres reportar
                  alguna incidencia, por favor completa el siguiente formulario.
                </p>

                <Card>
                  <CardHeader>
                    <CardTitle>Formulario de reporte</CardTitle>
                    <CardDescription>
                      Todos los reportes son revisados por nuestro equipo en un plazo de 24-48 horas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="report-email" className="text-sm font-medium">
                          Tu email
                        </label>
                        <Input id="report-email" type="email" placeholder="tu@email.com" />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="report-type" className="text-sm font-medium">
                          Tipo de reporte
                        </label>
                        <select
                          id="report-type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Selecciona un tipo de reporte</option>
                          <option value="publicacion">Publicación inadecuada</option>
                          <option value="usuario">Usuario sospechoso</option>
                          <option value="error">Error técnico</option>
                          <option value="fraude">Intento de fraude</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="report-url" className="text-sm font-medium">
                          URL del problema (opcional)
                        </label>
                        <Input id="report-url" placeholder="https://automarket.com/publicacion/..." />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="report-description" className="text-sm font-medium">
                          Descripción detallada
                        </label>
                        <Textarea
                          id="report-description"
                          placeholder="Describe el problema con el mayor detalle posible..."
                          rows={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="report-file" className="text-sm font-medium">
                          Adjuntar capturas (opcional)
                        </label>
                        <Input id="report-file" type="file" multiple />
                        <p className="text-xs text-muted-foreground mt-1">
                          Puedes adjuntar hasta 3 imágenes (PNG, JPG) de máximo 5MB cada una.
                        </p>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Enviar reporte</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Contenido de la pestaña Equipo */}
            <TabsContent value="equipo" className="pt-6">
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
                          <span className="text-xl font-bold text-blue-600">JR</span>
                        </div>
                        <div>
                          <CardTitle>Valentino Copperi</CardTitle>
                          <CardDescription>Desarrollador Full Stack</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Con más de 15 años de experiencia en el sector automotriz, Valentino fundó AutoMarket en 2020 con la
                        visión de transformar la forma en que se compran y venden vehículos en Argentina.
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
                            href="https://linkedin.com/in/juanrodriguez"
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
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Contactar para colaboraciones
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Contenido de la pestaña FAQ */}
            <TabsContent value="faq" className="pt-6">
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
