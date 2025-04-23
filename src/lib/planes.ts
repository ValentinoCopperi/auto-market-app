export const puedeVerEstadisticas = (suscripcion: string) => {
    if(!suscripcion || suscripcion === "plan_ocasion") return false
    return true
}
