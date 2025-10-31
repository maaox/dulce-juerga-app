import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================
  // USERS
  // ============================================
  console.log('👤 Creating users...');

  const adminPassword = await hashPassword('admin123');
  const bartenderPassword = await hashPassword('bartender123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@halloween.com' },
    update: {},
    create: {
      nombre: 'Admin',
      email: 'admin@halloween.com',
      password: adminPassword,
      rol: 'ADMIN',
    },
  });

  const bartender1 = await prisma.user.upsert({
    where: { email: 'carlos@halloween.com' },
    update: {},
    create: {
      nombre: 'Carlos López',
      email: 'carlos@halloween.com',
      password: bartenderPassword,
      rol: 'BARTENDER',
      barra: 'barra_1',
    },
  });

  const bartender2 = await prisma.user.upsert({
    where: { email: 'maria@halloween.com' },
    update: {},
    create: {
      nombre: 'María García',
      email: 'maria@halloween.com',
      password: bartenderPassword,
      rol: 'BARTENDER',
      barra: 'barra_2',
    },
  });

  const cajero = await prisma.user.upsert({
    where: { email: 'cajero@halloween.com' },
    update: {},
    create: {
      nombre: 'Pedro Ramírez',
      email: 'cajero@halloween.com',
      password: bartenderPassword,
      rol: 'CAJERO',
    },
  });

  console.log(`✅ Created ${[admin, bartender1, bartender2, cajero].length} users`);

  // ============================================
  // PRODUCTS
  // ============================================
  console.log('🍺 Creating products...');

  const productos = [
    // Cervezas
    {
      nombre: 'Cerveza Pilsen',
      descripcion: '330ml bien helada',
      categoria: 'CERVEZA',
      precioBase: 8,
      costoUnitario: 3,
      stockInicial: 100,
      stockActual: 100,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    {
      nombre: 'Cerveza Cusqueña',
      descripcion: '330ml - La cerveza de oro',
      categoria: 'CERVEZA',
      precioBase: 9,
      costoUnitario: 3.5,
      stockInicial: 80,
      stockActual: 80,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    {
      nombre: 'Cerveza Corona',
      descripcion: '355ml con limón',
      categoria: 'CERVEZA',
      precioBase: 12,
      costoUnitario: 5,
      stockInicial: 60,
      stockActual: 60,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    // Tragos
    {
      nombre: 'Ron con Coca Cola',
      descripcion: '2oz ron + Coca Cola + hielo + limón',
      categoria: 'TRAGO',
      precioBase: 10,
      costoUnitario: 2.5,
      stockInicial: 60,
      stockActual: 60,
      unidadMedida: 'UNIDAD',
      disponible: true,
      opciones: JSON.stringify([
        { nombre: 'Ron Cartavio', precioExtra: 0 },
        { nombre: 'Ron Flor de Caña', precioExtra: 2 },
      ]),
    },
    {
      nombre: 'Pisco Sour',
      descripcion: 'Clásico peruano con pisco, limón y clara de huevo',
      categoria: 'TRAGO',
      precioBase: 15,
      costoUnitario: 4,
      stockInicial: 40,
      stockActual: 40,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    {
      nombre: 'Mojito',
      descripcion: 'Ron blanco, hierbabuena, limón, azúcar y soda',
      categoria: 'TRAGO',
      precioBase: 12,
      costoUnitario: 3,
      stockInicial: 50,
      stockActual: 50,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    {
      nombre: 'Caipiriña',
      descripcion: 'Cachaza, limón, azúcar y hielo',
      categoria: 'TRAGO',
      precioBase: 13,
      costoUnitario: 3.5,
      stockInicial: 40,
      stockActual: 40,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    // Shots
    {
      nombre: 'Shot Tequila',
      descripcion: 'Shot de tequila con sal y limón',
      categoria: 'SHOT',
      precioBase: 7,
      costoUnitario: 2,
      stockInicial: 80,
      stockActual: 80,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    {
      nombre: 'Shot Jägermeister',
      descripcion: 'Shot helado de Jägermeister',
      categoria: 'SHOT',
      precioBase: 8,
      costoUnitario: 2.5,
      stockInicial: 60,
      stockActual: 60,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    {
      nombre: 'Shot Sangre de Vampiro',
      descripcion: 'Mezcla especial de Halloween - Tequila con grenadina',
      categoria: 'SHOT',
      precioBase: 10,
      costoUnitario: 3,
      stockInicial: 50,
      stockActual: 50,
      unidadMedida: 'UNIDAD',
      disponible: true,
      badges: JSON.stringify(['nuevo', 'especial']),
    },
    // Sin Alcohol
    {
      nombre: 'Agua San Luis',
      descripcion: '625ml',
      categoria: 'SIN_ALCOHOL',
      precioBase: 3,
      costoUnitario: 1,
      stockInicial: 50,
      stockActual: 50,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    {
      nombre: 'Gaseosa Inca Kola',
      descripcion: '500ml',
      categoria: 'SIN_ALCOHOL',
      precioBase: 4,
      costoUnitario: 1.5,
      stockInicial: 60,
      stockActual: 60,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
    {
      nombre: 'Red Bull',
      descripcion: '250ml - Bebida energética',
      categoria: 'SIN_ALCOHOL',
      precioBase: 8,
      costoUnitario: 3,
      stockInicial: 40,
      stockActual: 40,
      unidadMedida: 'UNIDAD',
      disponible: true,
    },
  ];

  for (const producto of productos) {
    const existing = await prisma.product.findFirst({
      where: { nombre: producto.nombre },
    });

    if (!existing) {
      await prisma.product.create({
        data: producto as any,
      });
    }
  }

  console.log(`✅ Created ${productos.length} products`);

  // ============================================
  // CONFIG
  // ============================================
  console.log('⚙️  Creating config...');

  const descuentos = [
    {
      horaInicio: '21:00',
      horaFin: '22:00',
      porcentaje: 30,
      descripcion: 'Happy Hour Extremo',
    },
    {
      horaInicio: '22:00',
      horaFin: '23:00',
      porcentaje: 20,
      descripcion: 'Happy Hour',
    },
    {
      horaInicio: '23:00',
      horaFin: '00:00',
      porcentaje: 10,
      descripcion: 'Última Hora',
    },
  ];

  await prisma.config.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      eventoFecha: new Date('2024-10-31'),
      eventoHoraInicio: '21:00',
      eventoHoraFin: '04:00',
      eventoNombre: 'Halloween Party 2024',
      eventoAforoMaximo: 150,
      eventoEstado: 'preparacion',
      descuentosEnabled: true,
      descuentos: JSON.stringify(descuentos),
      precioLibre: 0,
      precioPrioritaria: 5,
      precioVip: 8,
    },
  });

  console.log('✅ Created config');

  console.log('');
  console.log('✨ Seed completed successfully!');
  console.log('');
  console.log('📝 Test credentials:');
  console.log('   Admin: admin@halloween.com / admin123');
  console.log('   Bartender: carlos@halloween.com / bartender123');
  console.log('   Bartender: maria@halloween.com / bartender123');
  console.log('   Cajero: cajero@halloween.com / bartender123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
