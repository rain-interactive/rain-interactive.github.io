/* Reproductor oficial SoundCloud: no aloja ni copia el audio. */
(()=>{'use strict';
const mixes=[
 {name:'Sasha Crush · disco y funk',short:'Disco / Funk',desc:'Soul, synth-pop, disco, funk y algo de freestyle. Para escuchar mientras trabajas.',url:'https://soundcloud.com/user-643553014/sasha-crush-110724'},
 {name:'Moxie · The Travel Episode',short:'Suave / Soul',desc:'Una sesión de NTS tranquila: Sault, Khruangbin, Björk, Cleo Sol y Can.',url:'https://soundcloud.com/djmoxie/moxie-on-nts-radio-home-broadcast-22-travel-episode-pt-2-160920'},
 {name:'Moxie · NTS 2026',short:'House / DJ',desc:'La selección de sesiones de Moxie en NTS durante 2026: house, groove y descubrimientos.',url:'https://soundcloud.com/djmoxie/sets/moxie-nts-radio-playlist-2026'},
 {name:'Cheb Mimo · downtempo y raï',short:'Ritmos globales',desc:'Selección relajada y bailable con raï, discos magrebíes y downtempo.',url:'https://soundcloud.com/scenenoise/mimo-select'},
 {name:'pmresistance · All Styles All Smiles',short:'Soul / Boogie',desc:'Sonidos de los 80 y 90: soul, boogie y góspel de buen humor.',url:'https://soundcloud.com/pmresistance/nts-radio-mix-for-all-styles'},
 {name:'babyschön · Phonica',short:'Post-punk / Italo',desc:'NTS resident: italo, post-punk, EBM y house raro pero con ritmo.',url:'https://soundcloud.com/phonicarecords/off-the-record-mix-series-59-babyschon'},
 {name:'Channeling · indie rock y new wave',short:'Indie / Rock',desc:'Una sesión de NTS con indie, new wave y guitarras, fuera de lo electrónico.',url:'https://soundcloud.com/user-643553014/channeling-w-ivan-smagghe-8'},
 {name:'Pictureplane · indie rap 90s/2000s',short:'Hip-hop',desc:'Rap underground y boom bap de finales de los 90 y primeros 2000.',url:'https://soundcloud.com/pictureplane/nts-radio-boxxx-report-late-90s-early-2000s-indie-rap-mix'},
 {name:'NTS Guide To · colección',short:'Exploraciones',desc:'Sesiones de jazz, shoegaze, psicodelia brasileña, folk, vaporwave y otras rarezas.',url:'https://soundcloud.com/waitingfordog/sets/nts-guide-to'},
 {name:'NTS · CC:Disco! (2025)',short:'Disco elegante',desc:'Dos horas para cocinar o dibujar: Stevie Wonder, disco, soul y house cálido.',url:'https://soundcloud.com/user-643553014/cc-disco-220125'},
 {name:'NTS · CC:Disco! (2024)',short:'Disco y house',desc:'De Byron The Aquarius y Leon Vynehall a Womack & Womack. Energía sin estridencias.',url:'https://soundcloud.com/user-643553014/cc-disco-131124'},
 {name:'NTS · Prosumer (2025)',short:'Deep house',desc:'Todd Terry, Kerri Chandler y house para dejar sonando el estudio.',url:'https://soundcloud.com/user-643553014/prosumer-130525'},
 {name:'NTS · Prosumer For Hibiscus',short:'Synth / Boogie',desc:'Bowie, disco, boogie y synth-pop en una mezcla afectuosa y variada.',url:'https://soundcloud.com/user-643553014/prosumer-for-hibiscus-030924'},
 {name:'NTS · SlothBoogie',short:'Funk / Groove',desc:'Jazz, soul profundo, funk, broken beat y house amable.',url:'https://soundcloud.com/user-643553014/ldldn-w-slothboogie-010723'},
 {name:'NTS Radio · 48 sesiones',short:'48 sesiones NTS',desc:'Lista de SoundCloud con Floating Points, Thom Yorke, Four Tet, Caribou, vaporwave y más.',url:'https://soundcloud.com/verybusyppl/sets/nts-radio'},
 {name:'NTS · GiGi FM Production Mix',short:'Jungle / Dub',desc:'Jungle, techno, poesía y paisajes sonoros. Para la parte más exploradora del día.',url:'https://soundcloud.com/gigi-fm/nts-radio-gigi-fm-production-mix-21052025'},
 {name:'NTS · Orpheu The Wizard',short:'Electrónica rara',desc:'Selección de house, electrónica, disco oblicuo y hallazgos menos previsibles.',url:'https://soundcloud.com/user-643553014/orpheu-the-wizard-140624'},
 {name:'NTS · David August',short:'Club / Ritmo',desc:'Sesión acelerada de club con 45 temas y edits en 56 minutos.',url:'https://soundcloud.com/davidaugust/nts-radio-16012025'},
 {name:'NTS · IMOGEN Production Mix',short:'Techno / Club',desc:'Producción propia y atmósfera nocturna para cuando apetezca más intensidad.',url:'https://soundcloud.com/imogensmusic/nts-radio-100-production-mix'},
 {"name":"Vox Sinistra · Samo Mix 85","short":"Darkwave · EBM","desc":"Sintes oscuros, EBM y new beat. Mi elección para la noche de luces verdes.","url":"https://soundcloud.com/samorecords/samo-mix-85-vox-sinistra"},
 {"name":"Arnaud Rebotini · EBM Selection","short":"EBM francés","desc":"Máquinas analógicas y pulso industrial. Rebotini, The Hacker y Schwefelgelb.","url":"https://soundcloud.com/arnaudrebotini/a-modern-ebm-and-techno-selection-fevrier-2025-mix"},
 {"name":"CURVE X · Alien Planet","short":"Acid / Post-punk","desc":"Un viaje de vinilo desde Barcelona: post-punk, acid, techno y experimentación.","url":"https://soundcloud.com/from-hell-to-disco/from-hell-to-disco-03-curve-x"},
 {"name":"Local Suicide · Blank Wave","short":"Disco oscuro","desc":"Indie dance, italo, new wave y el lado más nocturno de Berlín.","url":"https://soundcloud.com/shialabiff/blank-wave-guest-mix-117-local-suicide"},
 {"name":"Huerco S · RA.658","short":"Ambient inquietante","desc":"Paisajes ambientales, extraños y envolventes; para mirar la Casa en silencio.","url":"https://soundcloud.com/resident-advisor/ra658-huerco-s"},
 {"name":"GiGi FM + Shoal · NTS","short":"Ambient / Texturas","desc":"Síntesis cruda y paisajes sonoros contemplativos; tecnología y naturaleza.","url":"https://soundcloud.com/gigi-fm/nts-radio-gigi-fm-presents-1"},
 {"name":"GiGi FM · F_LORAL","short":"Ambient íntimo","desc":"Música atmosférica luminosa para las horas de descanso.","url":"https://soundcloud.com/gigi-fm/gigi-fm-presents-f_loral-nts-radio-january-2026"},
 {"name":"DJ Stingray · Zone 313","short":"Electro futurista","desc":"Electro de Detroit, energía sintética y ritmos rápidos.","url":"https://soundcloud.com/rinsefm/djstingray260126"},
 {"name":"Buttechno · NTS enero 2026","short":"Ambient / Extraño","desc":"Pavel Milyakov: atmósferas melancólicas y experimentales.","url":"https://soundcloud.com/buttechno/nts-12012026"},
 {"name":"Inch of Shadow · Insomnia Berlin","short":"Dark disco / EBM","desc":"Dos horas de dark disco, EBM y electro grabadas en Berlín.","url":"https://soundcloud.com/inch-of-shadow/inch-of-shadow-insomnia-dj-set"},
 {"name":"Indie Music Nation · Dream Pop","short":"Shoegaze / Indie","desc":"Guitarras veladas, dream pop y canciones para mirar por la ventana.","url":"https://soundcloud.com/indiemusicnation/sets/dream-pop-shoegaze-april-2026"},
 {"name":"NTS · Dream Forest","short":"Jungle ambiental","desc":"Breakbeats de los noventa, neblina y nostalgia digital.","url":"https://soundcloud.com/user-202286394-991268468/dream-forest-w-barrage-250426"}
,
 {"name":"Minimal Schlager · TANK Mix","short":"Italo / Darkwave","desc":"Disco italiano, synth-pop inquieto, DAF, The Cure y Boy Harsher. Un salón de Lu Roth a medianoche.","url":"https://soundcloud.com/tank-magazine/tank-mix-minimal-schlager"},
 {"name":"Demdike Stare · MovingMetals","short":"Ritual / Industrial","desc":"Collage electrónico sombrío y espectral, para las escenas nocturnas más extrañas.","url":"https://soundcloud.com/modernlove/demdike-stare-mix-movingmetals"},
 {"name":"Skee Mask · Mixtape 001","short":"IDM / Ambient","desc":"Ambient espacial, breakbeats y techno de Munich; movimiento de cámara en cámara lenta.","url":"https://soundcloud.com/metamorphnyc/artcast001-skee-mask"},
 {"name":"Loraine James · NTS 140426","short":"Glitch / IDM","desc":"Jazz deconstruido, IDM y detalles ambientales, todo lo imperfecto y humano de la electrónica.","url":"https://soundcloud.com/user-202286394-991268468/loraine-james-140426"},
 {"name":"Ellen Allien · SECTION London","short":"Techno hipnótico","desc":"Sintetizadores espaciales, voces retorcidas y una sesión muy física.","url":"https://soundcloud.com/ellen-allien/ellen-alien-section-london-june-2025"},
 {"name":"Helena Hauff · The Cover Mix","short":"Electro crudo","desc":"Electro tenso y nocturno, máquinas viejas y electricidad en las paredes.","url":"https://soundcloud.com/mixmag-1/the-cover-mix-helena-hauff"},
 {"name":"DJ Diskord · Witch House","short":"Witch house","desc":"Salem, CRIM3S, Gesaffelstein y niebla digital para la Casa.","url":"https://soundcloud.com/morbidx-1/witch-housedark-trap-mix-by-dj-diskord"},
 {"name":"Doctor Jeep · De School","short":"Club / Bass","desc":"Una sesión oscura de club grabada en Ámsterdam, con ritmos de bajos muy vivos.","url":"https://soundcloud.com/drjeep/doctor-jeep-live-at-de-school"},
 {"name":"CRIM3S · selección oscura","short":"Witch / Noise","desc":"Recorrido concentrado por las canciones de CRIM3S: pulsos sucios y distorsión emocional.","url":"https://soundcloud.com/user-11160019-216054474/crim3s-mix"},
 {"name":"Boy Harsher · Machina Dark Mix","short":"Dark synth","desc":"Synth oscuro e hipnótico de Boy Harsher para una pausa breve entre sesiones.","url":"https://soundcloud.com/boy-harsher/machina-ft-mariana-saldana-1"},
 {"name":"Ethio-jazz · Addis Abeba","short":"Ethio-jazz","desc":"Metales oblicuos, soul etíope y melodías de Addis Abeba. Un sol extraño en la habitación.","url":"https://soundcloud.com/swanndelamancha/ethio-jazz-summer-mix-25","moods":["mañana","taller","atardecer","gris atlántico"],"discovery":true},
 {"name":"Bandas sonoras · Cine europeo","short":"Cine / 70s","desc":"Bandas sonoras francesas e italianas: jazz cinematográfico y la melancolía del cine de los setenta.","url":"https://soundcloud.com/swanndelamancha/french-italian-soundtracks-summer-mix-25","moods":["atardecer","gris atlántico","lluvia","nocturna"],"discovery":true},
 {"name":"Brasil · Verano de vinilo","short":"Brasil","desc":"Una sesión brasileña para abrir las ventanas; movimiento, calor y música popular de otros continentes.","url":"https://soundcloud.com/swanndelamancha/brazil-summer-mix-25","moods":["mañana","taller","atardecer"],"discovery":true},
 {"name":"Rook Radio · Highlife nigeriano","short":"Afrobeat / Highlife","desc":"Afrobeat y highlife de los setenta desde vinilos africanos: guitarras luminosas y ritmos hipnóticos.","url":"https://soundcloud.com/rookrecordsuk/rook-radio-6-70s-afrobeat-nigerian-highlife","moods":["mañana","taller","atardecer"],"discovery":true},
 {"name":"DOROTOP · Chicha peruana","short":"Chicha / Cumbia","desc":"Cumbia amazónica psicodélica: Los Mirlos, Los Destellos y guitarras que parecen de otro planeta.","url":"https://soundcloud.com/dorotop/mix-map-chicha","moods":["mañana","taller","atardecer"],"discovery":true},
 {"name":"Roots, ska y dub · Archivo jamaicano","short":"Dub / Reggae","desc":"Colección de mezclas de roots reggae, rocksteady, ska y dub; una pared de ecos y bajos cálidos.","url":"https://soundcloud.com/amine-laidia/sets/dub-ska-reggae-roots","moods":["lluvia","gris atlántico","mañana","atardecer"],"discovery":true},
 {"name":"Yussef Dayes · Jazz en movimiento","short":"Jazz / Broken beat","desc":"Jazz contemporáneo, improvisación, broken beat y soul con un pulso extraordinariamente vivo.","url":"https://soundcloud.com/fabrik-tetra/sets/yussef-dayes-tracks-remixes-live-mixing-sessions","moods":["mañana","taller","lluvia","atardecer"],"discovery":true},
 {"name":"Archivo electroacústico · Música concreta","short":"Música concreta","desc":"Una colección de música concreta y experimentación acúsmatica: máquinas, texturas y escucha radical.","url":"https://soundcloud.com/yasmine-cometa/sets/electronic-musique-concrete","moods":["insomnio","nocturna","lluvia nocturna","gris atlántico"],"discovery":true},
 {"name":"Ambient y clásica contemporánea","short":"Neoclásica / Ambient","desc":"Texturas electrónicas, cuerdas y composiciones contemporáneas; tiempo suspendido, sin obligación de bailar.","url":"https://soundcloud.com/anthony-bro-petit-67152302/sets/ambient-electronica-modern","moods":["lluvia nocturna","insomnio","lluvia","gris atlántico","mañana"],"discovery":true},
 {"name":"TREKKIE TRAX · Pura Pura","short":"Footwork / UK Bass","desc":"Un viaje veloz entre UK garage, bass music, Jersey club y footwork; danza sin línea recta.","url":"https://soundcloud.com/trekkie-trax/trekkie-trax-mix-012-pura-pura","moods":["taller","nocturna","atardecer","insomnio"],"discovery":true},
 {"name":"Glitch / Gaze · Dave NULL / VOID","short":"Shoegaze / Glitch","desc":"Guitarras shoegaze atravesadas por IDM, trip-hop y distorsión digital: fragilidad y ruido.","url":"https://soundcloud.com/dave-nullvoid/glitchgaze-mix-shoegaze-dreampop","moods":["insomnio","lluvia","gris atlántico","lluvia nocturna"],"discovery":true},
 {"name":"Tokyo Nightdrive · City Pop","short":"City Pop / Boogie","desc":"City pop japonés de los ochenta: fusión, funk, sintetizadores y el brillo de una ciudad imaginaria.","url":"https://soundcloud.com/flotonium_berlin/tokyo-nightdrive-japanese-city-pop-vinyl-mix","moods":["mañana","atardecer","taller","nocturna"],"discovery":true},
 {"name":"Punk y grunge · DJ Greg J","short":"Punk / Grunge","desc":"Punk rock reciente con guitarras urgentes y grunge. Una sacudida cuando la Casa esté demasiado tranquila.","url":"https://soundcloud.com/djgregj/new-punk-mix-2023-2025","moods":["taller","nocturna","insomnio"],"discovery":true},
 {"name":"PSEUDO AG · Ambient / IDM","short":"IDM / Lo-fi","desc":"Electrónica de pensamiento, ambient, experimental, lo-fi y fragmentos de techno oblicuo.","url":"https://soundcloud.com/pseudo-ag/experimental-ambient-idm-multi","moods":["lluvia nocturna","insomnio","lluvia","gris atlántico","nocturna"],"discovery":true},
 {"name":"Craig · Footwork Connection","short":"Juke / Chicago","desc":"Footwork y juke de Chicago, ritmos veloces, swing artificial y una energía casi imposible.","url":"https://soundcloud.com/craig/mix-for-footwork-connection-1252026","moods":["taller","nocturna","atardecer"],"discovery":true},
 {"name":"Xander Milne · French Touch en cinta","short":"French Touch / 90s","desc":"Cassius, Daft Punk, Roulé y filtro disco: house francés analógico para sacudir el salón.","url":"https://soundcloud.com/xandermilne/french-house-dj-mix-on-tape-daft-punk-roule-cassius-french-touch","energy":"alta","moods":["mañana","taller","atardecer","nocturna"]},
 {"name":"Mike Sandcastle · Disco House 90s","short":"Disco house / Groove","desc":"Vinilos de Le Knight Club, DJ Falcon, Mr Oizo y más. Para dibujar con el pie moviéndose.","url":"https://soundcloud.com/mikesandcastle/disco-house-classic-90s-french-touch-vinyl-mix","energy":"alta","moods":["mañana","taller","atardecer","nocturna"]},
 {"name":"Funky Breaks · B-Boy y B-Girl","short":"Funk / Breaks","desc":"Colección de breakbeats, funk setentero y electro-boogie; una dosis de ritmo y diversión.","url":"https://soundcloud.com/user-670790100/sets/funky-breaks","energy":"alta","moods":["mañana","taller","atardecer"]},
 {"name":"SPLIFF · Feel Good UK Garage","short":"UK Garage / House","desc":"Garage ligero, voces y bajos saltarines; una mezcla concebida para levantar el ánimo.","url":"https://soundcloud.com/spliffinthemix/a-feel-good-uk-garagehouse-mix","energy":"alta","moods":["mañana","taller","atardecer","nocturna"]},
 {"name":"DJ Q · UK Garage","short":"2-Step / Garage","desc":"Bajo, swing y 2-step londinense para que la casa no se quede quieta.","url":"https://soundcloud.com/djqmusic/dj-q-2022-uk-garage-mix","energy":"alta","moods":["taller","atardecer","nocturna"]},
 {"name":"DJ Nate · Carnaval 2025","short":"Soca / Dancehall","desc":"Carnaval de Notting Hill: dancehall, soca y sonidos de los sound systems caribeños.","url":"https://soundcloud.com/djnate/carnival2025","energy":"alta","moods":["mañana","taller","atardecer","nocturna"]},
 {"name":"RaeTooTrill · Afrobeats y Amapiano","short":"Amapiano / Afrobeats","desc":"Afrobeats, amapiano, voces cálidas y ediciones con mucho movimiento.","url":"https://soundcloud.com/raetootrill/afrobeats-amapiano-edits-mix","energy":"alta","moods":["mañana","taller","atardecer"]},
 {"name":"DJ Pinky Pink · Cumbia Party","short":"Cumbia / Tropical","desc":"Clásicos de cumbia y cruces tropicales electrónicos; alegría sin solemnidad.","url":"https://soundcloud.com/pinky1347/cumbia-mix-latin-vibes","energy":"alta","moods":["mañana","taller","atardecer","nocturna"]},
 {"name":"OK.DJ · Jungle a 160","short":"Jungle / Rave","desc":"Jungle, breaks acelerados y algo de happy hardcore: energía pura.","url":"https://soundcloud.com/ok_dj/jungle-160-mini-mix","energy":"alta","moods":["taller","atardecer","nocturna"]},
 {"name":"Nina Azucar · Armada Fania","short":"Salsa / Boogaloo","desc":"Salsa y boogaloo de la órbita Fania; metales, percusión y pista de baile.","url":"https://soundcloud.com/ninavicious/nina-azucar-armada-fania-mix-remastered","energy":"alta","moods":["mañana","taller","atardecer"]},
 {"name":"AJACENT · Baile Funk y Jersey Club","short":"Baile Funk / Jersey","desc":"Set de fiesta con baile funk brasileño, hip-hop y Jersey club de alto voltaje.","url":"https://soundcloud.com/dj-ajacent/live-set-spring-summer-2025-mix-hip-hop-baile-funk-jersey-club","energy":"alta","moods":["taller","atardecer","nocturna"]},
 {"name":"Natsu Summer · City Pop 80s","short":"City Pop / Japonés","desc":"Pop japonés ochentero y melodías soleadas en una sesión para la mañana.","url":"https://soundcloud.com/kidcal/natsu-summers-80s-japanese-city-pop-mix","energy":"alta","moods":["mañana","taller","atardecer"]},
 {"name":"DJ BMF · Latin Jazzy Mix","short":"Latin Funk / Boogaloo","desc":"Salsa, boogaloo y funk latino con Willie Colón y Héctor Lavoe; swing para trabajar.","url":"https://soundcloud.com/dj-bmf/latinjazzymix","energy":"alta","moods":["mañana","taller","atardecer"]},
 {"name":"DJ RV2 · Breakbeat Hardcore Jungle","short":"Breakbeat / Jungle","desc":"Rave de alta velocidad, breaks rotos y hardcore noventero, con sesiones antiguas y nuevas.","url":"https://soundcloud.com/dj_rv2/new-breakbeat-hardcore-jungle","energy":"alta","moods":["taller","atardecer","nocturna"]},
 {"name":"DJ SailFin · The Rave Generation","short":"Rave / Happy Hardcore","desc":"Jungle, happy hardcore, breakbeat clásico y un final de UK garage: una fiesta de verdad.","url":"https://soundcloud.com/djsailfin/happy-hardcore-rave-generation","energy":"alta","moods":["taller","atardecer","nocturna"]},
 {"name":"WOST · Latin Club Edits Vol. 2","short":"Dembow / Hard Drum","desc":"Mutaciones de reguetón, techno, dembow, guaracha y electrónica de club latinoamericana.","url":"https://soundcloud.com/xwost/sets/wost-latin-club-edits-vol-2-1","energy":"alta","moods":["taller","atardecer","nocturna"]},
 {"name":"Malachi Jean · Half Moon","short":"Gqom / Baile Funk","desc":"Afro-house, baile funk, kuduro, Jersey y Baltimore club: dos horas de ritmo imprevisible.","url":"https://soundcloud.com/halfmoonbk/malachi-jean-7-29-25","energy":"alta","moods":["mañana","taller","atardecer","nocturna"]},
 {"name":"Pilko · Electro Breakbeat de los 80","short":"Electro / Freestyle","desc":"Viejo electro y breakdance: Newcleus, Cyber People y máquinas de ritmo de otra época.","url":"https://soundcloud.com/pilko22/sets/80s-electro-breakbeat-mix","energy":"alta","moods":["mañana","taller","atardecer"]},
 {"name":"STREETKEVN · Street Edits","short":"Global Club / Bass","desc":"Edits de Miami bass, dembow, Jersey club y baile funk para un giro más callejero.","url":"https://m.soundcloud.com/streetkevn/sets/street-edits","energy":"alta","moods":["taller","atardecer","nocturna"]},
 {"name":"Dembow industrial · Archivo de club","short":"Industrial / Dembow","desc":"Amnesia Scanner, Arca y ritmos latinos distorsionados, desde la música de club más extraña.","url":"https://m.soundcloud.com/tengomuchotiempolibre_tbh/sets/moombahton-techno-dembow","energy":"alta","moods":["taller","nocturna","insomnio"]}
];

/* Autonomía ON: música continua, sin pausas deliberadas. */
const dock=document.createElement('aside');
dock.id='luxRadioDock';dock.setAttribute('aria-label','Radio Lu Roth · SoundCloud NTS Radio');
dock.innerHTML='<button id="luxRadioToggle" type="button" aria-expanded="false" aria-controls="luxRadioPanel"><span class="luxRadioNote" aria-hidden="true">♫</span><span class="luxRadioName">RADIO LU ROTH</span><span class="luxRadioChevron" aria-hidden="true">⌄</span></button><div id="luxRadioNow" role="status" aria-live="polite"></div><section id="luxRadioPanel" aria-label="Sesiones de música"><div id="luxRadioIntro"><strong>La música de la casa</strong><p>Radio Lu Roth · SoundCloud: jazz, punk, dub, cumbia, afrobeat, cine, música concreta y electrónica. Una sola colección en mutación.</p></div><nav id="luxRadioChoices" aria-label="Elegir sesión"></nav><div id="luxRadioActive" aria-live="polite"></div><iframe id="luxRadioFrame" title="SoundCloud: reproductor seleccionado" loading="lazy" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="luxRadioFlow" role="group" aria-label="Opciones de reproducción"><button id="luxRadioLoop" type="button" aria-pressed="true">↻ Bucle: sí</button><button id="luxRadioRandom" type="button" aria-pressed="true">⤨ Aleatorio: sí</button><button id="luxRadioNext" type="button">⏭ Siguiente</button></div><p id="luxRadioHint" aria-live="polite">El primer play se hace dentro de SoundCloud. Después se cambian automáticamente las sesiones.</p><div id="luxRadioFooter"><a id="luxRadioOriginal" href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">Abrir en SoundCloud</a><div>Las pistas disponibles y el permiso de reproducción automática dependen de SoundCloud y del navegador.</div></div></section>';
document.body.appendChild(dock);
// Reorganizar los controles sin recrear el reproductor ni perder las sesiones.
const compactBar=document.createElement('div');
compactBar.id='luxRadioBar';
compactBar.setAttribute('aria-label','Controles compactos de Radio Lu Roth');
compactBar.innerHTML='<span id="luxRadioEQ" aria-hidden="true"><i></i><i></i><i></i><i></i></span><div id="luxRadioMiniControls" role="group" aria-label="Reproductor de SoundCloud"><button id="luxRadioPlay" type="button" title="Reproducir o pausar" aria-label="Reproducir radio">▶</button><button id="luxRadioMiniNext" type="button" title="Siguiente sesión" aria-label="Siguiente sesión">⏭</button><label id="luxRadioVolumeLabel" title="Volumen de SoundCloud"><span>VOL</span><input id="luxRadioVolume" type="range" min="0" max="100" value="75" step="1" aria-label="Volumen de Radio Lu Roth"></label></div>';
compactBar.insertBefore(dock.querySelector('#luxRadioToggle'),compactBar.firstChild);
compactBar.insertBefore(dock.querySelector('#luxRadioNow'),compactBar.querySelector('#luxRadioMiniControls'));
dock.insertBefore(compactBar,dock.querySelector('#luxRadioPanel'));

// Las fuentes conviven bajo Radio Lu Roth, sin créditos ni divisiones por autor.
// La playlist publicada de Rain utiliza el reproductor oficial de Spotify.
const luMusicShelf=document.createElement('div');
luMusicShelf.id='luMusicShelf';
luMusicShelf.innerHTML='<div class="luMusicShelfNav"><button id="luMusicPlaylist" type="button" aria-expanded="false" aria-controls="luMusicPlaylistPanel">Colección musical</button></div><div id="luMusicPlaylistPanel" hidden><p>Una colección más de Radio Lu Roth. Spotify puede pedir que inicies sesión para escucharla completa.</p><iframe id="luMusicSpotifyFrame" title="Radio Lu Roth · colección musical" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
dock.querySelector('#luxRadioPanel').insertBefore(luMusicShelf,dock.querySelector('#luxRadioActive'));
const musicShelfButton=luMusicShelf.querySelector('#luMusicPlaylist');
const musicShelfPanel=luMusicShelf.querySelector('#luMusicPlaylistPanel');
const musicShelfFrame=luMusicShelf.querySelector('#luMusicSpotifyFrame');
const musicShelfURL='https://open.spotify.com/embed/playlist/4l7Q5zlpxrBLu7yFwyJeEY?utm_source=generator';
let musicShelfOpen=false;
function showMusicShelf(show){
 // Inicializar primero SoundCloud para que la colección no se cierre al cargar.
 if(show&&!initialized)open(true);
 musicShelfOpen=Boolean(show);
 dock.classList.toggle('has-lu-collection',musicShelfOpen);
 musicShelfPanel.hidden=!musicShelfOpen;
 musicShelfButton.setAttribute('aria-expanded',String(musicShelfOpen));
 if(musicShelfOpen){
  if(!musicShelfFrame.src)musicShelfFrame.src=musicShelfURL;
  // No se oyen dos reproductores simultáneos.
  try{widget?.pause()}catch{}
  autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=true;
  isPlaying=false;updateNow();
  open(true);
 }else if(musicShelfFrame.src){
  // Desmontar el iframe detiene también una reproducción de Spotify.
  musicShelfFrame.removeAttribute('src');
 }
 updateNow();
}
musicShelfButton.addEventListener('click',()=>showMusicShelf(!musicShelfOpen));

const $=id=>document.getElementById(id);
const toggle=$('luxRadioToggle'),choices=$('luxRadioChoices'),frame=$('luxRadioFrame');
const memKey='casa-lux-soundcloud-choice-v1',settingsKey='casa-lux-radio-flujo-v1';
let selected=0,initialized=false,widget=null,widgetReady=false,transitioning=false;
let lastTrackIndex=0,trackCount=1,shuffleBag=[];
let flow={loop:true,random:true},hasPlayed=false,isPlaying=false,luRadioManual=false;
let autoSessionActive=false,autoPlaybackPending=false,autoStopRequested=false;
let visualPreference=null,visualRecent=[];
let currentSound=null,manualPlayPending=false,compactStartup=false,soundVolume=75;
try{const savedVolume=localStorage.getItem('lux-radio-volume-v1');if(savedVolume!==null){const n=Number(savedVolume);if(Number.isFinite(n)&&n>=0&&n<=100)soundVolume=n}}catch{}
$('luxRadioVolume').value=String(soundVolume);
try {
 const prev=Number(localStorage.getItem(memKey));
 if(Number.isInteger(prev)&&prev>=0&&prev<mixes.length)selected=prev;
 const saved=JSON.parse(localStorage.getItem(settingsKey)||'null');
 if(saved && typeof saved.loop==='boolean' && typeof saved.random==='boolean')flow=saved;
} catch {}
function save(){try{localStorage.setItem(memKey,String(selected));localStorage.setItem(settingsKey,JSON.stringify(flow))}catch{}}
function updateNow(){
 const mix=mixes[selected];if(!mix)return;
 const label=musicShelfOpen?'Colección musical':(currentSound?.title?
  (currentSound.artist?currentSound.artist+' — ':'')+currentSound.title:mix.name);
 const now=$('luxRadioNow');now.textContent=(isPlaying?'ON AIR · ':hasPlayed?'PAUSA · ':'SOUNDCLOUD · ')+label;
 now.title=label;
 const play=$('luxRadioPlay');play.textContent=isPlaying?'Ⅱ':'▶';
 play.setAttribute('aria-label',isPlaying?'Pausar radio':'Reproducir radio');
 play.title=isPlaying?'Pausar':'Reproducir';
 dock.classList.toggle('playing',isPlaying&&!musicShelfOpen);
}
function refreshCurrentSound(){
 if(!widget||!widgetReady||musicShelfOpen)return;
 try{widget.getCurrentSound(sound=>{
  if(!sound||!sound.title)return;
  currentSound={artist:String(sound.user?.username||''),title:String(sound.title)};
  updateNow();
 })}catch{}
}
function mixURL(mix,play){
 return 'https://w.soundcloud.com/player/?url='+encodeURIComponent(mix.url)+
   '&auto_play='+Boolean(play)+'&color=%23ffffff&show_artwork=true&show_comments=false&show_user=true'+
   '&show_playcount=false&hide_related=true&visual=false&single_active=true';
}
function updateControls(){
 $('luxRadioLoop').setAttribute('aria-pressed',String(flow.loop));
 $('luxRadioRandom').setAttribute('aria-pressed',String(flow.random));
 $('luxRadioLoop').textContent=flow.loop?'↻ Bucle: sí':'↻ Bucle: no';
 $('luxRadioRandom').textContent=flow.random?'⤨ Aleatorio: sí':'⤨ Aleatorio: no';
}
// Prioridad editorial: la Casa conserva lo raro, pero la radio debe tener pulso.
function upbeatChoices(exclude=selected){
 const bright=/disco|funk|boogie|soul|house|garage|soca|salsa|cumbia|afrobeat|highlife|chicha|footwork|bass|juke|club|brasil|city pop|breaks|jungle|dancehall|ska|happy hardcore|punk|grunge|jazz|groove|italo/i;
 const mournful=/ambient|melanc|dark|witch|industrial|shoegaze|drone|concreta|idm|noise|experimental/i;
 return mixes.map((m,i)=>({m,i})).filter(x=>{
  if(x.i===exclude||visualRecent.includes(x.i))return false;
  if(x.m.energy==='alta')return true;
  const label=x.m.name+' '+x.m.short;
  return bright.test(label)&&!mournful.test(label);
 });
}
function pickNext(){
 if(!flow.random)return (selected+1)%mixes.length;
 if(!shuffleBag.length){
  shuffleBag=Array.from({length:mixes.length},(_,i)=>i).filter(i=>i!==selected);
  for(let i=shuffleBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffleBag[i],shuffleBag[j]]=[shuffleBag[j],shuffleBag[i]]}
 }
 const i=shuffleBag.shift();
 return Number.isInteger(i)?i:(selected+1)%mixes.length;
}
function setMix(i,play=false){
 if(!Number.isInteger(i)||!mixes[i])return;
 if(musicShelfOpen)showMusicShelf(false);
 selected=i;lastTrackIndex=0;trackCount=1;transitioning=false;isPlaying=false;currentSound=null;updateNow();window.dispatchEvent(new Event('lu-radio-rhythm-change'));
 const mix=mixes[i];
 const active=$('luxRadioActive');
 active.replaceChildren();
 const title=document.createElement('strong');title.textContent=mix.name;
 const desc=document.createElement('small');desc.textContent=mix.desc;
 active.append(title,desc);
 $('luxRadioOriginal').href=mix.url;
 choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.index)===i)));
 initialized=true;save();
 if(widget&&widgetReady){
  // load conserva los listeners: no se reemplaza el iframe cuando la API está conectada.
  try{widget.load(mix.url,{auto_play:!!play,color:'#ffffff',show_artwork:true,
       show_comments:false,show_user:true,show_playcount:false,
       hide_related:true,visual:false,single_active:true,
       callback:()=>{if(play&&!autoStopRequested)widget.play()}})}
  catch{frame.src=mixURL(mix,play)}
 }else frame.src=mixURL(mix,play);
 frame.title='SoundCloud · '+mix.name;
 $('luxRadioHint').textContent=play?'Siguiente sesión: '+mix.name:'Pulsa Play en SoundCloud para iniciar la radio.';
}
function goNext(){
 if(transitioning)return;
 const mood=document.getElementById('stage')?.dataset.luMood||'';
 // En autonomía enlazar otra sesión inmediatamente, sin silencio deliberado.
 transitioning=true;
 let candidates=autoSessionActive&&!luRadioManual?ambientChoices(mood).filter(x=>x.i!==selected):[];
 // Lu reserva un margen de descubrimiento para escapar de sus propios filtros.
 // Únicamente al acabar el set; no interrumpe ninguna canción en curso.
 if(autoSessionActive&&!luRadioManual&&Math.random()<.36){
  const unexplored=mixes.map((m,i)=>({m,i}))
   .filter(x=>x.m.discovery&&x.i!==selected&&!visualRecent.includes(x.i));
  if(unexplored.length)candidates=unexplored;
 }
 if(autoSessionActive&&!luRadioManual&&visualPreference&&Math.random()<.55){
  const visualFilters={
   oscuro:/dark|ambient|industrial|drone|techno|post.punk|witch|concreta|acúsm|shoegaze|glitch|punk/i,
   luminoso:/disco|funk|soul|boogie|house|jazz|groove|afrobeat|highlife|cumbia|brasil|city pop/i,
   frío:/electr|ambient|idm|wave|dub|jungle|techno|concreta|glitch|shoegaze/i,
   cálido:/soul|boogie|downtempo|disco|groove|indie|funk|ethio|cumbia|brasil|reggae|jazz/i,
   neutro:/experimental|explor|indie|ambient|house|jazz|cine|chicha|afrobeat|concreta|punk/i
  };
  const rx=visualFilters[visualPreference.tone]||visualFilters.neutro;
  const visual=Array.from({length:mixes.length},(_,i)=>({m:mixes[i],i}))
   .filter(x=>x.i!==selected&&!visualRecent.includes(x.i)&&rx.test(x.m.name+' '+x.m.short+' '+x.m.desc));
  if(visual.length)candidates=visual;
 }
 // Cuatro de cada cinco cambios favorecen música rítmica, incluso de noche.
 if((autoSessionActive||flow.random)&&Math.random()<.82){
  const lively=upbeatChoices();
  if(lively.length)candidates=lively;
 }
 const next=candidates.length?candidates[Math.floor(Math.random()*candidates.length)].i:pickNext();
 visualRecent.push(next);visualRecent=visualRecent.slice(-8);
 setMix(next,true);
 // SoundCloud termina primero el set actual; las preferencias visuales guían el siguiente.
}
function setupWidget(){
 if(widget||!window.SC||typeof window.SC.Widget!=='function')return;
 try{
  const api=window.SC.Widget;widget=api(frame);
  widget.bind(api.Events.READY,()=>{
   widgetReady=true;
   try{widget.setVolume(soundVolume)}catch{}
   if(manualPlayPending){manualPlayPending=false;try{widget.play()}catch{}}
   // Si el visitante ha encendido la Casa antes de que cargase SoundCloud,
   // se solicita reproducción al estar listo el widget (puede requerir Play).
   if(autoSessionActive&&autoPlaybackPending){
    autoPlaybackPending=false;
    try{widget.play()}catch{}
   }
   widget.getSounds(sounds=>{if(Array.isArray(sounds))trackCount=Math.max(1,sounds.length)});
   refreshCurrentSound();
  });
  widget.bind(api.Events.PLAY,()=>{
   hasPlayed=true;isPlaying=true;widgetReady=true;transitioning=false;autoPlaybackPending=false;manualPlayPending=false;updateNow();refreshCurrentSound();if(compactStartup){compactStartup=false;open(false)}window.dispatchEvent(new Event('lu-radio-rhythm-change'));
   widget.getCurrentSoundIndex(index=>{
    if(Number.isInteger(index))lastTrackIndex=index;
   });
   widget.getSounds(sounds=>{if(Array.isArray(sounds))trackCount=Math.max(1,sounds.length)});
   $('luxRadioHint').textContent='Sonando · al acabar, '+(flow.loop?'otra sesión '+(flow.random?'aleatoria':'en orden'):'la radio se detendrá')+'.';
  });
  widget.bind(api.Events.PAUSE,()=>{isPlaying=false;updateNow();window.dispatchEvent(new Event('lu-radio-rhythm-change'))});
  widget.bind(api.Events.FINISH,()=>{
   if((!flow.loop&&!autoSessionActive)||!hasPlayed||transitioning)return;
   // FINISH se emite también al terminar pistas individuales de un set.
   // Dejamos que SoundCloud avance internamente hasta la última pista.
   const endedIndex=lastTrackIndex;
   widget.getSounds(sounds=>{
    const count=Array.isArray(sounds)?Math.max(1,sounds.length):trackCount;
    if(endedIndex>=count-1)goNext();
   });
  });
  widget.bind(api.Events.ERROR,()=>{
   isPlaying=false;updateNow();
   $('luxRadioHint').textContent='Esta sesión no está disponible. Prueba «Siguiente» o ábrela en SoundCloud.';
  });
 }catch{widget=null;widgetReady=false}
}
function loadSDK(){
 if(window.SC?.Widget){setupWidget();return}
 if(document.getElementById('luxSoundcloudAPI'))return;
 const script=document.createElement('script');script.id='luxSoundcloudAPI';
 script.src='https://w.soundcloud.com/player/api.js';script.async=true;
 script.onload=setupWidget;
 script.onerror=()=>{$('luxRadioHint').textContent='No se pudo conectar el control automático. Puedes escuchar en SoundCloud.'};
 document.head.appendChild(script);
}
function open(value){
 dock.classList.toggle('open',value);
 toggle.setAttribute('aria-expanded',String(value));
 if(value){
  if(!initialized)setMix(selected,false);
  loadSDK();
 }
}
mixes.forEach((mix,i)=>{
 const button=document.createElement('button');
 button.type='button';button.dataset.index=String(i);button.textContent=mix.short;
 button.setAttribute('aria-pressed',String(i===selected));button.title=mix.desc;
 button.addEventListener('click',()=>{
  luRadioManual=true;autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=false;
  shuffleBag=shuffleBag.filter(x=>x!==i);
  if(!initialized)open(true);
  setMix(i,true);
  loadSDK();
 });
 choices.appendChild(button);
});
$('luxRadioPlay').addEventListener('click',()=>{
 if(musicShelfOpen)showMusicShelf(false);
 if(isPlaying){try{widget?.pause()}catch{};return}
 autoStopRequested=false;luRadioManual=true;
 if(!initialized){manualPlayPending=true;compactStartup=true;frame.loading='eager';open(true);setMix(selected,true);loadSDK()}
 else if(widgetReady&&widget){try{widget.play()}catch{}}
 else{manualPlayPending=true;compactStartup=true;frame.loading='eager';open(true);frame.src=mixURL(mixes[selected],true);loadSDK()}
});
$('luxRadioMiniNext').addEventListener('click',()=>{
 luRadioManual=true;autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=false;
 if(!initialized)setMix(selected,false);
 goNext();loadSDK();
});
$('luxRadioVolume').addEventListener('input',event=>{
 soundVolume=Math.max(0,Math.min(100,Number(event.target.value)||0));
 try{localStorage.setItem('lux-radio-volume-v1',String(soundVolume))}catch{}
 if(widgetReady&&widget){try{widget.setVolume(soundVolume)}catch{}}
});
$('luxRadioLoop').addEventListener('click',()=>{
 flow.loop=!flow.loop;updateControls();save();
});
$('luxRadioRandom').addEventListener('click',()=>{
 flow.random=!flow.random;shuffleBag=[];updateControls();save();
});
$('luxRadioNext').addEventListener('click',()=>{luRadioManual=true;autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=false;open(true);goNext()});
toggle.addEventListener('click',()=>open(!dock.classList.contains('open')));
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&dock.classList.contains('open'))open(false);
});
function ambientChoices(mood){
 const filters={
  'lluvia nocturna':/ambient|downtempo|dark|dembike|demdike|electrónica|nocturna|experimental/i,
  insomnio:/ambient|dark|post.punk|witch|electrónica|explor/i,
  nocturna:/post.punk|ebm|dark|techno|witch|industrial/i,
  lluvia:/ambient|downtempo|jazz|soul|explor/i,
  'gris atlántico':/ambient|downtempo|soul|jazz|explor/i,
  mañana:/suave|soul|disco|funk|boogie/i,
  taller:/house|soul|funk|ritmo|electrónica/i,
  atardecer:/synth|indie|new wave|downtempo|disco/i
 };
 const filter=filters[mood]||filters.taller;
 return mixes.map((m,i)=>({m,i})).filter(x=>
  (Array.isArray(x.m.moods)&&x.m.moods.includes(mood))||
  filter.test(x.m.name+' '+x.m.short+' '+x.m.desc));
}
function clasificarRitmo(mix){
 if(!mix)return 'media';
 const tags=[mix.short||'',mix.name||'',mix.desc||''].join(' ').toLowerCase();
 if(mix.energy==='alta'||/techno|electro|jungle|drum.{0,4}bass|footwork|garage|club|ebm|industrial|punk|bass music|breakbeat|house|funk|disco|cumbia|afrobeat|hip-hop|rap|ska|italo|dance|boogie/i.test(tags))return 'alta';
 if(/ambient|drone|downtempo|dream pop|shoegaze|cinem[aá]|paisaje|lento|musique concr[eè]te|contempla|experimental|noise|textura/i.test(tags))return 'baja';
 return 'media';
}
window.__luRadio={
 // Pausa la colección musical de Spotify al volver a SoundCloud.
 pauseCollection:()=>{
  if(musicShelfFrame.src)musicShelfFrame.removeAttribute('src');
 },
 getState:()=>({title:musicShelfOpen?'Colección musical':mixes[selected]?.name||'',playing:isPlaying,hasPlayed,silent:false,silenceUntil:0,manual:luRadioManual,autoSessionActive,autoPlaybackPending,visualTone:visualPreference?.tone||null,collectionOpen:musicShelfOpen,energy:clasificarRitmo(mixes[selected])}),
 openCollection:()=>showMusicShelf(true),
 // La imagen guía el próximo set, sin interrumpir jamás la sesión en marcha.
 setVisualPreference:(profile)=>{
  if(!profile||typeof profile.tone!=='string')return false;
  visualPreference={tone:profile.tone,brightness:Number(profile.brightness)||0,detail:Number(profile.detail)||0};
  return true;
 },
 // Se llama directamente desde la pulsación ON: el gesto del usuario autoriza
 // intentar reproducir SoundCloud; no podemos garantizar permisos del navegador.
 startAutonomy:(mood)=>{
  if(musicShelfOpen)showMusicShelf(false);
  autoSessionActive=true;autoPlaybackPending=false;autoStopRequested=false;luRadioManual=false;visualRecent=[];
  // Si SoundCloud ya está listo, reanudar la sesión dentro del mismo gesto ON.
  if(widgetReady&&widget&&initialized){
   frame.loading='eager';open(true);
   if(!isPlaying){
    autoPlaybackPending=true;
    const lively=upbeatChoices();
    if(lively.length&&Math.random()<.85){
     const choice=lively[Math.floor(Math.random()*lively.length)];
     setMix(choice.i,true);
    }else{try{widget.play()}catch{}}
   }
   $('luxRadioHint').textContent='Autonomía ON: música continua, sin pausas programadas.';
   updateNow();return mixes[selected]?.name||'';
  }
  autoPlaybackPending=true;
  const candidates=ambientChoices(mood);
  // Al arrancar, la mayor parte de las veces elegimos un set enérgico.
  const lively=upbeatChoices();
  const pool=(lively.length&&Math.random()<.85)?lively:
   (Math.random()<.22?mixes.map((m,i)=>({m,i})).filter(x=>x.m.discovery):candidates);
  const choice=pool.length?pool[Math.floor(Math.random()*pool.length)]:{i:selected};
  frame.loading='eager';
  open(true);
  setMix(choice.i,true);
  loadSDK();
  if(widgetReady&&widget){try{widget.play();autoPlaybackPending=false}catch{}}
  $('luxRadioHint').textContent='Autonomía ON: música continua. Si el navegador bloquea el sonido, pulsa Play en SoundCloud.';
  return mixes[selected]?.name||'';
 },
 stopAutonomy:()=>{
  const wasAuto=autoSessionActive;
  autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=true;
  if(!wasAuto)return;
  if(widget){try{widget.pause()}catch{}}
  else if(initialized)frame.src=mixURL(mixes[selected],false);
  isPlaying=false;updateNow();
  $('luxRadioHint').textContent='Autonomía apagada: radio en pausa. Puedes reproducirla manualmente.';
 },
 // Selección de ambiente sin iniciar audio ni interrumpir una sesión elegida por el visitante.
 suggest:(mood)=>{
  if(luRadioManual||hasPlayed||isPlaying||transitioning||autoSessionActive)return false;
  const filters={
   'lluvia nocturna':/ambient|downtempo|dark|dembike|demdike|electrónica|nocturna|experimental/i,
   insomnio:/ambient|dark|post.punk|witch|electrónica|explor/i,
   nocturna:/post.punk|ebm|dark|techno|witch|industrial/i,
   lluvia:/ambient|downtempo|jazz|soul|explor/i,
   'gris atlántico':/ambient|downtempo|soul|jazz|explor/i,
   mañana:/suave|soul|disco|funk|boogie/i,
   taller:/house|soul|funk|ritmo|electrónica/i,
   atardecer:/synth|indie|new wave|downtempo|disco/i
  };
  const filter=filters[mood]||filters.taller;
  const candidates=mixes.map((m,i)=>({m,i})).filter(x=>x.i!==selected&&filter.test(x.m.name+' '+x.m.short+' '+x.m.desc));
  if(!candidates.length)return false;
  const lively=upbeatChoices();
  const pool=(lively.length&&Math.random()<.85)?lively:candidates;
  const choice=pool[Math.floor(Math.random()*pool.length)];
  setMix(choice.i,false);
  return true;
 }
};
updateControls();updateNow();
if(window.matchMedia('(min-width:801px)').matches)open(true);
})();
