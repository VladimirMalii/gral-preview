/* Prima Mea Luna Roz 2026: pop-up de programare pe pachete, toate locatiile campaniei.
   Citeste sloturile libere exact ca formularul /Programari-online (POST get-hours, same-origin), combina cele doua servicii
   ale pachetului in aceeasi zi (intai consultul, pauza maxima 60 min), reverifica orele si trimite cererea pe canalul
   formularului online (POST process_form): call center-ul suna si confirma; receptia stie din cerere ca e campania (fara cod).
   Cand un medic nu are calendar online sau nicio zi nu se potriveste, pacienta alege o ZI PREFERATA + intervalul (ca optiunea
   „Selectati ziua preferata” a formularului) si call center-ul propune orele. Nu face programari direct in Medis.
   Se incarca din Continutul ofertei cu: <script src="https://www.gralmedical.ro/storage/luna-roz/luna-roz.js?v=2" defer></script>
   Butoanele din pagina: id="lunaroz-{cheia pachetului}". Datele (medici, pasul grilei, pachete) stau in CFG. */
(function () {
  "use strict";
  if (window.__lunaRoz) return;
  window.__lunaRoz = true;

  var CFG = {
    telefon: "021 323 00 00",
    telHref: "tel:0213230000",
    pauzaMax: 60, // minute intre sfarsitul consultului si inceputul serviciului 2
    luni: ["2026-10-01", "2026-11-01"], // lunile interogate
    perioada: ["2026-10-01", "2026-11-01"],
    cacheMin: 5,
    cereri: 1, // 1 = o cerere pe pachet (pe medicul primului serviciu, serviciul 2 in observatii); 2 = cate o cerere pe serviciu
    trimite: (window.LUNAROZ && window.LUNAROZ.trimite) || null, // optional: function(payload) -> Promise, inlocuieste trimiterea implicita
    // Medicii: loc / spec = combinatia cu care se citesc sloturile (difera pe specialitate!), pas = grila in minute (Medis, 01.10.2026)
    medici: {
      // Bucuresti, Clinica de Diagnostic GRAL (loc 7) + Clinica GRAL Radiologie (loc 8), aceeasi cladire
      146296: {
        nume: "Dr. Matei Daniela Cosmina",
        grad: "Medic specialist Obstetrică-Ginecologie",
        loc: 7,
        spec: 29,
        city: 1,
        pas: 30,
        coduri: { consult: ["CC001"] },
      },
      146615: {
        nume: "Dr. Filip Georgescu Paula",
        grad: "Medic specialist, ecografie",
        loc: 7,
        spec: 42,
        city: 1,
        pas: 20,
        coduri: { eco: [] },
      },
      144556: {
        nume: "Dr. Voiculescu Ioana",
        grad: "Medic primar Radiologie și Imagistică Medicală",
        afisare: "Clinica GRAL Radiologie (aceeași clădire)",
        loc: 8,
        spec: 38,
        city: 1,
        pas: 30,
        coduri: { mamo: [] },
      },
      146643: {
        nume: "Dr. Dumitrescu Andrei",
        grad: "Medic specialist Chirurgie plastică, microchirurgie reconstructivă",
        loc: 7,
        spec: 26,
        city: 1,
        pas: 20,
        coduri: { consult: ["CC001"] },
      },
      // Bucuresti, Clinica GRAL Stefan cel Mare (loc 10)
      146548: {
        nume: "Dr. Dumitru Andreea Elena",
        grad: "Medic specialist Obstetrică-Ginecologie",
        loc: 10,
        spec: 29,
        city: 1,
        pas: 30,
        coduri: { consult: ["CC001"], eco: ["EC1113"] },
      },
      // Ploiesti, Clinica MC GRAL (loc 13) + Gral Radiologie Ploiesti (loc 31), aceeasi cladire
      144383: {
        nume: "Dr. Grigore Daniela Cristina",
        grad: "Medic primar Obstetrică-Ginecologie",
        loc: 13,
        spec: 29,
        city: 9,
        pas: 15,
        coduri: { consult: ["CC4951"], eco: ["EC1113"] },
      },
      146640: {
        nume: "Dr. Brănescu Cătălina",
        grad: "Medic specialist Obstetrică-Ginecologie",
        loc: 13,
        spec: 29,
        city: 9,
        pas: 20,
        coduri: { consult: ["CC001"] },
      },
      146824: {
        nume: "Dr. Radu Cristina Isabella",
        grad: "Medic primar Obstetrică-Ginecologie",
        loc: 13,
        spec: 29,
        city: 9,
        pas: 20,
        coduri: { consult: ["CC002"] },
      },
      146646: {
        nume: "Dr. Szendrei Emanuel",
        grad: "Medic specialist Obstetrică-Ginecologie",
        loc: 13,
        spec: 29,
        city: 9,
        pas: 20,
        coduri: { consult: ["CC001"] },
      },
      146629: {
        nume: "Dr. Sarmași-Cernățoiu Iuliana",
        grad: "Medic primar Obstetrică-Ginecologie",
        loc: 13,
        spec: 29,
        city: 9,
        pas: 20,
        coduri: { consult: ["CC002"] },
      },
      146492: {
        nume: "Dr. Tatarici Simina Maria",
        grad: "Radiologie, Gral Radiologie Ploiești",
        afisare: "Gral Radiologie Ploiești (aceeași clădire)",
        loc: 31,
        spec: 42,
        city: 9,
        pas: 20,
        coduri: { mamo: [] },
      },
      // Constanta, Clinica GRAL (loc 94)
      146575: {
        nume: "Dr. Bejan Ilici Olimpia",
        grad: "Medic specialist Obstetrică-Ginecologie",
        loc: 94,
        spec: 29,
        city: 5,
        pas: 20,
        coduri: { consult: ["CC001"] },
      },
      146614: {
        nume: "Dr. Dodiță Diana",
        grad: "Medic specialist Endocrinologie",
        loc: 94,
        spec: 6,
        city: 5,
        pas: 20,
        coduri: { eco: ["EC1113"] },
      },
      // Craiova, Clinica OncoFort (loc 21)
      144534: {
        nume: "Dr. Mazilu Virgilia",
        grad: "Medic primar Obstetrică-Ginecologie",
        loc: 21,
        spec: 29,
        city: 6,
        pas: 20,
        coduri: { consult: ["CC001"], eco: ["EC1113"] },
      },
      // Pitesti, Clinica GRAL (loc 19)
      144392: {
        nume: "Dr. Niță Bogdan",
        grad: "Medic primar Endocrinologie",
        loc: 19,
        spec: 6,
        city: 13,
        pas: 30,
        coduri: { eco: ["EC1113"] },
      },
    },
    // Intrebarile suplimentare din pasul 3 (raspunsul ajunge in observatii)
    intrebari: {
      bilet: {
        text: "Ai bilet de trimitere pentru mamografie?",
        da: "Da",
        nu: "Nu încă",
        obs: "Bilet de trimitere pentru mamografie",
        nota_nu:
          "Fără bilet de trimitere, mamografia nu este gratuită: se achită la tariful standard al clinicii. Poți cere biletul medicului de familie înainte de ziua programării. Cererea poate fi trimisă oricum; call center-ul îți confirmă condițiile.",
      },
      bilet_mf: {
        text: "Ai bilet de trimitere de la medicul de familie pentru mamografie?",
        da: "Da",
        nu: "Nu încă",
        obs: "Bilet de trimitere pentru mamografie",
        nota_nu:
          "Fără bilet de trimitere, mamografia nu este gratuită: se achită la tariful standard al clinicii. Poți cere biletul medicului de familie înainte de ziua programării. Cererea poate fi trimisă oricum; call center-ul îți confirmă condițiile.",
      },
      onco: {
        text: "Ai trecut printr-o intervenție chirurgicală la sân în urma unui diagnostic oncologic?",
        da: "Da",
        nu: "Nu",
        obs: "Pacienta oncologica (interventie la san)",
        nota_nu:
          "Consultul gratuit din campanie este destinat pacientelor oncologice. Poți trimite cererea; call center-ul îți confirmă condițiile.",
      },
    },
    pachete: {
      "bucuresti-p1": {
        titlu: "Pachetul 1: consult ginecologic + ecografie de sân",
        reducere: "40% reducere",
        clinica:
          "Clinica de Diagnostic GRAL, Str. Traian Popovici nr. 79-91, București",
        s1: { cheie: "consult", nume: "Consult ginecologic", medici: [146296] },
        s2: { cheie: "eco", nume: "Ecografie de sân", medici: [146615] },
      },
      "bucuresti-p2": {
        titlu: "Pachetul 2: consult ginecologic + mamografie 2D bilaterală",
        reducere: "35% reducere · mamografie gratuită cu bilet",
        clinica:
          "Clinica de Diagnostic GRAL și Clinica GRAL Radiologie, Str. Traian Popovici nr. 79-91, București",
        intrebare: "bilet",
        s1: { cheie: "consult", nume: "Consult ginecologic", medici: [146296] },
        s2: {
          cheie: "mamo",
          nume: "Mamografie 2D bilaterală",
          medici: [144556],
        },
      },
      "chirurgie-consult": {
        titlu: "Consult gratuit de chirurgie plastică și reconstructivă",
        reducere: "gratuit pentru pacientele oncologice",
        clinica:
          "Centrul de Chirurgie GRAL, Str. Traian Popovici nr. 79-91, București",
        intrebare: "onco",
        s1: {
          cheie: "consult",
          nume: "Consult chirurgie plastică și reconstructivă",
          medici: [146643],
        },
      },
      "stefan-p1": {
        titlu: "Pachetul 1: consult ginecologic + ecografie de sân",
        reducere: "40% reducere",
        clinica:
          "Clinica GRAL Ștefan cel Mare, Șos. Ștefan cel Mare nr. 230, București",
        s1: { cheie: "consult", nume: "Consult ginecologic", medici: [146548] },
        s2: { cheie: "eco", nume: "Ecografie de sân", medici: [146548] },
      },
      "ploiesti-p1": {
        titlu: "Pachetul 1: consult ginecologic + ecografie de sân",
        reducere: "40% reducere",
        clinica: "Clinica MC GRAL Ploiești, Str. Cuza Vodă nr. 6",
        s1: {
          cheie: "consult",
          nume: "Consult ginecologic",
          medici: [144383, 146640, 146824, 146646, 146629],
        },
        s2: { cheie: "eco", nume: "Ecografie de sân", medici: [144383] },
      },
      "ploiesti-p2": {
        titlu: "Pachetul 2: consult ginecologic + mamografie 2D bilaterală",
        reducere: "35% reducere · mamografie gratuită cu bilet",
        clinica: "Clinica MC GRAL Ploiești, Str. Cuza Vodă nr. 6",
        intrebare: "bilet_mf",
        s1: {
          cheie: "consult",
          nume: "Consult ginecologic",
          medici: [144383, 146640, 146824, 146646, 146629],
        },
        s2: {
          cheie: "mamo",
          nume: "Mamografie 2D bilaterală",
          medici: [146492],
        },
      },
      "constanta-p1": {
        titlu: "Pachetul 1: consult ginecologic + ecografie mamară",
        reducere: "40% reducere",
        clinica: "Clinica GRAL Constanța, Bd. Alexandru Lăpușneanu nr. 87",
        s1: { cheie: "consult", nume: "Consult ginecologic", medici: [146575] },
        s2: { cheie: "eco", nume: "Ecografie mamară", medici: [146614] },
      },
      "craiova-p1": {
        titlu: "Pachetul 1: consult ginecologic + ecografie de sân",
        reducere: "40% reducere",
        clinica: "Clinica OncoFort Craiova, Str. Brestei nr. 21",
        s1: { cheie: "consult", nume: "Consult ginecologic", medici: [144534] },
        s2: { cheie: "eco", nume: "Ecografie de sân", medici: [144534] },
      },
      "pitesti-eco": {
        titlu: "Ecografie de sân cu 40% reducere",
        reducere: "40% reducere",
        clinica: "Clinica GRAL Pitești, Bd. Nicolae Bălcescu nr. 90",
        s1: { cheie: "eco", nume: "Ecografie de sân", medici: [144392] },
      },
    },
  };

  /* ---------- utilitare ---------- */
  var $ = function (sel, el) {
    return (el || document).querySelector(sel);
  };
  var $$ = function (sel, el) {
    return Array.prototype.slice.call((el || document).querySelectorAll(sel));
  };
  var pad = function (n) {
    return (n < 10 ? "0" : "") + n;
  };
  var iso = function (d) {
    return (
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate())
    );
  };
  var azi = function () {
    return iso(new Date());
  };
  var maine = function () {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    return iso(d);
  };
  var min = function (h) {
    var p = h.split(":");
    return +p[0] * 60 + +p[1];
  };
  var LUNI = [
    "ianuarie",
    "februarie",
    "martie",
    "aprilie",
    "mai",
    "iunie",
    "iulie",
    "august",
    "septembrie",
    "octombrie",
    "noiembrie",
    "decembrie",
  ];
  var ZILE = [
    "duminică",
    "luni",
    "marți",
    "miercuri",
    "joi",
    "vineri",
    "sâmbătă",
  ];
  var ziFrumos = function (z) {
    var d = new Date(z + "T12:00:00");
    return ZILE[d.getDay()] + ", " + d.getDate() + " " + LUNI[d.getMonth()];
  };
  var ziForm = function (z) {
    var p = z.split("-");
    return +p[1] + "/" + +p[2] + "/" + p[0];
  }; // formatul formularului: M/D/YYYY
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var csrf = function () {
    var m = $('meta[name="csrf-token"]');
    return m ? m.content : "";
  };
  var INTERVALE = { dim: "dimineața", dupa: "după-amiaza", oricand: "oricând" };

  function post(url, campuri) {
    var body = new URLSearchParams();
    Object.keys(campuri).forEach(function (k) {
      body.append(k, campuri[k]);
    });
    return fetch(url, {
      method: "POST",
      body: body,
      credentials: "same-origin",
      headers: {
        "X-CSRF-TOKEN": csrf(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      },
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  /* ---------- sloturi (citire, cu memorare scurta in sessionStorage) ---------- */
  function cacheGet(k) {
    try {
      var v = JSON.parse(sessionStorage.getItem(k));
      if (v && Date.now() - v.t < CFG.cacheMin * 60000) return v.d;
    } catch (e) {}
    return null;
  }
  function cacheSet(k, d) {
    try {
      sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), d: d }));
    } catch (e) {}
  }
  function oreDin(lista) {
    // raspunsul poate contine si false in loc de ore
    return (Array.isArray(lista) ? lista : [])
      .filter(function (h) {
        return typeof h === "string";
      })
      .map(function (h) {
        return h.slice(0, 5);
      });
  }

  function sloturiLuna(id, luna) {
    var m = CFG.medici[id],
      k = "lunaroz:" + id + ":" + m.loc + ":" + m.spec + ":" + luna,
      c = cacheGet(k);
    if (c) return Promise.resolve(c);
    return post("/Programari-online/get-hours", {
      "form_data[city_id]": 0,
      "form_data[location_id]": m.loc,
      "form_data[specialization_id]": m.spec,
      "form_data[service_id]": 0,
      "form_data[doctor_id]": id,
      "form_data[ref_month]": luna,
      "form_data[cnas]": 0,
    }).then(function (r) {
      var d = {};
      (Array.isArray(r) ? r : []).forEach(function (z) {
        if (z && typeof z === "object" && z.date) d[z.date] = oreDin(z.hours);
      });
      cacheSet(k, d);
      return d;
    });
  }
  function sloturiZi(id, zi) {
    // reverificare inainte de trimitere, fara memorare
    var m = CFG.medici[id];
    return post("/Programari-online/get-hours", {
      "form_data[city_id]": m.city,
      "form_data[location_id]": m.loc,
      "form_data[specialization_id]": m.spec,
      "form_data[service_id]": 0,
      "form_data[doctor_id]": id,
      "form_data[date]": ziForm(zi),
      "form_data[cnas]": 0,
    }).then(oreDin);
  }
  function mediciPachet(p) {
    var ids = {};
    p.s1.medici.concat(p.s2 ? p.s2.medici : []).forEach(function (i) {
      ids[i] = 1;
    });
    return Object.keys(ids);
  }
  function incarca(p) {
    var cereri = [];
    mediciPachet(p).forEach(function (id) {
      CFG.luni.forEach(function (l) {
        cereri.push(
          sloturiLuna(id, l).then(function (d) {
            return { id: id, d: d };
          }),
        );
      });
    });
    return Promise.all(cereri).then(function (rez) {
      var S = {};
      rez.forEach(function (r) {
        S[r.id] = S[r.id] || {};
        Object.keys(r.d).forEach(function (z) {
          S[r.id][z] = r.d[z];
        });
      });
      return S;
    });
  }

  /* ---------- combinarea: intai serviciul 1, apoi serviciul 2 in aceeasi zi, pauza 0..pauzaMax; un singur serviciu = orele lui ---------- */
  function perechiZi(p, S, zi) {
    var out = [];
    p.s1.medici.forEach(function (a) {
      var A = (S[a] || {})[zi] || [],
        pasA = CFG.medici[a].pas;
      A.forEach(function (ha) {
        if (!p.s2) {
          out.push({ zi: zi, a: a, ha: ha, b: null, hb: null, pauza: null });
          return;
        }
        var ia = min(ha),
          best = null;
        p.s2.medici.forEach(function (b) {
          ((S[b] || {})[zi] || []).forEach(function (hb) {
            var pauza = min(hb) - (ia + pasA);
            if (pauza < 0 || pauza > CFG.pauzaMax) return;
            if (!best || pauza < best.pauza)
              best = { b: b, hb: hb, pauza: pauza };
          });
        });
        if (best)
          out.push({
            zi: zi,
            a: a,
            ha: ha,
            b: best.b,
            hb: best.hb,
            pauza: best.pauza,
          });
      });
    });
    out.sort(function (x, y) {
      return min(x.ha) - min(y.ha) || (x.pauza || 0) - (y.pauza || 0);
    });
    return out;
  }
  function zileCuPerechi(p, S) {
    var zile = {},
      de = CFG.perioada[0] > azi() ? CFG.perioada[0] : azi();
    p.s1.medici.forEach(function (a) {
      Object.keys(S[a] || {}).forEach(function (z) {
        if (z > de && z <= CFG.perioada[1]) zile[z] = 1;
      });
    });
    return Object.keys(zile)
      .sort()
      .filter(function (z) {
        return perechiZi(p, S, z).length > 0;
      });
  }

  /* ---------- interfata ---------- */
  var CSS =
    ".lr-fund{position:fixed;inset:0;background:rgba(26,26,46,.55);z-index:99990;display:flex;align-items:flex-end;justify-content:center;padding:0}" +
    "@media(min-width:640px){.lr-fund{align-items:center;padding:16px}}" +
    ".lr-cutie{background:#fff;width:100%;max-width:640px;max-height:92vh;overflow:auto;border-radius:14px 14px 0 0;font-family:Montserrat,Arial,sans-serif;color:#444;font-size:15px;line-height:1.5;box-shadow:0 12px 40px rgba(0,0,0,.25)}" +
    "@media(min-width:640px){.lr-cutie{border-radius:12px}}" +
    ".lr-cap{position:sticky;top:0;background:#fff;border-bottom:1px solid #eee;padding:12px 16px;display:flex;align-items:flex-start;gap:12px;z-index:1}" +
    ".lr-cap h3{margin:0;font-size:17px;color:#042C53;line-height:1.3}.lr-cap small{display:block;color:#b3106c;font-weight:600;font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:2px}" +
    ".lr-x{margin-left:auto;border:0;background:#f3f3f3;border-radius:50%;width:40px;height:40px;font-size:22px;line-height:1;cursor:pointer;color:#444;flex:none}" +
    ".lr-corp{padding:14px 16px 18px}.lr-pas{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#b3106c;margin:0 0 8px;outline:0}" +
    ".lr-zile{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin:0 0 6px}" +
    ".lr-zi,.lr-pereche,.lr-filtru button{border:1px solid #ddd;background:#fff;border-radius:8px;padding:10px 12px;text-align:left;cursor:pointer;font:inherit;color:#1a1a2e;min-height:44px}" +
    ".lr-zi:hover,.lr-pereche:hover{border-color:#ec1c8f}.lr-zi b{display:block;font-size:15px}.lr-zi span{font-size:12px;color:#777}" +
    ".lr-filtru{display:flex;gap:8px;margin:0 0 10px}.lr-filtru button{flex:1;text-align:center}.lr-filtru button.on{background:#fdf3f8;border-color:#ec1c8f;color:#b3106c;font-weight:600}" +
    ".lr-lista{display:flex;flex-direction:column;gap:8px}.lr-pereche{display:flex;flex-direction:column;gap:3px}.lr-r{display:flex;gap:10px;align-items:baseline}.lr-r b{font-size:16px;color:#042C53;min-width:50px;flex:none}.lr-pereche small{color:#777;font-size:13px}" +
    ".lr-rez{background:#fdf3f8;border:1px solid #f3d3e4;border-radius:8px;padding:10px 12px;margin:0 0 12px;font-size:14px}.lr-rez b{color:#042C53}" +
    ".lr-camp{display:block;margin:0 0 10px}.lr-camp span{display:block;font-size:13px;font-weight:600;color:#1a1a2e;margin-bottom:4px}" +
    ".lr-camp input[type=text],.lr-camp input[type=tel],.lr-camp input[type=email],.lr-camp input[type=date]{width:100%;box-sizing:border-box;border:1px solid #ccc;border-radius:6px;padding:11px 12px;font:inherit;min-height:44px}" +
    ".lr-radio{display:flex;gap:16px;flex-wrap:wrap}.lr-radio label{display:flex;align-items:center;gap:6px;min-height:44px;cursor:pointer}" +
    ".lr-aten{background:#fff6ea;border-left:4px solid #ec691f;padding:8px 12px;border-radius:0 6px 6px 0;font-size:13px;margin:0 0 10px}" +
    ".lr-gdpr{display:flex;gap:8px;align-items:flex-start;font-size:13px;margin:4px 0 12px}.lr-gdpr input{margin-top:4px;width:18px;height:18px;flex:none}" +
    ".lr-btn{display:block;width:100%;border:0;border-radius:6px;padding:14px 12px;font:inherit;font-weight:600;font-size:15px;color:#fff;background:#EC691F;cursor:pointer;min-height:44px;text-align:center;text-decoration:none;box-sizing:border-box}.lr-btn[disabled]{opacity:.6;cursor:wait}" +
    ".lr-btn2{display:inline-block;border:0;background:none;color:#2d4191;font:inherit;font-size:14px;text-decoration:underline;cursor:pointer;padding:10px 0;min-height:44px}" +
    ".lr-err{color:#b3261e;font-size:13px;margin:6px 0 0}.lr-gol{color:#666;font-size:14px}.lr-ok{text-align:center;padding:10px 0}.lr-ok .lr-ic{width:56px;height:56px;border-radius:50%;background:#ec1c8f;color:#fff;font-size:30px;line-height:56px;margin:0 auto 10px;font-weight:700}" +
    ".lr-tel{color:#2d4191;font-weight:600;white-space:nowrap}.lr-mic{font-size:13px;color:#666}";

  var st = null; // starea pop-up-ului curent

  function deschide(cheie) {
    var p = CFG.pachete[cheie];
    if (!p) return;
    inchide();
    if (!$("#lr-css")) {
      var s = document.createElement("style");
      s.id = "lr-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
    st = {
      cheie: cheie,
      p: p,
      S: null,
      zi: null,
      per: null,
      filtru: "toate",
      focusInainte: document.activeElement,
    };
    var fund = document.createElement("div");
    fund.className = "lr-fund";
    fund.id = "lr-fund";
    fund.innerHTML =
      '<div class="lr-cutie" role="dialog" aria-modal="true" aria-labelledby="lr-titlu">' +
      '<div class="lr-cap"><div><small>Prima Mea Lună Roz · ' +
      esc(p.reducere) +
      '</small><h3 id="lr-titlu">' +
      esc(p.titlu) +
      "</h3></div>" +
      '<button type="button" class="lr-x" aria-label="Închide">&times;</button></div><div class="lr-corp" id="lr-corp"></div></div>';
    document.body.appendChild(fund);
    document.body.style.overflow = "hidden";
    $(".lr-x", fund).onclick = inchide;
    fund.addEventListener("click", function (e) {
      if (e.target === fund) inchide();
    });
    document.addEventListener("keydown", escInchide);
    pasZi();
  }
  function escInchide(e) {
    if (e.key === "Escape") inchide();
  }
  function inchide() {
    var f = $("#lr-fund");
    if (f) f.parentNode.removeChild(f);
    document.body.style.overflow = "";
    document.removeEventListener("keydown", escInchide);
    if (st && st.focusInainte && st.focusInainte.focus) st.focusInainte.focus();
    st = null;
  }
  function corp(html) {
    var c = $("#lr-corp");
    if (c) {
      c.innerHTML = html;
      c.scrollTop = 0;
      var h = $(".lr-pas", c);
      if (h) {
        h.setAttribute("tabindex", "-1");
        h.focus();
      }
    }
  }
  function afisat(id) {
    return CFG.medici[id].afisare || CFG.medici[id].nume;
  } // medicul, sau locul (mamografia nu se alege pe medic)
  function ambele(p) {
    return p.s2 ? "ambele servicii" : p.s1.nume.toLowerCase();
  }

  /* pasul 1: zilele cu ore potrivite; oricand, alternativa „zi preferata” (fara telefon) */
  function pasZi() {
    var p = st.p;
    corp(
      '<p class="lr-pas">Pasul 1 din 3: alege ziua</p><p class="lr-gol">Căutăm zilele cu ore libere pentru ' +
        esc(ambele(p)) +
        "…</p>",
    );
    (st.S ? Promise.resolve(st.S) : incarca(p))
      .then(function (S) {
        if (!st) return;
        st.S = S;
        var zile = zileCuPerechi(p, S),
          h = '<p class="lr-pas">Pasul 1 din 3: alege ziua</p>';
        if (!zile.length) {
          h +=
            '<p class="lr-gol" style="margin:0 0 12px">Momentan nu sunt ore libere online pentru ' +
            esc(ambele(p)) +
            " în perioada campaniei. Alege o zi preferată și te sună un operator GRAL Medical ca să stabilească orele.</p>" +
            '<button type="button" class="lr-btn" id="lr-pref">Alege ziua preferată</button>';
        } else {
          h +=
            '<p class="lr-mic" style="margin:0 0 10px">Zilele în care ' +
            esc(
              p.s2
                ? "ambele servicii se pot face în aceeași vizită"
                : p.s1.nume.toLowerCase() + " are ore libere",
            ) +
            ", la " +
            esc(p.clinica) +
            '.</p><div class="lr-zile">';
          zile.forEach(function (z) {
            var n = perechiZi(p, S, z).length;
            h +=
              '<button type="button" class="lr-zi" data-zi="' +
              z +
              '"><b>' +
              esc(ziFrumos(z)) +
              "</b><span>" +
              n +
              (n === 1 ? " variantă de ore" : " variante de ore") +
              "</span></button>";
          });
          h +=
            '</div><p class="lr-mic">Nu găsești o zi potrivită? <button type="button" class="lr-btn2" id="lr-pref" style="padding:0;min-height:0">Alege o zi preferată</button> și te sunăm noi pentru ore.</p>';
        }
        corp(h);
        $$(".lr-zi").forEach(function (b) {
          b.onclick = function () {
            st.zi = b.getAttribute("data-zi");
            st.filtru = "toate";
            pasOre();
          };
        });
        $("#lr-pref").onclick = pasPreferinta;
      })
      .catch(function () {
        corp(
          '<p class="lr-pas">Pasul 1 din 3: alege ziua</p><p class="lr-gol">Nu am putut citi programul medicilor acum. Poți încerca din nou sau poți alege o zi preferată, iar un operator te sună pentru ore.</p>' +
            '<button type="button" class="lr-btn" id="lr-pref" style="margin:0 0 8px">Alege ziua preferată</button><button type="button" class="lr-btn2" id="lr-retry">Încearcă din nou</button>',
        );
        $("#lr-pref").onclick = pasPreferinta;
        $("#lr-retry").onclick = function () {
          st.S = null;
          pasZi();
        };
      });
  }

  /* pasul 2a: perechile de ore ale zilei */
  function pasOre(mesaj) {
    var p = st.p,
      toate = perechiZi(p, st.S, st.zi);
    var per = toate.filter(function (x) {
      return (
        st.filtru === "toate" ||
        (st.filtru === "dim" ? min(x.ha) < 13 * 60 : min(x.ha) >= 13 * 60)
      );
    });
    var h =
      '<p class="lr-pas">Pasul 2 din 3: alege orele</p>' +
      (mesaj ? '<p class="lr-err" role="alert">' + esc(mesaj) + "</p>" : "") +
      '<div class="lr-rez"><b>' +
      esc(ziFrumos(st.zi)) +
      "</b> · " +
      toate.length +
      ' variante. <button type="button" class="lr-btn2" id="lr-alta-zi" style="padding:0 0 0 6px;min-height:0">altă zi</button></div>' +
      '<div class="lr-filtru"><button type="button" data-f="toate">Toate</button><button type="button" data-f="dim">Dimineața</button><button type="button" data-f="dupa">După-amiaza</button></div><div class="lr-lista">';
    if (!per.length)
      h +=
        '<p class="lr-gol">Nicio variantă în intervalul ales. Încearcă celălalt interval.</p>';
    per.forEach(function (x, i) {
      h +=
        '<button type="button" class="lr-pereche" data-i="' +
        i +
        '"><span class="lr-r"><b>' +
        x.ha +
        "</b><span>" +
        esc(p.s1.nume) +
        " · " +
        esc(afisat(x.a)) +
        "</span></span>";
      if (p.s2)
        h +=
          '<span class="lr-r"><b>' +
          x.hb +
          "</b><span>" +
          esc(p.s2.nume) +
          (x.b !== x.a ? " · " + esc(afisat(x.b)) : "") +
          "</span></span><small>" +
          (x.pauza === 0 ? "una după alta" : "pauză " + x.pauza + " min") +
          "</small>";
      h += "</button>";
    });
    corp(h + "</div>");
    $$(".lr-filtru button").forEach(function (b) {
      b.className = b.getAttribute("data-f") === st.filtru ? "on" : "";
      b.onclick = function () {
        st.filtru = b.getAttribute("data-f");
        pasOre();
      };
    });
    $("#lr-alta-zi").onclick = pasZi;
    $$(".lr-pereche").forEach(function (b) {
      b.onclick = function () {
        st.per = per[+b.getAttribute("data-i")];
        pasDate();
      };
    });
  }

  /* pasul 2b: zi preferata + interval, cand nu exista ore potrivite online sau pacienta prefera asa */
  function pasPreferinta(err) {
    var d = st.pref || {},
      de = CFG.perioada[0] > maine() ? CFG.perioada[0] : maine();
    corp(
      '<p class="lr-pas">Pasul 2 din 3: ziua preferată</p>' +
        '<p class="lr-mic" style="margin:0 0 10px">Alege ziua și intervalul care îți convin. Un operator GRAL Medical te sună și stabilește orele pentru ' +
        esc(ambele(st.p)) +
        ".</p>" +
        '<form id="lr-form-pref" novalidate><label class="lr-camp"><span>Ziua preferată</span><input type="date" name="zi" min="' +
        de +
        '" max="' +
        CFG.perioada[1] +
        '" value="' +
        esc(d.zi || "") +
        '" required></label>' +
        '<div class="lr-camp"><span>Intervalul</span><div class="lr-radio">' +
        ["dim", "dupa", "oricand"]
          .map(function (k) {
            return (
              '<label><input type="radio" name="interval" value="' +
              k +
              '"' +
              ((d.interval || "oricand") === k ? " checked" : "") +
              "> " +
              INTERVALE[k].charAt(0).toUpperCase() +
              INTERVALE[k].slice(1) +
              "</label>"
            );
          })
          .join("") +
        "</div></div>" +
        (err ? '<p class="lr-err" role="alert">' + esc(err) + "</p>" : "") +
        '<button type="submit" class="lr-btn">Continuă</button></form>' +
        '<button type="button" class="lr-btn2" id="lr-inapoi-zile" style="margin-top:6px">Înapoi la zilele cu ore libere</button>',
    );
    $("#lr-inapoi-zile").onclick = pasZi;
    $("#lr-form-pref").onsubmit = function (e) {
      e.preventDefault();
      var f = e.target,
        zi = (f.elements.zi.value || "").trim(),
        iv = f.querySelector("input[name=interval]:checked");
      st.pref = { zi: zi, interval: iv ? iv.value : "oricand" };
      if (!/^\d{4}-\d{2}-\d{2}$/.test(zi) || zi < de || zi > CFG.perioada[1])
        return pasPreferinta(
          "Alege o zi din perioada campaniei (până la " +
            ziFrumos(CFG.perioada[1]) +
            ").",
        );
      st.per = {
        zi: zi,
        pref: true,
        interval: st.pref.interval,
        a: st.p.s1.medici[0],
        ha: null,
        b: st.p.s2 ? st.p.s2.medici[0] : null,
        hb: null,
      };
      pasDate();
    };
  }

  function rezumatHtml(p, x) {
    if (x.pref)
      return (
        "<b>" +
        esc(ziFrumos(x.zi)) +
        "</b>, " +
        INTERVALE[x.interval] +
        "<br>Orele le stabilește operatorul împreună cu tine, pentru " +
        esc(ambele(p)) +
        "."
      );
    return (
      "<b>" +
      esc(ziFrumos(x.zi)) +
      "</b><br>" +
      x.ha +
      " " +
      esc(p.s1.nume) +
      ", " +
      esc(afisat(x.a)) +
      (p.s2
        ? "<br>" +
          x.hb +
          " " +
          esc(p.s2.nume) +
          (x.b !== x.a ? ", " + esc(afisat(x.b)) : "")
        : "")
    );
  }

  /* pasul 3: datele pacientei */
  function pasDate(err) {
    var p = st.p,
      x = st.per,
      d = st.date || {},
      q = p.intrebare && CFG.intrebari[p.intrebare];
    var h =
      '<p class="lr-pas">Pasul 3 din 3: datele tale</p><div class="lr-rez">' +
      rezumatHtml(p, x) +
      ' <button type="button" class="lr-btn2" id="lr-alte-ore" style="padding:0 0 0 6px;min-height:0">schimbă</button></div>' +
      '<form id="lr-form" novalidate>' +
      '<label class="lr-camp"><span>Nume și prenume</span><input type="text" name="nume" autocomplete="name" value="' +
      esc(d.nume || "") +
      '" required></label>' +
      '<label class="lr-camp"><span>Data nașterii</span><input type="date" name="dn" autocomplete="bday" value="' +
      esc(d.dn || "") +
      '" max="' +
      azi() +
      '" required></label>' +
      '<label class="lr-camp"><span>Telefon</span><input type="tel" name="tel" autocomplete="tel" inputmode="tel" value="' +
      esc(d.tel || "") +
      '" required></label>' +
      '<label class="lr-camp"><span>E-mail</span><input type="email" name="email" autocomplete="email" inputmode="email" value="' +
      esc(d.email || "") +
      '" required></label>';
    if (q) {
      h +=
        '<div class="lr-camp"><span>' +
        esc(q.text) +
        '</span><div class="lr-radio">' +
        '<label><input type="radio" name="raspuns" value="da"' +
        (d.raspuns === "da" ? " checked" : "") +
        "> " +
        esc(q.da) +
        "</label>" +
        '<label><input type="radio" name="raspuns" value="nu"' +
        (d.raspuns === "nu" ? " checked" : "") +
        "> " +
        esc(q.nu) +
        "</label></div></div>" +
        '<div class="lr-aten" id="lr-nota-nu" style="display:' +
        (d.raspuns === "nu" ? "block" : "none") +
        '">' +
        esc(q.nota_nu) +
        "</div>";
    }
    h +=
      '<label class="lr-gdpr"><input type="checkbox" name="gdpr"' +
      (d.gdpr ? " checked" : "") +
      '> Sunt de acord cu <a href="/protectia-datelor" target="_blank" rel="noopener">Politica de confidențialitate GRAL Medical</a> și cu prelucrarea datelor pentru această programare.</label>' +
      (err ? '<p class="lr-err" role="alert">' + esc(err) + "</p>" : "") +
      '<button type="submit" class="lr-btn" id="lr-trimite">Trimite cererea de programare</button>' +
      '<p class="lr-mic" style="margin:10px 0 0">Un operator GRAL Medical te sună pentru confirmare. Reducerea campaniei este inclusă în programare, nu ai nevoie de cod sau voucher.</p></form>';
    corp(h);
    $("#lr-alte-ore").onclick = function () {
      if (x.pref) pasPreferinta();
      else pasOre();
    };
    $$("input[name=raspuns]").forEach(function (r) {
      r.onchange = function () {
        $("#lr-nota-nu").style.display =
          r.value === "nu" && r.checked ? "block" : "none";
      };
    });
    $("#lr-form").onsubmit = function (e) {
      e.preventDefault();
      finalizeaza();
    };
  }

  function citesteForm() {
    var f = $("#lr-form"),
      g = function (n) {
        var el = f.elements[n];
        return el
          ? el.type === "checkbox"
            ? el.checked
            : (el.value || "").trim()
          : "";
      };
    var r = f.querySelector("input[name=raspuns]:checked");
    return {
      nume: g("nume"),
      dn: g("dn"),
      tel: g("tel"),
      email: g("email"),
      gdpr: g("gdpr"),
      raspuns: r ? r.value : "",
    };
  }
  function valideaza(d, p) {
    if (d.nume.length < 5) return "Scrie numele și prenumele.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.dn)) return "Alege data nașterii.";
    if (d.tel.replace(/\D/g, "").length < 10)
      return "Numărul de telefon trebuie să aibă cel puțin 10 cifre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))
      return "Scrie o adresă de e-mail validă.";
    if (p.intrebare && !d.raspuns) return "Răspunde la întrebarea de mai sus.";
    if (!d.gdpr) return "Bifează acordul pentru prelucrarea datelor.";
    return "";
  }

  // Textul pentru operator (campul "Informatii suplimentare" al formularului online -> e-mailul catre call center).
  // Etichete majuscule + un rand per informatie: lizibil si daca e-mailul uneste randurile. Fara coduri / vouchere.
  function medicLoc(id) {
    var m = CFG.medici[id];
    return m.nume + (m.afisare ? ", " + m.afisare : "");
  }
  function textObs(p, x, d) {
    var r = [
      "CAMPANIA PRIMA MEA LUNA ROZ: " + p.titlu + " (" + p.reducere + ").",
      "LOCATIA: " + p.clinica + ".",
    ];
    if (x.pref) {
      r.push(
        "ZI PREFERATA: " +
          ziFrumos(x.zi) +
          ", " +
          INTERVALE[x.interval] +
          " (pacienta nu a fixat ore).",
      );
      r.push(
        "DE FACUT: sunati pacienta si propuneti ore pentru " +
          p.s1.nume +
          " (" +
          medicLoc(x.a) +
          ")" +
          (p.s2
            ? " si " +
              p.s2.nume +
              " (" +
              medicLoc(x.b) +
              "), in aceeasi zi, una dupa alta"
            : "") +
          ".",
      );
    } else {
      r.push(
        "PROGRAMAREA 1: " +
          ziFrumos(x.zi) +
          ", ora " +
          x.ha +
          ", " +
          p.s1.nume +
          ", " +
          medicLoc(x.a) +
          ".",
      );
      if (p.s2) {
        r.push(
          "PROGRAMAREA 2: aceeasi zi, ora " +
            x.hb +
            ", " +
            p.s2.nume +
            ", " +
            medicLoc(x.b) +
            ".",
        );
        r.push(
          "DE FACUT: sunati pacienta si confirmati AMBELE programari in aceeasi zi (sau cele mai apropiate ore libere).",
        );
      } else {
        r.push("DE FACUT: sunati pacienta si confirmati programarea.");
      }
    }
    var q = p.intrebare && CFG.intrebari[p.intrebare];
    if (q)
      r.push(
        q.obs.toUpperCase() + ": " + (d.raspuns === "da" ? "DA" : "NU") + ".",
      );
    r.push(
      "Reducerea campaniei se aplica la receptie; pacienta nu are cod sau voucher.",
    );
    return r.join("\n");
  }

  // Cererea completa, in formatul campurilor formularului online
  function construiestePayload(p, x, d) {
    var dn = d.dn.split("-");
    function serv(nr, s, id, ora) {
      var m = CFG.medici[id];
      return {
        nr: nr,
        nume: s.nume,
        cheie: s.cheie,
        ora: ora ? ora + ":00" : "",
        doctor_id: +id,
        location_id: m.loc,
        specialization_id: m.spec,
        city_id: m.city,
        coduri_medis: (m.coduri || {})[s.cheie] || [],
      };
    }
    var servicii = [serv(1, p.s1, x.a, x.ha)];
    if (p.s2) servicii.push(serv(2, p.s2, x.b, x.hb));
    return {
      pachet: st.cheie,
      mod: x.pref ? "preferinta" : "ore",
      zi: x.zi,
      zi_form: x.pref ? "" : ziForm(x.zi),
      favorite_form: x.pref ? ziForm(x.zi) : "",
      interval: x.pref ? x.interval : "",
      pacienta: {
        nume: d.nume,
        dob_year: dn[0],
        dob_month: String(+dn[1]),
        dob_day: String(+dn[2]),
        telefon: d.tel,
        email: d.email,
        raspuns: d.raspuns,
      },
      servicii: servicii,
      observatii: textObs(p, x, d),
      prev_url: location.href,
    };
  }

  function finalizeaza() {
    var p = st.p,
      x = st.per,
      d = citesteForm();
    st.date = d;
    var err = valideaza(d, p);
    if (err) return pasDate(err);
    var btn = $("#lr-trimite");
    btn.disabled = true;
    btn.textContent = x.pref ? "Se trimite…" : "Verificăm orele…";
    $$(".lr-err").forEach(function (e) {
      e.parentNode.removeChild(e);
    }); // mesajul erorii anterioare nu mai e valabil
    // 1. reverificam ca orele alese mai sunt libere (nu si la zi preferata: nu are ore)
    var verif = x.pref
      ? Promise.resolve(null)
      : Promise.all([
          sloturiZi(x.a, x.zi),
          p.s2 ? sloturiZi(x.b, x.zi) : Promise.resolve([]),
        ]);
    verif
      .then(function (r) {
        if (r) {
          st.S[x.a][x.zi] = r[0];
          if (p.s2) st.S[x.b][x.zi] = r[1];
          if (r[0].indexOf(x.ha) < 0 || (p.s2 && r[1].indexOf(x.hb) < 0)) {
            st.per = null;
            return pasOre(
              p.s2
                ? "Una dintre orele alese tocmai s-a ocupat. Alege altă variantă din aceeași zi."
                : "Ora aleasă tocmai s-a ocupat. Alege alta.",
            );
          }
        }
        var payload = construiestePayload(p, x, d);
        // 2. trimiterea pe canalul formularului online (call center-ul confirma telefonic); CFG.trimite o poate inlocui
        btn.textContent = "Se trimite…";
        var fn =
          typeof CFG.trimite === "function" ? CFG.trimite : trimiteImplicit;
        return Promise.resolve(fn(payload)).then(function () {
          try {
            (window.dataLayer = window.dataLayer || []).push({
              event: "lunaroz_cerere",
              pachet: st.cheie,
              mod: payload.mod,
            });
          } catch (e) {}
          ecranFinal(p, x);
        });
      })
      .catch(function (e) {
        pasDate(
          (e && e.message ? e.message + " " : "") +
            "Dacă problema persistă, sună la " +
            CFG.telefon +
            " și spune că vrei o programare în campania Prima Mea Lună Roz.",
        );
      });
  }

  // Cererea de programare, cu aceleasi campuri pe care le trimite formularul /Programari-online (dist/js/scripts.js,
  // process_form); serviciul = codul din Medis, data M/D/YYYY, ora HH:MM:SS; la zi preferata: favorite_date in loc de date + hour.
  // Raspuns {"status":"failed","message"} = eroare.
  function cerereFormular(serv, pay, observatii) {
    return post("/Programari-online/process_form", {
      "form_data[search][city_id]": serv.city_id,
      "form_data[search][location_id]": serv.location_id,
      "form_data[search][specialization_id]": serv.specialization_id,
      "form_data[search][service_id]": serv.coduri_medis[0] || 0,
      "form_data[search][doctor_id]": serv.doctor_id,
      "form_data[search][first_available_date_val]": "",
      "form_data[search][cnas]": 0,
      "form_data[first_slot]": "false",
      "form_data[date]": pay.zi_form,
      "form_data[hour]": serv.ora,
      "form_data[favorite_date]": pay.favorite_form,
      "form_data[customer_name]": pay.pacienta.nume,
      "form_data[dob_year]": pay.pacienta.dob_year,
      "form_data[dob_month]": pay.pacienta.dob_month,
      "form_data[dob_day]": pay.pacienta.dob_day,
      "form_data[phone]": pay.pacienta.telefon,
      "form_data[email]": pay.pacienta.email,
      "form_data[extra_data]": observatii,
      "form_data[prev_url]": pay.prev_url,
    }).then(function (r) {
      if (r && r.status === "failed")
        throw new Error(r.message || "Cererea nu a putut fi trimisă.");
      return r;
    });
  }
  function trimiteImplicit(pay) {
    var s1 = pay.servicii[0],
      s2 = pay.servicii[1];
    if (CFG.cereri === 2 && s2) {
      return cerereFormular(
        s1,
        pay,
        "Programarea 1 din 2 (" + s1.nume + "). " + pay.observatii,
      ).then(function () {
        return cerereFormular(
          s2,
          pay,
          "Programarea 2 din 2 (" + s2.nume + "). " + pay.observatii,
        );
      });
    }
    return cerereFormular(s1, pay, pay.observatii);
  }

  function ecranFinal(p, x) {
    var ce = x.pref
      ? "pentru a stabili orele în <b>" +
        esc(ziFrumos(x.zi)) +
        "</b> (" +
        INTERVALE[x.interval] +
        ")"
      : "pentru confirmarea " +
        (p.s2 ? "ambelor programări" : "programării") +
        " din <b>" +
        esc(ziFrumos(x.zi)) +
        "</b> (" +
        x.ha +
        (p.s2 ? " și " + x.hb : "") +
        ")";
    corp(
      '<div class="lr-ok"><div class="lr-ic" aria-hidden="true">✓</div><p class="lr-pas">Cererea a fost trimisă</p><p>Te sună un operator GRAL Medical ' +
        ce +
        ".</p>" +
        '<div class="lr-rez" style="text-align:left">' +
        rezumatHtml(p, x) +
        "</div>" +
        '<p class="lr-mic">Reducerea campaniei Prima Mea Lună Roz este inclusă; nu ai nevoie de cod sau voucher la recepție.</p>' +
        '<p class="lr-mic">Dacă nu te sunăm până mâine, apelează <a class="lr-tel" href="' +
        CFG.telHref +
        '">' +
        CFG.telefon +
        "</a>.</p>" +
        '<button type="button" class="lr-btn2" id="lr-gata" style="margin-top:8px">Închide</button></div>',
    );
    $("#lr-gata").onclick = inchide;
  }

  /* ---------- legarea butoanelor din pagina (id="lunaroz-{pachet}" sau href care se termina cu #lunaroz-{pachet}) ---------- */
  function leaga() {
    Object.keys(CFG.pachete).forEach(function (k) {
      $$("#lunaroz-" + k + ', a[href$="#lunaroz-' + k + '"]').forEach(
        function (a) {
          if (a.__lr) return;
          a.__lr = true;
          a.addEventListener("click", function (e) {
            e.preventDefault();
            deschide(k);
          });
        },
      );
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", leaga);
  else leaga();
  window.lunaRoz = {
    deschide: deschide,
    inchide: inchide,
    cfg: CFG,
    perechiZi: perechiZi,
  };
})();
