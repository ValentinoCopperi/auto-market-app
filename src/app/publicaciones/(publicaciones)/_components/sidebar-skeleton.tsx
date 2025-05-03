export const SidebarSkeleton =() => {
    return (
      <div className="bg-card rounded-lg border border-border p-4 animate-pulse">
        {/* Título del sidebar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-5 w-5 rounded-full bg-muted"></div>
          <div className="h-6 w-24 bg-muted rounded"></div>
        </div>
  
        {/* Sección de filtro - Marca */}
        <div className="mb-6">
          <div className="h-5 w-16 bg-muted rounded mb-3"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
        </div>
  
        {/* Sección de filtro - Categoría */}
        <div className="mb-6">
          <div className="h-5 w-20 bg-muted rounded mb-3"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
        </div>
  
        {/* Sección de filtro - Precio */}
        <div className="mb-6">
          <div className="h-5 w-14 bg-muted rounded mb-3"></div>
          <div className="flex gap-2 mb-2">
            <div className="h-10 w-1/2 bg-muted rounded"></div>
            <div className="h-10 w-1/2 bg-muted rounded"></div>
          </div>
        </div>
  
        {/* Sección de filtro - Año */}
        <div className="mb-6">
          <div className="h-5 w-12 bg-muted rounded mb-3"></div>
          <div className="flex gap-2 mb-2">
            <div className="h-10 w-1/2 bg-muted rounded"></div>
            <div className="h-10 w-1/2 bg-muted rounded"></div>
          </div>
        </div>
  
        {/* Sección de filtro - Ciudad */}
        <div className="mb-6">
          <div className="h-5 w-16 bg-muted rounded mb-3"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
        </div>
  
        {/* Sección de filtro - Color */}
        <div className="mb-6">
          <div className="h-5 w-14 bg-muted rounded mb-3"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
        </div>
  
        {/* Botón de limpiar filtros */}
        <div className="h-10 w-full bg-muted rounded mt-6"></div>
      </div>
    );
  }
  