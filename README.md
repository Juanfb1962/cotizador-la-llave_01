# Cotiza tu Kit anti lluvias

Mini web para que los vecinos de Los Olivos calculen una cantidad referencial de materiales para proteger su techo y puedan enviar la cotización por WhatsApp a Ferretería La Llave.

## Cómo abrirla

1. Abre el archivo `index.html` con doble clic. Se mostrará en tu navegador.
2. Ingresa el área del techo, elige el tipo y, si necesitas, indica los metros de canaleta.
3. Presiona **Calcular mi kit** para ver cantidades y total. Usa **Pedir por WhatsApp** para abrir el mensaje listo para enviar.

No requiere instalación ni configuración de servidor. Los datos ingresados solo se usan para el cálculo y el mensaje; no se guardan.

## Cómo cambiar precios, rendimientos o número de WhatsApp

Abre `script.js` con un editor de texto sencillo, como el Bloc de notas.

- Cambia `NUMERO_WHATSAPP` al inicio por el número de destino en formato internacional, con código de país y solo dígitos. Para Perú, coloca `51` seguido del número, sin espacios ni signos.
- En la lista `PRODUCTOS`, cambia `precio` para actualizar el precio en soles.
- Cambia `rendimiento` si varían los metros que cubre cada producto.
- Los comentarios junto a cada producto explican la regla. La canaleta es opcional y la cinta de refuerzo solo se incluye para techos de calamina.

Guarda el archivo y vuelve a cargar la página en el navegador.

## Archivos

- `index.html`: estructura y textos de la página.
- `styles.css`: colores, tamaños y adaptación a celulares y computadoras.
- `script.js`: validación, cálculo de cantidades, precios y enlace de WhatsApp.
- `README.md`: estas instrucciones.
