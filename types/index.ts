import {
  User,
  Product,
  Sale,
  SaleItem,
  Song,
  Config,
  Role,
  Categoria,
  UnidadMedida,
  MetodoPago,
  EstadoVenta,
  TipoCancion,
  EstadoCancion
} from '@prisma/client';

// Export Prisma types
export type {
  User,
  Product,
  Sale,
  SaleItem,
  Song,
  Config,
  Role,
  Categoria,
  UnidadMedida,
  MetodoPago,
  EstadoVenta,
  TipoCancion,
  EstadoCancion,
};

// Extended types
export type SaleWithItems = Sale & {
  items: (SaleItem & {
    product: Product;
  })[];
  user: User;
};

export type ProductWithSales = Product & {
  saleItems: SaleItem[];
};

// Dashboard types
export interface DashboardStats {
  ventas: {
    total: number;
    cantidad: number;
    promedio: number;
    porMetodoPago: {
      efectivo: number;
      yape: number;
      plin: number;
      tarjeta: number;
      pulsera: number;
    };
    porBarra: {
      barra_1: number;
      barra_2: number;
    };
  };
  productos: {
    totalVendidos: number;
    masVendidos: {
      productoId: string;
      nombre: string;
      cantidad: number;
      total: number;
      imagenUrl: string | null;
    }[];
    stockCritico: {
      productoId: string;
      nombre: string;
      stockActual: number;
      stockInicial: number;
      porcentaje: number;
    }[];
  };
  canciones: {
    totalSolicitudes: number;
    porTipo: {
      libres: number;
      prioritarias: number;
      vips: number;
    };
    totalRecaudado: number;
    promedioEspera: number;
  };
  utilidad: {
    ingresos: number;
    costos: number;
    utilidadNeta: number;
    margenPorcentaje: number;
  };
}

// Discount types
export interface DescuentoFranja {
  horaInicio: string;
  horaFin: string;
  porcentaje: number;
  descripcion: string;
}

export interface DescuentoActual {
  activo: boolean;
  porcentaje: number;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  tiempoRestanteMinutos: number;
  proximoDescuento: {
    porcentaje: number;
    horaInicio: string;
  } | null;
}

// Cart types
export interface CartItem {
  producto: Product;
  cantidad: number;
}

// Payment details types
export interface PagoEfectivo {
  montoRecibido: number;
  cambio: number;
}

export interface PagoYapePlin {
  numeroOperacion: string;
  telefono: string;
  comprobanteUrl?: string;
  comprobanteKey?: string;
}

export interface PagoTarjeta {
  transaccionId: string;
  ultimos4Digitos: string;
}

export interface PagoPulsera {
  pulseraId: string;
  creditoUsado: number;
}

export type PagoDetalles = PagoEfectivo | PagoYapePlin | PagoTarjeta | PagoPulsera;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
