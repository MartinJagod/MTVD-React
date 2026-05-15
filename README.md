# RutaB2B MVP

RutaB2B es una primera versión técnica de una plataforma SaaS B2B para vendedores viajantes y representantes comerciales independientes. El MVP centraliza empresas representadas, clientes, catálogos, listas de precios y el armado básico de Notas de Pedido.

## Stack

- Next.js App Router
- TypeScript estricto
- TailwindCSS
- Prisma ORM
- PostgreSQL
- React Hook Form
- Zod
- pnpm como package manager recomendado

## Funcionalidades incluidas

- Autenticación simulada con un vendedor activo y roles preparados: `ADMIN`, `COMPANY`, `SELLER`, `CUSTOMER`.
- Modelo Prisma para usuarios, empresas, vendedores, clientes, productos, listas de precios y pedidos.
- Seed con 2 empresas representadas, 2 vendedores, 4 clientes, 4 categorías, 12 productos, 3 listas de precios y relaciones comerciales.
- Dashboard del vendedor con selector de cliente activo, empresas, accesos rápidos y últimos pedidos.
- Catálogo por empresa con búsqueda, filtro por categoría, vista de cards y vista de lista rápida.
- Precio visible según listas asignadas al cliente; productos sin precio muestran “Precio no disponible” y no se pueden agregar.
- Creación de Nota de Pedido con cálculo de subtotal, IVA y total.
- Guardado como borrador o marcado como enviada.
- Listado y detalle de Notas de Pedido con historial de estado.

## Instalación

> Este repo está preparado para pnpm. No uses `npm install`: el proyecto incluye `pnpm-lock.yaml`, `packageManager` y un guard de `preinstall` para evitar mezclar lockfiles/package managers.


```bash
corepack enable
pnpm install
```

## Variables de entorno

Copiá el archivo de ejemplo y completá la URL de PostgreSQL:

```bash
cp .env.example .env
```

Ejemplo:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/rutab2b?schema=public"
```

## Comandos Prisma

Generar el cliente Prisma:

```bash
pnpm prisma:generate
```

Crear/aplicar migraciones en desarrollo:

```bash
pnpm prisma:migrate
```

Cargar datos iniciales:

```bash
pnpm prisma:seed
```

También podés ejecutar el seed con Prisma:

```bash
pnpm prisma db seed
```

## Correr la aplicación

```bash
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000). La raíz redirige a `/dashboard`.

## Cómo probar el MVP

1. Ejecutá la migración y el seed.
2. Ingresá a `/dashboard`.
3. Seleccioná un cliente activo.
4. Abrí una empresa representada y revisá el catálogo.
5. Cambiá entre vista catálogo y lista rápida.
6. Intentá agregar productos sin precio: quedan bloqueados.
7. Creá una Nota de Pedido desde `/orders/new`.
8. Guardala como borrador o marcala como enviada.
9. Revisá el listado en `/orders` y el detalle en `/orders/[orderId]`.

## Reglas comerciales implementadas

- El precio mostrado sale de una `PriceList` asignada al `Customer` para la `Company` seleccionada.
- Si el cliente no tiene lista asignada para esa empresa, el producto muestra “Precio no disponible”.
- No se permite agregar productos sin precio disponible.
- Cada `OrderItem` guarda el precio aplicado al momento de crear el pedido.
- El pedido calcula subtotal, IVA y total.
- Los pedidos `DRAFT` se identifican como editables; los `SENT` quedan bloqueados para edición en esta versión.

## Nota sobre pnpm y Prisma

Con pnpm v10 los scripts de build/postinstall de dependencias pueden quedar bloqueados hasta aprobarlos. En este MVP se ejecuta `pnpm prisma:generate` explícitamente después de configurar `DATABASE_URL`, por lo que no dependemos del postinstall de npm.

## Próximos pasos sugeridos

- Reemplazar auth simulada por NextAuth/Auth.js o proveedor equivalente.
- Agregar edición real de borradores y persistencia de carrito por vendedor/cliente.
- Mejorar permisos por rol y visibilidad multiempresa.
- Agregar importación masiva de productos y precios.
- Incorporar auditoría operativa, estados intermedios y notificaciones.
- Preparar integración futura con ERP, facturación, WhatsApp e IA sin acoplarla al dominio actual.
