import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone } from 'lucide-react'
import React from 'react'   

const ContactoForm = () => {
    return (
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
                            <p className="font-medium">carmarketargentina@gmail.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Teléfono</p>
                            <p className="font-medium">+54 9 2494 628279</p>
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
    )
}

export default ContactoForm