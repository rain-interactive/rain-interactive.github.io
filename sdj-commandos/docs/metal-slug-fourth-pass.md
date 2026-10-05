# Metal Slug: cuarta pasada de arte

Versión 20261005-22. 2026-10-05.

Se volvió a revisar la hoja de 54 fotogramas del vídeo oficial de aniversario de SNK, especialmente sus máquinas, fogonazos y destrucción. Referencia: https://www.snk-corp.co.jp/us/anniversary/metalslug30th/assets/video/bg_ms30th_v01_sp.mp4. Las formas se adaptan mediante gráficos originales de canvas; no se incorporan sprites ni fotogramas originales al juego.

## Cambios

- Blindados con cinco paletas: arena, azul grisáceo naval, verde industrial, tonos claros de montaña y metal oscuro en la cueva.
- Siluetas distintas de jefes: sacos y carga en el zoco, panel naval en el puerto, protección frontal en industria, tubo elevado de artillería en montaña y placas oscuras con ranura luminosa en cueva.
- Pequeña compresión e inclinación del chasis al disparar, vinculada al reloj real de retroceso.
- Puerta, paneles y remaches adicionales en el helicóptero.
- Impactos separados por material: chispas y destello en metal, astillas en madera y partículas menores en personajes. Son efectos visuales; no cambian daño, colisiones ni cadencia.
- Los vehículos destruidos dejan restos de orugas, casco y cañón, o una cabina y rotor partidos. Emiten humo al principio y desaparecen a los doce segundos. Solo se conservan los ocho restos más recientes; se limpian al reiniciar y cambiar de zona.

Los restos quedan detrás de enemigos y jugador. Las amenazas, los objetos y los bocadillos mantienen su capa superior para conservar la lectura del combate.

## Verificación

- Render e inspección de cinco jefes y sus paletas, incluyendo capturas del puerto y la montaña.
- Pruebas de los tres materiales, límite y expiración de restos, limpieza de reinicio y de transición.
- Se mantienen las pruebas de marcha, retroceso, bocadillos sin voz, diez oleadas por zona y jefe a 150 segundos, suministros y legibilidad bajo humo.
- Campaña completa comprobada por simulación determinista de progresión, con invulnerabilidad: unas 12 minutos y 50 segundos simulados, cuarenta cofres y tres evoluciones. Las 29 armas y sus mecánicas pasan las comprobaciones.

Estas pruebas no sustituyen una prueba manual en navegador o teléfono ni una evaluación del equilibrio de dificultad.
