import { app as $, ipcMain as P, dialog as lr, BrowserWindow as De } from "electron";
import { fileURLToPath as hr } from "node:url";
import b from "node:path";
import w from "fs";
import qe from "tty";
import V from "util";
import pr from "os";
import We from "buffer";
import U from "stream";
import mr from "path";
import xr from "zlib";
import Ve from "events";
import { exec as vr } from "child_process";
function yr(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ve = { exports: {} }, X = { exports: {} }, he, _e;
function gr() {
  if (_e) return he;
  _e = 1;
  var e = 1e3, r = e * 60, n = r * 60, t = n * 24, i = t * 7, o = t * 365.25;
  he = function(d, c) {
    c = c || {};
    var f = typeof d;
    if (f === "string" && d.length > 0)
      return s(d);
    if (f === "number" && isFinite(d))
      return c.long ? a(d) : u(d);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(d)
    );
  };
  function s(d) {
    if (d = String(d), !(d.length > 100)) {
      var c = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        d
      );
      if (c) {
        var f = parseFloat(c[1]), l = (c[2] || "ms").toLowerCase();
        switch (l) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return f * o;
          case "weeks":
          case "week":
          case "w":
            return f * i;
          case "days":
          case "day":
          case "d":
            return f * t;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return f * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return f * r;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return f * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return f;
          default:
            return;
        }
      }
    }
  }
  function u(d) {
    var c = Math.abs(d);
    return c >= t ? Math.round(d / t) + "d" : c >= n ? Math.round(d / n) + "h" : c >= r ? Math.round(d / r) + "m" : c >= e ? Math.round(d / e) + "s" : d + "ms";
  }
  function a(d) {
    var c = Math.abs(d);
    return c >= t ? h(d, c, t, "day") : c >= n ? h(d, c, n, "hour") : c >= r ? h(d, c, r, "minute") : c >= e ? h(d, c, e, "second") : d + " ms";
  }
  function h(d, c, f, l) {
    var m = c >= f * 1.5;
    return Math.round(d / f) + " " + l + (m ? "s" : "");
  }
  return he;
}
var pe, Ae;
function Ge() {
  if (Ae) return pe;
  Ae = 1;
  function e(r) {
    t.debug = t, t.default = t, t.coerce = h, t.disable = u, t.enable = o, t.enabled = a, t.humanize = gr(), t.destroy = d, Object.keys(r).forEach((c) => {
      t[c] = r[c];
    }), t.names = [], t.skips = [], t.formatters = {};
    function n(c) {
      let f = 0;
      for (let l = 0; l < c.length; l++)
        f = (f << 5) - f + c.charCodeAt(l), f |= 0;
      return t.colors[Math.abs(f) % t.colors.length];
    }
    t.selectColor = n;
    function t(c) {
      let f, l = null, m, x;
      function p(...v) {
        if (!p.enabled)
          return;
        const y = p, g = Number(/* @__PURE__ */ new Date()), q = g - (f || g);
        y.diff = q, y.prev = f, y.curr = g, f = g, v[0] = t.coerce(v[0]), typeof v[0] != "string" && v.unshift("%O");
        let F = 0;
        v[0] = v[0].replace(/%([a-zA-Z%])/g, (O, J) => {
          if (O === "%%")
            return "%";
          F++;
          const Re = t.formatters[J];
          if (typeof Re == "function") {
            const dr = v[F];
            O = Re.call(y, dr), v.splice(F, 1), F--;
          }
          return O;
        }), t.formatArgs.call(y, v), (y.log || t.log).apply(y, v);
      }
      return p.namespace = c, p.useColors = t.useColors(), p.color = t.selectColor(c), p.extend = i, p.destroy = t.destroy, Object.defineProperty(p, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => l !== null ? l : (m !== t.namespaces && (m = t.namespaces, x = t.enabled(c)), x),
        set: (v) => {
          l = v;
        }
      }), typeof t.init == "function" && t.init(p), p;
    }
    function i(c, f) {
      const l = t(this.namespace + (typeof f > "u" ? ":" : f) + c);
      return l.log = this.log, l;
    }
    function o(c) {
      t.save(c), t.namespaces = c, t.names = [], t.skips = [];
      const f = (typeof c == "string" ? c : "").trim().replace(" ", ",").split(",").filter(Boolean);
      for (const l of f)
        l[0] === "-" ? t.skips.push(l.slice(1)) : t.names.push(l);
    }
    function s(c, f) {
      let l = 0, m = 0, x = -1, p = 0;
      for (; l < c.length; )
        if (m < f.length && (f[m] === c[l] || f[m] === "*"))
          f[m] === "*" ? (x = m, p = l, m++) : (l++, m++);
        else if (x !== -1)
          m = x + 1, p++, l = p;
        else
          return !1;
      for (; m < f.length && f[m] === "*"; )
        m++;
      return m === f.length;
    }
    function u() {
      const c = [
        ...t.names,
        ...t.skips.map((f) => "-" + f)
      ].join(",");
      return t.enable(""), c;
    }
    function a(c) {
      for (const f of t.skips)
        if (s(c, f))
          return !1;
      for (const f of t.names)
        if (s(c, f))
          return !0;
      return !1;
    }
    function h(c) {
      return c instanceof Error ? c.stack || c.message : c;
    }
    function d() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return t.enable(t.load()), t;
  }
  return pe = e, pe;
}
var Te;
function br() {
  return Te || (Te = 1, function(e, r) {
    r.formatArgs = t, r.save = i, r.load = o, r.useColors = n, r.storage = s(), r.destroy = /* @__PURE__ */ (() => {
      let a = !1;
      return () => {
        a || (a = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), r.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let a;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (a = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(a[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function t(a) {
      if (a[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + a[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const h = "color: " + this.color;
      a.splice(1, 0, h, "color: inherit");
      let d = 0, c = 0;
      a[0].replace(/%[a-zA-Z%]/g, (f) => {
        f !== "%%" && (d++, f === "%c" && (c = d));
      }), a.splice(c, 0, h);
    }
    r.log = console.debug || console.log || (() => {
    });
    function i(a) {
      try {
        a ? r.storage.setItem("debug", a) : r.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let a;
      try {
        a = r.storage.getItem("debug");
      } catch {
      }
      return !a && typeof process < "u" && "env" in process && (a = process.env.DEBUG), a;
    }
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Ge()(r);
    const { formatters: u } = e.exports;
    u.j = function(a) {
      try {
        return JSON.stringify(a);
      } catch (h) {
        return "[UnexpectedJSONParseError]: " + h.message;
      }
    };
  }(X, X.exports)), X.exports;
}
var K = { exports: {} }, me, Me;
function wr() {
  return Me || (Me = 1, me = (e, r = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", t = r.indexOf(n + e), i = r.indexOf("--");
    return t !== -1 && (i === -1 || t < i);
  }), me;
}
var xe, Pe;
function Cr() {
  if (Pe) return xe;
  Pe = 1;
  const e = pr, r = qe, n = wr(), { env: t } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in t && (t.FORCE_COLOR === "true" ? i = 1 : t.FORCE_COLOR === "false" ? i = 0 : i = t.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(t.FORCE_COLOR, 10), 3));
  function o(a) {
    return a === 0 ? !1 : {
      level: a,
      hasBasic: !0,
      has256: a >= 2,
      has16m: a >= 3
    };
  }
  function s(a, h) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (a && !h && i === void 0)
      return 0;
    const d = i || 0;
    if (t.TERM === "dumb")
      return d;
    if (process.platform === "win32") {
      const c = e.release().split(".");
      return Number(c[0]) >= 10 && Number(c[2]) >= 10586 ? Number(c[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in t)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((c) => c in t) || t.CI_NAME === "codeship" ? 1 : d;
    if ("TEAMCITY_VERSION" in t)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(t.TEAMCITY_VERSION) ? 1 : 0;
    if (t.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in t) {
      const c = parseInt((t.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (t.TERM_PROGRAM) {
        case "iTerm.app":
          return c >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(t.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(t.TERM) || "COLORTERM" in t ? 1 : d;
  }
  function u(a) {
    const h = s(a, a && a.isTTY);
    return o(h);
  }
  return xe = {
    supportsColor: u,
    stdout: o(s(!0, r.isatty(1))),
    stderr: o(s(!0, r.isatty(2)))
  }, xe;
}
var Ne;
function Er() {
  return Ne || (Ne = 1, function(e, r) {
    const n = qe, t = V;
    r.init = d, r.log = u, r.formatArgs = o, r.save = a, r.load = h, r.useColors = i, r.destroy = t.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), r.colors = [6, 2, 3, 4, 5, 1];
    try {
      const f = Cr();
      f && (f.stderr || f).level >= 2 && (r.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    r.inspectOpts = Object.keys(process.env).filter((f) => /^debug_/i.test(f)).reduce((f, l) => {
      const m = l.substring(6).toLowerCase().replace(/_([a-z])/g, (p, v) => v.toUpperCase());
      let x = process.env[l];
      return /^(yes|on|true|enabled)$/i.test(x) ? x = !0 : /^(no|off|false|disabled)$/i.test(x) ? x = !1 : x === "null" ? x = null : x = Number(x), f[m] = x, f;
    }, {});
    function i() {
      return "colors" in r.inspectOpts ? !!r.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(f) {
      const { namespace: l, useColors: m } = this;
      if (m) {
        const x = this.color, p = "\x1B[3" + (x < 8 ? x : "8;5;" + x), v = `  ${p};1m${l} \x1B[0m`;
        f[0] = v + f[0].split(`
`).join(`
` + v), f.push(p + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        f[0] = s() + l + " " + f[0];
    }
    function s() {
      return r.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function u(...f) {
      return process.stderr.write(t.formatWithOptions(r.inspectOpts, ...f) + `
`);
    }
    function a(f) {
      f ? process.env.DEBUG = f : delete process.env.DEBUG;
    }
    function h() {
      return process.env.DEBUG;
    }
    function d(f) {
      f.inspectOpts = {};
      const l = Object.keys(r.inspectOpts);
      for (let m = 0; m < l.length; m++)
        f.inspectOpts[l[m]] = r.inspectOpts[l[m]];
    }
    e.exports = Ge()(r);
    const { formatters: c } = e.exports;
    c.o = function(f) {
      return this.inspectOpts.colors = this.useColors, t.inspect(f, this.inspectOpts).split(`
`).map((l) => l.trim()).join(" ");
    }, c.O = function(f) {
      return this.inspectOpts.colors = this.useColors, t.inspect(f, this.inspectOpts);
    };
  }(K, K.exports)), K.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? ve.exports = br() : ve.exports = Er();
var Fr = ve.exports, D = { exports: {} }, we = { exports: {} }, Sr = He;
function He(e, r) {
  if (e && r) return He(e)(r);
  if (typeof e != "function")
    throw new TypeError("need wrapper function");
  return Object.keys(e).forEach(function(t) {
    n[t] = e[t];
  }), n;
  function n() {
    for (var t = new Array(arguments.length), i = 0; i < t.length; i++)
      t[i] = arguments[i];
    var o = e.apply(this, t), s = t[t.length - 1];
    return typeof o == "function" && o !== s && Object.keys(s).forEach(function(u) {
      o[u] = s[u];
    }), o;
  }
}
var Ze = Sr;
we.exports = Ze(k);
we.exports.strict = Ze(Ye);
k.proto = k(function() {
  Object.defineProperty(Function.prototype, "once", {
    value: function() {
      return k(this);
    },
    configurable: !0
  }), Object.defineProperty(Function.prototype, "onceStrict", {
    value: function() {
      return Ye(this);
    },
    configurable: !0
  });
});
function k(e) {
  var r = function() {
    return r.called ? r.value : (r.called = !0, r.value = e.apply(this, arguments));
  };
  return r.called = !1, r;
}
function Ye(e) {
  var r = function() {
    if (r.called)
      throw new Error(r.onceError);
    return r.called = !0, r.value = e.apply(this, arguments);
  }, n = e.name || "Function wrapped with `once`";
  return r.onceError = n + " shouldn't be called more than once", r.called = !1, r;
}
var Je = we.exports, Ir = Je, Or = function() {
}, Lr = function(e) {
  return e.setHeader && typeof e.abort == "function";
}, zr = function(e) {
  return e.stdio && Array.isArray(e.stdio) && e.stdio.length === 3;
}, Xe = function(e, r, n) {
  if (typeof r == "function") return Xe(e, null, r);
  r || (r = {}), n = Ir(n || Or);
  var t = e._writableState, i = e._readableState, o = r.readable || r.readable !== !1 && e.readable, s = r.writable || r.writable !== !1 && e.writable, u = !1, a = function() {
    e.writable || h();
  }, h = function() {
    s = !1, o || n.call(e);
  }, d = function() {
    o = !1, s || n.call(e);
  }, c = function(p) {
    n.call(e, p ? new Error("exited with error code: " + p) : null);
  }, f = function(p) {
    n.call(e, p);
  }, l = function() {
    process.nextTick(m);
  }, m = function() {
    if (!u) {
      if (o && !(i && i.ended && !i.destroyed)) return n.call(e, new Error("premature close"));
      if (s && !(t && t.ended && !t.destroyed)) return n.call(e, new Error("premature close"));
    }
  }, x = function() {
    e.req.on("finish", h);
  };
  return Lr(e) ? (e.on("complete", h), e.on("abort", l), e.req ? x() : e.on("request", x)) : s && !t && (e.on("end", a), e.on("close", a)), zr(e) && e.on("exit", c), e.on("end", d), e.on("finish", h), r.error !== !1 && e.on("error", f), e.on("close", l), function() {
    u = !0, e.removeListener("complete", h), e.removeListener("abort", l), e.removeListener("request", x), e.req && e.req.removeListener("finish", h), e.removeListener("end", a), e.removeListener("close", a), e.removeListener("finish", h), e.removeListener("exit", c), e.removeListener("end", d), e.removeListener("error", f), e.removeListener("close", l);
  };
}, Rr = Xe, _r = Je, Ar = Rr, Q;
try {
  Q = require("fs");
} catch {
}
var W = function() {
}, Tr = /^v?\.0/.test(process.version), ne = function(e) {
  return typeof e == "function";
}, Mr = function(e) {
  return !Tr || !Q ? !1 : (e instanceof (Q.ReadStream || W) || e instanceof (Q.WriteStream || W)) && ne(e.close);
}, Pr = function(e) {
  return e.setHeader && ne(e.abort);
}, Nr = function(e, r, n, t) {
  t = _r(t);
  var i = !1;
  e.on("close", function() {
    i = !0;
  }), Ar(e, { readable: r, writable: n }, function(s) {
    if (s) return t(s);
    i = !0, t();
  });
  var o = !1;
  return function(s) {
    if (!i && !o) {
      if (o = !0, Mr(e)) return e.close(W);
      if (Pr(e)) return e.abort();
      if (ne(e.destroy)) return e.destroy();
      t(s || new Error("stream was destroyed"));
    }
  };
}, Be = function(e) {
  e();
}, Br = function(e, r) {
  return e.pipe(r);
}, jr = function() {
  var e = Array.prototype.slice.call(arguments), r = ne(e[e.length - 1] || W) && e.pop() || W;
  if (Array.isArray(e[0]) && (e = e[0]), e.length < 2) throw new Error("pump requires two streams per minimum");
  var n, t = e.map(function(i, o) {
    var s = o < e.length - 1, u = o > 0;
    return Nr(i, s, u, function(a) {
      n || (n = a), a && t.forEach(Be), !s && (t.forEach(Be), r(n));
    });
  });
  return e.reduce(Br);
}, $r = jr;
const { PassThrough: Ur } = U;
var Dr = (e) => {
  e = { ...e };
  const { array: r } = e;
  let { encoding: n } = e;
  const t = n === "buffer";
  let i = !1;
  r ? i = !(n || t) : n = n || "utf8", t && (n = null);
  const o = new Ur({ objectMode: i });
  n && o.setEncoding(n);
  let s = 0;
  const u = [];
  return o.on("data", (a) => {
    u.push(a), i ? s = u.length : s += a.length;
  }), o.getBufferedValue = () => r ? u : t ? Buffer.concat(u, s) : u.join(""), o.getBufferedLength = () => s, o;
};
const { constants: qr } = We, Wr = $r, Vr = Dr;
class Ke extends Error {
  constructor() {
    super("maxBuffer exceeded"), this.name = "MaxBufferError";
  }
}
async function ie(e, r) {
  if (!e)
    return Promise.reject(new Error("Expected a stream"));
  r = {
    maxBuffer: 1 / 0,
    ...r
  };
  const { maxBuffer: n } = r;
  let t;
  return await new Promise((i, o) => {
    const s = (u) => {
      u && t.getBufferedLength() <= qr.MAX_LENGTH && (u.bufferedData = t.getBufferedValue()), o(u);
    };
    t = Wr(e, Vr(r), (u) => {
      if (u) {
        s(u);
        return;
      }
      i();
    }), t.on("data", () => {
      t.getBufferedLength() > n && s(new Ke());
    });
  }), t.getBufferedValue();
}
D.exports = ie;
D.exports.default = ie;
D.exports.buffer = (e, r) => ie(e, { ...r, encoding: "buffer" });
D.exports.array = (e, r) => ie(e, { ...r, array: !0 });
D.exports.MaxBufferError = Ke;
var Gr = D.exports, I = {}, G = {}, Hr = oe;
function oe() {
  this.pending = 0, this.max = 1 / 0, this.listeners = [], this.waiting = [], this.error = null;
}
oe.prototype.go = function(e) {
  this.pending < this.max ? Qe(this, e) : this.waiting.push(e);
};
oe.prototype.wait = function(e) {
  this.pending === 0 ? e(this.error) : this.listeners.push(e);
};
oe.prototype.hold = function() {
  return ke(this);
};
function ke(e) {
  e.pending += 1;
  var r = !1;
  return n;
  function n(i) {
    if (r) throw new Error("callback called twice");
    if (r = !0, e.error = e.error || i, e.pending -= 1, e.waiting.length > 0 && e.pending < e.max)
      Qe(e, e.waiting.shift());
    else if (e.pending === 0) {
      var o = e.listeners;
      e.listeners = [], o.forEach(t);
    }
  }
  function t(i) {
    i(e.error);
  }
}
function Qe(e, r) {
  r(ke(e));
}
var H = w, se = V, Ce = U, er = Ce.Readable, Ee = Ce.Writable, Zr = Ce.PassThrough, Yr = Hr, ae = Ve.EventEmitter;
G.createFromBuffer = Jr;
G.createFromFd = Xr;
G.BufferSlicer = R;
G.FdSlicer = z;
se.inherits(z, ae);
function z(e, r) {
  r = r || {}, ae.call(this), this.fd = e, this.pend = new Yr(), this.pend.max = 1, this.refCount = 0, this.autoClose = !!r.autoClose;
}
z.prototype.read = function(e, r, n, t, i) {
  var o = this;
  o.pend.go(function(s) {
    H.read(o.fd, e, r, n, t, function(u, a, h) {
      s(), i(u, a, h);
    });
  });
};
z.prototype.write = function(e, r, n, t, i) {
  var o = this;
  o.pend.go(function(s) {
    H.write(o.fd, e, r, n, t, function(u, a, h) {
      s(), i(u, a, h);
    });
  });
};
z.prototype.createReadStream = function(e) {
  return new fe(this, e);
};
z.prototype.createWriteStream = function(e) {
  return new ce(this, e);
};
z.prototype.ref = function() {
  this.refCount += 1;
};
z.prototype.unref = function() {
  var e = this;
  if (e.refCount -= 1, e.refCount > 0) return;
  if (e.refCount < 0) throw new Error("invalid unref");
  e.autoClose && H.close(e.fd, r);
  function r(n) {
    n ? e.emit("error", n) : e.emit("close");
  }
};
se.inherits(fe, er);
function fe(e, r) {
  r = r || {}, er.call(this, r), this.context = e, this.context.ref(), this.start = r.start || 0, this.endOffset = r.end, this.pos = this.start, this.destroyed = !1;
}
fe.prototype._read = function(e) {
  var r = this;
  if (!r.destroyed) {
    var n = Math.min(r._readableState.highWaterMark, e);
    if (r.endOffset != null && (n = Math.min(n, r.endOffset - r.pos)), n <= 0) {
      r.destroyed = !0, r.push(null), r.context.unref();
      return;
    }
    r.context.pend.go(function(t) {
      if (r.destroyed) return t();
      var i = new Buffer(n);
      H.read(r.context.fd, i, 0, n, r.pos, function(o, s) {
        o ? r.destroy(o) : s === 0 ? (r.destroyed = !0, r.push(null), r.context.unref()) : (r.pos += s, r.push(i.slice(0, s))), t();
      });
    });
  }
};
fe.prototype.destroy = function(e) {
  this.destroyed || (e = e || new Error("stream destroyed"), this.destroyed = !0, this.emit("error", e), this.context.unref());
};
se.inherits(ce, Ee);
function ce(e, r) {
  r = r || {}, Ee.call(this, r), this.context = e, this.context.ref(), this.start = r.start || 0, this.endOffset = r.end == null ? 1 / 0 : +r.end, this.bytesWritten = 0, this.pos = this.start, this.destroyed = !1, this.on("finish", this.destroy.bind(this));
}
ce.prototype._write = function(e, r, n) {
  var t = this;
  if (!t.destroyed) {
    if (t.pos + e.length > t.endOffset) {
      var i = new Error("maximum file length exceeded");
      i.code = "ETOOBIG", t.destroy(), n(i);
      return;
    }
    t.context.pend.go(function(o) {
      if (t.destroyed) return o();
      H.write(t.context.fd, e, 0, e.length, t.pos, function(s, u) {
        s ? (t.destroy(), o(), n(s)) : (t.bytesWritten += u, t.pos += u, t.emit("progress"), o(), n());
      });
    });
  }
};
ce.prototype.destroy = function() {
  this.destroyed || (this.destroyed = !0, this.context.unref());
};
se.inherits(R, ae);
function R(e, r) {
  ae.call(this), r = r || {}, this.refCount = 0, this.buffer = e, this.maxChunkSize = r.maxChunkSize || Number.MAX_SAFE_INTEGER;
}
R.prototype.read = function(e, r, n, t, i) {
  var o = t + n, s = o - this.buffer.length, u = s > 0 ? s : n;
  this.buffer.copy(e, r, t, o), setImmediate(function() {
    i(null, u);
  });
};
R.prototype.write = function(e, r, n, t, i) {
  e.copy(this.buffer, t, r, r + n), setImmediate(function() {
    i(null, n, e);
  });
};
R.prototype.createReadStream = function(e) {
  e = e || {};
  var r = new Zr(e);
  r.destroyed = !1, r.start = e.start || 0, r.endOffset = e.end, r.pos = r.endOffset || this.buffer.length;
  for (var n = this.buffer.slice(r.start, r.pos), t = 0; ; ) {
    var i = t + this.maxChunkSize;
    if (i >= n.length) {
      t < n.length && r.write(n.slice(t, n.length));
      break;
    }
    r.write(n.slice(t, i)), t = i;
  }
  return r.end(), r.destroy = function() {
    r.destroyed = !0;
  }, r;
};
R.prototype.createWriteStream = function(e) {
  var r = this;
  e = e || {};
  var n = new Ee(e);
  return n.start = e.start || 0, n.endOffset = e.end == null ? this.buffer.length : +e.end, n.bytesWritten = 0, n.pos = n.start, n.destroyed = !1, n._write = function(t, i, o) {
    if (!n.destroyed) {
      var s = n.pos + t.length;
      if (s > n.endOffset) {
        var u = new Error("maximum file length exceeded");
        u.code = "ETOOBIG", n.destroyed = !0, o(u);
        return;
      }
      t.copy(r.buffer, n.pos, 0, t.length), n.bytesWritten += t.length, n.pos = s, n.emit("progress"), o();
    }
  }, n.destroy = function() {
    n.destroyed = !0;
  }, n;
};
R.prototype.ref = function() {
  this.refCount += 1;
};
R.prototype.unref = function() {
  if (this.refCount -= 1, this.refCount < 0)
    throw new Error("invalid unref");
};
function Jr(e, r) {
  return new R(e, r);
}
function Xr(e, r) {
  return new z(e, r);
}
var _ = We.Buffer, ye = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
typeof Int32Array < "u" && (ye = new Int32Array(ye));
function rr(e) {
  if (_.isBuffer(e))
    return e;
  var r = typeof _.alloc == "function" && typeof _.from == "function";
  if (typeof e == "number")
    return r ? _.alloc(e) : new _(e);
  if (typeof e == "string")
    return r ? _.from(e) : new _(e);
  throw new Error("input must be buffer, number, or string, received " + typeof e);
}
function Kr(e) {
  var r = rr(4);
  return r.writeInt32BE(e, 0), r;
}
function Fe(e, r) {
  e = rr(e), _.isBuffer(r) && (r = r.readUInt32BE(0));
  for (var n = ~~r ^ -1, t = 0; t < e.length; t++)
    n = ye[(n ^ e[t]) & 255] ^ n >>> 8;
  return n ^ -1;
}
function Se() {
  return Kr(Fe.apply(null, arguments));
}
Se.signed = function() {
  return Fe.apply(null, arguments);
};
Se.unsigned = function() {
  return Fe.apply(null, arguments) >>> 0;
};
var kr = Se, ge = w, Qr = xr, tr = G, et = kr, ue = V, de = Ve.EventEmitter, nr = U.Transform, Ie = U.PassThrough, rt = U.Writable;
I.open = tt;
I.fromFd = ir;
I.fromBuffer = nt;
I.fromRandomAccessReader = Oe;
I.dosDateTimeToDate = sr;
I.validateFileName = ar;
I.ZipFile = A;
I.Entry = Z;
I.RandomAccessReader = T;
function tt(e, r, n) {
  typeof r == "function" && (n = r, r = null), r == null && (r = {}), r.autoClose == null && (r.autoClose = !0), r.lazyEntries == null && (r.lazyEntries = !1), r.decodeStrings == null && (r.decodeStrings = !0), r.validateEntrySizes == null && (r.validateEntrySizes = !0), r.strictFileNames == null && (r.strictFileNames = !1), n == null && (n = re), ge.open(e, "r", function(t, i) {
    if (t) return n(t);
    ir(i, r, function(o, s) {
      o && ge.close(i, re), n(o, s);
    });
  });
}
function ir(e, r, n) {
  typeof r == "function" && (n = r, r = null), r == null && (r = {}), r.autoClose == null && (r.autoClose = !1), r.lazyEntries == null && (r.lazyEntries = !1), r.decodeStrings == null && (r.decodeStrings = !0), r.validateEntrySizes == null && (r.validateEntrySizes = !0), r.strictFileNames == null && (r.strictFileNames = !1), n == null && (n = re), ge.fstat(e, function(t, i) {
    if (t) return n(t);
    var o = tr.createFromFd(e, { autoClose: !0 });
    Oe(o, i.size, r, n);
  });
}
function nt(e, r, n) {
  typeof r == "function" && (n = r, r = null), r == null && (r = {}), r.autoClose = !1, r.lazyEntries == null && (r.lazyEntries = !1), r.decodeStrings == null && (r.decodeStrings = !0), r.validateEntrySizes == null && (r.validateEntrySizes = !0), r.strictFileNames == null && (r.strictFileNames = !1);
  var t = tr.createFromBuffer(e, { maxChunkSize: 65536 });
  Oe(t, e.length, r, n);
}
function Oe(e, r, n, t) {
  typeof n == "function" && (t = n, n = null), n == null && (n = {}), n.autoClose == null && (n.autoClose = !0), n.lazyEntries == null && (n.lazyEntries = !1), n.decodeStrings == null && (n.decodeStrings = !0);
  var i = !!n.decodeStrings;
  if (n.validateEntrySizes == null && (n.validateEntrySizes = !0), n.strictFileNames == null && (n.strictFileNames = !1), t == null && (t = re), typeof r != "number") throw new Error("expected totalSize parameter to be a number");
  if (r > Number.MAX_SAFE_INTEGER)
    throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
  e.ref();
  var o = 22, s = 65535, u = Math.min(o + s, r), a = S(u), h = r - a.length;
  B(e, a, 0, u, h, function(d) {
    if (d) return t(d);
    for (var c = u - o; c >= 0; c -= 1)
      if (a.readUInt32LE(c) === 101010256) {
        var f = a.slice(c), l = f.readUInt16LE(4);
        if (l !== 0)
          return t(new Error("multi-disk zip files are not supported: found disk number: " + l));
        var m = f.readUInt16LE(10), x = f.readUInt32LE(16), p = f.readUInt16LE(20), v = f.length - o;
        if (p !== v)
          return t(new Error("invalid comment length. expected: " + v + ". found: " + p));
        var y = i ? ee(f, 22, f.length, !1) : f.slice(22);
        if (!(m === 65535 || x === 4294967295))
          return t(null, new A(e, x, r, m, y, n.autoClose, n.lazyEntries, i, n.validateEntrySizes, n.strictFileNames));
        var g = S(20), q = h + c - g.length;
        B(e, g, 0, g.length, q, function(F) {
          if (F) return t(F);
          if (g.readUInt32LE(0) !== 117853008)
            return t(new Error("invalid zip64 end of central directory locator signature"));
          var ze = j(g, 8), O = S(56);
          B(e, O, 0, O.length, ze, function(J) {
            return J ? t(J) : O.readUInt32LE(0) !== 101075792 ? t(new Error("invalid zip64 end of central directory record signature")) : (m = j(O, 32), x = j(O, 48), t(null, new A(e, x, r, m, y, n.autoClose, n.lazyEntries, i, n.validateEntrySizes, n.strictFileNames)));
          });
        });
        return;
      }
    t(new Error("end of central directory record signature not found"));
  });
}
ue.inherits(A, de);
function A(e, r, n, t, i, o, s, u, a, h) {
  var d = this;
  de.call(d), d.reader = e, d.reader.on("error", function(c) {
    or(d, c);
  }), d.reader.once("close", function() {
    d.emit("close");
  }), d.readEntryCursor = r, d.fileSize = n, d.entryCount = t, d.comment = i, d.entriesRead = 0, d.autoClose = !!o, d.lazyEntries = !!s, d.decodeStrings = !!u, d.validateEntrySizes = !!a, d.strictFileNames = !!h, d.isOpen = !0, d.emittedError = !1, d.lazyEntries || d._readEntry();
}
A.prototype.close = function() {
  this.isOpen && (this.isOpen = !1, this.reader.unref());
};
function C(e, r) {
  e.autoClose && e.close(), or(e, r);
}
function or(e, r) {
  e.emittedError || (e.emittedError = !0, e.emit("error", r));
}
A.prototype.readEntry = function() {
  if (!this.lazyEntries) throw new Error("readEntry() called without lazyEntries:true");
  this._readEntry();
};
A.prototype._readEntry = function() {
  var e = this;
  if (e.entryCount === e.entriesRead) {
    setImmediate(function() {
      e.autoClose && e.close(), !e.emittedError && e.emit("end");
    });
    return;
  }
  if (!e.emittedError) {
    var r = S(46);
    B(e.reader, r, 0, r.length, e.readEntryCursor, function(n) {
      if (n) return C(e, n);
      if (!e.emittedError) {
        var t = new Z(), i = r.readUInt32LE(0);
        if (i !== 33639248) return C(e, new Error("invalid central directory file header signature: 0x" + i.toString(16)));
        if (t.versionMadeBy = r.readUInt16LE(4), t.versionNeededToExtract = r.readUInt16LE(6), t.generalPurposeBitFlag = r.readUInt16LE(8), t.compressionMethod = r.readUInt16LE(10), t.lastModFileTime = r.readUInt16LE(12), t.lastModFileDate = r.readUInt16LE(14), t.crc32 = r.readUInt32LE(16), t.compressedSize = r.readUInt32LE(20), t.uncompressedSize = r.readUInt32LE(24), t.fileNameLength = r.readUInt16LE(28), t.extraFieldLength = r.readUInt16LE(30), t.fileCommentLength = r.readUInt16LE(32), t.internalFileAttributes = r.readUInt16LE(36), t.externalFileAttributes = r.readUInt32LE(38), t.relativeOffsetOfLocalHeader = r.readUInt32LE(42), t.generalPurposeBitFlag & 64) return C(e, new Error("strong encryption is not supported"));
        e.readEntryCursor += 46, r = S(t.fileNameLength + t.extraFieldLength + t.fileCommentLength), B(e.reader, r, 0, r.length, e.readEntryCursor, function(o) {
          if (o) return C(e, o);
          if (!e.emittedError) {
            var s = (t.generalPurposeBitFlag & 2048) !== 0;
            t.fileName = e.decodeStrings ? ee(r, 0, t.fileNameLength, s) : r.slice(0, t.fileNameLength);
            var u = t.fileNameLength + t.extraFieldLength, a = r.slice(t.fileNameLength, u);
            t.extraFields = [];
            for (var h = 0; h < a.length - 3; ) {
              var d = a.readUInt16LE(h + 0), c = a.readUInt16LE(h + 2), f = h + 4, l = f + c;
              if (l > a.length) return C(e, new Error("extra field length exceeds extra field buffer size"));
              var m = S(c);
              a.copy(m, 0, f, l), t.extraFields.push({
                id: d,
                data: m
              }), h = l;
            }
            if (t.fileComment = e.decodeStrings ? ee(r, u, u + t.fileCommentLength, s) : r.slice(u, u + t.fileCommentLength), t.comment = t.fileComment, e.readEntryCursor += r.length, e.entriesRead += 1, t.uncompressedSize === 4294967295 || t.compressedSize === 4294967295 || t.relativeOffsetOfLocalHeader === 4294967295) {
              for (var x = null, h = 0; h < t.extraFields.length; h++) {
                var p = t.extraFields[h];
                if (p.id === 1) {
                  x = p.data;
                  break;
                }
              }
              if (x == null)
                return C(e, new Error("expected zip64 extended information extra field"));
              var v = 0;
              if (t.uncompressedSize === 4294967295) {
                if (v + 8 > x.length)
                  return C(e, new Error("zip64 extended information extra field does not include uncompressed size"));
                t.uncompressedSize = j(x, v), v += 8;
              }
              if (t.compressedSize === 4294967295) {
                if (v + 8 > x.length)
                  return C(e, new Error("zip64 extended information extra field does not include compressed size"));
                t.compressedSize = j(x, v), v += 8;
              }
              if (t.relativeOffsetOfLocalHeader === 4294967295) {
                if (v + 8 > x.length)
                  return C(e, new Error("zip64 extended information extra field does not include relative header offset"));
                t.relativeOffsetOfLocalHeader = j(x, v), v += 8;
              }
            }
            if (e.decodeStrings)
              for (var h = 0; h < t.extraFields.length; h++) {
                var p = t.extraFields[h];
                if (p.id === 28789) {
                  if (p.data.length < 6 || p.data.readUInt8(0) !== 1)
                    continue;
                  var y = p.data.readUInt32LE(1);
                  if (et.unsigned(r.slice(0, t.fileNameLength)) !== y)
                    continue;
                  t.fileName = ee(p.data, 5, p.data.length, !0);
                  break;
                }
              }
            if (e.validateEntrySizes && t.compressionMethod === 0) {
              var g = t.uncompressedSize;
              if (t.isEncrypted() && (g += 12), t.compressedSize !== g) {
                var q = "compressed/uncompressed size mismatch for stored file: " + t.compressedSize + " != " + t.uncompressedSize;
                return C(e, new Error(q));
              }
            }
            if (e.decodeStrings) {
              e.strictFileNames || (t.fileName = t.fileName.replace(/\\/g, "/"));
              var F = ar(t.fileName, e.validateFileNameOptions);
              if (F != null) return C(e, new Error(F));
            }
            e.emit("entry", t), e.lazyEntries || e._readEntry();
          }
        });
      }
    });
  }
};
A.prototype.openReadStream = function(e, r, n) {
  var t = this, i = 0, o = e.compressedSize;
  if (n == null)
    n = r, r = {};
  else {
    if (r.decrypt != null) {
      if (!e.isEncrypted())
        throw new Error("options.decrypt can only be specified for encrypted entries");
      if (r.decrypt !== !1) throw new Error("invalid options.decrypt value: " + r.decrypt);
      if (e.isCompressed() && r.decompress !== !1)
        throw new Error("entry is encrypted and compressed, and options.decompress !== false");
    }
    if (r.decompress != null) {
      if (!e.isCompressed())
        throw new Error("options.decompress can only be specified for compressed entries");
      if (!(r.decompress === !1 || r.decompress === !0))
        throw new Error("invalid options.decompress value: " + r.decompress);
    }
    if (r.start != null || r.end != null) {
      if (e.isCompressed() && r.decompress !== !1)
        throw new Error("start/end range not allowed for compressed entry without options.decompress === false");
      if (e.isEncrypted() && r.decrypt !== !1)
        throw new Error("start/end range not allowed for encrypted entry without options.decrypt === false");
    }
    if (r.start != null) {
      if (i = r.start, i < 0) throw new Error("options.start < 0");
      if (i > e.compressedSize) throw new Error("options.start > entry.compressedSize");
    }
    if (r.end != null) {
      if (o = r.end, o < 0) throw new Error("options.end < 0");
      if (o > e.compressedSize) throw new Error("options.end > entry.compressedSize");
      if (o < i) throw new Error("options.end < options.start");
    }
  }
  if (!t.isOpen) return n(new Error("closed"));
  if (e.isEncrypted() && r.decrypt !== !1)
    return n(new Error("entry is encrypted, and options.decrypt !== false"));
  t.reader.ref();
  var s = S(30);
  B(t.reader, s, 0, s.length, e.relativeOffsetOfLocalHeader, function(u) {
    try {
      if (u) return n(u);
      var a = s.readUInt32LE(0);
      if (a !== 67324752)
        return n(new Error("invalid local file header signature: 0x" + a.toString(16)));
      var h = s.readUInt16LE(26), d = s.readUInt16LE(28), c = e.relativeOffsetOfLocalHeader + s.length + h + d, f;
      if (e.compressionMethod === 0)
        f = !1;
      else if (e.compressionMethod === 8)
        f = r.decompress != null ? r.decompress : !0;
      else
        return n(new Error("unsupported compression method: " + e.compressionMethod));
      var l = c, m = l + e.compressedSize;
      if (e.compressedSize !== 0 && m > t.fileSize)
        return n(new Error("file data overflows file bounds: " + l + " + " + e.compressedSize + " > " + t.fileSize));
      var x = t.reader.createReadStream({
        start: l + i,
        end: l + o
      }), p = x;
      if (f) {
        var v = !1, y = Qr.createInflateRaw();
        x.on("error", function(g) {
          setImmediate(function() {
            v || y.emit("error", g);
          });
        }), x.pipe(y), t.validateEntrySizes ? (p = new Y(e.uncompressedSize), y.on("error", function(g) {
          setImmediate(function() {
            v || p.emit("error", g);
          });
        }), y.pipe(p)) : p = y, p.destroy = function() {
          v = !0, y !== p && y.unpipe(p), x.unpipe(y), x.destroy();
        };
      }
      n(null, p);
    } finally {
      t.reader.unref();
    }
  });
};
function Z() {
}
Z.prototype.getLastModDate = function() {
  return sr(this.lastModFileDate, this.lastModFileTime);
};
Z.prototype.isEncrypted = function() {
  return (this.generalPurposeBitFlag & 1) !== 0;
};
Z.prototype.isCompressed = function() {
  return this.compressionMethod === 8;
};
function sr(e, r) {
  var n = e & 31, t = (e >> 5 & 15) - 1, i = (e >> 9 & 127) + 1980, o = 0, s = (r & 31) * 2, u = r >> 5 & 63, a = r >> 11 & 31;
  return new Date(i, t, n, a, u, s, o);
}
function ar(e) {
  return e.indexOf("\\") !== -1 ? "invalid characters in fileName: " + e : /^[a-zA-Z]:/.test(e) || /^\//.test(e) ? "absolute path: " + e : e.split("/").indexOf("..") !== -1 ? "invalid relative path: " + e : null;
}
function B(e, r, n, t, i, o) {
  if (t === 0)
    return setImmediate(function() {
      o(null, S(0));
    });
  e.read(r, n, t, i, function(s, u) {
    if (s) return o(s);
    if (u < t)
      return o(new Error("unexpected EOF"));
    o();
  });
}
ue.inherits(Y, nr);
function Y(e) {
  nr.call(this), this.actualByteCount = 0, this.expectedByteCount = e;
}
Y.prototype._transform = function(e, r, n) {
  if (this.actualByteCount += e.length, this.actualByteCount > this.expectedByteCount) {
    var t = "too many bytes in the stream. expected " + this.expectedByteCount + ". got at least " + this.actualByteCount;
    return n(new Error(t));
  }
  n(null, e);
};
Y.prototype._flush = function(e) {
  if (this.actualByteCount < this.expectedByteCount) {
    var r = "not enough bytes in the stream. expected " + this.expectedByteCount + ". got only " + this.actualByteCount;
    return e(new Error(r));
  }
  e();
};
ue.inherits(T, de);
function T() {
  de.call(this), this.refCount = 0;
}
T.prototype.ref = function() {
  this.refCount += 1;
};
T.prototype.unref = function() {
  var e = this;
  if (e.refCount -= 1, e.refCount > 0) return;
  if (e.refCount < 0) throw new Error("invalid unref");
  e.close(r);
  function r(n) {
    if (n) return e.emit("error", n);
    e.emit("close");
  }
};
T.prototype.createReadStream = function(e) {
  var r = e.start, n = e.end;
  if (r === n) {
    var t = new Ie();
    return setImmediate(function() {
      t.end();
    }), t;
  }
  var i = this._readStreamForRange(r, n), o = !1, s = new le(this);
  i.on("error", function(a) {
    setImmediate(function() {
      o || s.emit("error", a);
    });
  }), s.destroy = function() {
    i.unpipe(s), s.unref(), i.destroy();
  };
  var u = new Y(n - r);
  return s.on("error", function(a) {
    setImmediate(function() {
      o || u.emit("error", a);
    });
  }), u.destroy = function() {
    o = !0, s.unpipe(u), s.destroy();
  }, i.pipe(s).pipe(u);
};
T.prototype._readStreamForRange = function(e, r) {
  throw new Error("not implemented");
};
T.prototype.read = function(e, r, n, t, i) {
  var o = this.createReadStream({ start: t, end: t + n }), s = new rt(), u = 0;
  s._write = function(a, h, d) {
    a.copy(e, r + u, 0, a.length), u += a.length, d();
  }, s.on("finish", i), o.on("error", function(a) {
    i(a);
  }), o.pipe(s);
};
T.prototype.close = function(e) {
  setImmediate(e);
};
ue.inherits(le, Ie);
function le(e) {
  Ie.call(this), this.context = e, this.context.ref(), this.unreffedYet = !1;
}
le.prototype._flush = function(e) {
  this.unref(), e();
};
le.prototype.unref = function(e) {
  this.unreffedYet || (this.unreffedYet = !0, this.context.unref());
};
var it = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ";
function ee(e, r, n, t) {
  if (t)
    return e.toString("utf8", r, n);
  for (var i = "", o = r; o < n; o++)
    i += it[e[o]];
  return i;
}
function j(e, r) {
  var n = e.readUInt32LE(r), t = e.readUInt32LE(r + 4);
  return t * 4294967296 + n;
}
var S;
typeof Buffer.allocUnsafe == "function" ? S = function(e) {
  return Buffer.allocUnsafe(e);
} : S = function(e) {
  return new Buffer(e);
};
function re(e) {
  if (e) throw e;
}
const E = Fr("extract-zip"), { createWriteStream: ot, promises: N } = w, st = Gr, M = mr, { promisify: Le } = V, at = U, ft = I, ct = Le(ft.open), ut = Le(at.pipeline);
class dt {
  constructor(r, n) {
    this.zipPath = r, this.opts = n;
  }
  async extract() {
    return E("opening", this.zipPath, "with opts", this.opts), this.zipfile = await ct(this.zipPath, { lazyEntries: !0 }), this.canceled = !1, new Promise((r, n) => {
      this.zipfile.on("error", (t) => {
        this.canceled = !0, n(t);
      }), this.zipfile.readEntry(), this.zipfile.on("close", () => {
        this.canceled || (E("zip extraction complete"), r());
      }), this.zipfile.on("entry", async (t) => {
        if (this.canceled) {
          E("skipping entry", t.fileName, { cancelled: this.canceled });
          return;
        }
        if (E("zipfile entry", t.fileName), t.fileName.startsWith("__MACOSX/")) {
          this.zipfile.readEntry();
          return;
        }
        const i = M.dirname(M.join(this.opts.dir, t.fileName));
        try {
          await N.mkdir(i, { recursive: !0 });
          const o = await N.realpath(i);
          if (M.relative(this.opts.dir, o).split(M.sep).includes(".."))
            throw new Error(`Out of bound path "${o}" found while processing file ${t.fileName}`);
          await this.extractEntry(t), E("finished processing", t.fileName), this.zipfile.readEntry();
        } catch (o) {
          this.canceled = !0, this.zipfile.close(), n(o);
        }
      });
    });
  }
  async extractEntry(r) {
    if (this.canceled) {
      E("skipping entry extraction", r.fileName, { cancelled: this.canceled });
      return;
    }
    this.opts.onEntry && this.opts.onEntry(r, this.zipfile);
    const n = M.join(this.opts.dir, r.fileName), t = r.externalFileAttributes >> 16 & 65535, i = 61440, o = 16384, u = (t & i) === 40960;
    let a = (t & i) === o;
    !a && r.fileName.endsWith("/") && (a = !0);
    const h = r.versionMadeBy >> 8;
    a || (a = h === 0 && r.externalFileAttributes === 16), E("extracting entry", { filename: r.fileName, isDir: a, isSymlink: u });
    const d = this.getExtractedMode(t, a) & 511, c = a ? n : M.dirname(n), f = { recursive: !0 };
    if (a && (f.mode = d), E("mkdir", { dir: c, ...f }), await N.mkdir(c, f), a) return;
    E("opening read stream", n);
    const l = await Le(this.zipfile.openReadStream.bind(this.zipfile))(r);
    if (u) {
      const m = await st(l);
      E("creating symlink", m, n), await N.symlink(m, n);
    } else
      await ut(l, ot(n, { mode: d }));
  }
  getExtractedMode(r, n) {
    let t = r;
    return t === 0 && (n ? (this.opts.defaultDirMode && (t = parseInt(this.opts.defaultDirMode, 10)), t || (t = 493)) : (this.opts.defaultFileMode && (t = parseInt(this.opts.defaultFileMode, 10)), t || (t = 420))), t;
  }
}
var lt = async function(e, r) {
  if (E("creating target directory", r.dir), !M.isAbsolute(r.dir))
    throw new Error("Target directory is expected to be absolute");
  return await N.mkdir(r.dir, { recursive: !0 }), r.dir = await N.realpath(r.dir), new dt(e, r).extract();
};
const ht = /* @__PURE__ */ yr(lt), je = V.promisify(vr), fr = b.dirname(hr(import.meta.url));
process.env.APP_ROOT = b.join(fr, "..");
const be = process.env.VITE_DEV_SERVER_URL, Lt = b.join(process.env.APP_ROOT, "dist-electron"), cr = b.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = be ? b.join(process.env.APP_ROOT, "public") : cr;
let L;
const $e = b.join(process.env.APP_ROOT, "projects"), Ue = b.join($.getPath("userData"), "projects");
if (w.existsSync($e) && !w.existsSync(Ue)) {
  console.log("🔁 Eski projects klasörü bulundu. Yeni konuma taşınıyor...");
  try {
    w.renameSync($e, Ue), console.log("✅ Taşıma tamamlandı.");
  } catch (e) {
    console.error("🚨 Taşıma hatası:", e);
  }
}
function ur() {
  L = new De({
    icon: b.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: b.join(fr, "preload.mjs")
    }
  }), L.webContents.openDevTools(), L.webContents.on("did-finish-load", () => {
    L == null || L.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), be ? L.loadURL(be) : L.loadFile(b.join(cr, "index.html"));
}
const pt = $.getPath("userData"), te = b.join(pt, "projects");
w.existsSync(te) || w.mkdirSync(te, { recursive: !0 });
P.handle("create-project", async (e, r) => {
  try {
    const n = b.join(te, r);
    return w.existsSync(n) || w.mkdirSync(n, { recursive: !0 }), { success: !0, path: n };
  } catch (n) {
    return console.error("Error creating project folder:", n), { success: !1, error: n.message };
  }
});
P.handle("select-zip-folder", async () => {
  try {
    const e = await lr.showOpenDialog({
      title: "Select Folder Containing ZIPs",
      properties: ["openDirectory"]
    });
    return e.canceled || e.filePaths.length === 0 ? { success: !1 } : { success: !0, folderPath: e.filePaths[0] };
  } catch (e) {
    return console.error("Error selecting ZIP folder:", e), { success: !1, error: e.message };
  }
});
P.handle("process-zip-folder", async (e, r, n) => {
  try {
    const t = b.join(te, n);
    w.existsSync(t) || w.mkdirSync(t, { recursive: !0 });
    const i = w.readdirSync(r).filter((s) => s.endsWith(".zip")), o = [];
    for (const s of i) {
      const u = b.join(r, s), a = b.basename(s, ".zip"), h = b.join(t, a);
      w.existsSync(h) || w.mkdirSync(h, { recursive: !0 }), await ht(u, { dir: h }), o.push({
        studentId: a,
        path: h
      });
    }
    return { success: !0, students: o };
  } catch (t) {
    return console.error("ZIP processing failed:", t), { success: !1, error: t.message };
  }
});
P.handle("evaluate-project", async (e, r) => {
  var n, t, i, o;
  try {
    const s = [], u = (((n = r.config) == null ? void 0 : n.language) || "").toLowerCase(), a = ((i = (t = r.config) == null ? void 0 : t.inputFormat) == null ? void 0 : i.split(" ")) || [], h = (((o = r.config) == null ? void 0 : o.outputFormat) || "").trim(), d = process.platform === "win32";
    for (const [c, f] of Object.entries(r.students || {}))
      try {
        let l = "", m = "";
        if (u === "c")
          l = d ? "gcc main.c -o main.exe" : "gcc main.c -o main", m = d ? `main.exe ${a.join(" ")}` : `./main ${a.join(" ")}`;
        else if (u === "java")
          l = "javac Main.java", m = `java Main ${a.join(" ")}`;
        else if (u === "python")
          m = `python3 main.py ${a.join(" ")}`;
        else
          throw new Error(`Unsupported language: ${u}`);
        l && await je(l, { cwd: f });
        const { stdout: x } = await je(m, {
          cwd: f,
          timeout: 5e3
        }), p = x.trim(), v = p === h;
        s.push({
          studentId: c,
          status: v ? "Success" : "Failure",
          ...v ? {} : { actualOutput: p }
        });
      } catch (l) {
        s.push({
          studentId: c,
          status: "Failure",
          error: l.message || "Unknown error"
        });
      }
    return { success: !0, results: s };
  } catch (s) {
    return console.error("Evaluation failed:", s), { success: !1, error: s.message };
  }
});
P.handle("open-project", async () => {
  console.log("Open Project clicked");
});
P.handle("manage-configurations", async () => {
  console.log("Manage Configurations clicked");
});
P.handle("open-help", async () => {
  console.log("Help clicked");
});
$.on("window-all-closed", () => {
  process.platform !== "darwin" && ($.quit(), L = null);
});
$.on("activate", () => {
  De.getAllWindows().length === 0 && ur();
});
$.whenReady().then(ur);
export {
  Lt as MAIN_DIST,
  cr as RENDERER_DIST,
  be as VITE_DEV_SERVER_URL
};
