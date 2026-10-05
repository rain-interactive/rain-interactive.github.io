# Tutorial de primera entrada y logro

Versión 20261005-23. 2026-10-05.

Al pulsar Entrar en combate, quien todavía no haya completado el tutorial practica primero el movimiento a la derecha y después a la izquierda. Se usan las mismas mitades de pantalla y los mismos eventos de puntero que durante la partida; también funcionan las teclas de dirección y A/D.

La pantalla explica: «Si pulsas a la derecha de la pantalla te moverás a la derecha y si pulsas a la izquierda de la pantalla te moverás a la izquierda». La primera prueba pide pulsar a la derecha; después del desplazamiento muestra «Bien, aprendiste a moverte a la derecha». A continuación pide pulsar a la izquierda y confirma «Bien, enhorabuena, aprendiste a moverte a la izquierda».

La dirección equivocada no supera una prueba. Para validarla el personaje debe desplazarse diez unidades en la dirección indicada. Los controles se limpian entre pruebas para que una pulsación anterior no se arrastre al paso siguiente.

Tras ambas pruebas se muestra durante 2,7 segundos el logro «Enhorabuena, has completado el tutorial». La partida comienza automáticamente después. En el tutorial no hay enemigos, disparos automáticos, daño ni avance del reloj de campaña. La partida se reinicia desde su posición, salud, tiempo y arsenal iniciales al finalizar.

La finalización se guarda en localStorage con la clave sdj-commandos-tutorial-v1. Las siguientes partidas y visitas del mismo navegador entran directamente al combate. Si el navegador no permite guardar, se conserva la finalización durante la sesión. Un tutorial incompleto no se registra como completado.

Todas las instrucciones, felicitaciones y el logro tienen traducción ES/EN. El texto se ajusta al ancho del canvas. Se conserva la distribución de controles del juego cuando el canvas gira en un teléfono vertical.

## Comprobaciones

- Prueba de los controladores reales de pointerdown/pointerup, rechazando el lado equivocado y comprobando desplazamiento y secuencia.
- Comprobación de logro, guardado, finalización incompleta, visitas posteriores y repetición en la misma sesión.
- Inicio limpio de campaña después del logro, sin entradas mantenidas ni tiempo consumido.
- Teclado y correspondencia de mitades de pantalla en orientación vertical.
- Render de tutorial inicial, segunda prueba y logro; traducciones de juego y portada.
- Pruebas de arte, cincuenta oleadas y sus mecánicas; simulación completa de campaña sin tutorial para validar continuidad del combate.

Las pruebas usan canvas por software y controladores simulados. Queda pendiente la prueba manual en un navegador móvil real.
