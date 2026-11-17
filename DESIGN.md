# Diseño de Bifurca

La interfaz funciona como mesa de edición narrativa. El árbol tiene el espacio principal y el inspector conserva los controles de edición juntos. El lienzo punteado marca la escala sin competir con los textos.

## Color y tipografía

- Carbón `#171816` para la página y `#151613` para el lienzo.
- Superficie `#20211e`, divisores `#373831` y texto principal `#f4f1e9`.
- Texto secundario `#aaa99e`. Ámbar `#e7b86d` para la acción principal, el foco y los puertos.
- Geist Variable local para texto y controles. Monoespaciada del sistema para conteos y etiquetas del grafo.

## Componentes y composición

El encabezado muestra el nombre del diálogo y las acciones de sesión. El inspector tiene hasta 330 px de ancho. Bajo 768 px el lienzo y el inspector se apilan. Cada nodo expone un puerto por respuesta, con trazo discontinuo para conexiones pendientes. Las etiquetas Inicio y Final identifican su función con texto.

Los botones dan retroalimentación breve al pulsar. Los campos conservan su etiqueta y un contorno al enfocar. El simulador mantiene visible el paso actual y devuelve el foco al editor al cerrarse. Las transiciones de los botones se desactivan con la preferencia de movimiento reducido.

