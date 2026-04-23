# Momento Challenge (TypeScript)

Proyecto en Node.js + TypeScript que calcula **emisión**, **siniestros** y **bono** por agente a partir de archivos CSV y muestra el resultado en consola.

## Requisitos

- Node.js (recomendado 18+)
- npm

## Instalación

```bash
npm install
```

## Ejecución

Modo “watch” (usa `nodemon` + `ts-node`):

```bash
npm start
```

## Validación del proceso (primer semestre 2025)

Para validar la ejecución, el cálculo del bono se realiza **solo** con operaciones cuya fecha esté en el rango:

- Desde: `2025-01-01`
- Hasta: `2025-06-30`

Esto aplica a las operaciones leídas desde:

- `src/resources/issuance.csv`
- `src/resources/claims.csv`

## Qué calcula

El flujo principal está en `src/server.ts`:

1. Lee agentes desde `src/resources/agents.csv`.
2. Lee operaciones de emisión desde `src/resources/issuance.csv`.
3. Lee operaciones de siniestros desde `src/resources/claims.csv`.
4. Calcula por agente:
   - **Emisión**: suma de `amount` donde `operation === "issuance"`.
   - **Siniestros**: `(reserve + adjust) - (deductible - recovery)`.
   - **PB** (porcentaje de bono): depende de la siniestralidad (accident rate) y del total de emisión.
   - **Bono**: `(emisión * PB) / 100`.
5. Imprime una tabla en consola:

```text
AGENTE  NOMBRE  APELLIDO  EMISIÓN  SINIESTROS  BONO
...
```

## Estructura del proyecto

- `src/server.ts`: entrypoint; orquesta lectura, cálculos e impresión.
- `src/logic/agents.ts`: carga de agentes + formateo de salida.
- `src/logic/operations.ts`: carga/filtrado de operaciones + reglas de cálculo.
- `src/logic/utils.ts`: utilería para leer CSV (`csv-parse`).
- `src/resources/*.csv`: fuentes de datos.

## Chequeo de TypeScript

```bash
npx tsc -p tsconfig.json --noEmit
```

## Resultado
<img width="1007" height="418" alt="Screenshot_20260422_194712" src="https://github.com/user-attachments/assets/5f42ec18-f4d3-46f0-9ab7-7a72c866399b" />
