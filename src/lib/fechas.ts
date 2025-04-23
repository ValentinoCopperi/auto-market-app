// Función para formatear la hora del mensaje
export function formatMessageTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) {
        return "Ahora mismo"
    } else if (diffMins < 60) {
        return `Hace ${diffMins} min`
    } else if (diffHours < 24) {
        return `Hace ${diffHours} h`
    } else if (diffDays === 1) {
        return "Ayer"
    } else if (diffDays < 7) {
        return `Hace ${diffDays} días`
    } else {
        return date.toLocaleDateString("es-AR", {
            day: "numeric",
            month: "short",
        })
    }
}
