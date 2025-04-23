interface MotorpointOptionsProps {
    className?: string
  }
  
  const MotorpointOptions = ({ className = "" }: MotorpointOptionsProps) => {
    return (
      <section className={`py-16  ${className}`} data-component="motorpoint-options">
        <div className="">
          <div className="">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Conoce tu opcion ideal</h2>
            <p className="text-lg mb-12 max-w-3xl">
              Consultar disponibilidad y precio según el vehículo, la zona donde se encuentra y la opción de revisión
              según necesidad:
            </p>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Opción 1 */}
              <div className="border rounded-lg p-6 h-full">
                <div className="w-4 h-4 rounded-full bg-blue-600 mb-4"></div>
                <h3 className="text-xl font-bold mb-1">
                  <span className="text-blue-600">OPCIÓN 1</span> - ESCANEO ELECTRÓNICO COMPLETO:
                </h3>
                <div className="mt-6 space-y-4 text-sm">
                  <p>• Lectura de códigos de falla registrados en todos los módulos electrónicos existentes</p>
                  <p>• Monitoreo de parámetros de funcionamiento normal en tiempo real</p>
                  <p>• Lectura y análisis de Kilometraje real, horas de operación y encendidos en cada módulo</p>
                  <p>• Borrado y reseteo de fallas:</p>
                  <p>
                    • Módulos de Motor, inyección, caja - transmisión, abs, esp, airbags, climatización, instrumental,
                    carrocería, iluminación y más
                  </p>
                  <p>Se entrega informe en PDF con todos los datos y fallas registradas</p>
                </div>
              </div>
  
              {/* Opción 2 */}
              <div className="border rounded-lg p-6 h-full">
                <div className="flex gap-1 mb-4">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                </div>
                <h3 className="text-xl font-bold mb-1">
                  <span className="text-blue-600">OPCIÓN 2</span> - REVISIÓN COMPLETA:
                </h3>
                <div className="mt-6 space-y-4 text-sm">
                  <p>ESCANEO ELECTRÓNICO •</p>
                  <p>• REVISIÓN VISUAL Y DINÁMICA •</p>
                  <p>• Estado de motor, caja - transmisión, frenos, suspensión, tren delantero, dirección, neumáticos.</p>
                  <p>
                    • Carrocería y pintura, medición con tester digital para controlar paneles repintados, reparados y
                    choques graves o estructurales
                  </p>
                  <p>• Prueba de funcionamiento normal de equipamiento, multimedia y accesorios</p>
                  <p>• Prueba de funcionamiento normal de iluminación y seguridad</p>
                </div>
              </div>
  
              {/* Información adicional */}
              <div className="p-6 h-full">
                <p className="mb-6">
                  Se entrega informe de escaneo y chequeo por puntos, detallando defectos, observaciones, reparaciones o
                  mantenimientos a realizarse para decidir sobre el precio y la compra de la unidad.
                </p>
                <p>
                  Adicionalmente, antes o después de realizar la revisión, se pueden solicitar informes de dominio
                  histórico, infracciones y siniestros registrados en compañías de seguros
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default MotorpointOptions
  