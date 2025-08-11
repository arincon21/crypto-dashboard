# Panel de Criptomonedas

Esta es una aplicación de panel de criptomonedas construida con Vue.js, TypeScript y Firebase. Permite a los usuarios rastrear los precios de las criptomonedas, gestionar su portafolio y mantenerse actualizados con las últimas noticias del mercado.

## Despliegue

La aplicación está desplegada en Firebase y se puede acceder a ella a través del siguiente enlace:

[https://crypto-dashboard-f1e61.firebaseapp.com/login](https://crypto-dashboard-f1e61.firebaseapp.com/login)

## Características

*   **Datos de Criptomonedas en Tiempo Real:** Vea información de precios en tiempo real para varias criptomonedas.
*   **Seguimiento de Portafolio:** Agregue y monitoree sus tenencias de criptomonedas.
*   **Noticias del Mercado:** Manténgase informado con las últimas noticias del mundo de las criptomonedas.
*   **Lista de Seguimiento:** Vigile sus criptomonedas favoritas.
*   **Alertas de Precios:** Configure alertas de precios para ser notificado de cambios de precios significativos.
*   **Autenticación de Usuarios:** Sistema seguro de autenticación de usuarios impulsado por Firebase.

## Tecnologías Utilizadas

*   **Vue.js:** Un marco de JavaScript progresivo para construir interfaces de usuario.
*   **TypeScript:** Un superconjunto tipado de JavaScript que compila a JavaScript plano.
*   **Vite:** una herramienta de compilación rápida y un servidor de desarrollo para proyectos web modernos.
*   **Pinia:** Una biblioteca de gestión de estado para Vue.js.
*   **Vue Router:** El enrutador oficial para Vue.js.
*   **Tailwind CSS:** Un marco de CSS de primera utilidad para un rápido desarrollo de la interfaz de usuario.
*   **Firebase:** Una plataforma para construir aplicaciones web y móviles, utilizada aquí para servicios de autenticación y base de datos.
*   **Heroicons:** Un conjunto de iconos SVG gratuitos y de alta calidad para que los uses en tus proyectos web.

## Empezando

### Prerrequisitos

*   Node.js (versión ^20.19.0 || >=22.12.0)
*   npm (o su gestor de paquetes favorito)
*   Un proyecto de Firebase

### Instalación

1.  Clone el repositorio:
    ```bash
    git clone https://github.com/your-username/crypto-dashboard.git
    ```
2.  Navegue al directorio del proyecto:
    ```bash
    cd crypto-dashboard
    ```
3.  Instale las dependencias:
    ```bash
    npm install
    ```
4.  Configure su configuración de Firebase en `src/firebase.ts`.

## Uso

Para iniciar el servidor de desarrollo, ejecute el siguiente comando:

```bash
npm run dev
```

Esto iniciará la aplicación en `http://localhost:5173`.

### Compilación

Para compilar la aplicación para producción, ejecute:

```bash
npm run build
```

Esto creará un directorio `dist` con los archivos listos para producción.

### Linting y Formateo

*   Para verificar el código: `npm run lint`
*   Para formatear el código: `npm run format`

## Estructura del Proyecto

```
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── dashboard/
│   │   └── icons/
│   ├── composables/
│   ├── router/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   ├── views/
│   ├── App.vue
│   ├── main.ts
│   └── firebase.ts
├── .firebaserc
├── firebase.json
├── index.html
├── package.json
└── README.md
```

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, siéntase libre de enviar una solicitud de extracción.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.