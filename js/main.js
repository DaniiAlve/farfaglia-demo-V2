// Interacciones simuladas de la maqueta (no envían datos).
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) {
    return "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // ---- Menú móvil
  var toggle = $(".menu-toggle"), nav = $("#nav-principal");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var abierto = nav.classList.toggle("abierto");
      toggle.setAttribute("aria-expanded", abierto);
    });
  }

  // ---- Diálogo de aviso de maqueta
  var dlg = $("#dlg-demo");
  function avisar(titulo, texto) {
    if (!dlg || !dlg.showModal) { alert((titulo || "Maqueta") + "\n" + (texto || "")); return; }
    if (titulo) $("[data-dlg-titulo]", dlg).textContent = titulo;
    if (texto) $("[data-dlg-texto]", dlg).textContent = texto;
    dlg.showModal();
  }
  if (dlg) {
    $("[data-dlg-cerrar]", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }
  $$("[data-demo-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      avisar(f.getAttribute("data-demo-titulo"), f.getAttribute("data-demo-texto"));
    });
  });

  // ---- Contador del carrito (persistido en la sesión del navegador)
  var badges = $$("[data-cart-count]");
  function leerCuenta() {
    try { var v = sessionStorage.getItem("farfaglia-carrito"); if (v !== null) return parseInt(v, 10) || 0; } catch (e) {}
    return 2;
  }
  function guardarCuenta(n) {
    try { sessionStorage.setItem("farfaglia-carrito", String(n)); } catch (e) {}
    badges.forEach(function (b) { b.textContent = n; });
  }
  var cuenta = leerCuenta();
  guardarCuenta(cuenta);

  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () {
      cuenta += 1; guardarCuenta(cuenta);
      var t = b.textContent; b.textContent = "¡Agregado!";
      setTimeout(function () { b.textContent = t; }, 1200);
    });
  });
  var addFicha = $("[data-add-ficha]");
  if (addFicha) {
    addFicha.addEventListener("click", function () {
      var q = parseInt($("#cantidad-ficha").value, 10) || 1;
      cuenta += q; guardarCuenta(cuenta);
      avisar("Agregado al carrito", "Se agregó el producto (maqueta: el carrito es de ejemplo).");
    });
  }

  // ---- Selectores de color / talle / chips
  $$(".swatches, .tallas").forEach(function (g) {
    var nombre = g.getAttribute("data-grupo");
    $$("button", g).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", g).forEach(function (o) { o.setAttribute("aria-pressed", o === b); });
        var salida = $('[data-valor-de="' + nombre + '"]');
        if (salida) salida.textContent = b.getAttribute("data-valor");
      });
    });
  });
  $$(".chips .chip").forEach(function (c) {
    c.addEventListener("click", function () {
      c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") !== "true");
    });
  });

  // ---- Galería de fotos
  $$(".galeria .miniaturas").forEach(function (g) {
    $$("button", g).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", g).forEach(function (o) { o.setAttribute("aria-current", o === b); });
      });
    });
  });

  // ---- Pestañas
  $$(".tablist").forEach(function (lista) {
    var tabs = $$("[role=tab]", lista);
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (o) {
          var activa = o === t;
          o.setAttribute("aria-selected", activa);
          var p = document.getElementById(o.getAttribute("aria-controls"));
          if (p) p.hidden = !activa;
        });
      });
    });
  });

  // ---- Calculadora de envío (ejemplo)
  var calc = $("[data-calc-envio]");
  if (calc) {
    calc.addEventListener("submit", function (e) {
      e.preventDefault();
      var cp = $("input", calc).value.trim();
      var out = $("[data-calc-resultado]");
      out.textContent = /^\d{4}$/.test(cp)
        ? "Envío estimado: $4.500,00 · llega en 3 a 5 días (valor de ejemplo)."
        : "Ingresá un código postal de 4 números.";
    });
  }

  // ---- Cantidad (+ / −)
  $$(".cantidad").forEach(function (c) {
    var input = $("input", c);
    $$("[data-paso]", c).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = (parseInt(input.value, 10) || 1) + (b.getAttribute("data-paso") === "mas" ? 1 : -1);
        input.value = Math.min(99, Math.max(1, v));
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
  });

  // ---- Carrito: totales
  var items = $$("[data-item]");
  if (items.length || $("[data-vacio]")) {
    var UMBRAL = 100000, ENVIO = 4500;
    var recalcular = function () {
      var vivos = $$("[data-item]");
      var sub = 0;
      vivos.forEach(function (it) {
        var q = parseInt($("input", it).value, 10) || 1;
        var s = q * parseInt(it.getAttribute("data-precio"), 10);
        $("[data-subtotal]", it).textContent = fmt(s);
        sub += s;
      });
      var vacio = vivos.length === 0;
      $$("[data-con-items]").forEach(function (e) { e.hidden = vacio; });
      var v = $("[data-vacio]"); if (v) v.hidden = !vacio;
      var envio = sub >= UMBRAL || vacio ? 0 : ENVIO;
      var set = function (s, t) { var e = $(s); if (e) e.textContent = t; };
      set("[data-resumen-subtotal]", fmt(sub));
      set("[data-resumen-envio]", envio ? fmt(envio) : "Gratis");
      set("[data-resumen-total]", fmt(sub + envio));
      set("[data-resumen-transf]", fmt((sub + envio) * 0.9));
      var falta = UMBRAL - sub;
      set("[data-progreso-texto]", falta > 0
        ? "Te faltan " + fmt(falta) + " para el envío gratis"
        : "¡Tenés envío gratis!");
      var barra = $("[data-progreso-barra]");
      if (barra) barra.style.width = Math.min(100, (sub / UMBRAL) * 100) + "%";
      guardarCuenta(vivos.reduce(function (a, it) { return a + (parseInt($("input", it).value, 10) || 1); }, 0));
      cuenta = leerCuenta();
    };
    items.forEach(function (it) {
      $("input", it).addEventListener("input", recalcular);
      $(".quitar", it).addEventListener("click", function () { it.remove(); recalcular(); });
    });
    recalcular();
  }
})();
