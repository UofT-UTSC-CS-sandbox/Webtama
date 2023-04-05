"use strict";
(self.webpackChunknanoblog = self.webpackChunknanoblog || []).push([
  [179],
  {
    362: () => {
      function ne(e) {
        return "function" == typeof e;
      }
      function uo(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const Ni = uo(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function lo(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class yt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (ne(r))
              try {
                r();
              } catch (i) {
                t = i instanceof Ni ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  Tf(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof Ni ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Ni(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Tf(t);
            else {
              if (t instanceof yt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && lo(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && lo(n, t), t instanceof yt && t._removeParent(this);
        }
      }
      yt.EMPTY = (() => {
        const e = new yt();
        return (e.closed = !0), e;
      })();
      const If = yt.EMPTY;
      function Af(e) {
        return (
          e instanceof yt ||
          (e && "closed" in e && ne(e.remove) && ne(e.add) && ne(e.unsubscribe))
        );
      }
      function Tf(e) {
        ne(e) ? e() : e.unsubscribe();
      }
      const $n = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Ri = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = Ri;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = Ri;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function xf(e) {
        Ri.setTimeout(() => {
          const { onUnhandledError: t } = $n;
          if (!t) throw e;
          t(e);
        });
      }
      function Nf() {}
      const pw = qa("C", void 0, void 0);
      function qa(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let Un = null;
      function Fi(e) {
        if ($n.useDeprecatedSynchronousErrorHandling) {
          const t = !Un;
          if ((t && (Un = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = Un;
            if (((Un = null), n)) throw r;
          }
        } else e();
      }
      class Za extends yt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Af(t) && t.add(this))
              : (this.destination = Cw);
        }
        static create(t, n, r) {
          return new co(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Qa(
                (function mw(e) {
                  return qa("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Qa(
                (function gw(e) {
                  return qa("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? Qa(pw, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const vw = Function.prototype.bind;
      function Ka(e, t) {
        return vw.call(e, t);
      }
      class _w {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Pi(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Pi(r);
            }
          else Pi(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Pi(n);
            }
        }
      }
      class co extends Za {
        constructor(t, n, r) {
          let o;
          if ((super(), ne(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && $n.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && Ka(t.next, i),
                  error: t.error && Ka(t.error, i),
                  complete: t.complete && Ka(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new _w(o);
        }
      }
      function Pi(e) {
        $n.useDeprecatedSynchronousErrorHandling
          ? (function yw(e) {
              $n.useDeprecatedSynchronousErrorHandling &&
                Un &&
                ((Un.errorThrown = !0), (Un.error = e));
            })(e)
          : xf(e);
      }
      function Qa(e, t) {
        const { onStoppedNotification: n } = $n;
        n && Ri.setTimeout(() => n(e, t));
      }
      const Cw = {
          closed: !0,
          next: Nf,
          error: function Dw(e) {
            throw e;
          },
          complete: Nf,
        },
        Ya =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Gn(e) {
        return e;
      }
      function Rf(e) {
        return 0 === e.length
          ? Gn
          : 1 === e.length
          ? e[0]
          : function (n) {
              return e.reduce((r, o) => o(r), n);
            };
      }
      let ge = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function bw(e) {
              return (
                (e && e instanceof Za) ||
                ((function Ew(e) {
                  return e && ne(e.next) && ne(e.error) && ne(e.complete);
                })(e) &&
                  Af(e))
              );
            })(n)
              ? n
              : new co(n, r, o);
            return (
              Fi(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Ff(r))((o, i) => {
              const s = new co({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [Ya]() {
            return this;
          }
          pipe(...n) {
            return Rf(n)(this);
          }
          toPromise(n) {
            return new (n = Ff(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function Ff(e) {
        var t;
        return null !== (t = e ?? $n.Promise) && void 0 !== t ? t : Promise;
      }
      const Mw = uo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Ht = (() => {
        class e extends ge {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Pf(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new Mw();
          }
          next(n) {
            Fi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            Fi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            Fi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? If
              : ((this.currentObservers = null),
                i.push(n),
                new yt(() => {
                  (this.currentObservers = null), lo(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new ge();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Pf(t, n)), e;
      })();
      class Pf extends Ht {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : If;
        }
      }
      function Of(e) {
        return ne(e?.lift);
      }
      function Re(e) {
        return (t) => {
          if (Of(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Se(e, t, n, r, o) {
        return new Sw(e, t, n, r, o);
      }
      class Sw extends Za {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function $(e, t) {
        return Re((n, r) => {
          let o = 0;
          n.subscribe(
            Se(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function zn(e) {
        return this instanceof zn ? ((this.v = e), this) : new zn(e);
      }
      function Tw(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          r = n.apply(e, t || []),
          i = [];
        return (
          (o = {}),
          s("next"),
          s("throw"),
          s("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function s(f) {
          r[f] &&
            (o[f] = function (h) {
              return new Promise(function (p, g) {
                i.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function u(f) {
              f.value instanceof zn
                ? Promise.resolve(f.value.v).then(l, c)
                : d(i[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(i[0][3], p);
          }
        }
        function l(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
        }
      }
      function xw(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function Vf(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (l) {
                    i({ value: l, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      const jf = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Bf(e) {
        return ne(e?.then);
      }
      function Hf(e) {
        return ne(e[Ya]);
      }
      function $f(e) {
        return Symbol.asyncIterator && ne(e?.[Symbol.asyncIterator]);
      }
      function Uf(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Gf = (function Rw() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function zf(e) {
        return ne(e?.[Gf]);
      }
      function Wf(e) {
        return Tw(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield zn(n.read());
              if (o) return yield zn(void 0);
              yield yield zn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function qf(e) {
        return ne(e?.getReader);
      }
      function It(e) {
        if (e instanceof ge) return e;
        if (null != e) {
          if (Hf(e))
            return (function Fw(e) {
              return new ge((t) => {
                const n = e[Ya]();
                if (ne(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (jf(e))
            return (function Pw(e) {
              return new ge((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Bf(e))
            return (function Ow(e) {
              return new ge((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, xf);
              });
            })(e);
          if ($f(e)) return Zf(e);
          if (zf(e))
            return (function kw(e) {
              return new ge((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (qf(e))
            return (function Lw(e) {
              return Zf(Wf(e));
            })(e);
        }
        throw Uf(e);
      }
      function Zf(e) {
        return new ge((t) => {
          (function Vw(e, t) {
            var n, r, o, i;
            return (function Iw(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    l(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  try {
                    l(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, u);
                }
                l((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = xw(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function en(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Pe(e, t, n = 1 / 0) {
        return ne(t)
          ? Pe((r, o) => $((i, s) => t(r, i, o, s))(It(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            Re((r, o) =>
              (function jw(e, t, n, r, o, i, s, a) {
                const u = [];
                let l = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete();
                  },
                  h = (g) => (l < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && t.next(g), l++;
                    let y = !1;
                    It(n(g, c++)).subscribe(
                      Se(
                        t,
                        (D) => {
                          o?.(D), i ? h(D) : t.next(D);
                        },
                        () => {
                          y = !0;
                        },
                        void 0,
                        () => {
                          if (y)
                            try {
                              for (l--; u.length && l < r; ) {
                                const D = u.shift();
                                s ? en(t, s, () => p(D)) : p(D);
                              }
                              f();
                            } catch (D) {
                              t.error(D);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Se(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      function hr(e = 1 / 0) {
        return Pe(Gn, e);
      }
      const tn = new ge((e) => e.complete());
      function Xa(e) {
        return e[e.length - 1];
      }
      function Kf(e) {
        return ne(Xa(e)) ? e.pop() : void 0;
      }
      function fo(e) {
        return (function Hw(e) {
          return e && ne(e.schedule);
        })(Xa(e))
          ? e.pop()
          : void 0;
      }
      function Qf(e, t = 0) {
        return Re((n, r) => {
          n.subscribe(
            Se(
              r,
              (o) => en(r, e, () => r.next(o), t),
              () => en(r, e, () => r.complete(), t),
              (o) => en(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function Yf(e, t = 0) {
        return Re((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Jf(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ge((n) => {
          en(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            en(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function _e(e, t) {
        return t
          ? (function Zw(e, t) {
              if (null != e) {
                if (Hf(e))
                  return (function Uw(e, t) {
                    return It(e).pipe(Yf(t), Qf(t));
                  })(e, t);
                if (jf(e))
                  return (function zw(e, t) {
                    return new ge((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Bf(e))
                  return (function Gw(e, t) {
                    return It(e).pipe(Yf(t), Qf(t));
                  })(e, t);
                if ($f(e)) return Jf(e, t);
                if (zf(e))
                  return (function Ww(e, t) {
                    return new ge((n) => {
                      let r;
                      return (
                        en(n, t, () => {
                          (r = e[Gf]()),
                            en(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ne(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (qf(e))
                  return (function qw(e, t) {
                    return Jf(Wf(e), t);
                  })(e, t);
              }
              throw Uf(e);
            })(e, t)
          : It(e);
      }
      function eu(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new co({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return t(...n).subscribe(r);
      }
      function ee(e) {
        for (let t in e) if (e[t] === ee) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function tu(e, t) {
        for (const n in t)
          t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
      }
      function te(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(te).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function nu(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const Yw = ee({ __forward_ref__: ee });
      function re(e) {
        return (
          (e.__forward_ref__ = re),
          (e.toString = function () {
            return te(this());
          }),
          e
        );
      }
      function F(e) {
        return ru(e) ? e() : e;
      }
      function ru(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(Yw) &&
          e.__forward_ref__ === re
        );
      }
      class C extends Error {
        constructor(t, n) {
          super(
            (function Oi(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t.trim() : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function k(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function ki(e, t) {
        throw new C(-201, !1);
      }
      function st(e, t) {
        null == e &&
          (function Q(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function x(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function et(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Li(e) {
        return Xf(e, Vi) || Xf(e, th);
      }
      function Xf(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function eh(e) {
        return e && (e.hasOwnProperty(ou) || e.hasOwnProperty(sE))
          ? e[ou]
          : null;
      }
      const Vi = ee({ ɵprov: ee }),
        ou = ee({ ɵinj: ee }),
        th = ee({ ngInjectableDef: ee }),
        sE = ee({ ngInjectorDef: ee });
      var N = (() => (
        ((N = N || {})[(N.Default = 0)] = "Default"),
        (N[(N.Host = 1)] = "Host"),
        (N[(N.Self = 2)] = "Self"),
        (N[(N.SkipSelf = 4)] = "SkipSelf"),
        (N[(N.Optional = 8)] = "Optional"),
        N
      ))();
      let iu;
      function vt(e) {
        const t = iu;
        return (iu = e), t;
      }
      function nh(e, t, n) {
        const r = Li(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & N.Optional
          ? null
          : void 0 !== t
          ? t
          : void ki(te(e));
      }
      function En(e) {
        return { toString: e }.toString();
      }
      var At = (() => (
          ((At = At || {})[(At.OnPush = 0)] = "OnPush"),
          (At[(At.Default = 1)] = "Default"),
          At
        ))(),
        $t = (() => {
          return (
            ((e = $t || ($t = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            $t
          );
          var e;
        })();
      const oe = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        pr = {},
        Z = [],
        ji = ee({ ɵcmp: ee }),
        su = ee({ ɵdir: ee }),
        au = ee({ ɵpipe: ee }),
        rh = ee({ ɵmod: ee }),
        rn = ee({ ɵfac: ee }),
        ho = ee({ __NG_ELEMENT_ID__: ee });
      let uE = 0;
      function bn(e) {
        return En(() => {
          const n = !0 === e.standalone,
            r = {},
            o = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === At.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: n,
              dependencies: (n && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || Z,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || $t.Emulated,
              id: "c" + uE++,
              styles: e.styles || Z,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            i = e.dependencies,
            s = e.features;
          return (
            (o.inputs = sh(e.inputs, r)),
            (o.outputs = sh(e.outputs)),
            s && s.forEach((a) => a(o)),
            (o.directiveDefs = i
              ? () => ("function" == typeof i ? i() : i).map(oh).filter(ih)
              : null),
            (o.pipeDefs = i
              ? () => ("function" == typeof i ? i() : i).map(We).filter(ih)
              : null),
            o
          );
        });
      }
      function oh(e) {
        return Y(e) || ze(e);
      }
      function ih(e) {
        return null !== e;
      }
      function at(e) {
        return En(() => ({
          type: e.type,
          bootstrap: e.bootstrap || Z,
          declarations: e.declarations || Z,
          imports: e.imports || Z,
          exports: e.exports || Z,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function sh(e, t) {
        if (null == e) return pr;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      const P = bn;
      function Y(e) {
        return e[ji] || null;
      }
      function ze(e) {
        return e[su] || null;
      }
      function We(e) {
        return e[au] || null;
      }
      function ut(e, t) {
        const n = e[rh] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${te(e)} does not have '\u0275mod' property.`);
        return n;
      }
      const B = 11;
      function nt(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function xt(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function cu(e) {
        return 0 != (8 & e.flags);
      }
      function Ui(e) {
        return 2 == (2 & e.flags);
      }
      function Gi(e) {
        return 1 == (1 & e.flags);
      }
      function Nt(e) {
        return null !== e.template;
      }
      function pE(e) {
        return 0 != (256 & e[2]);
      }
      function Qn(e, t) {
        return e.hasOwnProperty(rn) ? e[rn] : null;
      }
      class yE {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Dt() {
        return lh;
      }
      function lh(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = _E), vE;
      }
      function vE() {
        const e = dh(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === pr) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function _E(e, t, n, r) {
        const o =
            dh(e) ||
            (function DE(e, t) {
              return (e[ch] = t);
            })(e, { previous: pr, current: null }),
          i = o.current || (o.current = {}),
          s = o.previous,
          a = this.declaredInputs[n],
          u = s[a];
        (i[a] = new yE(u && u.currentValue, t, s === pr)), (e[r] = t);
      }
      Dt.ngInherit = !0;
      const ch = "__ngSimpleChanges__";
      function dh(e) {
        return e[ch] || null;
      }
      function De(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function zi(e, t) {
        return De(t[e]);
      }
      function wt(e, t) {
        return De(t[e.index]);
      }
      function gu(e, t) {
        return e.data[t];
      }
      function ct(e, t) {
        const n = t[e];
        return nt(n) ? n : n[0];
      }
      function Wi(e) {
        return 64 == (64 & e[2]);
      }
      function Mn(e, t) {
        return null == t ? null : e[t];
      }
      function fh(e) {
        e[18] = 0;
      }
      function mu(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (
          ;
          null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5]));

        )
          (r[5] += t), (n = r), (r = r[3]);
      }
      const O = { lFrame: wh(null), bindingsEnabled: !0 };
      function ph() {
        return O.bindingsEnabled;
      }
      function v() {
        return O.lFrame.lView;
      }
      function z() {
        return O.lFrame.tView;
      }
      function Ie() {
        let e = gh();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function gh() {
        return O.lFrame.currentTNode;
      }
      function Ut(e, t) {
        const n = O.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function yu() {
        return O.lFrame.isParent;
      }
      function Dr() {
        return O.lFrame.bindingIndex++;
      }
      function LE(e, t) {
        const n = O.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), _u(t);
      }
      function _u(e) {
        O.lFrame.currentDirectiveIndex = e;
      }
      function Cu(e) {
        O.lFrame.currentQueryIndex = e;
      }
      function jE(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function Dh(e, t, n) {
        if (n & N.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & N.Host ||
              ((o = jE(i)), null === o || ((i = i[15]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (O.lFrame = Ch());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function wu(e) {
        const t = Ch(),
          n = e[1];
        (O.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function Ch() {
        const e = O.lFrame,
          t = null === e ? null : e.child;
        return null === t ? wh(e) : t;
      }
      function wh(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function Eh() {
        const e = O.lFrame;
        return (
          (O.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const bh = Eh;
      function Eu() {
        const e = Eh();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Ze() {
        return O.lFrame.selectedIndex;
      }
      function Sn(e) {
        O.lFrame.selectedIndex = e;
      }
      function fe() {
        const e = O.lFrame;
        return gu(e.tView, e.selectedIndex);
      }
      function qi(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: l,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            u && (e.viewHooks || (e.viewHooks = [])).push(-n, u),
            l &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, l),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, l)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function Zi(e, t, n) {
        Mh(e, t, 3, n);
      }
      function Ki(e, t, n, r) {
        (3 & e[2]) === n && Mh(e, t, n, r);
      }
      function bu(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function Mh(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[18] += 65536),
              (a < i || -1 == i) &&
                (ZE(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)),
              u++;
      }
      function ZE(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              i.call(a);
            } finally {
            }
          }
        } else
          try {
            i.call(a);
          } finally {
          }
      }
      class _o {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Qi(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            Ih(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function Sh(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Ih(e) {
        return 64 === e.charCodeAt(0);
      }
      function Yi(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  Ah(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function Ah(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      function Th(e) {
        return -1 !== e;
      }
      function Cr(e) {
        return 32767 & e;
      }
      function wr(e, t) {
        let n = (function XE(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let Su = !0;
      function Ji(e) {
        const t = Su;
        return (Su = e), t;
      }
      let eb = 0;
      const Gt = {};
      function Co(e, t) {
        const n = Au(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          Iu(r.data, e),
          Iu(t, null),
          Iu(r.blueprint, null));
        const o = Xi(e, t),
          i = e.injectorIndex;
        if (Th(o)) {
          const s = Cr(o),
            a = wr(o, t),
            u = a[1].data;
          for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
        }
        return (t[i + 8] = o), i;
      }
      function Iu(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Au(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Xi(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = Vh(o)), null === r)) return -1;
          if ((n++, (o = o[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function es(e, t, n) {
        !(function tb(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(ho) && (r = n[ho]),
            null == r && (r = n[ho] = eb++);
          const o = 255 & r;
          t.data[e + (o >> 5)] |= 1 << o;
        })(e, t, n);
      }
      function Rh(e, t, n) {
        if (n & N.Optional || void 0 !== e) return e;
        ki();
      }
      function Fh(e, t, n, r) {
        if (
          (n & N.Optional && void 0 === r && (r = null),
          0 == (n & (N.Self | N.Host)))
        ) {
          const o = e[9],
            i = vt(void 0);
          try {
            return o ? o.get(t, r, n & N.Optional) : nh(t, r, n & N.Optional);
          } finally {
            vt(i);
          }
        }
        return Rh(r, 0, n);
      }
      function Ph(e, t, n, r = N.Default, o) {
        if (null !== e) {
          if (1024 & t[2]) {
            const s = (function sb(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 1024 & s[2] && !(256 & s[2]);

              ) {
                const a = Oh(i, s, n, r | N.Self, Gt);
                if (a !== Gt) return a;
                let u = i.parent;
                if (!u) {
                  const l = s[21];
                  if (l) {
                    const c = l.get(n, Gt, r);
                    if (c !== Gt) return c;
                  }
                  (u = Vh(s)), (s = s[15]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, Gt);
            if (s !== Gt) return s;
          }
          const i = Oh(e, t, n, r, Gt);
          if (i !== Gt) return i;
        }
        return Fh(t, n, r, o);
      }
      function Oh(e, t, n, r, o) {
        const i = (function ob(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(ho) ? e[ho] : void 0;
          return "number" == typeof t ? (t >= 0 ? 255 & t : ib) : t;
        })(n);
        if ("function" == typeof i) {
          if (!Dh(t, e, r)) return r & N.Host ? Rh(o, 0, r) : Fh(t, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & N.Optional) return s;
            ki();
          } finally {
            bh();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = Au(e, t),
            u = -1,
            l = r & N.Host ? t[16][6] : null;
          for (
            (-1 === a || r & N.SkipSelf) &&
            ((u = -1 === a ? Xi(e, t) : t[a + 8]),
            -1 !== u && Lh(r, !1)
              ? ((s = t[1]), (a = Cr(u)), (t = wr(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[1];
            if (kh(i, a, c.data)) {
              const d = rb(a, t, n, s, r, l);
              if (d !== Gt) return d;
            }
            (u = t[a + 8]),
              -1 !== u && Lh(r, t[1].data[a + 8] === l) && kh(i, a, t)
                ? ((s = c), (a = Cr(u)), (t = wr(u, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function rb(e, t, n, r, o, i) {
        const s = t[1],
          a = s.data[e + 8],
          c = (function ts(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              u = e.directiveStart,
              c = i >> 20,
              f = o ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (o) {
              const h = s[u];
              if (h && Nt(h) && h.type === n) return u;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? Ui(a) && Su : r != s && 0 != (3 & a.type),
            o & N.Host && i === a
          );
        return null !== c ? wo(t, s, c, a) : Gt;
      }
      function wo(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function KE(e) {
            return e instanceof _o;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function Jw(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function q(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : k(e);
              })(i[n])
            );
          const a = Ji(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? vt(s.injectImpl) : null;
          Dh(e, r, N.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function qE(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = lh(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  o &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== u && vt(u), Ji(a), (s.resolving = !1), bh();
          }
        }
        return o;
      }
      function kh(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function Lh(e, t) {
        return !(e & N.Self || (e & N.Host && t));
      }
      class Er {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return Ph(this._tNode, this._lView, t, r, n);
        }
      }
      function ib() {
        return new Er(Ie(), v());
      }
      function Ve(e) {
        return En(() => {
          const t = e.prototype.constructor,
            n = t[rn] || Tu(t),
            r = Object.prototype;
          let o = Object.getPrototypeOf(e.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[rn] || Tu(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function Tu(e) {
        return ru(e)
          ? () => {
              const t = Tu(F(e));
              return t && t();
            }
          : Qn(e);
      }
      function Vh(e) {
        const t = e[1],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[6] : null;
      }
      const Mr = "__parameters__";
      function Ir(e, t, n) {
        return En(() => {
          const r = (function xu(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, l, c) {
              const d = u.hasOwnProperty(Mr)
                ? u[Mr]
                : Object.defineProperty(u, Mr, { value: [] })[Mr];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), u;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      class I {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = x({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function an(e, t) {
        e.forEach((n) => (Array.isArray(n) ? an(n, t) : t(n)));
      }
      function Bh(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function ns(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function ft(e, t, n) {
        let r = Ar(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function cb(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = n);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > t; )
                    (e[o] = e[o - 2]), o--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function Ru(e, t) {
        const n = Ar(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Ar(e, t) {
        return (function Uh(e, t, n) {
          let r = 0,
            o = e.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << n];
            if (t === s) return i << n;
            s > t ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(e, t, 1);
      }
      const Io = {},
        Pu = "__NG_DI_FLAG__",
        os = "ngTempTokenPath",
        vb = /\n/gm,
        Gh = "__source";
      let Ao;
      function Tr(e) {
        const t = Ao;
        return (Ao = e), t;
      }
      function Db(e, t = N.Default) {
        if (void 0 === Ao) throw new C(-203, !1);
        return null === Ao
          ? nh(e, void 0, t)
          : Ao.get(e, t & N.Optional ? null : void 0, t);
      }
      function M(e, t = N.Default) {
        return (
          (function aE() {
            return iu;
          })() || Db
        )(F(e), t);
      }
      function me(e, t = N.Default) {
        return (
          "number" != typeof t &&
            (t =
              0 |
              (t.optional && 8) |
              (t.host && 1) |
              (t.self && 2) |
              (t.skipSelf && 4)),
          M(e, t)
        );
      }
      function Ou(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = F(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new C(900, !1);
            let o,
              i = N.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = Cb(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            t.push(M(o, i));
          } else t.push(M(r));
        }
        return t;
      }
      function To(e, t) {
        return (e[Pu] = t), (e.prototype[Pu] = t), e;
      }
      function Cb(e) {
        return e[Pu];
      }
      const xo = To(Ir("Optional"), 8),
        No = To(Ir("SkipSelf"), 4);
      let Lu;
      class rp {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      function An(e) {
        return e instanceof rp ? e.changingThisBreaksApplicationSecurity : e;
      }
      const zb =
        /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
      var Ce = (() => (
        ((Ce = Ce || {})[(Ce.NONE = 0)] = "NONE"),
        (Ce[(Ce.HTML = 1)] = "HTML"),
        (Ce[(Ce.STYLE = 2)] = "STYLE"),
        (Ce[(Ce.SCRIPT = 3)] = "SCRIPT"),
        (Ce[(Ce.URL = 4)] = "URL"),
        (Ce[(Ce.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        Ce
      ))();
      function Gu(e) {
        const t = (function ko() {
          const e = v();
          return e && e[12];
        })();
        return t
          ? t.sanitize(Ce.URL, e) || ""
          : (function Po(e, t) {
              const n = (function Hb(e) {
                return (e instanceof rp && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(
                  `Required a safe ${t}, got a ${n} (see https://g.co/ng/security#xss)`
                );
              }
              return n === t;
            })(e, "URL")
          ? An(e)
          : (function Bu(e) {
              return (e = String(e)).match(zb) ? e : "unsafe:" + e;
            })(k(e));
      }
      const zu = new I("ENVIRONMENT_INITIALIZER"),
        dp = new I("INJECTOR", -1),
        fp = new I("INJECTOR_DEF_TYPES");
      class hp {
        get(t, n = Io) {
          if (n === Io) {
            const r = new Error(`NullInjectorError: No provider for ${te(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function iM(...e) {
        return { ɵproviders: pp(0, e) };
      }
      function pp(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        return (
          an(t, (i) => {
            const s = i;
            Wu(s, n, [], r) && (o || (o = []), o.push(s));
          }),
          void 0 !== o && gp(o, n),
          n
        );
      }
      function gp(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: o } = e[n];
          an(o, (i) => {
            t.push(i);
          });
        }
      }
      function Wu(e, t, n, r) {
        if (!(e = F(e))) return !1;
        let o = null,
          i = eh(e);
        const s = !i && Y(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = eh(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const l of u) Wu(l, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let l;
              r.add(o);
              try {
                an(i.imports, (c) => {
                  Wu(c, t, n, r) && (l || (l = []), l.push(c));
                });
              } finally {
              }
              void 0 !== l && gp(l, t);
            }
            if (!a) {
              const l = Qn(o) || (() => new o());
              t.push(
                { provide: o, useFactory: l, deps: Z },
                { provide: fp, useValue: o, multi: !0 },
                { provide: zu, useValue: () => M(o), multi: !0 }
              );
            }
            const u = i.providers;
            null == u ||
              a ||
              an(u, (c) => {
                t.push(c);
              });
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      const sM = ee({ provide: String, useValue: ee });
      function qu(e) {
        return null !== e && "object" == typeof e && sM in e;
      }
      function Yn(e) {
        return "function" == typeof e;
      }
      const Zu = new I("Set Injector scope."),
        cs = {},
        uM = {};
      let Ku;
      function ds() {
        return void 0 === Ku && (Ku = new hp()), Ku;
      }
      class Tn {}
      class vp extends Tn {
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Yu(t, (s) => this.processProvider(s)),
            this.records.set(dp, Rr(void 0, this)),
            o.has("environment") && this.records.set(Tn, Rr(void 0, this));
          const i = this.records.get(Zu);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(fp.multi, Z, N.Self)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = Tr(this),
            r = vt(void 0);
          try {
            return t();
          } finally {
            Tr(n), vt(r);
          }
        }
        get(t, n = Io, r = N.Default) {
          this.assertNotDestroyed();
          const o = Tr(this),
            i = vt(void 0);
          try {
            if (!(r & N.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function hM(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof I)
                    );
                  })(t) && Li(t);
                (a = u && this.injectableDefInScope(u) ? Rr(Qu(t), cs) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & N.Self ? ds() : this.parent).get(
              t,
              (n = r & N.Optional && n === Io ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[os] = s[os] || []).unshift(te(t)), o)) throw s;
              return (function wb(e, t, n, r) {
                const o = e[os];
                throw (
                  (t[Gh] && o.unshift(t[Gh]),
                  (e.message = (function Eb(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = te(t);
                    if (Array.isArray(t)) o = t.map(te).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : te(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      vb,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[os] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            vt(i), Tr(o);
          }
        }
        resolveInjectorInitializers() {
          const t = Tr(this),
            n = vt(void 0);
          try {
            const r = this.get(zu.multi, Z, N.Self);
            for (const o of r) o();
          } finally {
            Tr(t), vt(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(te(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new C(205, !1);
        }
        processProvider(t) {
          let n = Yn((t = F(t))) ? t : F(t && t.provide);
          const r = (function cM(e) {
            return qu(e) ? Rr(void 0, e.useValue) : Rr(_p(e), cs);
          })(t);
          if (Yn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = Rr(void 0, cs, !0)),
              (o.factory = () => Ou(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === cs && ((n.value = uM), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function fM(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = F(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
      }
      function Qu(e) {
        const t = Li(e),
          n = null !== t ? t.factory : Qn(e);
        if (null !== n) return n;
        if (e instanceof I) throw new C(204, !1);
        if (e instanceof Function)
          return (function lM(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function So(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new C(204, !1))
              );
            const n = (function oE(e) {
              const t = e && (e[Vi] || e[th]);
              if (t) {
                const n = (function iE(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new C(204, !1);
      }
      function _p(e, t, n) {
        let r;
        if (Yn(e)) {
          const o = F(e);
          return Qn(o) || Qu(o);
        }
        if (qu(e)) r = () => F(e.useValue);
        else if (
          (function yp(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...Ou(e.deps || []));
        else if (
          (function mp(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => M(F(e.useExisting));
        else {
          const o = F(e && (e.useClass || e.provide));
          if (
            !(function dM(e) {
              return !!e.deps;
            })(e)
          )
            return Qn(o) || Qu(o);
          r = () => new o(...Ou(e.deps));
        }
        return r;
      }
      function Rr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function pM(e) {
        return !!e.ɵproviders;
      }
      function Yu(e, t) {
        for (const n of e)
          Array.isArray(n) ? Yu(n, t) : pM(n) ? Yu(n.ɵproviders, t) : t(n);
      }
      class Dp {}
      class yM {
        resolveComponentFactory(t) {
          throw (function mM(e) {
            const t = Error(
              `No component factory found for ${te(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let Lo = (() => {
        class e {}
        return (e.NULL = new yM()), e;
      })();
      function vM() {
        return Fr(Ie(), v());
      }
      function Fr(e, t) {
        return new ht(wt(e, t));
      }
      let ht = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = vM), e;
      })();
      class wp {}
      let ln = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function DM() {
                const e = v(),
                  n = ct(Ie().index, e);
                return (nt(n) ? n : e)[B];
              })()),
            e
          );
        })(),
        CM = (() => {
          class e {}
          return (
            (e.ɵprov = x({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class Vo {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const wM = new Vo("14.2.9"),
        Ju = {};
      function rl(e) {
        return e.ngOriginalError;
      }
      class Pr {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && rl(t);
          for (; n && rl(n); ) n = rl(n);
          return n || null;
        }
      }
      const ol = new Map();
      let PM = 0;
      const sl = "__ngContext__";
      function je(e, t) {
        nt(t)
          ? ((e[sl] = t[20]),
            (function kM(e) {
              ol.set(e[20], e);
            })(t))
          : (e[sl] = t);
      }
      function cn(e) {
        return e instanceof Function ? e() : e;
      }
      var rt = (() => (
        ((rt = rt || {})[(rt.Important = 1)] = "Important"),
        (rt[(rt.DashCase = 2)] = "DashCase"),
        rt
      ))();
      function ul(e, t) {
        return undefined(e, t);
      }
      function Bo(e) {
        const t = e[3];
        return xt(t) ? t[3] : t;
      }
      function ll(e) {
        return kp(e[13]);
      }
      function cl(e) {
        return kp(e[4]);
      }
      function kp(e) {
        for (; null !== e && !xt(e); ) e = e[4];
        return e;
      }
      function kr(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          xt(r) ? (i = r) : nt(r) && ((s = !0), (r = r[0]));
          const a = De(r);
          0 === e && null !== n
            ? null == o
              ? $p(t, n, a)
              : Jn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? Jn(t, n, a, o || null, !0)
            : 2 === e
            ? (function Kp(e, t, n) {
                const r = fs(e, t);
                r &&
                  (function c0(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function h0(e, t, n, r, o) {
                const i = n[7];
                i !== De(n) && kr(t, e, r, i, o);
                for (let a = 10; a < n.length; a++) {
                  const u = n[a];
                  Ho(u[1], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function fl(e, t, n) {
        return e.createElement(t, n);
      }
      function Vp(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          o = t[3];
        512 & t[2] && ((t[2] &= -513), mu(o, -1)), n.splice(r, 1);
      }
      function hl(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const o = r[17];
          null !== o && o !== e && Vp(o, r), t > 0 && (e[n - 1][4] = r[4]);
          const i = ns(e, 10 + t);
          !(function t0(e, t) {
            Ho(e, t, t[B], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = i[19];
          null !== s && s.detachView(i[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -65);
        }
        return r;
      }
      function jp(e, t) {
        if (!(128 & t[2])) {
          const n = t[B];
          n.destroyNode && Ho(e, t, n, 3, null, null),
            (function o0(e) {
              let t = e[13];
              if (!t) return pl(e[1], e);
              for (; t; ) {
                let n = null;
                if (nt(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; )
                    nt(t) && pl(t[1], t), (t = t[3]);
                  null === t && (t = e), nt(t) && pl(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function pl(e, t) {
        if (!(128 & t[2])) {
          (t[2] &= -65),
            (t[2] |= 128),
            (function l0(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof _o)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        try {
                          u.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        i.call(o);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function u0(e, t) {
              const n = e.cleanup,
                r = t[7];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 1],
                      a = "function" == typeof s ? s(t) : De(t[s]),
                      u = r[(o = n[i + 2])],
                      l = n[i + 3];
                    "boolean" == typeof l
                      ? a.removeEventListener(n[i], u, l)
                      : l >= 0
                      ? r[(o = l)]()
                      : r[(o = -l)].unsubscribe(),
                      (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) (0, r[i])();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && t[B].destroy();
          const n = t[17];
          if (null !== n && xt(t[3])) {
            n !== t[3] && Vp(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
          !(function LM(e) {
            ol.delete(e[20]);
          })(t);
        }
      }
      function Bp(e, t, n) {
        return (function Hp(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          if (2 & r.flags) {
            const o = e.data[r.directiveStart].encapsulation;
            if (o === $t.None || o === $t.Emulated) return null;
          }
          return wt(r, n);
        })(e, t.parent, n);
      }
      function Jn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function $p(e, t, n) {
        e.appendChild(t, n);
      }
      function Up(e, t, n, r, o) {
        null !== r ? Jn(e, t, n, r, o) : $p(e, t, n);
      }
      function fs(e, t) {
        return e.parentNode(t);
      }
      let Wp = function zp(e, t, n) {
        return 40 & e.type ? wt(e, n) : null;
      };
      function hs(e, t, n, r) {
        const o = Bp(e, r, t),
          i = t[B],
          a = (function Gp(e, t, n) {
            return Wp(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) Up(i, o, n[u], a, !1);
          else Up(i, o, n, a, !1);
      }
      function ps(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return wt(t, e);
          if (4 & n) return ml(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return ps(e, r);
            {
              const o = e[t.index];
              return xt(o) ? ml(-1, o) : De(o);
            }
          }
          if (32 & n) return ul(t, e)() || De(e[t.index]);
          {
            const r = Zp(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : ps(Bo(e[16]), r)
              : ps(e, t.next);
          }
        }
        return null;
      }
      function Zp(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function ml(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[1].firstChild;
          if (null !== o) return ps(r, o);
        }
        return t[7];
      }
      function yl(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && je(De(a), r), (n.flags |= 4)),
            64 != (64 & n.flags))
          )
            if (8 & u) yl(e, t, n.child, r, o, i, !1), kr(t, e, o, a, i);
            else if (32 & u) {
              const l = ul(n, r);
              let c;
              for (; (c = l()); ) kr(t, e, o, c, i);
              kr(t, e, o, a, i);
            } else 16 & u ? Qp(e, t, r, n, o, i) : kr(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Ho(e, t, n, r, o, i) {
        yl(n, r, e.firstChild, t, o, i, !1);
      }
      function Qp(e, t, n, r, o, i) {
        const s = n[16],
          u = s[6].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) kr(t, e, o, u[l], i);
        else yl(e, t, u, s[3], o, i, !0);
      }
      function Yp(e, t, n) {
        e.setAttribute(t, "style", n);
      }
      function vl(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function Jp(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const Xp = "ng-template";
      function g0(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let o = e[r++];
          if (n && "class" === o) {
            if (((o = e[r]), -1 !== Jp(o.toLowerCase(), t, 0))) return !0;
          } else if (1 === o) {
            for (; r < e.length && "string" == typeof (o = e[r++]); )
              if (o.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function eg(e) {
        return 4 === e.type && e.value !== Xp;
      }
      function m0(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Xp);
      }
      function y0(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function D0(e) {
            for (let t = 0; t < e.length; t++) if (Sh(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !m0(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (Rt(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!g0(e.attrs, l, n)) {
                    if (Rt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = v0(8 & r ? "class" : u, o, eg(e), n);
                if (-1 === d) {
                  if (Rt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Jp(h, l, 0)) || (2 & r && l !== f)) {
                    if (Rt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Rt(r) && !Rt(u)) return !1;
            if (s && Rt(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return Rt(r) || s;
      }
      function Rt(e) {
        return 0 == (1 & e);
      }
      function v0(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function C0(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function tg(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (y0(e, t[r], n)) return !0;
        return !1;
      }
      function ng(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function E0(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !Rt(s) && ((t += ng(i, o)), (o = "")),
              (r = s),
              (i = i || !Rt(r));
          n++;
        }
        return "" !== o && (t += ng(i, o)), t;
      }
      const L = {};
      function _l(e) {
        rg(z(), v(), Ze() + e, !1);
      }
      function rg(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const i = e.preOrderCheckHooks;
            null !== i && Zi(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && Ki(t, i, 0, n);
          }
        Sn(n);
      }
      function ag(e, t = null, n = null, r) {
        const o = ug(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function ug(e, t = null, n = null, r, o = new Set()) {
        const i = [n || Z, iM(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : te(e))),
          new vp(i, t || ds(), r || null, o)
        );
      }
      let pt = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return ag({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return ag({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = Io),
          (e.NULL = new hp()),
          (e.ɵprov = x({ token: e, providedIn: "any", factory: () => M(dp) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function _(e, t = N.Default) {
        const n = v();
        return null === n ? M(e, t) : Ph(Ie(), n, F(e), t);
      }
      function bl() {
        throw new Error("invalid");
      }
      function ms(e, t) {
        return (e << 17) | (t << 2);
      }
      function Ft(e) {
        return (e >> 17) & 32767;
      }
      function Ml(e) {
        return 2 | e;
      }
      function dn(e) {
        return (131068 & e) >> 2;
      }
      function Sl(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function Il(e) {
        return 1 | e;
      }
      function Mg(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r],
              i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              Cu(o), s.contentQueries(2, t[i], i);
            }
          }
      }
      function _s(e, t, n, r, o, i, s, a, u, l, c) {
        const d = t.blueprint.slice();
        return (
          (d[0] = o),
          (d[2] = 76 | r),
          (null !== c || (e && 1024 & e[2])) && (d[2] |= 1024),
          fh(d),
          (d[3] = d[15] = e),
          (d[8] = n),
          (d[10] = s || (e && e[10])),
          (d[B] = a || (e && e[B])),
          (d[12] = u || (e && e[12]) || null),
          (d[9] = l || (e && e[9]) || null),
          (d[6] = i),
          (d[20] = (function OM() {
            return PM++;
          })()),
          (d[21] = c),
          (d[16] = 2 == t.type ? e[16] : d),
          d
        );
      }
      function Vr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function Ol(e, t, n, r, o) {
            const i = gh(),
              s = yu(),
              u = (e.data[t] = (function iS(e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && (i.next = u)),
              u
            );
          })(e, t, n, r, o)),
            (function kE() {
              return O.lFrame.inI18n;
            })() && (i.flags |= 64);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function vo() {
            const e = O.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Ut(i, !0), i;
      }
      function jr(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function kl(e, t, n) {
        wu(t);
        try {
          const r = e.viewQuery;
          null !== r && Gl(1, r, n);
          const o = e.template;
          null !== o && Sg(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Mg(e, t),
            e.staticViewQueries && Gl(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function nS(e, t) {
              for (let n = 0; n < t.length; n++) CS(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), Eu();
        }
      }
      function Ds(e, t, n, r) {
        const o = t[2];
        if (128 != (128 & o)) {
          wu(t);
          try {
            fh(t),
              (function yh(e) {
                return (O.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && Sg(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && Zi(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && Ki(t, l, 0, null), bu(t, 0);
            }
            if (
              ((function _S(e) {
                for (let t = ll(e); null !== t; t = cl(t)) {
                  if (!t[2]) continue;
                  const n = t[9];
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r],
                      i = o[3];
                    0 == (512 & o[2]) && mu(i, 1), (o[2] |= 512);
                  }
                }
              })(t),
              (function vS(e) {
                for (let t = ll(e); null !== t; t = cl(t))
                  for (let n = 10; n < t.length; n++) {
                    const r = t[n],
                      o = r[1];
                    Wi(r) && Ds(o, r, o.template, r[8]);
                  }
              })(t),
              null !== e.contentQueries && Mg(e, t),
              s)
            ) {
              const l = e.contentCheckHooks;
              null !== l && Zi(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && Ki(t, l, 1), bu(t, 1);
            }
            !(function eS(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    if (o < 0) Sn(~o);
                    else {
                      const i = o,
                        s = n[++r],
                        a = n[++r];
                      LE(s, i), a(2, t[i]);
                    }
                  }
                } finally {
                  Sn(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function tS(e, t) {
                for (let n = 0; n < t.length; n++) DS(e, t[n]);
              })(t, a);
            const u = e.viewQuery;
            if ((null !== u && Gl(2, u, r), s)) {
              const l = e.viewCheckHooks;
              null !== l && Zi(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && Ki(t, l, 2), bu(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[2] &= -41),
              512 & t[2] && ((t[2] &= -513), mu(t[3], -1));
          } finally {
            Eu();
          }
        }
      }
      function Sg(e, t, n, r, o) {
        const i = Ze(),
          s = 2 & r;
        try {
          Sn(-1), s && t.length > 22 && rg(e, t, 22, !1), n(r, o);
        } finally {
          Sn(i);
        }
      }
      function Ag(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = jl(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function jl(e, t, n, r, o, i, s, a, u, l) {
        const c = 22 + r,
          d = c + o,
          f = (function rS(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : L);
            return n;
          })(c, d),
          h = "function" == typeof l ? l() : l;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function xg(e, t, n) {
        for (let r in e)
          if (e.hasOwnProperty(r)) {
            const o = e[r];
            (n = null === n ? {} : n).hasOwnProperty(r)
              ? n[r].push(t, o)
              : (n[r] = [t, o]);
          }
        return n;
      }
      function Ng(e, t) {
        const r = t.directiveEnd,
          o = e.data,
          i = t.attrs,
          s = [];
        let a = null,
          u = null;
        for (let l = t.directiveStart; l < r; l++) {
          const c = o[l],
            d = c.inputs,
            f = null === i || eg(t) ? null : yS(d, i);
          s.push(f), (a = xg(d, l, a)), (u = xg(c.outputs, l, u));
        }
        null !== a &&
          (a.hasOwnProperty("class") && (t.flags |= 16),
          a.hasOwnProperty("style") && (t.flags |= 32)),
          (t.initialInputs = s),
          (t.inputs = a),
          (t.outputs = u);
      }
      function Rg(e, t) {
        const n = ct(t, e);
        16 & n[2] || (n[2] |= 32);
      }
      function Fg(e, t, n, r, o, i) {
        const s = i.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const u = ~t.index;
          (function lS(e) {
            let t = e.length;
            for (; t > 0; ) {
              const n = e[--t];
              if ("number" == typeof n && n < 0) return n;
            }
            return 0;
          })(a) != u && a.push(u),
            a.push(r, o, s);
        }
      }
      function Pg(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Og(e, t) {
        (t.flags |= 2), (e.components || (e.components = [])).push(t.index);
      }
      function pS(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          Nt(t) && (n[""] = e);
        }
      }
      function kg(e, t, n) {
        (e.flags |= 1),
          (e.directiveStart = t),
          (e.directiveEnd = t + n),
          (e.providerIndexes = t);
      }
      function Lg(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = Qn(o.type)),
          s = new _o(i, Nt(o), _);
        (e.blueprint[r] = s),
          (n[r] = s),
          Fg(e, t, 0, r, jr(e, n, o.hostVars, L), o);
      }
      function gS(e, t, n) {
        const r = wt(t, e),
          o = Ag(n),
          i = e[10],
          s = Cs(
            e,
            _s(
              e,
              o,
              null,
              n.onPush ? 32 : 16,
              r,
              t,
              i,
              i.createRenderer(r, n),
              null,
              null,
              null
            )
          );
        e[t.index] = s;
      }
      function zt(e, t, n, r, o, i) {
        const s = wt(e, t);
        !(function Hl(e, t, n, r, o, i, s) {
          if (null == i) e.removeAttribute(t, o, n);
          else {
            const a = null == s ? k(i) : s(i, r || "", o);
            e.setAttribute(t, o, a, n);
          }
        })(t[B], s, i, e.value, n, r, o);
      }
      function mS(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let u = 0; u < s.length; ) {
            const l = s[u++],
              c = s[u++],
              d = s[u++];
            null !== a ? r.setInput(n, d, l, c) : (n[c] = d);
          }
        }
      }
      function yS(e, t) {
        let n = null,
          r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              e.hasOwnProperty(o) &&
                (null === n && (n = []), n.push(o, e[o], t[r + 1])),
                (r += 2);
            } else r += 2;
          else r += 4;
        }
        return n;
      }
      function DS(e, t) {
        const n = ct(t, e);
        if (Wi(n)) {
          const r = n[1];
          48 & n[2] ? Ds(r, n, r.template, n[8]) : n[5] > 0 && $l(n);
        }
      }
      function $l(e) {
        for (let r = ll(e); null !== r; r = cl(r))
          for (let o = 10; o < r.length; o++) {
            const i = r[o];
            if (Wi(i))
              if (512 & i[2]) {
                const s = i[1];
                Ds(s, i, s.template, i[8]);
              } else i[5] > 0 && $l(i);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = ct(n[r], e);
            Wi(o) && o[5] > 0 && $l(o);
          }
      }
      function CS(e, t) {
        const n = ct(t, e),
          r = n[1];
        (function wS(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          kl(r, n, n[8]);
      }
      function Cs(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function Ul(e) {
        for (; e; ) {
          e[2] |= 32;
          const t = Bo(e);
          if (pE(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function ws(e, t, n, r = !0) {
        const o = t[10];
        o.begin && o.begin();
        try {
          Ds(e, t, e.template, n);
        } catch (s) {
          throw (r && $g(t, s), s);
        } finally {
          o.end && o.end();
        }
      }
      function Gl(e, t, n) {
        Cu(0), t(e, n);
      }
      function jg(e) {
        return e[7] || (e[7] = []);
      }
      function Bg(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function $g(e, t) {
        const n = e[9],
          r = n ? n.get(Pr, null) : null;
        r && r.handleError(t);
      }
      function zl(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            u = t[s],
            l = e.data[s];
          null !== l.setInput ? l.setInput(u, o, r, a) : (u[a] = o);
        }
      }
      function Es(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = nu(o, a))
              : 2 == i && (r = nu(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function bs(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(De(i)), xt(i)))
            for (let a = 10; a < i.length; a++) {
              const u = i[a],
                l = u[1].firstChild;
              null !== l && bs(u[1], u, l, r);
            }
          const s = n.type;
          if (8 & s) bs(e, t, n.child, r);
          else if (32 & s) {
            const a = ul(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = Zp(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = Bo(t[16]);
              bs(u[1], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class $o {
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return bs(n, t, n.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (xt(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (hl(t, r), ns(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          jp(this._lView[1], this._lView);
        }
        onDestroy(t) {
          !(function Tg(e, t, n, r) {
            const o = jg(t);
            null === n
              ? o.push(r)
              : (o.push(n), e.firstCreatePass && Bg(e).push(r, o.length - 1));
          })(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          Ul(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          ws(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function r0(e, t) {
              Ho(e, t, t[B], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class ES extends $o {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          ws(t[1], t, t[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class Wl extends Lo {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = Y(t);
          return new Uo(n, this.ngModule);
        }
      }
      function Ug(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class MS {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          const o = this.injector.get(t, Ju, r);
          return o !== Ju || n === Ju ? o : this.parentInjector.get(t, n, r);
        }
      }
      class Uo extends Dp {
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function b0(e) {
              return e.map(E0).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        get inputs() {
          return Ug(this.componentDef.inputs);
        }
        get outputs() {
          return Ug(this.componentDef.outputs);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof Tn ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new MS(t, i) : t,
            a = s.get(wp, null);
          if (null === a) throw new C(407, !1);
          const u = s.get(CM, null),
            l = a.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function oS(e, t, n) {
                  return e.selectRootElement(t, n === $t.ShadowDom);
                })(l, r, this.componentDef.encapsulation)
              : fl(
                  a.createRenderer(null, this.componentDef),
                  c,
                  (function bS(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(c)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = jl(0, null, null, 1, 0, null, null, null, null, null),
            p = _s(null, h, null, f, null, null, a, l, u, s, null);
          let g, y;
          wu(p);
          try {
            const D = (function AS(e, t, n, r, o, i) {
              const s = n[1];
              n[22] = e;
              const u = Vr(s, 22, 2, "#host", null),
                l = (u.mergedAttrs = t.hostAttrs);
              null !== l &&
                (Es(u, l, !0),
                null !== e &&
                  (Qi(o, e, l),
                  null !== u.classes && vl(o, e, u.classes),
                  null !== u.styles && Yp(o, e, u.styles)));
              const c = r.createRenderer(e, t),
                d = _s(
                  n,
                  Ag(t),
                  null,
                  t.onPush ? 32 : 16,
                  n[22],
                  u,
                  r,
                  c,
                  i || null,
                  null,
                  null
                );
              return (
                s.firstCreatePass &&
                  (es(Co(u, n), s, t.type), Og(s, u), kg(u, n.length, 1)),
                Cs(n, d),
                (n[22] = d)
              );
            })(d, this.componentDef, p, a, l);
            if (d)
              if (r) Qi(l, d, ["ng-version", wM.full]);
              else {
                const { attrs: w, classes: m } = (function M0(e) {
                  const t = [],
                    n = [];
                  let r = 1,
                    o = 2;
                  for (; r < e.length; ) {
                    let i = e[r];
                    if ("string" == typeof i)
                      2 === o
                        ? "" !== i && t.push(i, e[++r])
                        : 8 === o && n.push(i);
                    else {
                      if (!Rt(o)) break;
                      o = i;
                    }
                    r++;
                  }
                  return { attrs: t, classes: n };
                })(this.componentDef.selectors[0]);
                w && Qi(l, d, w), m && m.length > 0 && vl(l, d, m.join(" "));
              }
            if (((y = gu(h, 22)), void 0 !== n)) {
              const w = (y.projection = []);
              for (let m = 0; m < this.ngContentSelectors.length; m++) {
                const S = n[m];
                w.push(null != S ? Array.from(S) : null);
              }
            }
            (g = (function TS(e, t, n, r) {
              const o = n[1],
                i = (function uS(e, t, n) {
                  const r = Ie();
                  e.firstCreatePass &&
                    (n.providersResolver && n.providersResolver(n),
                    Lg(e, r, t, jr(e, t, 1, null), n),
                    Ng(e, r));
                  const o = wo(t, e, r.directiveStart, r);
                  je(o, t);
                  const i = wt(r, t);
                  return i && je(i, t), o;
                })(o, n, t);
              if (((e[8] = n[8] = i), null !== r)) for (const a of r) a(i, t);
              if (t.contentQueries) {
                const a = Ie();
                t.contentQueries(1, i, a.directiveStart);
              }
              const s = Ie();
              return (
                !o.firstCreatePass ||
                  (null === t.hostBindings && null === t.hostAttrs) ||
                  (Sn(s.index),
                  Fg(n[1], s, 0, s.directiveStart, s.directiveEnd, t),
                  Pg(t, i)),
                i
              );
            })(D, this.componentDef, p, [xS])),
              kl(h, p, null);
          } finally {
            Eu();
          }
          return new IS(this.componentType, g, Fr(y, p), p, y);
        }
      }
      class IS extends class gM {} {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new ES(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            const i = this._rootLView;
            zl(i[1], i, o, t, n), Rg(i, this._tNode.index);
          }
        }
        get injector() {
          return new Er(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function xS() {
        const e = Ie();
        qi(v()[1], e);
      }
      function J(e) {
        let t = (function Gg(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          n = !0;
        const r = [e];
        for (; t; ) {
          let o;
          if (Nt(e)) o = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new C(903, !1);
            o = t.ɵdir;
          }
          if (o) {
            if (n) {
              r.push(o);
              const s = e;
              (s.inputs = ql(e.inputs)),
                (s.declaredInputs = ql(e.declaredInputs)),
                (s.outputs = ql(e.outputs));
              const a = o.hostBindings;
              a && PS(e, a);
              const u = o.viewQuery,
                l = o.contentQueries;
              if (
                (u && RS(e, u),
                l && FS(e, l),
                tu(e.inputs, o.inputs),
                tu(e.declaredInputs, o.declaredInputs),
                tu(e.outputs, o.outputs),
                Nt(o) && o.data.animation)
              ) {
                const c = e.data;
                c.animation = (c.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(e), a === J && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function NS(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = t += o.hostVars),
              (o.hostAttrs = Yi(o.hostAttrs, (n = Yi(n, o.hostAttrs))));
          }
        })(r);
      }
      function ql(e) {
        return e === pr ? {} : e === Z ? [] : e;
      }
      function RS(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function FS(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, o, i) => {
              t(r, o, i), n(r, o, i);
            }
          : t;
      }
      function PS(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function Be(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function qt(e, t, n, r) {
        const o = v();
        return Be(o, Dr(), t) && (z(), zt(fe(), o, e, t, n, r)), qt;
      }
      function Is(e, t, n) {
        const r = v();
        return (
          Be(r, Dr(), t) &&
            (function gt(e, t, n, r, o, i, s, a) {
              const u = wt(t, n);
              let c,
                l = t.inputs;
              !a && null != l && (c = l[r])
                ? (zl(e, n, c, r, o), Ui(t) && Rg(n, t.index))
                : 3 & t.type &&
                  ((r = (function sS(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, t.value || "", r) : o),
                  i.setProperty(u, r, o));
            })(z(), fe(), r, e, t, r[B], n, !1),
          Is
        );
      }
      function Kl(e, t, n, r, o) {
        const s = o ? "class" : "style";
        zl(e, n, t.inputs[s], s, r);
      }
      function K(e, t, n, r) {
        const o = v(),
          i = z(),
          s = 22 + e,
          a = o[B],
          u = (o[s] = fl(
            a,
            t,
            (function WE() {
              return O.lFrame.currentNamespace;
            })()
          )),
          l = i.firstCreatePass
            ? (function WS(e, t, n, r, o, i, s) {
                const a = t.consts,
                  l = Vr(t, e, 2, o, Mn(a, i));
                return (
                  (function Bl(e, t, n, r) {
                    let o = !1;
                    if (ph()) {
                      const i = (function fS(e, t, n) {
                          const r = e.directiveRegistry;
                          let o = null;
                          if (r)
                            for (let i = 0; i < r.length; i++) {
                              const s = r[i];
                              tg(n, s.selectors, !1) &&
                                (o || (o = []),
                                es(Co(n, t), e, s.type),
                                Nt(s) ? (Og(e, n), o.unshift(s)) : o.push(s));
                            }
                          return o;
                        })(e, t, n),
                        s = null === r ? null : { "": -1 };
                      if (null !== i) {
                        (o = !0), kg(n, e.data.length, i.length);
                        for (let c = 0; c < i.length; c++) {
                          const d = i[c];
                          d.providersResolver && d.providersResolver(d);
                        }
                        let a = !1,
                          u = !1,
                          l = jr(e, t, i.length, null);
                        for (let c = 0; c < i.length; c++) {
                          const d = i[c];
                          (n.mergedAttrs = Yi(n.mergedAttrs, d.hostAttrs)),
                            Lg(e, n, t, l, d),
                            pS(l, d, s),
                            null !== d.contentQueries && (n.flags |= 8),
                            (null !== d.hostBindings ||
                              null !== d.hostAttrs ||
                              0 !== d.hostVars) &&
                              (n.flags |= 128);
                          const f = d.type.prototype;
                          !a &&
                            (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                            ((e.preOrderHooks || (e.preOrderHooks = [])).push(
                              n.index
                            ),
                            (a = !0)),
                            !u &&
                              (f.ngOnChanges || f.ngDoCheck) &&
                              ((
                                e.preOrderCheckHooks ||
                                (e.preOrderCheckHooks = [])
                              ).push(n.index),
                              (u = !0)),
                            l++;
                        }
                        Ng(e, n);
                      }
                      s &&
                        (function hS(e, t, n) {
                          if (t) {
                            const r = (e.localNames = []);
                            for (let o = 0; o < t.length; o += 2) {
                              const i = n[t[o + 1]];
                              if (null == i) throw new C(-301, !1);
                              r.push(t[o], i);
                            }
                          }
                        })(n, r, s);
                    }
                    return (n.mergedAttrs = Yi(n.mergedAttrs, n.attrs)), o;
                  })(t, n, l, Mn(a, s)),
                  null !== l.attrs && Es(l, l.attrs, !1),
                  null !== l.mergedAttrs && Es(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, i, o, 0, t, n, r)
            : i.data[s];
        Ut(l, !0);
        const c = l.mergedAttrs;
        null !== c && Qi(a, u, c);
        const d = l.classes;
        null !== d && vl(a, u, d);
        const f = l.styles;
        return (
          null !== f && Yp(a, u, f),
          64 != (64 & l.flags) && hs(i, o, u, l),
          0 ===
            (function AE() {
              return O.lFrame.elementDepthCount;
            })() && je(u, o),
          (function TE() {
            O.lFrame.elementDepthCount++;
          })(),
          Gi(l) &&
            ((function Ll(e, t, n) {
              !ph() ||
                ((function cS(e, t, n, r) {
                  const o = n.directiveStart,
                    i = n.directiveEnd;
                  e.firstCreatePass || Co(n, t), je(r, t);
                  const s = n.initialInputs;
                  for (let a = o; a < i; a++) {
                    const u = e.data[a],
                      l = Nt(u);
                    l && gS(t, n, u);
                    const c = wo(t, e, a, n);
                    je(c, t),
                      null !== s && mS(0, a - o, c, u, 0, s),
                      l && (ct(n.index, t)[8] = c);
                  }
                })(e, t, n, wt(n, t)),
                128 == (128 & n.flags) &&
                  (function dS(e, t, n) {
                    const r = n.directiveStart,
                      o = n.directiveEnd,
                      i = n.index,
                      s = (function VE() {
                        return O.lFrame.currentDirectiveIndex;
                      })();
                    try {
                      Sn(i);
                      for (let a = r; a < o; a++) {
                        const u = e.data[a],
                          l = t[a];
                        _u(a),
                          (null !== u.hostBindings ||
                            0 !== u.hostVars ||
                            null !== u.hostAttrs) &&
                            Pg(u, l);
                      }
                    } finally {
                      Sn(-1), _u(s);
                    }
                  })(e, t, n));
            })(i, o, l),
            (function Ig(e, t, n) {
              if (cu(t)) {
                const o = t.directiveEnd;
                for (let i = t.directiveStart; i < o; i++) {
                  const s = e.data[i];
                  s.contentQueries && s.contentQueries(1, n[i], i);
                }
              }
            })(i, l, o)),
          null !== r &&
            (function Vl(e, t, n = wt) {
              const r = t.localNames;
              if (null !== r) {
                let o = t.index + 1;
                for (let i = 0; i < r.length; i += 2) {
                  const s = r[i + 1],
                    a = -1 === s ? n(t, e) : e[s];
                  e[o++] = a;
                }
              }
            })(o, l),
          K
        );
      }
      function X() {
        let e = Ie();
        yu()
          ? (function vu() {
              O.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Ut(e, !1));
        const t = e;
        !(function xE() {
          O.lFrame.elementDepthCount--;
        })();
        const n = z();
        return (
          n.firstCreatePass && (qi(n, e), cu(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function YE(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Kl(n, t, v(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function JE(e) {
              return 0 != (32 & e.flags);
            })(t) &&
            Kl(n, t, v(), t.stylesWithoutHost, !1),
          X
        );
      }
      function ye(e, t, n, r) {
        return K(e, t, n, r), X(), ye;
      }
      function Wo(e) {
        return !!e && "function" == typeof e.then;
      }
      const Jl = function tm(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function He(e, t, n, r) {
        const o = v(),
          i = z(),
          s = Ie();
        return (
          (function rm(e, t, n, r, o, i, s, a) {
            const u = Gi(r),
              c = e.firstCreatePass && Bg(e),
              d = t[8],
              f = jg(t);
            let h = !0;
            if (3 & r.type || a) {
              const y = wt(r, t),
                D = a ? a(y) : y,
                w = f.length,
                m = a ? (W) => a(De(W[r.index])) : r.index;
              let S = null;
              if (
                (!a &&
                  u &&
                  (S = (function KS(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[7],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== S)
              )
                ((S.__ngLastListenerFn__ || S).__ngNextListenerFn__ = i),
                  (S.__ngLastListenerFn__ = i),
                  (h = !1);
              else {
                i = im(r, t, d, i, !1);
                const W = n.listen(D, o, i);
                f.push(i, W), c && c.push(o, m, w, w + 1);
              }
            } else i = im(r, t, d, i, !1);
            const p = r.outputs;
            let g;
            if (h && null !== p && (g = p[o])) {
              const y = g.length;
              if (y)
                for (let D = 0; D < y; D += 2) {
                  const le = t[g[D]][g[D + 1]].subscribe(i),
                    fr = f.length;
                  f.push(i, le), c && c.push(o, r.index, fr, -(fr + 1));
                }
            }
          })(i, o, o[B], s, e, t, 0, r),
          He
        );
      }
      function om(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (o) {
          return $g(e, o), !1;
        }
      }
      function im(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          Ul(2 & e.flags ? ct(e.index, t) : t);
          let u = om(t, 0, r, s),
            l = i.__ngNextListenerFn__;
          for (; l; ) (u = om(t, 0, l, s) && u), (l = l.__ngNextListenerFn__);
          return o && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
        };
      }
      function gm(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? Ft(i) : dn(i),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const c = e[a + 1];
          nI(e[a], t) && ((u = !0), (e[a + 1] = r ? Il(c) : Ml(c))),
            (a = r ? Ft(c) : dn(c));
        }
        u && (e[n + 1] = r ? Ml(i) : Il(i));
      }
      function nI(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Ar(e, t) >= 0)
        );
      }
      function As(e, t) {
        return (
          (function Pt(e, t, n, r) {
            const o = v(),
              i = z(),
              s = (function sn(e) {
                const t = O.lFrame,
                  n = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + e), n;
              })(2);
            i.firstUpdatePass &&
              (function bm(e, t, n, r) {
                const o = e.data;
                if (null === o[n + 1]) {
                  const i = o[Ze()],
                    s = (function Em(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, n);
                  (function Am(e, t) {
                    return 0 != (e.flags & (t ? 16 : 32));
                  })(i, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function dI(e, t, n, r) {
                      const o = (function Du(e) {
                        const t = O.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let i = r ? t.residualClasses : t.residualStyles;
                      if (null === o)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((n = qo((n = ec(null, e, t, n, r)), t.attrs, r)),
                          (i = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((n = ec(o, e, t, n, r)), null === i)) {
                            let u = (function fI(e, t, n) {
                              const r = n ? t.classBindings : t.styleBindings;
                              if (0 !== dn(r)) return e[Ft(r)];
                            })(e, t, r);
                            void 0 !== u &&
                              Array.isArray(u) &&
                              ((u = ec(null, e, t, u[1], r)),
                              (u = qo(u, t.attrs, r)),
                              (function hI(e, t, n, r) {
                                e[Ft(n ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(e, t, r, u));
                          } else
                            i = (function pI(e, t, n) {
                              let r;
                              const o = t.directiveEnd;
                              for (
                                let i = 1 + t.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = qo(r, e[i].hostAttrs, n);
                              return qo(r, t.attrs, n);
                            })(e, t, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (t.residualClasses = i)
                            : (t.residualStyles = i)),
                        n
                      );
                    })(o, i, t, r)),
                    (function eI(e, t, n, r, o, i) {
                      let s = i ? t.classBindings : t.styleBindings,
                        a = Ft(s),
                        u = dn(s);
                      e[r] = n;
                      let c,
                        l = !1;
                      if (Array.isArray(n)) {
                        const d = n;
                        (c = d[1]), (null === c || Ar(d, c) > 0) && (l = !0);
                      } else c = n;
                      if (o)
                        if (0 !== u) {
                          const f = Ft(e[a + 1]);
                          (e[r + 1] = ms(f, a)),
                            0 !== f && (e[f + 1] = Sl(e[f + 1], r)),
                            (e[a + 1] = (function G0(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = ms(a, 0)),
                            0 !== a && (e[a + 1] = Sl(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = ms(u, 0)),
                          0 === a ? (a = r) : (e[u + 1] = Sl(e[u + 1], r)),
                          (u = r);
                      l && (e[r + 1] = Ml(e[r + 1])),
                        gm(e, c, r, !0),
                        gm(e, c, r, !1),
                        (function tI(e, t, n, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof t &&
                            Ar(i, t) >= 0 &&
                            (n[r + 1] = Il(n[r + 1]));
                        })(t, c, e, r, i),
                        (s = ms(a, u)),
                        i ? (t.classBindings = s) : (t.styleBindings = s);
                    })(o, i, t, n, s, r);
                }
              })(i, e, s, r),
              t !== L &&
                Be(o, s, t) &&
                (function Sm(e, t, n, r, o, i, s, a) {
                  if (!(3 & t.type)) return;
                  const u = e.data,
                    l = u[a + 1];
                  Ts(
                    (function yg(e) {
                      return 1 == (1 & e);
                    })(l)
                      ? Im(u, t, n, o, dn(l), s)
                      : void 0
                  ) ||
                    (Ts(i) ||
                      ((function mg(e) {
                        return 2 == (2 & e);
                      })(l) &&
                        (i = Im(u, null, n, o, a, s))),
                    (function p0(e, t, n, r, o) {
                      if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : rt.DashCase;
                        null == o
                          ? e.removeStyle(n, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= rt.Important)),
                            e.setStyle(n, r, o, i));
                      }
                    })(r, s, zi(Ze(), n), o, i));
                })(
                  i,
                  i.data[Ze()],
                  o,
                  o[B],
                  e,
                  (o[s + 1] = (function yI(e, t) {
                    return (
                      null == e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e && (e = te(An(e)))),
                      e
                    );
                  })(t, n)),
                  r,
                  s
                );
          })(e, t, null, !0),
          As
        );
      }
      function ec(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = t[a]), (r = qo(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function qo(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                ft(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function Im(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const u = e[o],
            l = Array.isArray(u),
            c = l ? u[1] : u,
            d = null === c;
          let f = n[o + 1];
          f === L && (f = d ? Z : void 0);
          let h = d ? Ru(f, r) : c === r ? f : void 0;
          if ((l && !Ts(h) && (h = Ru(u, r)), Ts(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? Ft(p) : dn(p);
        }
        if (null !== t) {
          let u = i ? t.residualClasses : t.residualStyles;
          null != u && (a = Ru(u, r));
        }
        return a;
      }
      function Ts(e) {
        return void 0 !== e;
      }
      function mt(e, t = "") {
        const n = v(),
          r = z(),
          o = e + 22,
          i = r.firstCreatePass ? Vr(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function dl(e, t) {
            return e.createText(t);
          })(n[B], t));
        hs(r, n, s, i), Ut(i, !1);
      }
      function tc(e) {
        return nc("", e, ""), tc;
      }
      function nc(e, t, n) {
        const r = v(),
          o = (function Hr(e, t, n, r) {
            return Be(e, Dr(), n) ? t + k(n) + r : L;
          })(r, e, t, n);
        return (
          o !== L &&
            (function fn(e, t, n) {
              const r = zi(t, e);
              !(function Lp(e, t, n) {
                e.setValue(t, n);
              })(e[B], r, n);
            })(r, Ze(), o),
          nc
        );
      }
      const Yr = "en-US";
      let Qm = Yr;
      function ic(e, t, n, r, o) {
        if (((e = F(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) ic(e[i], t, n, r, o);
        else {
          const i = z(),
            s = v();
          let a = Yn(e) ? e : F(e.provide),
            u = _p(e);
          const l = Ie(),
            c = 1048575 & l.providerIndexes,
            d = l.directiveStart,
            f = l.providerIndexes >> 20;
          if (Yn(e) || !e.multi) {
            const h = new _o(u, o, _),
              p = ac(a, t, o ? c : c + f, d);
            -1 === p
              ? (es(Co(l, s), i, a),
                sc(i, e, t.length),
                t.push(a),
                l.directiveStart++,
                l.directiveEnd++,
                o && (l.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = ac(a, t, c + f, d),
              p = ac(a, t, c, c + f),
              g = h >= 0 && n[h],
              y = p >= 0 && n[p];
            if ((o && !y) || (!o && !g)) {
              es(Co(l, s), i, a);
              const D = (function OA(e, t, n, r, o) {
                const i = new _o(e, n, _);
                return (
                  (i.multi = []),
                  (i.index = t),
                  (i.componentProviders = 0),
                  Cy(i, o, r && !n),
                  i
                );
              })(o ? PA : FA, n.length, o, r, u);
              !o && y && (n[p].providerFactory = D),
                sc(i, e, t.length, 0),
                t.push(a),
                l.directiveStart++,
                l.directiveEnd++,
                o && (l.providerIndexes += 1048576),
                n.push(D),
                s.push(D);
            } else sc(i, e, h > -1 ? h : p, Cy(n[o ? p : h], u, !o && r));
            !o && r && y && n[p].componentProviders++;
          }
        }
      }
      function sc(e, t, n, r) {
        const o = Yn(t),
          i = (function aM(e) {
            return !!e.useClass;
          })(t);
        if (o || i) {
          const u = (i ? F(t.useClass) : t).prototype.ngOnDestroy;
          if (u) {
            const l = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
              const c = l.indexOf(n);
              -1 === c ? l.push(n, [r, u]) : l[c + 1].push(r, u);
            } else l.push(n, u);
          }
        }
      }
      function Cy(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function ac(e, t, n, r) {
        for (let o = n; o < r; o++) if (t[o] === e) return o;
        return -1;
      }
      function FA(e, t, n, r) {
        return uc(this.multi, []);
      }
      function PA(e, t, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = wo(n, n[1], this.providerFactory.index, r);
          (i = a.slice(0, s)), uc(o, i);
          for (let u = s; u < a.length; u++) i.push(a[u]);
        } else (i = []), uc(o, i);
        return i;
      }
      function uc(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function ue(e, t = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function RA(e, t, n) {
              const r = z();
              if (r.firstCreatePass) {
                const o = Nt(e);
                ic(n, r.data, r.blueprint, o, !0),
                  ic(t, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, t);
        };
      }
      class nr {}
      class wy {}
      class Ey extends nr {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Wl(this));
          const r = ut(t);
          (this._bootstrapComponents = cn(r.bootstrap)),
            (this._r3Injector = ug(
              t,
              n,
              [
                { provide: nr, useValue: this },
                { provide: Lo, useValue: this.componentFactoryResolver },
              ],
              te(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class lc extends wy {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new Ey(this.moduleType, t);
        }
      }
      class LA extends nr {
        constructor(t, n, r) {
          super(),
            (this.componentFactoryResolver = new Wl(this)),
            (this.instance = null);
          const o = new vp(
            [
              ...t,
              { provide: nr, useValue: this },
              { provide: Lo, useValue: this.componentFactoryResolver },
            ],
            n || ds(),
            r,
            new Set(["environment"])
          );
          (this.injector = o), o.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function Ps(e, t, n = null) {
        return new LA(e, t, n).injector;
      }
      let VA = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n.id)) {
              const r = pp(0, n.type),
                o =
                  r.length > 0
                    ? Ps([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n.id, o);
            }
            return this.cachedInjectors.get(n.id);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (e.ɵprov = x({
            token: e,
            providedIn: "environment",
            factory: () => new e(M(Tn)),
          })),
          e
        );
      })();
      function by(e) {
        e.getStandaloneInjector = (t) =>
          t.get(VA).getOrCreateStandaloneInjector(e);
      }
      function dc(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const pe = class cT extends Ht {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = dc(i)), o && (o = dc(o)), s && (s = dc(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof yt && t.add(a), a;
        }
      };
      let kt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = gT), e;
      })();
      function gT() {
        return (function Vy(e, t) {
          let n;
          const r = t[e.index];
          if (xt(r)) n = r;
          else {
            let o;
            if (8 & e.type) o = De(r);
            else {
              const i = t[B];
              o = i.createComment("");
              const s = wt(e, t);
              Jn(
                i,
                fs(i, s),
                o,
                (function d0(e, t) {
                  return e.nextSibling(t);
                })(i, s),
                !1
              );
            }
            (t[e.index] = n =
              (function Vg(e, t, n, r) {
                return new Array(e, !0, !1, t, null, 0, r, n, null, null);
              })(r, t, o, e)),
              Cs(t, n);
          }
          return new ky(n, e, t);
        })(Ie(), v());
      }
      const mT = kt,
        ky = class extends mT {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Fr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Er(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Xi(this._hostTNode, this._hostLView);
            if (Th(t)) {
              const n = wr(t, this._hostLView),
                r = Cr(t);
              return new Er(n[1].data[r + 8], n);
            }
            return new Er(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = Ly(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const s = t.createEmbeddedView(n || {}, i);
            return this.insert(s, o), s;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function Mo(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.environmentInjector || d.ngModuleRef);
            }
            const u = s ? t : new Uo(Y(t)),
              l = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const f = (s ? l : this.parentInjector).get(Tn, null);
              f && (i = f);
            }
            const c = u.create(l, o, void 0, i);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[1];
            if (
              (function IE(e) {
                return xt(e[3]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new ky(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function s0(e, t, n, r) {
              const o = 10 + r,
                i = n.length;
              r > 0 && (n[o - 1][4] = t),
                r < i - 10
                  ? ((t[4] = n[o]), Bh(n, 10 + r, t))
                  : (n.push(t), (t[4] = null)),
                (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function a0(e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0),
                    null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 64);
            })(o, r, s, i);
            const a = ml(i, s),
              u = r[B],
              l = fs(u, s[7]);
            return (
              null !== l &&
                (function n0(e, t, n, r, o, i) {
                  (r[0] = o), (r[6] = t), Ho(e, r, n, 1, o, i);
                })(o, s[6], u, r, l, a),
              t.attachToViewContainerRef(),
              Bh(hc(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = Ly(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = hl(this._lContainer, n);
            r && (ns(hc(this._lContainer), n), jp(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = hl(this._lContainer, n);
            return r && null != ns(hc(this._lContainer), n) ? new $o(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function Ly(e) {
        return e[8];
      }
      function hc(e) {
        return e[8] || (e[8] = []);
      }
      function Ls(...e) {}
      const Vs = new I("Application Initializer");
      let js = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = Ls),
              (this.reject = Ls),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (Wo(i)) n.push(i);
                else if (Jl(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Vs, 8));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const ni = new I("AppId", {
        providedIn: "root",
        factory: function uv() {
          return `${Sc()}${Sc()}${Sc()}`;
        },
      });
      function Sc() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const lv = new I("Platform Initializer"),
        Ic = new I("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        cv = new I("appBootstrapListener");
      let WT = (() => {
        class e {
          log(n) {
            console.log(n);
          }
          warn(n) {
            console.warn(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      const pn = new I("LocaleId", {
        providedIn: "root",
        factory: () =>
          me(pn, N.Optional | N.SkipSelf) ||
          (function qT() {
            return (typeof $localize < "u" && $localize.locale) || Yr;
          })(),
      });
      class KT {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Ac = (() => {
        class e {
          compileModuleSync(n) {
            return new lc(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = cn(ut(n).declarations).reduce((s, a) => {
                const u = Y(a);
                return u && s.push(new Uo(u)), s;
              }, []);
            return new KT(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const JT = (() => Promise.resolve(0))();
      function Tc(e) {
        typeof Zone > "u"
          ? JT.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class xe {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new pe(!1)),
            (this.onMicrotaskEmpty = new pe(!1)),
            (this.onStable = new pe(!1)),
            (this.onError = new pe(!1)),
            typeof Zone > "u")
          )
            throw new C(908, !1);
          Zone.assertZonePatched();
          const o = this;
          if (
            ((o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.AsyncStackTaggingZoneSpec)
          ) {
            const i = Zone.AsyncStackTaggingZoneSpec;
            o._inner = o._inner.fork(new i("Angular"));
          }
          Zone.TaskTrackingZoneSpec &&
            (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function XT() {
              let e = oe.requestAnimationFrame,
                t = oe.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function nx(e) {
              const t = () => {
                !(function tx(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(oe, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Nc(e),
                                (e.isCheckStableRunning = !0),
                                xc(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Nc(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return hv(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      pv(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return hv(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), pv(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          Nc(e),
                          xc(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!xe.isInAngularZone()) throw new C(909, !1);
        }
        static assertNotInAngularZone() {
          if (xe.isInAngularZone()) throw new C(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, ex, Ls, Ls);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const ex = {};
      function xc(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Nc(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function hv(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function pv(e) {
        e._nesting--, xc(e);
      }
      class rx {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new pe()),
            (this.onMicrotaskEmpty = new pe()),
            (this.onStable = new pe()),
            (this.onError = new pe());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const gv = new I(""),
        Bs = new I("");
      let Pc,
        Rc = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Pc ||
                  ((function ox(e) {
                    Pc = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      xe.assertNotInAngularZone(),
                        Tc(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Tc(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(xe), M(Fc), M(Bs));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Fc = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Pc?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = x({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })(),
        Rn = null;
      const mv = new I("AllowMultipleToken"),
        Oc = new I("PlatformDestroyListeners");
      class yv {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function _v(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new I(r);
        return (i = []) => {
          let s = kc();
          if (!s || s.injector.get(mv, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function ax(e) {
                  if (Rn && !Rn.get(mv, !1)) throw new C(400, !1);
                  Rn = e;
                  const t = e.get(Cv);
                  (function vv(e) {
                    const t = e.get(lv, null);
                    t && t.forEach((n) => n());
                  })(e);
                })(
                  (function Dv(e = [], t) {
                    return pt.create({
                      name: t,
                      providers: [
                        { provide: Zu, useValue: "platform" },
                        { provide: Oc, useValue: new Set([() => (Rn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function lx(e) {
            const t = kc();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function kc() {
        return Rn?.get(Cv) ?? null;
      }
      let Cv = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function Ev(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new rx()
                      : ("zone.js" === e ? void 0 : e) || new xe(t)),
                  n
                );
              })(
                r?.ngZone,
                (function wv(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              i = [{ provide: xe, useValue: o }];
            return o.run(() => {
              const s = pt.create({
                  providers: i,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                a = n.create(s),
                u = a.injector.get(Pr, null);
              if (!u) throw new C(402, !1);
              return (
                o.runOutsideAngular(() => {
                  const l = o.onError.subscribe({
                    next: (c) => {
                      u.handleError(c);
                    },
                  });
                  a.onDestroy(() => {
                    $s(this._modules, a), l.unsubscribe();
                  });
                }),
                (function bv(e, t, n) {
                  try {
                    const r = n();
                    return Wo(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(u, o, () => {
                  const l = a.injector.get(js);
                  return (
                    l.runInitializers(),
                    l.donePromise.then(
                      () => (
                        (function Ym(e) {
                          st(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (Qm = e.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(pn, Yr) || Yr),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = Mv({}, r);
            return (function ix(e, t, n) {
              const r = new lc(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Hs);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new C(403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new C(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Oc, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(pt));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function Mv(e, t) {
        return Array.isArray(t) ? t.reduce(Mv, e) : { ...e, ...t };
      }
      let Hs = (() => {
        class e {
          constructor(n, r, o) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const i = new ge((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new ge((a) => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    xe.assertNotInAngularZone(),
                      Tc(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const l = this._zone.onUnstable.subscribe(() => {
                  xe.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  u.unsubscribe(), l.unsubscribe();
                };
              });
            this.isStable = (function Kw(...e) {
              const t = fo(e),
                n = (function $w(e, t) {
                  return "number" == typeof Xa(e) ? e.pop() : t;
                })(e, 1 / 0),
                r = e;
              return r.length
                ? 1 === r.length
                  ? It(r[0])
                  : hr(n)(_e(r, t))
                : tn;
            })(
              i,
              s.pipe(
                (function Qw(e = {}) {
                  const {
                    connector: t = () => new Ht(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = e;
                  return (i) => {
                    let s,
                      a,
                      u,
                      l = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = u = void 0), (c = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), g?.unsubscribe();
                      };
                    return Re((g, y) => {
                      l++, !d && !c && f();
                      const D = (u = u ?? t());
                      y.add(() => {
                        l--, 0 === l && !d && !c && (a = eu(p, o));
                      }),
                        D.subscribe(y),
                        !s &&
                          l > 0 &&
                          ((s = new co({
                            next: (w) => D.next(w),
                            error: (w) => {
                              (d = !0), f(), (a = eu(h, n, w)), D.error(w);
                            },
                            complete: () => {
                              (c = !0), f(), (a = eu(h, r)), D.complete();
                            },
                          })),
                          It(g).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const o = n instanceof Dp;
            if (!this._injector.get(js).done)
              throw (
                (!o &&
                  (function gr(e) {
                    const t = Y(e) || ze(e) || We(e);
                    return null !== t && t.standalone;
                  })(n),
                new C(405, false))
              );
            let s;
            (s = o ? n : this._injector.get(Lo).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function sx(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(nr),
              l = s.create(pt.NULL, [], r || s.selector, a),
              c = l.location.nativeElement,
              d = l.injector.get(gv, null);
            return (
              d?.registerApplication(c),
              l.onDestroy(() => {
                this.detachView(l.hostView),
                  $s(this.components, l),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(l),
              l
            );
          }
          tick() {
            if (this._runningTick) throw new C(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            $s(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView),
              this.tick(),
              this.components.push(n),
              this._injector
                .get(cv, [])
                .concat(this._bootstrapListeners)
                .forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => $s(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new C(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(xe), M(Tn), M(Pr));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function $s(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let Iv = !0,
        Us = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = fx), e;
        })();
      function fx(e) {
        return (function hx(e, t, n) {
          if (Ui(e) && !n) {
            const r = ct(e.index, t);
            return new $o(r, r);
          }
          return 47 & e.type ? new $o(t[16], t) : null;
        })(Ie(), v(), 16 == (16 & e));
      }
      const Sx = _v(null, "core", []);
      let Ix = (() => {
        class e {
          constructor(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Hs));
          }),
          (e.ɵmod = at({ type: e })),
          (e.ɵinj = et({})),
          e
        );
      })();
      function mn(e) {
        return "boolean" == typeof e ? e : null != e && "false" !== e;
      }
      let qs = null;
      function Qt() {
        return qs;
      }
      const Je = new I("DocumentToken");
      let Hc = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({
            token: e,
            factory: function () {
              return (function Nx() {
                return M(Vv);
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const Rx = new I("Location Initialized");
      let Vv = (() => {
        class e extends Hc {
          constructor(n) {
            super(), (this._doc = n), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Qt().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Qt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Qt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(n) {
            this.location.pathname = n;
          }
          pushState(n, r, o) {
            jv() ? this._history.pushState(n, r, o) : (this.location.hash = o);
          }
          replaceState(n, r, o) {
            jv()
              ? this._history.replaceState(n, r, o)
              : (this.location.hash = o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Je));
          }),
          (e.ɵprov = x({
            token: e,
            factory: function () {
              return (function Fx() {
                return new Vv(M(Je));
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function jv() {
        return !!window.history.pushState;
      }
      function $c(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function Bv(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function yn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let or = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({
            token: e,
            factory: function () {
              return me($v);
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const Hv = new I("appBaseHref");
      let $v = (() => {
          class e extends or {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  me(Je).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return $c(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  yn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + yn(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + yn(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Hc), M(Hv, 8));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Px = (() => {
          class e extends or {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = $c(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + yn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + yn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Hc), M(Hv, 8));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Uc = (() => {
          class e {
            constructor(n) {
              (this._subject = new pe()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._baseHref = Bv(Uv(r))),
                this._locationStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + yn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function kx(e, t) {
                  return e && t.startsWith(e) ? t.substring(e.length) : t;
                })(this._baseHref, Uv(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._locationStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + yn(r)),
                  o
                );
            }
            replaceState(n, r = "", o = null) {
              this._locationStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + yn(r)),
                  o
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
          }
          return (
            (e.normalizeQueryParams = yn),
            (e.joinWithSlash = $c),
            (e.stripTrailingSlash = Bv),
            (e.ɵfac = function (n) {
              return new (n || e)(M(or));
            }),
            (e.ɵprov = x({
              token: e,
              factory: function () {
                return (function Ox() {
                  return new Uc(M(or));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function Uv(e) {
        return e.replace(/\/index.html$/, "");
      }
      function Jv(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(";")) {
          const r = n.indexOf("="),
            [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (o.trim() === t) return decodeURIComponent(i);
        }
        return null;
      }
      let JN = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = at({ type: e })),
          (e.ɵinj = et({})),
          e
        );
      })();
      let nR = (() => {
        class e {}
        return (
          (e.ɵprov = x({
            token: e,
            providedIn: "root",
            factory: () => new rR(M(Je), window),
          })),
          e
        );
      })();
      class rR {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function oR(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              s_(this.window.history) ||
              s_(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function s_(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class a_ {}
      class id extends class wR extends class xx {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function Tx(e) {
            qs || (qs = e);
          })(new id());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function ER() {
            return (
              (ai = ai || document.querySelector("base")),
              ai ? ai.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function bR(e) {
                (oa = oa || document.createElement("a")),
                  oa.setAttribute("href", e);
                const t = oa.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          ai = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return Jv(document.cookie, t);
        }
      }
      let oa,
        ai = null;
      const d_ = new I("TRANSITION_ID"),
        SR = [
          {
            provide: Vs,
            useFactory: function MR(e, t, n) {
              return () => {
                n.get(js).donePromise.then(() => {
                  const r = Qt(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [d_, Je, pt],
            multi: !0,
          },
        ];
      let AR = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const ia = new I("EventManagerPlugins");
      let sa = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => (o.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(ia), M(xe));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class f_ {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = Qt().getGlobalEventTarget(this._doc, t);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let h_ = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((o) => {
                this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        ui = (() => {
          class e extends h_ {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, o) {
              n.forEach((i) => {
                const s = this._doc.createElement("style");
                (s.textContent = i), o.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(p_), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, o) => {
                this._addStylesToHost(n, o, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(p_));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Je));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function p_(e) {
        Qt().remove(e);
      }
      const sd = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        ad = /%COMP%/g;
      function aa(e, t, n) {
        for (let r = 0; r < t.length; r++) {
          let o = t[r];
          Array.isArray(o) ? aa(e, o, n) : ((o = o.replace(ad, e)), n.push(o));
        }
        return n;
      }
      function y_(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let ud = (() => {
        class e {
          constructor(n, r, o) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new ld(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case $t.Emulated: {
                let o = this.rendererByCompId.get(r.id);
                return (
                  o ||
                    ((o = new PR(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, o)),
                  o.applyToHost(n),
                  o
                );
              }
              case 1:
              case $t.ShadowDom:
                return new OR(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const o = aa(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(o),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(sa), M(ui), M(ni));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class ld {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(sd[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          (__(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (__(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = sd[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = sd[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (rt.DashCase | rt.Important)
            ? t.style.setProperty(n, r, o & rt.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & rt.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, y_(r))
            : this.eventManager.addEventListener(t, n, y_(r));
        }
      }
      function __(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class PR extends ld {
        constructor(t, n, r, o) {
          super(t), (this.component = r);
          const i = aa(o + "-" + r.id, r.styles, []);
          n.addStyles(i),
            (this.contentAttr = (function NR(e) {
              return "_ngcontent-%COMP%".replace(ad, e);
            })(o + "-" + r.id)),
            (this.hostAttr = (function RR(e) {
              return "_nghost-%COMP%".replace(ad, e);
            })(o + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class OR extends ld {
        constructor(t, n, r, o) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = aa(o.id, o.styles, []);
          for (let s = 0; s < i.length; s++) {
            const a = document.createElement("style");
            (a.textContent = i[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
      }
      let kR = (() => {
        class e extends f_ {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Je));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const D_ = ["alt", "control", "meta", "shift"],
        LR = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        VR = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let jR = (() => {
        class e extends f_ {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Qt().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              D_.forEach((l) => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let o = LR[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                D_.forEach((s) => {
                  s !== o && (0, VR[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Je));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const UR = _v(Sx, "browser", [
          { provide: Ic, useValue: "browser" },
          {
            provide: lv,
            useValue: function BR() {
              id.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: Je,
            useFactory: function $R() {
              return (
                (function Fb(e) {
                  Lu = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        E_ = new I(""),
        b_ = [
          {
            provide: Bs,
            useClass: class IR {
              addToWindow(t) {
                (oe.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i)
                    throw new Error("Could not find testability for element.");
                  return i;
                }),
                  (oe.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (oe.getAllAngularRootElements = () => t.getAllRootElements()),
                  oe.frameworkStabilizers || (oe.frameworkStabilizers = []),
                  oe.frameworkStabilizers.push((r) => {
                    const o = oe.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach(function (u) {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? Qt().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: gv, useClass: Rc, deps: [xe, Fc, Bs] },
          { provide: Rc, useClass: Rc, deps: [xe, Fc, Bs] },
        ],
        M_ = [
          { provide: Zu, useValue: "root" },
          {
            provide: Pr,
            useFactory: function HR() {
              return new Pr();
            },
            deps: [],
          },
          { provide: ia, useClass: kR, multi: !0, deps: [Je, xe, Ic] },
          { provide: ia, useClass: jR, multi: !0, deps: [Je] },
          { provide: ud, useClass: ud, deps: [sa, ui, ni] },
          { provide: wp, useExisting: ud },
          { provide: h_, useExisting: ui },
          { provide: ui, useClass: ui, deps: [Je] },
          { provide: sa, useClass: sa, deps: [ia, xe] },
          { provide: a_, useClass: AR, deps: [] },
          [],
        ];
      let GR = (() => {
          class e {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: ni, useValue: n.appId },
                  { provide: d_, useExisting: ni },
                  SR,
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(E_, 12));
            }),
            (e.ɵmod = at({ type: e })),
            (e.ɵinj = et({ providers: [...M_, ...b_], imports: [JN, Ix] })),
            e
          );
        })(),
        S_ = (() => {
          class e {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Je));
            }),
            (e.ɵprov = x({
              token: e,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function WR() {
                        return new S_(M(Je));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function A(...e) {
        return _e(e, fo(e));
      }
      typeof window < "u" && window;
      class Bt extends Ht {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      const ua = uo(
          (e) =>
            function () {
              e(this),
                (this.name = "EmptyError"),
                (this.message = "no elements in sequence");
            }
        ),
        { isArray: eF } = Array,
        { getPrototypeOf: tF, prototype: nF, keys: rF } = Object;
      function T_(e) {
        if (1 === e.length) {
          const t = e[0];
          if (eF(t)) return { args: t, keys: null };
          if (
            (function oF(e) {
              return e && "object" == typeof e && tF(e) === nF;
            })(t)
          ) {
            const n = rF(t);
            return { args: n.map((r) => t[r]), keys: n };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: iF } = Array;
      function x_(e) {
        return $((t) =>
          (function sF(e, t) {
            return iF(t) ? e(...t) : e(t);
          })(e, t)
        );
      }
      function N_(e, t) {
        return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
      }
      function R_(...e) {
        const t = fo(e),
          n = Kf(e),
          { args: r, keys: o } = T_(e);
        if (0 === r.length) return _e([], t);
        const i = new ge(
          (function aF(e, t, n = Gn) {
            return (r) => {
              F_(
                t,
                () => {
                  const { length: o } = e,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let u = 0; u < o; u++)
                    F_(
                      t,
                      () => {
                        const l = _e(e[u], t);
                        let c = !1;
                        l.subscribe(
                          Se(
                            r,
                            (d) => {
                              (i[u] = d),
                                c || ((c = !0), a--),
                                a || r.next(n(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, t, o ? (s) => N_(o, s) : Gn)
        );
        return n ? i.pipe(x_(n)) : i;
      }
      function F_(e, t, n) {
        e ? en(n, e, t) : t();
      }
      function fd(...e) {
        return (function uF() {
          return hr(1);
        })()(_e(e, fo(e)));
      }
      function P_(e) {
        return new ge((t) => {
          It(e()).subscribe(t);
        });
      }
      function li(e, t) {
        const n = ne(e) ? e : () => e,
          r = (o) => o.error(n());
        return new ge(t ? (o) => t.schedule(r, 0, o) : r);
      }
      function hd() {
        return Re((e, t) => {
          let n = null;
          e._refCount++;
          const r = Se(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const o = e._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class O_ extends ge {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Of(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new yt();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                Se(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = yt.EMPTY));
          }
          return t;
        }
        refCount() {
          return hd()(this);
        }
      }
      function Yt(e, t) {
        return Re((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            Se(
              r,
              (u) => {
                o?.unsubscribe();
                let l = 0;
                const c = i++;
                It(e(u, c)).subscribe(
                  (o = Se(
                    r,
                    (d) => r.next(t ? t(u, d, c, l++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function ci(e) {
        return e <= 0
          ? () => tn
          : Re((t, n) => {
              let r = 0;
              t.subscribe(
                Se(n, (o) => {
                  ++r <= e && (n.next(o), e <= r && n.complete());
                })
              );
            });
      }
      function _n(e, t) {
        return Re((n, r) => {
          let o = 0;
          n.subscribe(Se(r, (i) => e.call(t, i, o++) && r.next(i)));
        });
      }
      function la(e) {
        return Re((t, n) => {
          let r = !1;
          t.subscribe(
            Se(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function k_(e = cF) {
        return Re((t, n) => {
          let r = !1;
          t.subscribe(
            Se(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function cF() {
        return new ua();
      }
      function Pn(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? _n((o, i) => e(o, i, r)) : Gn,
            ci(1),
            n ? la(t) : k_(() => new ua())
          );
      }
      function On(e, t) {
        return ne(t) ? Pe(e, t, 1) : Pe(e, 1);
      }
      function Ue(e, t, n) {
        const r = ne(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Re((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                Se(
                  i,
                  (u) => {
                    var l;
                    null === (l = r.next) || void 0 === l || l.call(r, u),
                      i.next(u);
                  },
                  () => {
                    var u;
                    (a = !1),
                      null === (u = r.complete) || void 0 === u || u.call(r),
                      i.complete();
                  },
                  (u) => {
                    var l;
                    (a = !1),
                      null === (l = r.error) || void 0 === l || l.call(r, u),
                      i.error(u);
                  },
                  () => {
                    var u, l;
                    a &&
                      (null === (u = r.unsubscribe) ||
                        void 0 === u ||
                        u.call(r)),
                      null === (l = r.finalize) || void 0 === l || l.call(r);
                  }
                )
              );
            })
          : Gn;
      }
      function kn(e) {
        return Re((t, n) => {
          let i,
            r = null,
            o = !1;
          (r = t.subscribe(
            Se(n, void 0, void 0, (s) => {
              (i = It(e(s, kn(e)(t)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function dF(e, t, n, r, o) {
        return (i, s) => {
          let a = n,
            u = t,
            l = 0;
          i.subscribe(
            Se(
              s,
              (c) => {
                const d = l++;
                (u = a ? e(u, c, d) : ((a = !0), c)), r && s.next(u);
              },
              o &&
                (() => {
                  a && s.next(u), s.complete();
                })
            )
          );
        };
      }
      function L_(e, t) {
        return Re(dF(e, t, arguments.length >= 2, !0));
      }
      function pd(e) {
        return e <= 0
          ? () => tn
          : Re((t, n) => {
              let r = [];
              t.subscribe(
                Se(
                  n,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function V_(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? _n((o, i) => e(o, i, r)) : Gn,
            pd(1),
            n ? la(t) : k_(() => new ua())
          );
      }
      function gd(e) {
        return Re((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      const H = "primary",
        di = Symbol("RouteTitle");
      class pF {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function eo(e) {
        return new pF(e);
      }
      function gF(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function Jt(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !j_(e[o], t[o]))) return !1;
        return !0;
      }
      function j_(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((o, i) => r[i] === o);
        }
        return e === t;
      }
      function B_(e) {
        return Array.prototype.concat.apply([], e);
      }
      function H_(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Oe(e, t) {
        for (const n in e) e.hasOwnProperty(n) && t(e[n], n);
      }
      function Ln(e) {
        return Jl(e) ? e : Wo(e) ? _e(Promise.resolve(e)) : A(e);
      }
      const vF = {
          exact: function G_(e, t, n) {
            if (
              !sr(e.segments, t.segments) ||
              !ca(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !G_(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: z_,
        },
        $_ = {
          exact: function _F(e, t) {
            return Jt(e, t);
          },
          subset: function DF(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => j_(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function U_(e, t, n) {
        return (
          vF[n.paths](e.root, t.root, n.matrixParams) &&
          $_[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function z_(e, t, n) {
        return W_(e, t, t.segments, n);
      }
      function W_(e, t, n, r) {
        if (e.segments.length > n.length) {
          const o = e.segments.slice(0, n.length);
          return !(!sr(o, n) || t.hasChildren() || !ca(o, n, r));
        }
        if (e.segments.length === n.length) {
          if (!sr(e.segments, n) || !ca(e.segments, n, r)) return !1;
          for (const o in t.children)
            if (!e.children[o] || !z_(e.children[o], t.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
          return (
            !!(sr(e.segments, o) && ca(e.segments, o, r) && e.children[H]) &&
            W_(e.children[H], t, i, r)
          );
        }
      }
      function ca(e, t, n) {
        return t.every((r, o) => $_[n](e[o].parameters, r.parameters));
      }
      class ir {
        constructor(t, n, r) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = eo(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return EF.serialize(this);
        }
      }
      class U {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Oe(n, (r, o) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return da(this);
        }
      }
      class fi {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = eo(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return Q_(this);
        }
      }
      function sr(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      let q_ = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({
            token: e,
            factory: function () {
              return new yd();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      class yd {
        parse(t) {
          const n = new RF(t);
          return new ir(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(t) {
          const n = `/${hi(t.root, !0)}`,
            r = (function SF(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${fa(n)}=${fa(o)}`).join("&")
                    : `${fa(n)}=${fa(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function bF(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const EF = new yd();
      function da(e) {
        return e.segments.map((t) => Q_(t)).join("/");
      }
      function hi(e, t) {
        if (!e.hasChildren()) return da(e);
        if (t) {
          const n = e.children[H] ? hi(e.children[H], !1) : "",
            r = [];
          return (
            Oe(e.children, (o, i) => {
              i !== H && r.push(`${i}:${hi(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function wF(e, t) {
            let n = [];
            return (
              Oe(e.children, (r, o) => {
                o === H && (n = n.concat(t(r, o)));
              }),
              Oe(e.children, (r, o) => {
                o !== H && (n = n.concat(t(r, o)));
              }),
              n
            );
          })(e, (r, o) =>
            o === H ? [hi(e.children[H], !1)] : [`${o}:${hi(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[H]
            ? `${da(e)}/${n[0]}`
            : `${da(e)}/(${n.join("//")})`;
        }
      }
      function Z_(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function fa(e) {
        return Z_(e).replace(/%3B/gi, ";");
      }
      function vd(e) {
        return Z_(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function ha(e) {
        return decodeURIComponent(e);
      }
      function K_(e) {
        return ha(e.replace(/\+/g, "%20"));
      }
      function Q_(e) {
        return `${vd(e.path)}${(function MF(e) {
          return Object.keys(e)
            .map((t) => `;${vd(t)}=${vd(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const IF = /^[^\/()?;=#]+/;
      function pa(e) {
        const t = e.match(IF);
        return t ? t[0] : "";
      }
      const AF = /^[^=?&#]+/,
        xF = /^[^&#]+/;
      class RF {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new U([], {})
              : new U([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[H] = new U(t, n)),
            r
          );
        }
        parseSegment() {
          const t = pa(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new C(4009, !1);
          return this.capture(t), new fi(ha(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = pa(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = pa(this.remaining);
            o && ((r = o), this.capture(r));
          }
          t[ha(n)] = ha(r);
        }
        parseQueryParam(t) {
          const n = (function TF(e) {
            const t = e.match(AF);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function NF(e) {
              const t = e.match(xF);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = K_(n),
            i = K_(r);
          if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
          } else t[o] = i;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = pa(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o) throw new C(4010, !1);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.slice(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : t && (i = H);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[H] : new U([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new C(4011, !1);
        }
      }
      function _d(e) {
        return e.segments.length > 0 ? new U([], { [H]: e }) : e;
      }
      function ga(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const i = ga(e.children[r]);
          (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
        }
        return (function FF(e) {
          if (1 === e.numberOfChildren && e.children[H]) {
            const t = e.children[H];
            return new U(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new U(e.segments, t));
      }
      function ar(e) {
        return e instanceof ir;
      }
      function kF(e, t, n, r, o) {
        if (0 === n.length) return to(t.root, t.root, t.root, r, o);
        const i = (function X_(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new J_(!0, 0, e);
          let t = 0,
            n = !1;
          const r = e.reduce((o, i, s) => {
            if ("object" == typeof i && null != i) {
              if (i.outlets) {
                const a = {};
                return (
                  Oe(i.outlets, (u, l) => {
                    a[l] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...o, { outlets: a }]
                );
              }
              if (i.segmentPath) return [...o, i.segmentPath];
            }
            return "string" != typeof i
              ? [...o, i]
              : 0 === s
              ? (i.split("/").forEach((a, u) => {
                  (0 == u && "." === a) ||
                    (0 == u && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? t++
                      : "" != a && o.push(a));
                }),
                o)
              : [...o, i];
          }, []);
          return new J_(n, t, r);
        })(n);
        return i.toRoot()
          ? to(t.root, t.root, new U([], {}), r, o)
          : (function s(u) {
              const l = (function VF(e, t, n, r) {
                  if (e.isAbsolute) return new no(t.root, !0, 0);
                  if (-1 === r) return new no(n, n === t.root, 0);
                  return (function eD(e, t, n) {
                    let r = e,
                      o = t,
                      i = n;
                    for (; i > o; ) {
                      if (((i -= o), (r = r.parent), !r)) throw new C(4005, !1);
                      o = r.segments.length;
                    }
                    return new no(r, !1, o - i);
                  })(n, r + (pi(e.commands[0]) ? 0 : 1), e.numberOfDoubleDots);
                })(i, t, e.snapshot?._urlSegment, u),
                c = l.processChildren
                  ? mi(l.segmentGroup, l.index, i.commands)
                  : Cd(l.segmentGroup, l.index, i.commands);
              return to(t.root, l.segmentGroup, c, r, o);
            })(e.snapshot?._lastPathIndex);
      }
      function pi(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function gi(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function to(e, t, n, r, o) {
        let s,
          i = {};
        r &&
          Oe(r, (u, l) => {
            i[l] = Array.isArray(u) ? u.map((c) => `${c}`) : `${u}`;
          }),
          (s = e === t ? n : Y_(e, t, n));
        const a = _d(ga(s));
        return new ir(a, i, o);
      }
      function Y_(e, t, n) {
        const r = {};
        return (
          Oe(e.children, (o, i) => {
            r[i] = o === t ? n : Y_(o, t, n);
          }),
          new U(e.segments, r)
        );
      }
      class J_ {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && pi(r[0]))
          )
            throw new C(4003, !1);
          const o = r.find(gi);
          if (o && o !== H_(r)) throw new C(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class no {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function Cd(e, t, n) {
        if (
          (e || (e = new U([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return mi(e, t, n);
        const r = (function BF(e, t, n) {
            let r = 0,
              o = t;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= n.length) return i;
              const s = e.segments[o],
                a = n[r];
              if (gi(a)) break;
              const u = `${a}`,
                l = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === u) break;
              if (u && l && "object" == typeof l && void 0 === l.outlets) {
                if (!nD(u, l, s)) return i;
                r += 2;
              } else {
                if (!nD(u, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, t, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new U(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[H] = new U(e.segments.slice(r.pathIndex), e.children)),
            mi(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new U(e.segments, {})
          : r.match && !e.hasChildren()
          ? wd(e, t, n)
          : r.match
          ? mi(e, 0, o)
          : wd(e, t, n);
      }
      function mi(e, t, n) {
        if (0 === n.length) return new U(e.segments, {});
        {
          const r = (function jF(e) {
              return gi(e[0]) ? e[0].outlets : { [H]: e };
            })(n),
            o = {};
          return (
            Oe(r, (i, s) => {
              "string" == typeof i && (i = [i]),
                null !== i && (o[s] = Cd(e.children[s], t, i));
            }),
            Oe(e.children, (i, s) => {
              void 0 === r[s] && (o[s] = i);
            }),
            new U(e.segments, o)
          );
        }
      }
      function wd(e, t, n) {
        const r = e.segments.slice(0, t);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (gi(i)) {
            const u = HF(i.outlets);
            return new U(r, u);
          }
          if (0 === o && pi(n[0])) {
            r.push(new fi(e.segments[t].path, tD(n[0]))), o++;
            continue;
          }
          const s = gi(i) ? i.outlets[H] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && pi(a)
            ? (r.push(new fi(s, tD(a))), (o += 2))
            : (r.push(new fi(s, {})), o++);
        }
        return new U(r, {});
      }
      function HF(e) {
        const t = {};
        return (
          Oe(e, (n, r) => {
            "string" == typeof n && (n = [n]),
              null !== n && (t[r] = wd(new U([], {}), 0, n));
          }),
          t
        );
      }
      function tD(e) {
        const t = {};
        return Oe(e, (n, r) => (t[r] = `${n}`)), t;
      }
      function nD(e, t, n) {
        return e == n.path && Jt(t, n.parameters);
      }
      class Dn {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class Ed extends Dn {
        constructor(t, n, r = "imperative", o = null) {
          super(t, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class ur extends Dn {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class ma extends Dn {
        constructor(t, n, r, o) {
          super(t, n), (this.reason = r), (this.code = o), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class rD extends Dn {
        constructor(t, n, r, o) {
          super(t, n), (this.error = r), (this.target = o), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class $F extends Dn {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class UF extends Dn {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class GF extends Dn {
        constructor(t, n, r, o, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class zF extends Dn {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class WF extends Dn {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class qF {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class ZF {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class KF {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class QF {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class YF {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class JF {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class oD {
        constructor(t, n, r) {
          (this.routerEvent = t),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class iD {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = bd(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = bd(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = Md(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== t);
        }
        pathFromRoot(t) {
          return Md(t, this._root).map((n) => n.value);
        }
      }
      function bd(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = bd(e, n);
          if (r) return r;
        }
        return null;
      }
      function Md(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = Md(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class Cn {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function ro(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class sD extends iD {
        constructor(t, n) {
          super(t), (this.snapshot = n), Sd(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function aD(e, t) {
        const n = (function eP(e, t) {
            const s = new ya([], {}, {}, "", {}, H, t, null, e.root, -1, {});
            return new lD("", new Cn(s, []));
          })(e, t),
          r = new Bt([new fi("", {})]),
          o = new Bt({}),
          i = new Bt({}),
          s = new Bt({}),
          a = new Bt(""),
          u = new lr(r, o, s, a, i, H, t, n.root);
        return (u.snapshot = n.root), new sD(new Cn(u, []), n);
      }
      class lr {
        constructor(t, n, r, o, i, s, a, u) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.pipe($((l) => l[di])) ?? A(void 0)),
            (this._futureSnapshot = u);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe($((t) => eo(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe($((t) => eo(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function uD(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function tP(e) {
          return e.reduce(
            (t, n) => ({
              params: { ...t.params, ...n.params },
              data: { ...t.data, ...n.data },
              resolve: {
                ...n.data,
                ...t.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class ya {
        constructor(t, n, r, o, i, s, a, u, l, c, d, f) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.[di]),
            (this.routeConfig = u),
            (this._urlSegment = l),
            (this._lastPathIndex = c),
            (this._correctedLastPathIndex = f ?? c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = eo(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = eo(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class lD extends iD {
        constructor(t, n) {
          super(n), (this.url = t), Sd(this, n);
        }
        toString() {
          return cD(this._root);
        }
      }
      function Sd(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => Sd(e, n));
      }
      function cD(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(cD).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function Id(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            Jt(t.queryParams, n.queryParams) ||
              e.queryParams.next(n.queryParams),
            t.fragment !== n.fragment && e.fragment.next(n.fragment),
            Jt(t.params, n.params) || e.params.next(n.params),
            (function mF(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!Jt(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.url.next(n.url),
            Jt(t.data, n.data) || e.data.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function Ad(e, t) {
        const n =
          Jt(e.params, t.params) &&
          (function CF(e, t) {
            return (
              sr(e, t) && e.every((n, r) => Jt(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || Ad(e.parent, t.parent))
        );
      }
      function yi(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const o = (function rP(e, t, n) {
            return t.children.map((r) => {
              for (const o of n.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return yi(e, r, o);
              return yi(e, r);
            });
          })(e, t, n);
          return new Cn(r, o);
        }
        {
          if (e.shouldAttach(t.value)) {
            const i = e.retrieve(t.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => yi(e, a))),
                s
              );
            }
          }
          const r = (function oP(e) {
              return new lr(
                new Bt(e.url),
                new Bt(e.params),
                new Bt(e.queryParams),
                new Bt(e.fragment),
                new Bt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            o = t.children.map((i) => yi(e, i));
          return new Cn(r, o);
        }
      }
      const Td = "ngNavigationCancelingError";
      function dD(e, t) {
        const { redirectTo: n, navigationBehaviorOptions: r } = ar(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          o = fD(!1, 0, t);
        return (o.url = n), (o.navigationBehaviorOptions = r), o;
      }
      function fD(e, t, n) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Td] = !0), (r.cancellationCode = t), n && (r.url = n), r;
      }
      function hD(e) {
        return pD(e) && ar(e.url);
      }
      function pD(e) {
        return e && e[Td];
      }
      class iP {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new vi()),
            (this.attachRef = null);
        }
      }
      let vi = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const o = this.getOrCreateContext(n);
            (o.outlet = r), this.contexts.set(n, o);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new iP()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const va = !1;
      let xd = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.parentContexts = n),
              (this.location = r),
              (this.changeDetector = i),
              (this.environmentInjector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new pe()),
              (this.deactivateEvents = new pe()),
              (this.attachEvents = new pe()),
              (this.detachEvents = new pe()),
              (this.name = o || H),
              n.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.getContext(this.name)?.outlet === this &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const n = this.parentContexts.getContext(this.name);
              n &&
                n.route &&
                (n.attachRef
                  ? this.attach(n.attachRef, n.route)
                  : this.activateWith(n.route, n.injector));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new C(4012, va);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new C(4012, va);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new C(4012, va);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new C(4013, va);
            this._activatedRoute = n;
            const o = this.location,
              s = n._futureSnapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              u = new sP(n, a, o.injector);
            if (
              r &&
              (function aP(e) {
                return !!e.resolveComponentFactory;
              })(r)
            ) {
              const l = r.resolveComponentFactory(s);
              this.activated = o.createComponent(l, o.length, u);
            } else
              this.activated = o.createComponent(s, {
                index: o.length,
                injector: u,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(
              _(vi),
              _(kt),
              (function Eo(e) {
                return (function nb(e, t) {
                  if ("class" === t) return e.classes;
                  if ("style" === t) return e.styles;
                  const n = e.attrs;
                  if (n) {
                    const r = n.length;
                    let o = 0;
                    for (; o < r; ) {
                      const i = n[o];
                      if (Sh(i)) break;
                      if (0 === i) o += 2;
                      else if ("number" == typeof i)
                        for (o++; o < r && "string" == typeof n[o]; ) o++;
                      else {
                        if (i === t) return n[o + 1];
                        o += 2;
                      }
                    }
                  }
                  return null;
                })(Ie(), e);
              })("name"),
              _(Us),
              _(Tn)
            );
          }),
          (e.ɵdir = P({
            type: e,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
          })),
          e
        );
      })();
      class sP {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === lr
            ? this.route
            : t === vi
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      let Nd = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = bn({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [by],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && ye(0, "router-outlet");
            },
            dependencies: [xd],
            encapsulation: 2,
          })),
          e
        );
      })();
      function gD(e, t) {
        return (
          e.providers &&
            !e._injector &&
            (e._injector = Ps(e.providers, t, `Route: ${e.path}`)),
          e._injector ?? t
        );
      }
      function Fd(e) {
        const t = e.children && e.children.map(Fd),
          n = t ? { ...e, children: t } : { ...e };
        return (
          !n.component &&
            !n.loadComponent &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== H &&
            (n.component = Nd),
          n
        );
      }
      function St(e) {
        return e.outlet || H;
      }
      function mD(e, t) {
        const n = e.filter((r) => St(r) === t);
        return n.push(...e.filter((r) => St(r) !== t)), n;
      }
      function _i(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const n = t.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class fP {
        constructor(t, n, r, o) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            Id(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const o = ro(n);
          t.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Oe(o, (i, s) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = ro(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = ro(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const o = ro(n);
          t.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new JF(i.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new QF(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if ((Id(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Id(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = _i(o.snapshot),
                u = a?.get(Lo) ?? null;
              (s.attachRef = null),
                (s.route = o),
                (s.resolver = u),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class yD {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class _a {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function hP(e, t, n) {
        const r = e._root;
        return Di(r, t ? t._root : null, n, [r.value]);
      }
      function oo(e, t) {
        const n = Symbol(),
          r = t.get(e, n);
        return r === n
          ? "function" != typeof e ||
            (function rE(e) {
              return null !== Li(e);
            })(e)
            ? t.get(e)
            : e
          : r;
      }
      function Di(
        e,
        t,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = ro(t);
        return (
          e.children.forEach((s) => {
            (function gP(
              e,
              t,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const u = (function mP(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !sr(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !sr(e.url, t.url) || !Jt(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Ad(e, t) || !Jt(e.queryParams, t.queryParams);
                    default:
                      return !Ad(e, t);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                u
                  ? o.canActivateChecks.push(new yD(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  Di(e, t, i.component ? (a ? a.children : null) : n, r, o),
                  u &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new _a(a.outlet.component, s));
              } else
                s && Ci(t, a, o),
                  o.canActivateChecks.push(new yD(r)),
                  Di(e, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Oe(i, (s, a) => Ci(s, n.getContext(a), o)),
          o
        );
      }
      function Ci(e, t, n) {
        const r = ro(e),
          o = e.value;
        Oe(r, (i, s) => {
          Ci(i, o.component ? (t ? t.children.getContext(s) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new _a(
              o.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              o
            )
          );
      }
      function wi(e) {
        return "function" == typeof e;
      }
      function Pd(e) {
        return e instanceof ua || "EmptyError" === e?.name;
      }
      const Da = Symbol("INITIAL_VALUE");
      function io() {
        return Yt((e) =>
          R_(
            e.map((t) =>
              t.pipe(
                ci(1),
                (function lF(...e) {
                  const t = fo(e);
                  return Re((n, r) => {
                    (t ? fd(e, n, t) : fd(e, n)).subscribe(r);
                  });
                })(Da)
              )
            )
          ).pipe(
            $((t) => {
              for (const n of t)
                if (!0 !== n) {
                  if (n === Da) return Da;
                  if (!1 === n || n instanceof ir) return n;
                }
              return !0;
            }),
            _n((t) => t !== Da),
            ci(1)
          )
        );
      }
      function vD(e) {
        return (function ww(...e) {
          return Rf(e);
        })(
          Ue((t) => {
            if (ar(t)) throw dD(0, t);
          }),
          $((t) => !0 === t)
        );
      }
      const Od = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function _D(e, t, n, r, o) {
        const i = kd(e, t, n);
        return i.matched
          ? (function FP(e, t, n, r) {
              const o = t.canMatch;
              return o && 0 !== o.length
                ? A(
                    o.map((s) => {
                      const a = oo(s, e);
                      return Ln(
                        (function wP(e) {
                          return e && wi(e.canMatch);
                        })(a)
                          ? a.canMatch(t, n)
                          : e.runInContext(() => a(t, n))
                      );
                    })
                  ).pipe(io(), vD())
                : A(!0);
            })((r = gD(t, r)), t, n).pipe($((s) => (!0 === s ? i : { ...Od })))
          : A(i);
      }
      function kd(e, t, n) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? { ...Od }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (t.matcher || gF)(n, e, t);
        if (!o) return { ...Od };
        const i = {};
        Oe(o.posParams, (a, u) => {
          i[u] = a.path;
        });
        const s =
          o.consumed.length > 0
            ? { ...i, ...o.consumed[o.consumed.length - 1].parameters }
            : i;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: n.slice(o.consumed.length),
          parameters: s,
          positionalParamSegments: o.posParams ?? {},
        };
      }
      function Ca(e, t, n, r, o = "corrected") {
        if (
          n.length > 0 &&
          (function kP(e, t, n) {
            return n.some((r) => wa(e, t, r) && St(r) !== H);
          })(e, n, r)
        ) {
          const s = new U(
            t,
            (function OP(e, t, n, r) {
              const o = {};
              (o[H] = r),
                (r._sourceSegment = e),
                (r._segmentIndexShift = t.length);
              for (const i of n)
                if ("" === i.path && St(i) !== H) {
                  const s = new U([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = t.length),
                    (o[St(i)] = s);
                }
              return o;
            })(e, t, r, new U(n, e.children))
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: [] }
          );
        }
        if (
          0 === n.length &&
          (function LP(e, t, n) {
            return n.some((r) => wa(e, t, r));
          })(e, n, r)
        ) {
          const s = new U(
            e.segments,
            (function PP(e, t, n, r, o, i) {
              const s = {};
              for (const a of r)
                if (wa(e, n, a) && !o[St(a)]) {
                  const u = new U([], {});
                  (u._sourceSegment = e),
                    (u._segmentIndexShift =
                      "legacy" === i ? e.segments.length : t.length),
                    (s[St(a)] = u);
                }
              return { ...o, ...s };
            })(e, t, n, r, e.children, o)
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: n }
          );
        }
        const i = new U(e.segments, e.children);
        return (
          (i._sourceSegment = e),
          (i._segmentIndexShift = t.length),
          { segmentGroup: i, slicedSegments: n }
        );
      }
      function wa(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      function DD(e, t, n, r) {
        return (
          !!(St(e) === r || (r !== H && wa(t, n, e))) &&
          ("**" === e.path || kd(t, e, n).matched)
        );
      }
      function CD(e, t, n) {
        return 0 === t.length && !e.children[n];
      }
      const Ea = !1;
      class ba {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class wD {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function Ei(e) {
        return li(new ba(e));
      }
      function ED(e) {
        return li(new wD(e));
      }
      class HP {
        constructor(t, n, r, o, i) {
          (this.injector = t),
            (this.configLoader = n),
            (this.urlSerializer = r),
            (this.urlTree = o),
            (this.config = i),
            (this.allowRedirects = !0);
        }
        apply() {
          const t = Ca(this.urlTree.root, [], [], this.config).segmentGroup,
            n = new U(t.segments, t.children);
          return this.expandSegmentGroup(this.injector, this.config, n, H)
            .pipe(
              $((i) =>
                this.createUrlTree(
                  ga(i),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              kn((i) => {
                if (i instanceof wD)
                  return (this.allowRedirects = !1), this.match(i.urlTree);
                throw i instanceof ba ? this.noMatchError(i) : i;
              })
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.injector, this.config, t.root, H)
            .pipe(
              $((o) => this.createUrlTree(ga(o), t.queryParams, t.fragment))
            )
            .pipe(
              kn((o) => {
                throw o instanceof ba ? this.noMatchError(o) : o;
              })
            );
        }
        noMatchError(t) {
          return new C(4002, Ea);
        }
        createUrlTree(t, n, r) {
          const o = _d(t);
          return new ir(o, n, r);
        }
        expandSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, n, r).pipe($((i) => new U([], i)))
            : this.expandSegment(t, r, n, r.segments, o, !0);
        }
        expandChildren(t, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return _e(o).pipe(
            On((i) => {
              const s = r.children[i],
                a = mD(n, i);
              return this.expandSegmentGroup(t, a, s, i).pipe(
                $((u) => ({ segment: u, outlet: i }))
              );
            }),
            L_((i, s) => ((i[s.outlet] = s.segment), i), {}),
            V_()
          );
        }
        expandSegment(t, n, r, o, i, s) {
          return _e(r).pipe(
            On((a) =>
              this.expandSegmentAgainstRoute(t, n, r, a, o, i, s).pipe(
                kn((l) => {
                  if (l instanceof ba) return A(null);
                  throw l;
                })
              )
            ),
            Pn((a) => !!a),
            kn((a, u) => {
              if (Pd(a)) return CD(n, o, i) ? A(new U([], {})) : Ei(n);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(t, n, r, o, i, s, a) {
          return DD(o, n, i, s)
            ? void 0 === o.redirectTo
              ? this.matchSegmentAgainstRoute(t, n, o, i, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s)
              : Ei(n)
            : Ei(n);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
          const i = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? ED(i)
            : this.lineralizeSegments(r, i).pipe(
                Pe((s) => {
                  const a = new U(s, {});
                  return this.expandSegment(t, a, n, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: u,
            remainingSegments: l,
            positionalParamSegments: c,
          } = kd(n, o, i);
          if (!a) return Ei(n);
          const d = this.applyRedirectCommands(u, o.redirectTo, c);
          return o.redirectTo.startsWith("/")
            ? ED(d)
            : this.lineralizeSegments(o, d).pipe(
                Pe((f) => this.expandSegment(t, n, r, f.concat(l), s, !1))
              );
        }
        matchSegmentAgainstRoute(t, n, r, o, i) {
          return "**" === r.path
            ? ((t = gD(r, t)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? A({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                      })
                    : this.configLoader.loadChildren(t, r)
                  ).pipe(
                    $(
                      (a) => (
                        (r._loadedRoutes = a.routes),
                        (r._loadedInjector = a.injector),
                        new U(o, {})
                      )
                    )
                  )
                : A(new U(o, {})))
            : _D(n, r, o, t).pipe(
                Yt(
                  ({ matched: s, consumedSegments: a, remainingSegments: u }) =>
                    s
                      ? this.getChildConfig((t = r._injector ?? t), r, o).pipe(
                          Pe((c) => {
                            const d = c.injector ?? t,
                              f = c.routes,
                              { segmentGroup: h, slicedSegments: p } = Ca(
                                n,
                                a,
                                u,
                                f
                              ),
                              g = new U(h.segments, h.children);
                            if (0 === p.length && g.hasChildren())
                              return this.expandChildren(d, f, g).pipe(
                                $((m) => new U(a, m))
                              );
                            if (0 === f.length && 0 === p.length)
                              return A(new U(a, {}));
                            const y = St(r) === i;
                            return this.expandSegment(
                              d,
                              g,
                              f,
                              p,
                              y ? H : i,
                              !0
                            ).pipe(
                              $((w) => new U(a.concat(w.segments), w.children))
                            );
                          })
                        )
                      : Ei(n)
                )
              );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? A({ routes: n.children, injector: t })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? A({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function RP(e, t, n, r) {
                  const o = t.canLoad;
                  return void 0 === o || 0 === o.length
                    ? A(!0)
                    : A(
                        o.map((s) => {
                          const a = oo(s, e);
                          return Ln(
                            (function vP(e) {
                              return e && wi(e.canLoad);
                            })(a)
                              ? a.canLoad(t, n)
                              : e.runInContext(() => a(t, n))
                          );
                        })
                      ).pipe(io(), vD());
                })(t, n, r).pipe(
                  Pe((o) =>
                    o
                      ? this.configLoader.loadChildren(t, n).pipe(
                          Ue((i) => {
                            (n._loadedRoutes = i.routes),
                              (n._loadedInjector = i.injector);
                          })
                        )
                      : (function jP(e) {
                          return li(fD(Ea, 3));
                        })()
                  )
                )
            : A({ routes: [], injector: t });
        }
        lineralizeSegments(t, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return A(r);
            if (o.numberOfChildren > 1 || !o.children[H])
              return li(new C(4e3, Ea));
            o = o.children[H];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r
          );
        }
        applyRedirectCreateUrlTree(t, n, r, o) {
          const i = this.createSegmentGroup(t, n.root, r, o);
          return new ir(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Oe(t, (o, i) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, o) {
          const i = this.createSegments(t, n.segments, r, o);
          let s = {};
          return (
            Oe(n.children, (a, u) => {
              s[u] = this.createSegmentGroup(t, a, r, o);
            }),
            new U(i, s)
          );
        }
        createSegments(t, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(t, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(t, n, r) {
          const o = r[n.path.substring(1)];
          if (!o) throw new C(4001, Ea);
          return o;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === t.path) return n.splice(r), o;
            r++;
          }
          return t;
        }
      }
      class UP {}
      class WP {
        constructor(t, n, r, o, i, s, a, u) {
          (this.injector = t),
            (this.rootComponentType = n),
            (this.config = r),
            (this.urlTree = o),
            (this.url = i),
            (this.paramsInheritanceStrategy = s),
            (this.relativeLinkResolution = a),
            (this.urlSerializer = u);
        }
        recognize() {
          const t = Ca(
            this.urlTree.root,
            [],
            [],
            this.config.filter((n) => void 0 === n.redirectTo),
            this.relativeLinkResolution
          ).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            H
          ).pipe(
            $((n) => {
              if (null === n) return null;
              const r = new ya(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  H,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {}
                ),
                o = new Cn(r, n),
                i = new lD(this.url, o);
              return this.inheritParamsAndData(i._root), i;
            })
          );
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = uD(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, n, r)
            : this.processSegment(t, n, r, r.segments, o);
        }
        processChildren(t, n, r) {
          return _e(Object.keys(r.children)).pipe(
            On((o) => {
              const i = r.children[o],
                s = mD(n, o);
              return this.processSegmentGroup(t, s, i, o);
            }),
            L_((o, i) => (o && i ? (o.push(...i), o) : null)),
            (function fF(e, t = !1) {
              return Re((n, r) => {
                let o = 0;
                n.subscribe(
                  Se(r, (i) => {
                    const s = e(i, o++);
                    (s || t) && r.next(i), !s && r.complete();
                  })
                );
              });
            })((o) => null !== o),
            la(null),
            V_(),
            $((o) => {
              if (null === o) return null;
              const i = bD(o);
              return (
                (function qP(e) {
                  e.sort((t, n) =>
                    t.value.outlet === H
                      ? -1
                      : n.value.outlet === H
                      ? 1
                      : t.value.outlet.localeCompare(n.value.outlet)
                  );
                })(i),
                i
              );
            })
          );
        }
        processSegment(t, n, r, o, i) {
          return _e(n).pipe(
            On((s) =>
              this.processSegmentAgainstRoute(s._injector ?? t, s, r, o, i)
            ),
            Pn((s) => !!s),
            kn((s) => {
              if (Pd(s)) return CD(r, o, i) ? A([]) : A(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(t, n, r, o, i) {
          if (n.redirectTo || !DD(n, r, o, i)) return A(null);
          let s;
          if ("**" === n.path) {
            const a = o.length > 0 ? H_(o).parameters : {},
              u = SD(r) + o.length;
            s = A({
              snapshot: new ya(
                o,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                AD(n),
                St(n),
                n.component ?? n._loadedComponent ?? null,
                n,
                MD(r),
                u,
                TD(n),
                u
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = _D(r, n, o, t).pipe(
              $(
                ({
                  matched: a,
                  consumedSegments: u,
                  remainingSegments: l,
                  parameters: c,
                }) => {
                  if (!a) return null;
                  const d = SD(r) + u.length;
                  return {
                    snapshot: new ya(
                      u,
                      c,
                      Object.freeze({ ...this.urlTree.queryParams }),
                      this.urlTree.fragment,
                      AD(n),
                      St(n),
                      n.component ?? n._loadedComponent ?? null,
                      n,
                      MD(r),
                      d,
                      TD(n),
                      d
                    ),
                    consumedSegments: u,
                    remainingSegments: l,
                  };
                }
              )
            );
          return s.pipe(
            Yt((a) => {
              if (null === a) return A(null);
              const {
                snapshot: u,
                consumedSegments: l,
                remainingSegments: c,
              } = a;
              t = n._injector ?? t;
              const d = n._loadedInjector ?? t,
                f = (function ZP(e) {
                  return e.children
                    ? e.children
                    : e.loadChildren
                    ? e._loadedRoutes
                    : [];
                })(n),
                { segmentGroup: h, slicedSegments: p } = Ca(
                  r,
                  l,
                  c,
                  f.filter((y) => void 0 === y.redirectTo),
                  this.relativeLinkResolution
                );
              if (0 === p.length && h.hasChildren())
                return this.processChildren(d, f, h).pipe(
                  $((y) => (null === y ? null : [new Cn(u, y)]))
                );
              if (0 === f.length && 0 === p.length) return A([new Cn(u, [])]);
              const g = St(n) === i;
              return this.processSegment(d, f, h, p, g ? H : i).pipe(
                $((y) => (null === y ? null : [new Cn(u, y)]))
              );
            })
          );
        }
      }
      function KP(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function bD(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!KP(r)) {
            t.push(r);
            continue;
          }
          const o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r);
        }
        for (const r of n) {
          const o = bD(r.children);
          t.push(new Cn(r.value, o));
        }
        return t.filter((r) => !n.has(r));
      }
      function MD(e) {
        let t = e;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function SD(e) {
        let t = e,
          n = t._segmentIndexShift ?? 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment), (n += t._segmentIndexShift ?? 0);
        return n - 1;
      }
      function AD(e) {
        return e.data || {};
      }
      function TD(e) {
        return e.resolve || {};
      }
      function xD(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function Ld(e) {
        return Yt((t) => {
          const n = e(t);
          return n ? _e(n).pipe($(() => t)) : A(t);
        });
      }
      let ND = (() => {
          class e {
            buildTitle(n) {
              let r,
                o = n.root;
              for (; void 0 !== o; )
                (r = this.getResolvedTitleForRoute(o) ?? r),
                  (o = o.children.find((i) => i.outlet === H));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[di];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = x({
              token: e,
              factory: function () {
                return me(RD);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        RD = (() => {
          class e extends ND {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(S_));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      class rO {}
      class iO extends class oO {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      } {}
      const Sa = new I("", { providedIn: "root", factory: () => ({}) }),
        Vd = new I("ROUTES");
      let jd = (() => {
        class e {
          constructor(n, r) {
            (this.injector = n),
              (this.compiler = r),
              (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap());
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return A(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = Ln(n.loadComponent()).pipe(
                Ue((i) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = i);
                }),
                gd(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              o = new O_(r, () => new Ht()).pipe(hd());
            return this.componentLoaders.set(n, o), o;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return A({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const i = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                $((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let u,
                    l,
                    c = !1;
                  Array.isArray(a)
                    ? (l = a)
                    : ((u = a.create(n).injector),
                      (l = B_(u.get(Vd, [], N.Self | N.Optional))));
                  return { routes: l.map(Fd), injector: u };
                }),
                gd(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new O_(i, () => new Ht()).pipe(hd());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return Ln(n()).pipe(
              Pe((r) =>
                r instanceof wy || Array.isArray(r)
                  ? A(r)
                  : _e(this.compiler.compileModuleAsync(r))
              )
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(pt), M(Ac));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class aO {}
      class uO {
        shouldProcessUrl(t) {
          return !0;
        }
        extract(t) {
          return t;
        }
        merge(t, n) {
          return t;
        }
      }
      function lO(e) {
        throw e;
      }
      function cO(e, t, n) {
        return t.parse("/");
      }
      const dO = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        fO = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      function PD() {
        const e = me(q_),
          t = me(vi),
          n = me(Uc),
          r = me(pt),
          o = me(Ac),
          i = me(Vd, { optional: !0 }) ?? [],
          s = me(Sa, { optional: !0 }) ?? {},
          a = me(RD),
          u = me(ND, { optional: !0 }),
          l = me(aO, { optional: !0 }),
          c = me(rO, { optional: !0 }),
          d = new be(null, e, t, n, r, o, B_(i));
        return (
          l && (d.urlHandlingStrategy = l),
          c && (d.routeReuseStrategy = c),
          (d.titleStrategy = u ?? a),
          (function hO(e, t) {
            e.errorHandler && (t.errorHandler = e.errorHandler),
              e.malformedUriErrorHandler &&
                (t.malformedUriErrorHandler = e.malformedUriErrorHandler),
              e.onSameUrlNavigation &&
                (t.onSameUrlNavigation = e.onSameUrlNavigation),
              e.paramsInheritanceStrategy &&
                (t.paramsInheritanceStrategy = e.paramsInheritanceStrategy),
              e.relativeLinkResolution &&
                (t.relativeLinkResolution = e.relativeLinkResolution),
              e.urlUpdateStrategy &&
                (t.urlUpdateStrategy = e.urlUpdateStrategy),
              e.canceledNavigationResolution &&
                (t.canceledNavigationResolution =
                  e.canceledNavigationResolution);
          })(s, d),
          d
        );
      }
      let be = (() => {
        class e {
          constructor(n, r, o, i, s, a, u) {
            (this.rootComponentType = n),
              (this.urlSerializer = r),
              (this.rootContexts = o),
              (this.location = i),
              (this.config = u),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new Ht()),
              (this.errorHandler = lO),
              (this.malformedUriErrorHandler = cO),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.afterPreactivation = () => A(void 0)),
              (this.urlHandlingStrategy = new uO()),
              (this.routeReuseStrategy = new iO()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.configLoader = s.get(jd)),
              (this.configLoader.onLoadEndListener = (f) =>
                this.triggerEvent(new ZF(f))),
              (this.configLoader.onLoadStartListener = (f) =>
                this.triggerEvent(new qF(f))),
              (this.ngModule = s.get(nr)),
              (this.console = s.get(WT));
            const d = s.get(xe);
            (this.isNgZoneEnabled = d instanceof xe && xe.isInAngularZone()),
              this.resetConfig(u),
              (this.currentUrlTree = (function yF() {
                return new ir(new U([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = aD(
                this.currentUrlTree,
                this.rootComponentType
              )),
              (this.transitions = new Bt({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            return this.location.getState()?.ɵrouterPageId;
          }
          setupNavigations(n) {
            const r = this.events;
            return n.pipe(
              _n((o) => 0 !== o.id),
              $((o) => ({
                ...o,
                extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
              })),
              Yt((o) => {
                let i = !1,
                  s = !1;
                return A(o).pipe(
                  Ue((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.rawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? {
                            ...this.lastSuccessfulNavigation,
                            previousNavigation: null,
                          }
                        : null,
                    };
                  }),
                  Yt((a) => {
                    const u = this.browserUrlTree.toString(),
                      l =
                        !this.navigated ||
                        a.extractedUrl.toString() !== u ||
                        u !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || l) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        OD(a.source) && (this.browserUrlTree = a.extractedUrl),
                        A(a).pipe(
                          Yt((d) => {
                            const f = this.transitions.getValue();
                            return (
                              r.next(
                                new Ed(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState
                                )
                              ),
                              f !== this.transitions.getValue()
                                ? tn
                                : Promise.resolve(d)
                            );
                          }),
                          (function $P(e, t, n, r) {
                            return Yt((o) =>
                              (function BP(e, t, n, r, o) {
                                return new HP(e, t, n, r, o).apply();
                              })(e, t, n, o.extractedUrl, r).pipe(
                                $((i) => ({ ...o, urlAfterRedirects: i }))
                              )
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config
                          ),
                          Ue((d) => {
                            (this.currentNavigation = {
                              ...this.currentNavigation,
                              finalUrl: d.urlAfterRedirects,
                            }),
                              (o.urlAfterRedirects = d.urlAfterRedirects);
                          }),
                          (function YP(e, t, n, r, o, i) {
                            return Pe((s) =>
                              (function zP(
                                e,
                                t,
                                n,
                                r,
                                o,
                                i,
                                s = "emptyOnly",
                                a = "legacy"
                              ) {
                                return new WP(e, t, n, r, o, s, a, i)
                                  .recognize()
                                  .pipe(
                                    Yt((u) =>
                                      null === u
                                        ? (function GP(e) {
                                            return new ge((t) => t.error(e));
                                          })(new UP())
                                        : A(u)
                                    )
                                  );
                              })(
                                e,
                                t,
                                n,
                                s.urlAfterRedirects,
                                r.serialize(s.urlAfterRedirects),
                                r,
                                o,
                                i
                              ).pipe($((a) => ({ ...s, targetSnapshot: a })))
                            );
                          })(
                            this.ngModule.injector,
                            this.rootComponentType,
                            this.config,
                            this.urlSerializer,
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution
                          ),
                          Ue((d) => {
                            if (
                              ((o.targetSnapshot = d.targetSnapshot),
                              "eager" === this.urlUpdateStrategy)
                            ) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl
                                );
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new $F(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            r.next(f);
                          })
                        )
                      );
                    if (
                      l &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: f,
                          extractedUrl: h,
                          source: p,
                          restoredState: g,
                          extras: y,
                        } = a,
                        D = new Ed(f, this.serializeUrl(h), p, g);
                      r.next(D);
                      const w = aD(h, this.rootComponentType).snapshot;
                      return A(
                        (o = {
                          ...a,
                          targetSnapshot: w,
                          urlAfterRedirects: h,
                          extras: {
                            ...y,
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          },
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), tn;
                  }),
                  Ue((a) => {
                    const u = new UF(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(u);
                  }),
                  $(
                    (a) =>
                      (o = {
                        ...a,
                        guards: hP(
                          a.targetSnapshot,
                          a.currentSnapshot,
                          this.rootContexts
                        ),
                      })
                  ),
                  (function bP(e, t) {
                    return Pe((n) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: o,
                        guards: {
                          canActivateChecks: i,
                          canDeactivateChecks: s,
                        },
                      } = n;
                      return 0 === s.length && 0 === i.length
                        ? A({ ...n, guardsResult: !0 })
                        : (function MP(e, t, n, r) {
                            return _e(e).pipe(
                              Pe((o) =>
                                (function NP(e, t, n, r, o) {
                                  const i =
                                    t && t.routeConfig
                                      ? t.routeConfig.canDeactivate
                                      : null;
                                  return i && 0 !== i.length
                                    ? A(
                                        i.map((a) => {
                                          const u = _i(t) ?? o,
                                            l = oo(a, u);
                                          return Ln(
                                            (function CP(e) {
                                              return e && wi(e.canDeactivate);
                                            })(l)
                                              ? l.canDeactivate(e, t, n, r)
                                              : u.runInContext(() =>
                                                  l(e, t, n, r)
                                                )
                                          ).pipe(Pn());
                                        })
                                      ).pipe(io())
                                    : A(!0);
                                })(o.component, o.route, n, t, r)
                              ),
                              Pn((o) => !0 !== o, !0)
                            );
                          })(s, r, o, e).pipe(
                            Pe((a) =>
                              a &&
                              (function yP(e) {
                                return "boolean" == typeof e;
                              })(a)
                                ? (function SP(e, t, n, r) {
                                    return _e(t).pipe(
                                      On((o) =>
                                        fd(
                                          (function AP(e, t) {
                                            return (
                                              null !== e && t && t(new KF(e)),
                                              A(!0)
                                            );
                                          })(o.route.parent, r),
                                          (function IP(e, t) {
                                            return (
                                              null !== e && t && t(new YF(e)),
                                              A(!0)
                                            );
                                          })(o.route, r),
                                          (function xP(e, t, n) {
                                            const r = t[t.length - 1],
                                              i = t
                                                .slice(0, t.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function pP(e) {
                                                    const t = e.routeConfig
                                                      ? e.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return t && 0 !== t.length
                                                      ? { node: e, guards: t }
                                                      : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  P_(() =>
                                                    A(
                                                      s.guards.map((u) => {
                                                        const l =
                                                            _i(s.node) ?? n,
                                                          c = oo(u, l);
                                                        return Ln(
                                                          (function DP(e) {
                                                            return (
                                                              e &&
                                                              wi(
                                                                e.canActivateChild
                                                              )
                                                            );
                                                          })(c)
                                                            ? c.canActivateChild(
                                                                r,
                                                                e
                                                              )
                                                            : l.runInContext(
                                                                () => c(r, e)
                                                              )
                                                        ).pipe(Pn());
                                                      })
                                                    ).pipe(io())
                                                  )
                                                );
                                            return A(i).pipe(io());
                                          })(e, o.path, n),
                                          (function TP(e, t, n) {
                                            const r = t.routeConfig
                                              ? t.routeConfig.canActivate
                                              : null;
                                            if (!r || 0 === r.length)
                                              return A(!0);
                                            const o = r.map((i) =>
                                              P_(() => {
                                                const s = _i(t) ?? n,
                                                  a = oo(i, s);
                                                return Ln(
                                                  (function _P(e) {
                                                    return (
                                                      e && wi(e.canActivate)
                                                    );
                                                  })(a)
                                                    ? a.canActivate(t, e)
                                                    : s.runInContext(() =>
                                                        a(t, e)
                                                      )
                                                ).pipe(Pn());
                                              })
                                            );
                                            return A(o).pipe(io());
                                          })(e, o.route, n)
                                        )
                                      ),
                                      Pn((o) => !0 !== o, !0)
                                    );
                                  })(r, i, e, t)
                                : A(a)
                            ),
                            $((a) => ({ ...n, guardsResult: a }))
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  Ue((a) => {
                    if (((o.guardsResult = a.guardsResult), ar(a.guardsResult)))
                      throw dD(0, a.guardsResult);
                    const u = new GF(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(u);
                  }),
                  _n(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, "", 3),
                      !1)
                  ),
                  Ld((a) => {
                    if (a.guards.canActivateChecks.length)
                      return A(a).pipe(
                        Ue((u) => {
                          const l = new zF(
                            u.id,
                            this.serializeUrl(u.extractedUrl),
                            this.serializeUrl(u.urlAfterRedirects),
                            u.targetSnapshot
                          );
                          this.triggerEvent(l);
                        }),
                        Yt((u) => {
                          let l = !1;
                          return A(u).pipe(
                            (function JP(e, t) {
                              return Pe((n) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: o },
                                } = n;
                                if (!o.length) return A(n);
                                let i = 0;
                                return _e(o).pipe(
                                  On((s) =>
                                    (function XP(e, t, n, r) {
                                      const o = e.routeConfig,
                                        i = e._resolve;
                                      return (
                                        void 0 !== o?.title &&
                                          !xD(o) &&
                                          (i[di] = o.title),
                                        (function eO(e, t, n, r) {
                                          const o = (function tO(e) {
                                            return [
                                              ...Object.keys(e),
                                              ...Object.getOwnPropertySymbols(
                                                e
                                              ),
                                            ];
                                          })(e);
                                          if (0 === o.length) return A({});
                                          const i = {};
                                          return _e(o).pipe(
                                            Pe((s) =>
                                              (function nO(e, t, n, r) {
                                                const o = _i(t) ?? r,
                                                  i = oo(e, o);
                                                return Ln(
                                                  i.resolve
                                                    ? i.resolve(t, n)
                                                    : o.runInContext(() =>
                                                        i(t, n)
                                                      )
                                                );
                                              })(e[s], t, n, r).pipe(
                                                Pn(),
                                                Ue((a) => {
                                                  i[s] = a;
                                                })
                                              )
                                            ),
                                            pd(1),
                                            (function hF(e) {
                                              return $(() => e);
                                            })(i),
                                            kn((s) => (Pd(s) ? tn : li(s)))
                                          );
                                        })(i, e, t, r).pipe(
                                          $(
                                            (s) => (
                                              (e._resolvedData = s),
                                              (e.data = uD(e, n).resolve),
                                              o &&
                                                xD(o) &&
                                                (e.data[di] = o.title),
                                              null
                                            )
                                          )
                                        )
                                      );
                                    })(s.route, r, e, t)
                                  ),
                                  Ue(() => i++),
                                  pd(1),
                                  Pe((s) => (i === o.length ? A(n) : tn))
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector
                            ),
                            Ue({
                              next: () => (l = !0),
                              complete: () => {
                                l ||
                                  (this.restoreHistory(u),
                                  this.cancelNavigationTransition(u, "", 2));
                              },
                            })
                          );
                        }),
                        Ue((u) => {
                          const l = new WF(
                            u.id,
                            this.serializeUrl(u.extractedUrl),
                            this.serializeUrl(u.urlAfterRedirects),
                            u.targetSnapshot
                          );
                          this.triggerEvent(l);
                        })
                      );
                  }),
                  Ld((a) => {
                    const u = (l) => {
                      const c = [];
                      l.routeConfig?.loadComponent &&
                        !l.routeConfig._loadedComponent &&
                        c.push(
                          this.configLoader.loadComponent(l.routeConfig).pipe(
                            Ue((d) => {
                              l.component = d;
                            }),
                            $(() => {})
                          )
                        );
                      for (const d of l.children) c.push(...u(d));
                      return c;
                    };
                    return R_(u(a.targetSnapshot.root)).pipe(la(), ci(1));
                  }),
                  Ld(() => this.afterPreactivation()),
                  $((a) => {
                    const u = (function nP(e, t, n) {
                      const r = yi(e, t._root, n ? n._root : void 0);
                      return new sD(r, t);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState
                    );
                    return (o = { ...a, targetRouterState: u });
                  }),
                  Ue((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, t, n) =>
                    $(
                      (r) => (
                        new fP(
                          t,
                          r.targetRouterState,
                          r.currentRouterState,
                          n
                        ).activate(e),
                        r
                      )
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a)
                  ),
                  Ue({
                    next() {
                      i = !0;
                    },
                    complete() {
                      i = !0;
                    },
                  }),
                  gd(() => {
                    i || s || this.cancelNavigationTransition(o, "", 1),
                      this.currentNavigation?.id === o.id &&
                        (this.currentNavigation = null);
                  }),
                  kn((a) => {
                    if (((s = !0), pD(a))) {
                      hD(a) ||
                        ((this.navigated = !0), this.restoreHistory(o, !0));
                      const u = new ma(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a.message,
                        a.cancellationCode
                      );
                      if ((r.next(u), hD(a))) {
                        const l = this.urlHandlingStrategy.merge(
                            a.url,
                            this.rawUrlTree
                          ),
                          c = {
                            skipLocationChange: o.extras.skipLocationChange,
                            replaceUrl:
                              "eager" === this.urlUpdateStrategy ||
                              OD(o.source),
                          };
                        this.scheduleNavigation(l, "imperative", null, c, {
                          resolve: o.resolve,
                          reject: o.reject,
                          promise: o.promise,
                        });
                      } else o.resolve(!1);
                    } else {
                      this.restoreHistory(o, !0);
                      const u = new rD(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a,
                        o.targetSnapshot ?? void 0
                      );
                      r.next(u);
                      try {
                        o.resolve(this.errorHandler(a));
                      } catch (l) {
                        o.reject(l);
                      }
                    }
                    return tn;
                  })
                );
              })
            );
          }
          resetRootComponentType(n) {
            (this.rootComponentType = n),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(n) {
            this.transitions.next({ ...this.transitions.value, ...n });
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    const o = { replaceUrl: !0 },
                      i = n.state?.navigationId ? n.state : null;
                    if (i) {
                      const a = { ...i };
                      delete a.navigationId,
                        delete a.ɵrouterPageId,
                        0 !== Object.keys(a).length && (o.state = a);
                    }
                    const s = this.parseUrl(n.url);
                    this.scheduleNavigation(s, r, i, o);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(n) {
            this.events.next(n);
          }
          resetConfig(n) {
            (this.config = n.map(Fd)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: u,
              } = r,
              l = o || this.routerState.root,
              c = u ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case "merge":
                d = { ...this.currentUrlTree.queryParams, ...i };
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = i || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              kF(l, this.currentUrlTree, n, d, c ?? null)
            );
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const o = ar(n) ? n : this.parseUrl(n),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, "imperative", null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function pO(e) {
                for (let t = 0; t < e.length; t++) {
                  if (null == e[t]) throw new C(4008, false);
                }
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let o;
            if (((o = !0 === r ? { ...dO } : !1 === r ? { ...fO } : r), ar(n)))
              return U_(this.currentUrlTree, n, o);
            const i = this.parseUrl(n);
            return U_(this.currentUrlTree, i, o);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, o) => {
              const i = n[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (n) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = n.id),
                  (this.currentPageId = n.targetPageId),
                  this.events.next(
                    new ur(
                      n.id,
                      this.serializeUrl(n.extractedUrl),
                      this.serializeUrl(this.currentUrlTree)
                    )
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  this.titleStrategy?.updateTitle(this.routerState.snapshot),
                  n.resolve(!0);
              },
              (n) => {
                this.console.warn(`Unhandled Navigation Error: ${n}`);
              }
            );
          }
          scheduleNavigation(n, r, o, i, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, u, l;
            s
              ? ((a = s.resolve), (u = s.reject), (l = s.promise))
              : (l = new Promise((f, h) => {
                  (a = f), (u = h);
                }));
            const c = ++this.navigationId;
            let d;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (o = this.location.getState()),
                  (d =
                    o && o.ɵrouterPageId
                      ? o.ɵrouterPageId
                      : i.replaceUrl || i.skipLocationChange
                      ? this.browserPageId ?? 0
                      : (this.browserPageId ?? 0) + 1))
                : (d = 0),
              this.setTransition({
                id: c,
                targetPageId: d,
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: n,
                extras: i,
                resolve: a,
                reject: u,
                promise: l,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              l.catch((f) => Promise.reject(f))
            );
          }
          setBrowserUrl(n, r) {
            const o = this.urlSerializer.serialize(n),
              i = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, r.targetPageId),
              };
            this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl
              ? this.location.replaceState(o, "", i)
              : this.location.go(o, "", i);
          }
          restoreHistory(n, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const o = this.currentPageId - n.targetPageId;
              ("popstate" !== n.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !== this.currentNavigation?.finalUrl) ||
              0 === o
                ? this.currentUrlTree === this.currentNavigation?.finalUrl &&
                  0 === o &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(o);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          cancelNavigationTransition(n, r, o) {
            const i = new ma(n.id, this.serializeUrl(n.extractedUrl), r, o);
            this.triggerEvent(i), n.resolve(!1);
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            bl();
          }),
          (e.ɵprov = x({
            token: e,
            factory: function () {
              return PD();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      function OD(e) {
        return "imperative" !== e;
      }
      let Aa = (() => {
        class e {
          constructor(n, r, o) {
            (this.router = n),
              (this.route = r),
              (this.locationStrategy = o),
              (this._preserveFragment = !1),
              (this._skipLocationChange = !1),
              (this._replaceUrl = !1),
              (this.commands = null),
              (this.href = null),
              (this.onChanges = new Ht()),
              (this.subscription = n.events.subscribe((i) => {
                i instanceof ur && this.updateTargetUrlAndHref();
              }));
          }
          set preserveFragment(n) {
            this._preserveFragment = mn(n);
          }
          get preserveFragment() {
            return this._preserveFragment;
          }
          set skipLocationChange(n) {
            this._skipLocationChange = mn(n);
          }
          get skipLocationChange() {
            return this._skipLocationChange;
          }
          set replaceUrl(n) {
            this._replaceUrl = mn(n);
          }
          get replaceUrl() {
            return this._replaceUrl;
          }
          set routerLink(n) {
            this.commands = null != n ? (Array.isArray(n) ? n : [n]) : null;
          }
          ngOnChanges(n) {
            this.updateTargetUrlAndHref(), this.onChanges.next(this);
          }
          ngOnDestroy() {
            this.subscription.unsubscribe();
          }
          onClick(n, r, o, i, s) {
            return (
              !!(
                0 !== n ||
                r ||
                o ||
                i ||
                s ||
                ("string" == typeof this.target && "_self" != this.target) ||
                null === this.urlTree
              ) ||
              (this.router.navigateByUrl(this.urlTree, {
                skipLocationChange: this.skipLocationChange,
                replaceUrl: this.replaceUrl,
                state: this.state,
              }),
              !1)
            );
          }
          updateTargetUrlAndHref() {
            this.href =
              null !== this.urlTree
                ? this.locationStrategy.prepareExternalUrl(
                    this.router.serializeUrl(this.urlTree)
                  )
                : null;
          }
          get urlTree() {
            return null === this.commands
              ? null
              : this.router.createUrlTree(this.commands, {
                  relativeTo:
                    void 0 !== this.relativeTo ? this.relativeTo : this.route,
                  queryParams: this.queryParams,
                  fragment: this.fragment,
                  queryParamsHandling: this.queryParamsHandling,
                  preserveFragment: this.preserveFragment,
                });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(be), _(lr), _(or));
          }),
          (e.ɵdir = P({
            type: e,
            selectors: [
              ["a", "routerLink", ""],
              ["area", "routerLink", ""],
            ],
            hostVars: 2,
            hostBindings: function (n, r) {
              1 & n &&
                He("click", function (i) {
                  return r.onClick(
                    i.button,
                    i.ctrlKey,
                    i.shiftKey,
                    i.altKey,
                    i.metaKey
                  );
                }),
                2 & n && qt("target", r.target)("href", r.href, Gu);
            },
            inputs: {
              target: "target",
              queryParams: "queryParams",
              fragment: "fragment",
              queryParamsHandling: "queryParamsHandling",
              state: "state",
              relativeTo: "relativeTo",
              preserveFragment: "preserveFragment",
              skipLocationChange: "skipLocationChange",
              replaceUrl: "replaceUrl",
              routerLink: "routerLink",
            },
            standalone: !0,
            features: [Dt],
          })),
          e
        );
      })();
      class kD {}
      let yO = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.router = n),
              (this.injector = o),
              (this.preloadingStrategy = i),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                _n((n) => n instanceof ur),
                On(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const o = [];
            for (const i of r) {
              i.providers &&
                !i._injector &&
                (i._injector = Ps(i.providers, n, `Route: ${i.path}`));
              const s = i._injector ?? n,
                a = i._loadedInjector ?? s;
              (i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
              (i.loadComponent && !i._loadedComponent)
                ? o.push(this.preloadConfig(s, i))
                : (i.children || i._loadedRoutes) &&
                  o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
            }
            return _e(o).pipe(hr());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let o;
              o =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : A(null);
              const i = o.pipe(
                Pe((s) =>
                  null === s
                    ? A(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? _e([i, this.loader.loadComponent(r)]).pipe(hr())
                : i;
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(be), M(Ac), M(Tn), M(kD), M(jd));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Hd = new I("");
      let LD = (() => {
        class e {
          constructor(n, r, o = {}) {
            (this.router = n),
              (this.viewportScroller = r),
              (this.options = o),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (o.scrollPositionRestoration =
                o.scrollPositionRestoration || "disabled"),
              (o.anchorScrolling = o.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.router.events.subscribe((n) => {
              n instanceof Ed
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof ur &&
                  ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.router.parseUrl(n.urlAfterRedirects).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.router.events.subscribe((n) => {
              n instanceof oD &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.router.triggerEvent(
              new oD(
                n,
                "popstate" === this.lastSource
                  ? this.store[this.restoredId]
                  : null,
                r
              )
            );
          }
          ngOnDestroy() {
            this.routerEventsSubscription &&
              this.routerEventsSubscription.unsubscribe(),
              this.scrollEventsSubscription &&
                this.scrollEventsSubscription.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            bl();
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function so(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function $d(e) {
        return [{ provide: Vd, multi: !0, useValue: e }];
      }
      function jD() {
        const e = me(pt);
        return (t) => {
          const n = e.get(Hs);
          if (t !== n.components[0]) return;
          const r = e.get(be),
            o = e.get(BD);
          1 === e.get(Ud) && r.initialNavigation(),
            e.get(HD, null, N.Optional)?.setUpPreloading(),
            e.get(Hd, null, N.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            o.next(),
            o.complete();
        };
      }
      const BD = new I("", { factory: () => new Ht() }),
        Ud = new I("", { providedIn: "root", factory: () => 1 });
      const HD = new I("");
      function CO(e) {
        return so(0, [
          { provide: HD, useExisting: yO },
          { provide: kD, useExisting: e },
        ]);
      }
      const $D = new I("ROUTER_FORROOT_GUARD"),
        wO = [
          Uc,
          { provide: q_, useClass: yd },
          { provide: be, useFactory: PD },
          vi,
          {
            provide: lr,
            useFactory: function VD(e) {
              return e.routerState.root;
            },
            deps: [be],
          },
          jd,
        ];
      function EO() {
        return new yv("Router", be);
      }
      let UD = (() => {
        class e {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                wO,
                [],
                $d(n),
                {
                  provide: $D,
                  useFactory: IO,
                  deps: [[be, new xo(), new No()]],
                },
                { provide: Sa, useValue: r || {} },
                r?.useHash
                  ? { provide: or, useClass: Px }
                  : { provide: or, useClass: $v },
                {
                  provide: Hd,
                  useFactory: () => {
                    const e = me(be),
                      t = me(nR),
                      n = me(Sa);
                    return (
                      n.scrollOffset && t.setOffset(n.scrollOffset),
                      new LD(e, t, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? CO(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: yv, multi: !0, useFactory: EO },
                r?.initialNavigation ? AO(r) : [],
                [
                  { provide: GD, useFactory: jD },
                  { provide: cv, multi: !0, useExisting: GD },
                ],
              ],
            };
          }
          static forChild(n) {
            return { ngModule: e, providers: [$d(n)] };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M($D, 8));
          }),
          (e.ɵmod = at({ type: e })),
          (e.ɵinj = et({ imports: [Nd] })),
          e
        );
      })();
      function IO(e) {
        return "guarded";
      }
      function AO(e) {
        return [
          "disabled" === e.initialNavigation
            ? so(3, [
                {
                  provide: Vs,
                  multi: !0,
                  useFactory: () => {
                    const t = me(be);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Ud, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? so(2, [
                { provide: Ud, useValue: 0 },
                {
                  provide: Vs,
                  multi: !0,
                  deps: [pt],
                  useFactory: (t) => {
                    const n = t.get(Rx, Promise.resolve());
                    let r = !1;
                    return () =>
                      n.then(
                        () =>
                          new Promise((i) => {
                            const s = t.get(be),
                              a = t.get(BD);
                            (function o(i) {
                              t.get(be)
                                .events.pipe(
                                  _n(
                                    (a) =>
                                      a instanceof ur ||
                                      a instanceof ma ||
                                      a instanceof rD
                                  ),
                                  $(
                                    (a) =>
                                      a instanceof ur ||
                                      (a instanceof ma &&
                                        (0 === a.code || 1 === a.code) &&
                                        null)
                                  ),
                                  _n((a) => null !== a),
                                  ci(1)
                                )
                                .subscribe(() => {
                                  i();
                                });
                            })(() => {
                              i(!0), (r = !0);
                            }),
                              (s.afterPreactivation = () => (
                                i(!0), r || a.closed ? A(void 0) : a
                              )),
                              s.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const GD = new I("");
      class WD {}
      class qD {}
      class wn {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? (this.lazyInit =
                  "string" == typeof t
                    ? () => {
                        (this.headers = new Map()),
                          t.split("\n").forEach((n) => {
                            const r = n.indexOf(":");
                            if (r > 0) {
                              const o = n.slice(0, r),
                                i = o.toLowerCase(),
                                s = n.slice(r + 1).trim();
                              this.maybeSetNormalizedName(o, i),
                                this.headers.has(i)
                                  ? this.headers.get(i).push(s)
                                  : this.headers.set(i, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(t).forEach((n) => {
                            let r = t[n];
                            const o = n.toLowerCase();
                            "string" == typeof r && (r = [r]),
                              r.length > 0 &&
                                (this.headers.set(o, r),
                                this.maybeSetNormalizedName(n, o));
                          });
                      })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof wn
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((n) => {
              this.headers.set(n, t.headers.get(n)),
                this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new wn();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof wn
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              o.push(...r), this.headers.set(n, o);
              break;
            case "d":
              const i = t.value;
              if (i) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              t(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class xO {
        encodeKey(t) {
          return ZD(t);
        }
        encodeValue(t) {
          return ZD(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const RO = /%(\d[a-f0-9])/gi,
        FO = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function ZD(e) {
        return encodeURIComponent(e).replace(RO, (t, n) => FO[n] ?? t);
      }
      function Na(e) {
        return `${e}`;
      }
      class Vn {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new xO()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function NO(e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((o) => {
                      const i = o.indexOf("="),
                        [s, a] =
                          -1 == i
                            ? [t.decodeKey(o), ""]
                            : [
                                t.decodeKey(o.slice(0, i)),
                                t.decodeValue(o.slice(i + 1)),
                              ],
                        u = n.get(s) || [];
                      u.push(a), n.set(s, u);
                    }),
                n
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((n) => {
                  const r = t.fromObject[n],
                    o = Array.isArray(r) ? r.map(Na) : [Na(r)];
                  this.map.set(n, o);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const n = this.map.get(t);
          return n ? n[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, n) {
          return this.clone({ param: t, value: n, op: "a" });
        }
        appendAll(t) {
          const n = [];
          return (
            Object.keys(t).forEach((r) => {
              const o = t[r];
              Array.isArray(o)
                ? o.forEach((i) => {
                    n.push({ param: r, value: i, op: "a" });
                  })
                : n.push({ param: r, value: o, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(t, n) {
          return this.clone({ param: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ param: t, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const n = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const n = new Vn({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(t)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    n.push(Na(t.value)), this.map.set(t.param, n);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const o = r.indexOf(Na(t.value));
                      -1 !== o && r.splice(o, 1),
                        r.length > 0
                          ? this.map.set(t.param, r)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class PO {
        constructor() {
          this.map = new Map();
        }
        set(t, n) {
          return this.map.set(t, n), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function KD(e) {
        return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
      }
      function QD(e) {
        return typeof Blob < "u" && e instanceof Blob;
      }
      function YD(e) {
        return typeof FormData < "u" && e instanceof FormData;
      }
      class bi {
        constructor(t, n, r, o) {
          let i;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function OO(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || o
              ? ((this.body = void 0 !== r ? r : null), (i = o))
              : (i = r),
            i &&
              ((this.reportProgress = !!i.reportProgress),
              (this.withCredentials = !!i.withCredentials),
              i.responseType && (this.responseType = i.responseType),
              i.headers && (this.headers = i.headers),
              i.context && (this.context = i.context),
              i.params && (this.params = i.params)),
            this.headers || (this.headers = new wn()),
            this.context || (this.context = new PO()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new Vn()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : KD(this.body) ||
              QD(this.body) ||
              YD(this.body) ||
              (function kO(e) {
                return (
                  typeof URLSearchParams < "u" && e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof Vn
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || YD(this.body)
            ? null
            : QD(this.body)
            ? this.body.type || null
            : KD(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof Vn
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          const n = t.method || this.method,
            r = t.url || this.url,
            o = t.responseType || this.responseType,
            i = void 0 !== t.body ? t.body : this.body,
            s =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            a =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let u = t.headers || this.headers,
            l = t.params || this.params;
          const c = t.context ?? this.context;
          return (
            void 0 !== t.setHeaders &&
              (u = Object.keys(t.setHeaders).reduce(
                (d, f) => d.set(f, t.setHeaders[f]),
                u
              )),
            t.setParams &&
              (l = Object.keys(t.setParams).reduce(
                (d, f) => d.set(f, t.setParams[f]),
                l
              )),
            new bi(n, r, i, {
              params: l,
              headers: u,
              context: c,
              reportProgress: a,
              responseType: o,
              withCredentials: s,
            })
          );
        }
      }
      var Me = (() => (
        ((Me = Me || {})[(Me.Sent = 0)] = "Sent"),
        (Me[(Me.UploadProgress = 1)] = "UploadProgress"),
        (Me[(Me.ResponseHeader = 2)] = "ResponseHeader"),
        (Me[(Me.DownloadProgress = 3)] = "DownloadProgress"),
        (Me[(Me.Response = 4)] = "Response"),
        (Me[(Me.User = 5)] = "User"),
        Me
      ))();
      class Gd {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new wn()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class zd extends Gd {
        constructor(t = {}) {
          super(t), (this.type = Me.ResponseHeader);
        }
        clone(t = {}) {
          return new zd({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class Ra extends Gd {
        constructor(t = {}) {
          super(t),
            (this.type = Me.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new Ra({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class JD extends Gd {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function Wd(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let XD = (() => {
        class e {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, o = {}) {
            let i;
            if (n instanceof bi) i = n;
            else {
              let u, l;
              (u = o.headers instanceof wn ? o.headers : new wn(o.headers)),
                o.params &&
                  (l =
                    o.params instanceof Vn
                      ? o.params
                      : new Vn({ fromObject: o.params })),
                (i = new bi(n, r, void 0 !== o.body ? o.body : null, {
                  headers: u,
                  context: o.context,
                  params: l,
                  reportProgress: o.reportProgress,
                  responseType: o.responseType || "json",
                  withCredentials: o.withCredentials,
                }));
            }
            const s = A(i).pipe(On((u) => this.handler.handle(u)));
            if (n instanceof bi || "events" === o.observe) return s;
            const a = s.pipe(_n((u) => u instanceof Ra));
            switch (o.observe || "body") {
              case "body":
                switch (i.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      $((u) => {
                        if (null !== u.body && !(u.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return u.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      $((u) => {
                        if (null !== u.body && !(u.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return u.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      $((u) => {
                        if (null !== u.body && "string" != typeof u.body)
                          throw new Error("Response is not a string.");
                        return u.body;
                      })
                    );
                  default:
                    return a.pipe($((u) => u.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${o.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new Vn().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, o = {}) {
            return this.request("PATCH", n, Wd(o, r));
          }
          post(n, r, o = {}) {
            return this.request("POST", n, Wd(o, r));
          }
          put(n, r, o = {}) {
            return this.request("PUT", n, Wd(o, r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(WD));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class eC {
        constructor(t, n) {
          (this.next = t), (this.interceptor = n);
        }
        handle(t) {
          return this.interceptor.intercept(t, this.next);
        }
      }
      const qd = new I("HTTP_INTERCEPTORS");
      let LO = (() => {
        class e {
          intercept(n, r) {
            return r.handle(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const VO = /^\)\]\}',?\n/;
      let tC = (() => {
        class e {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed."
              );
            return new ge((r) => {
              const o = this.xhrFactory.build();
              if (
                (o.open(n.method, n.urlWithParams),
                n.withCredentials && (o.withCredentials = !0),
                n.headers.forEach((h, p) => o.setRequestHeader(h, p.join(","))),
                n.headers.has("Accept") ||
                  o.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*"
                  ),
                !n.headers.has("Content-Type"))
              ) {
                const h = n.detectContentTypeHeader();
                null !== h && o.setRequestHeader("Content-Type", h);
              }
              if (n.responseType) {
                const h = n.responseType.toLowerCase();
                o.responseType = "json" !== h ? h : "text";
              }
              const i = n.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = o.statusText || "OK",
                    p = new wn(o.getAllResponseHeaders()),
                    g =
                      (function jO(e) {
                        return "responseURL" in e && e.responseURL
                          ? e.responseURL
                          : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                          ? e.getResponseHeader("X-Request-URL")
                          : null;
                      })(o) || n.url;
                  return (
                    (s = new zd({
                      headers: p,
                      status: o.status,
                      statusText: h,
                      url: g,
                    })),
                    s
                  );
                },
                u = () => {
                  let { headers: h, status: p, statusText: g, url: y } = a(),
                    D = null;
                  204 !== p &&
                    (D = typeof o.response > "u" ? o.responseText : o.response),
                    0 === p && (p = D ? 200 : 0);
                  let w = p >= 200 && p < 300;
                  if ("json" === n.responseType && "string" == typeof D) {
                    const m = D;
                    D = D.replace(VO, "");
                    try {
                      D = "" !== D ? JSON.parse(D) : null;
                    } catch (S) {
                      (D = m), w && ((w = !1), (D = { error: S, text: D }));
                    }
                  }
                  w
                    ? (r.next(
                        new Ra({
                          body: D,
                          headers: h,
                          status: p,
                          statusText: g,
                          url: y || void 0,
                        })
                      ),
                      r.complete())
                    : r.error(
                        new JD({
                          error: D,
                          headers: h,
                          status: p,
                          statusText: g,
                          url: y || void 0,
                        })
                      );
                },
                l = (h) => {
                  const { url: p } = a(),
                    g = new JD({
                      error: h,
                      status: o.status || 0,
                      statusText: o.statusText || "Unknown Error",
                      url: p || void 0,
                    });
                  r.error(g);
                };
              let c = !1;
              const d = (h) => {
                  c || (r.next(a()), (c = !0));
                  let p = { type: Me.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total),
                    "text" === n.responseType &&
                      !!o.responseText &&
                      (p.partialText = o.responseText),
                    r.next(p);
                },
                f = (h) => {
                  let p = { type: Me.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total), r.next(p);
                };
              return (
                o.addEventListener("load", u),
                o.addEventListener("error", l),
                o.addEventListener("timeout", l),
                o.addEventListener("abort", l),
                n.reportProgress &&
                  (o.addEventListener("progress", d),
                  null !== i &&
                    o.upload &&
                    o.upload.addEventListener("progress", f)),
                o.send(i),
                r.next({ type: Me.Sent }),
                () => {
                  o.removeEventListener("error", l),
                    o.removeEventListener("abort", l),
                    o.removeEventListener("load", u),
                    o.removeEventListener("timeout", l),
                    n.reportProgress &&
                      (o.removeEventListener("progress", d),
                      null !== i &&
                        o.upload &&
                        o.upload.removeEventListener("progress", f)),
                    o.readyState !== o.DONE && o.abort();
                }
              );
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(a_));
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Zd = new I("XSRF_COOKIE_NAME"),
        Kd = new I("XSRF_HEADER_NAME");
      class nC {}
      let BO = (() => {
          class e {
            constructor(n, r, o) {
              (this.doc = n),
                (this.platform = r),
                (this.cookieName = o),
                (this.lastCookieString = ""),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ("server" === this.platform) return null;
              const n = this.doc.cookie || "";
              return (
                n !== this.lastCookieString &&
                  (this.parseCount++,
                  (this.lastToken = Jv(n, this.cookieName)),
                  (this.lastCookieString = n)),
                this.lastToken
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Je), M(Ic), M(Zd));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Qd = (() => {
          class e {
            constructor(n, r) {
              (this.tokenService = n), (this.headerName = r);
            }
            intercept(n, r) {
              const o = n.url.toLowerCase();
              if (
                "GET" === n.method ||
                "HEAD" === n.method ||
                o.startsWith("http://") ||
                o.startsWith("https://")
              )
                return r.handle(n);
              const i = this.tokenService.getToken();
              return (
                null !== i &&
                  !n.headers.has(this.headerName) &&
                  (n = n.clone({ headers: n.headers.set(this.headerName, i) })),
                r.handle(n)
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(nC), M(Kd));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        HO = (() => {
          class e {
            constructor(n, r) {
              (this.backend = n), (this.injector = r), (this.chain = null);
            }
            handle(n) {
              if (null === this.chain) {
                const r = this.injector.get(qd, []);
                this.chain = r.reduceRight(
                  (o, i) => new eC(o, i),
                  this.backend
                );
              }
              return this.chain.handle(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(qD), M(pt));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        $O = (() => {
          class e {
            static disable() {
              return {
                ngModule: e,
                providers: [{ provide: Qd, useClass: LO }],
              };
            }
            static withOptions(n = {}) {
              return {
                ngModule: e,
                providers: [
                  n.cookieName ? { provide: Zd, useValue: n.cookieName } : [],
                  n.headerName ? { provide: Kd, useValue: n.headerName } : [],
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = at({ type: e })),
            (e.ɵinj = et({
              providers: [
                Qd,
                { provide: qd, useExisting: Qd, multi: !0 },
                { provide: nC, useClass: BO },
                { provide: Zd, useValue: "XSRF-TOKEN" },
                { provide: Kd, useValue: "X-XSRF-TOKEN" },
              ],
            })),
            e
          );
        })(),
        UO = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = at({ type: e })),
            (e.ɵinj = et({
              providers: [
                XD,
                { provide: WD, useClass: HO },
                tC,
                { provide: qD, useExisting: tC },
              ],
              imports: [
                $O.withOptions({
                  cookieName: "XSRF-TOKEN",
                  headerName: "X-XSRF-TOKEN",
                }),
              ],
            })),
            e
          );
        })(),
        Yd = (() => {
          class e {
            constructor(n) {
              (this.http = n), (this.endpoint = "http://localhost:3000");
            }
            signIn(n, r) {
              return this.http.post(this.endpoint + "/users/signin", {
                username: n,
                password: r,
              });
            }
            signUp(n, r) {
              return this.http.post(this.endpoint + "/users/signup", {
                username: n,
                password: r,
              });
            }
            signOut() {
              return this.http.get(this.endpoint + "/users/signout");
            }
            me() {
              return this.http.get(this.endpoint + "/users/me");
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(XD));
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        GO = (() => {
          class e {
            constructor(n) {
              (this.api = n), (this.error = ""), (this.isAuth = !1);
            }
            ngOnInit() {
              this.checkAuth();
            }
            checkAuth() {
              this.api.me().subscribe({
                next: () => {
                  this.isAuth = !0;
                },
                error: () => {
                  this.isAuth = !1;
                },
              });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(Yd));
            }),
            (e.ɵcmp = bn({
              type: e,
              selectors: [["app-index"]],
              decls: 2,
              vars: 1,
              consts: [["id", "error-box"]],
              template: function (n, r) {
                1 & n && (K(0, "p", 0), mt(1), X()),
                  2 & n && (_l(1), tc(r.error));
              },
              styles: ["#error-box[_ngcontent-%COMP%]{color:red}"],
            })),
            e
          );
        })(),
        rC = (() => {
          class e {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(ln), _(ht));
            }),
            (e.ɵdir = P({ type: e })),
            e
          );
        })(),
        cr = (() => {
          class e extends rC {}
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Ve(e)))(r || e);
              };
            })()),
            (e.ɵdir = P({ type: e, features: [J] })),
            e
          );
        })();
      const Xt = new I("NgValueAccessor"),
        qO = { provide: Xt, useExisting: re(() => Fa), multi: !0 },
        KO = new I("CompositionEventMode");
      let Fa = (() => {
        class e extends rC {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function ZO() {
                  const e = Qt() ? Qt().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(ln), _(ht), _(KO, 8));
          }),
          (e.ɵdir = P({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                He("input", function (i) {
                  return r._handleInput(i.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (i) {
                  return r._compositionEnd(i.target.value);
                });
            },
            features: [ue([qO]), J],
          })),
          e
        );
      })();
      function jn(e) {
        return (
          null == e ||
          (("string" == typeof e || Array.isArray(e)) && 0 === e.length)
        );
      }
      function iC(e) {
        return null != e && "number" == typeof e.length;
      }
      const Ge = new I("NgValidators"),
        Bn = new I("NgAsyncValidators"),
        YO =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class Pa {
        static min(t) {
          return (function sC(e) {
            return (t) => {
              if (jn(t.value) || jn(e)) return null;
              const n = parseFloat(t.value);
              return !isNaN(n) && n < e
                ? { min: { min: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static max(t) {
          return (function aC(e) {
            return (t) => {
              if (jn(t.value) || jn(e)) return null;
              const n = parseFloat(t.value);
              return !isNaN(n) && n > e
                ? { max: { max: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static required(t) {
          return uC(t);
        }
        static requiredTrue(t) {
          return (function lC(e) {
            return !0 === e.value ? null : { required: !0 };
          })(t);
        }
        static email(t) {
          return (function cC(e) {
            return jn(e.value) || YO.test(e.value) ? null : { email: !0 };
          })(t);
        }
        static minLength(t) {
          return (function dC(e) {
            return (t) =>
              jn(t.value) || !iC(t.value)
                ? null
                : t.value.length < e
                ? {
                    minlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static maxLength(t) {
          return (function fC(e) {
            return (t) =>
              iC(t.value) && t.value.length > e
                ? {
                    maxlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static pattern(t) {
          return (function hC(e) {
            if (!e) return Oa;
            let t, n;
            return (
              "string" == typeof e
                ? ((n = ""),
                  "^" !== e.charAt(0) && (n += "^"),
                  (n += e),
                  "$" !== e.charAt(e.length - 1) && (n += "$"),
                  (t = new RegExp(n)))
                : ((n = e.toString()), (t = e)),
              (r) => {
                if (jn(r.value)) return null;
                const o = r.value;
                return t.test(o)
                  ? null
                  : { pattern: { requiredPattern: n, actualValue: o } };
              }
            );
          })(t);
        }
        static nullValidator(t) {
          return null;
        }
        static compose(t) {
          return _C(t);
        }
        static composeAsync(t) {
          return DC(t);
        }
      }
      function uC(e) {
        return jn(e.value) ? { required: !0 } : null;
      }
      function Oa(e) {
        return null;
      }
      function pC(e) {
        return null != e;
      }
      function gC(e) {
        return Wo(e) ? _e(e) : e;
      }
      function mC(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? { ...t, ...n } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function yC(e, t) {
        return t.map((n) => n(e));
      }
      function vC(e) {
        return e.map((t) =>
          (function JO(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function _C(e) {
        if (!e) return null;
        const t = e.filter(pC);
        return 0 == t.length
          ? null
          : function (n) {
              return mC(yC(n, t));
            };
      }
      function Jd(e) {
        return null != e ? _C(vC(e)) : null;
      }
      function DC(e) {
        if (!e) return null;
        const t = e.filter(pC);
        return 0 == t.length
          ? null
          : function (n) {
              return (function zO(...e) {
                const t = Kf(e),
                  { args: n, keys: r } = T_(e),
                  o = new ge((i) => {
                    const { length: s } = n;
                    if (!s) return void i.complete();
                    const a = new Array(s);
                    let u = s,
                      l = s;
                    for (let c = 0; c < s; c++) {
                      let d = !1;
                      It(n[c]).subscribe(
                        Se(
                          i,
                          (f) => {
                            d || ((d = !0), l--), (a[c] = f);
                          },
                          () => u--,
                          void 0,
                          () => {
                            (!u || !d) &&
                              (l || i.next(r ? N_(r, a) : a), i.complete());
                          }
                        )
                      );
                    }
                  });
                return t ? o.pipe(x_(t)) : o;
              })(yC(n, t).map(gC)).pipe($(mC));
            };
      }
      function Xd(e) {
        return null != e ? DC(vC(e)) : null;
      }
      function CC(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function wC(e) {
        return e._rawValidators;
      }
      function EC(e) {
        return e._rawAsyncValidators;
      }
      function ef(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function ka(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function bC(e, t) {
        const n = ef(t);
        return (
          ef(e).forEach((o) => {
            ka(n, o) || n.push(o);
          }),
          n
        );
      }
      function MC(e, t) {
        return ef(t).filter((n) => !ka(e, n));
      }
      class SC {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = Jd(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = Xd(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t) {
          this.control && this.control.reset(t);
        }
        hasError(t, n) {
          return !!this.control && this.control.hasError(t, n);
        }
        getError(t, n) {
          return this.control ? this.control.getError(t, n) : null;
        }
      }
      class Xe extends SC {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Hn extends SC {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class IC {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let AC = (() => {
          class e extends IC {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(Hn, 2));
            }),
            (e.ɵdir = P({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  As("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending);
              },
              features: [J],
            })),
            e
          );
        })(),
        TC = (() => {
          class e extends IC {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(Xe, 10));
            }),
            (e.ɵdir = P({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  As("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [J],
            })),
            e
          );
        })();
      const Mi = "VALID",
        Va = "INVALID",
        ao = "PENDING",
        Si = "DISABLED";
      function sf(e) {
        return (ja(e) ? e.validators : e) || null;
      }
      function NC(e) {
        return Array.isArray(e) ? Jd(e) : e || null;
      }
      function af(e, t) {
        return (ja(t) ? t.asyncValidators : e) || null;
      }
      function RC(e) {
        return Array.isArray(e) ? Xd(e) : e || null;
      }
      function ja(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      function FC(e, t, n) {
        const r = e.controls;
        if (!(t ? Object.keys(r) : r).length) throw new C(1e3, "");
        if (!r[n]) throw new C(1001, "");
      }
      function PC(e, t, n) {
        e._forEachChild((r, o) => {
          if (void 0 === n[o]) throw new C(1002, "");
        });
      }
      class Ba {
        constructor(t, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            (this._rawValidators = t),
            (this._rawAsyncValidators = n),
            (this._composedValidatorFn = NC(this._rawValidators)),
            (this._composedAsyncValidatorFn = RC(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Mi;
        }
        get invalid() {
          return this.status === Va;
        }
        get pending() {
          return this.status == ao;
        }
        get disabled() {
          return this.status === Si;
        }
        get enabled() {
          return this.status !== Si;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          (this._rawValidators = t), (this._composedValidatorFn = NC(t));
        }
        setAsyncValidators(t) {
          (this._rawAsyncValidators = t),
            (this._composedAsyncValidatorFn = RC(t));
        }
        addValidators(t) {
          this.setValidators(bC(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(bC(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(MC(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(MC(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return ka(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return ka(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = ao),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = Si),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = Mi),
            this._forEachChild((r) => {
              r.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Mi || this.status === ao) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Si : Mi;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = ao), (this._hasOwnPendingAsyncValidator = !0);
            const n = gC(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, n = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(t) {
          let n = t;
          return null == n ||
            (Array.isArray(n) || (n = n.split(".")), 0 === n.length)
            ? null
            : n.reduce((r, o) => r && r._find(o), this);
        }
        getError(t, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, n) {
          return !!this.getError(t, n);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new pe()), (this.statusChanges = new pe());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Si
            : this.errors
            ? Va
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(ao)
            ? ao
            : this._anyControlsHaveStatus(Va)
            ? Va
            : Mi;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((n) => n.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          ja(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
      }
      class Ii extends Ba {
        constructor(t, n, r) {
          super(sf(n), af(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, n) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(t, n, r = {}) {
          this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, n, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            n && this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, n = {}) {
          PC(this, 0, t),
            Object.keys(t).forEach((r) => {
              FC(this, !0, r),
                this.controls[r].setValue(t[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (Object.keys(t).forEach((r) => {
              const o = this.controls[r];
              o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = {}, n = {}) {
          this._forEachChild((r, o) => {
            r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (t, n, r) => ((t[r] = n.getRawValue()), t)
          );
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && t(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const [n, r] of Object.entries(this.controls))
            if (this.contains(n) && t(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
          );
        }
        _reduceChildren(t, n) {
          let r = t;
          return (
            this._forEachChild((o, i) => {
              r = n(r, o, i);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(t) {
          return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
        }
      }
      class OC extends Ii {}
      function Ai(e, t) {
        uf(e, t),
          t.valueAccessor.writeValue(e.value),
          e.disabled && t.valueAccessor.setDisabledState?.(!0),
          (function s1(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && kC(e, t);
            });
          })(e, t),
          (function u1(e, t) {
            const n = (r, o) => {
              t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function a1(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && kC(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function i1(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const n = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(n),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(n);
                });
            }
          })(e, t);
      }
      function $a(e, t, n = !0) {
        const r = () => {};
        t.valueAccessor &&
          (t.valueAccessor.registerOnChange(r),
          t.valueAccessor.registerOnTouched(r)),
          Ga(e, t),
          e &&
            (t._invokeOnDestroyCallbacks(),
            e._registerOnCollectionChange(() => {}));
      }
      function Ua(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function uf(e, t) {
        const n = wC(e);
        null !== t.validator
          ? e.setValidators(CC(n, t.validator))
          : "function" == typeof n && e.setValidators([n]);
        const r = EC(e);
        null !== t.asyncValidator
          ? e.setAsyncValidators(CC(r, t.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const o = () => e.updateValueAndValidity();
        Ua(t._rawValidators, o), Ua(t._rawAsyncValidators, o);
      }
      function Ga(e, t) {
        let n = !1;
        if (null !== e) {
          if (null !== t.validator) {
            const o = wC(e);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== t.validator);
              i.length !== o.length && ((n = !0), e.setValidators(i));
            }
          }
          if (null !== t.asyncValidator) {
            const o = EC(e);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== t.asyncValidator);
              i.length !== o.length && ((n = !0), e.setAsyncValidators(i));
            }
          }
        }
        const r = () => {};
        return Ua(t._rawValidators, r), Ua(t._rawAsyncValidators, r), n;
      }
      function kC(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function BC(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      function HC(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const xi = class extends Ba {
        constructor(t = null, n, r) {
          super(sf(n), af(r, n)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(t),
            this._setUpdateStrategy(n),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            ja(n) &&
              (n.nonNullable || n.initialValueIsDefault) &&
              (this.defaultValue = HC(t) ? t.value : t);
        }
        setValue(t, n = {}) {
          (this.value = this._pendingValue = t),
            this._onChange.length &&
              !1 !== n.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== n.emitViewToModelChange)
              ),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          this.setValue(t, n);
        }
        reset(t = this.defaultValue, n = {}) {
          this._applyFormState(t),
            this.markAsPristine(n),
            this.markAsUntouched(n),
            this.setValue(this.value, n),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(t) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(t) {
          this._onChange.push(t);
        }
        _unregisterOnChange(t) {
          BC(this._onChange, t);
        }
        registerOnDisabledChange(t) {
          this._onDisabledChange.push(t);
        }
        _unregisterOnDisabledChange(t) {
          BC(this._onDisabledChange, t);
        }
        _forEachChild(t) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(t) {
          HC(t)
            ? ((this.value = this._pendingValue = t.value),
              t.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = t);
        }
      };
      let WC = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = P({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            e
          );
        })(),
        ZC = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = at({ type: e })),
            (e.ɵinj = et({})),
            e
          );
        })();
      const ff = new I("NgModelWithFormControlWarning"),
        w1 = { provide: Xe, useExisting: re(() => za) };
      let za = (() => {
        class e extends Xe {
          constructor(n, r) {
            super(),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new pe()),
              this._setValidators(n),
              this._setAsyncValidators(r);
          }
          ngOnChanges(n) {
            this._checkFormPresent(),
              n.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (Ga(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(n) {
            const r = this.form.get(n.path);
            return (
              Ai(r, n),
              r.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(n),
              r
            );
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            $a(n.control || null, n, !1),
              (function f1(e, t) {
                const n = e.indexOf(t);
                n > -1 && e.splice(n, 1);
              })(this.directives, n);
          }
          addFormGroup(n) {
            this._setUpFormContainer(n);
          }
          removeFormGroup(n) {
            this._cleanUpFormContainer(n);
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          addFormArray(n) {
            this._setUpFormContainer(n);
          }
          removeFormArray(n) {
            this._cleanUpFormContainer(n);
          }
          getFormArray(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            this.form.get(n.path).setValue(r);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function jC(e, t) {
                e._syncPendingControls(),
                  t.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(n),
              "dialog" === n?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n) {
            this.form.reset(n), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((n) => {
              const r = n.control,
                o = this.form.get(n.path);
              r !== o &&
                ($a(r || null, n),
                ((e) => e instanceof xi)(o) && (Ai(o, n), (n.control = o)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(n) {
            const r = this.form.get(n.path);
            (function LC(e, t) {
              uf(e, t);
            })(r, n),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(n) {
            if (this.form) {
              const r = this.form.get(n.path);
              r &&
                (function l1(e, t) {
                  return Ga(e, t);
                })(r, n) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            uf(this.form, this), this._oldForm && Ga(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(Ge, 10), _(Bn, 10));
          }),
          (e.ɵdir = P({
            type: e,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (n, r) {
              1 & n &&
                He("submit", function (i) {
                  return r.onSubmit(i);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [ue([w1]), J, Dt],
          })),
          e
        );
      })();
      const M1 = { provide: Hn, useExisting: re(() => gf) };
      let gf = (() => {
          class e extends Hn {
            constructor(n, r, o, i, s) {
              super(),
                (this._ngModelWarningConfig = s),
                (this._added = !1),
                (this.update = new pe()),
                (this._ngModelWarningSent = !1),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function cf(e, t) {
                  if (!t) return null;
                  let n, r, o;
                  return (
                    Array.isArray(t),
                    t.forEach((i) => {
                      i.constructor === Fa
                        ? (n = i)
                        : (function d1(e) {
                            return Object.getPrototypeOf(e.constructor) === cr;
                          })(i)
                        ? (r = i)
                        : (o = i);
                    }),
                    o || r || n || null
                  );
                })(0, i));
            }
            set isDisabled(n) {}
            ngOnChanges(n) {
              this._added || this._setUpControl(),
                (function lf(e, t) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const n = e.model;
                  return !!n.isFirstChange() || !Object.is(t, n.currentValue);
                })(n, this.viewModel) &&
                  ((this.viewModel = this.model),
                  this.formDirective.updateModel(this, this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            get path() {
              return (function Ha(e, t) {
                return [...t.path, e];
              })(
                null == this.name ? this.name : this.name.toString(),
                this._parent
              );
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            _checkParentType() {}
            _setUpControl() {
              this._checkParentType(),
                (this.control = this.formDirective.addControl(this)),
                (this._added = !0);
            }
          }
          return (
            (e._ngModelWarningSentOnce = !1),
            (e.ɵfac = function (n) {
              return new (n || e)(
                _(Xe, 13),
                _(Ge, 10),
                _(Bn, 10),
                _(Xt, 10),
                _(ff, 8)
              );
            }),
            (e.ɵdir = P({
              type: e,
              selectors: [["", "formControlName", ""]],
              inputs: {
                name: ["formControlName", "name"],
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
              },
              outputs: { update: "ngModelChange" },
              features: [ue([M1]), J, Dt],
            })),
            e
          );
        })(),
        dr = (() => {
          class e {
            constructor() {
              this._validator = Oa;
            }
            ngOnChanges(n) {
              if (this.inputName in n) {
                const r = this.normalizeInput(n[this.inputName].currentValue);
                (this._enabled = this.enabled(r)),
                  (this._validator = this._enabled
                    ? this.createValidator(r)
                    : Oa),
                  this._onChange && this._onChange();
              }
            }
            validate(n) {
              return this._validator(n);
            }
            registerOnValidatorChange(n) {
              this._onChange = n;
            }
            enabled(n) {
              return null != n;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = P({ type: e, features: [Dt] })),
            e
          );
        })();
      const P1 = { provide: Ge, useExisting: re(() => Wa), multi: !0 };
      let Wa = (() => {
          class e extends dr {
            constructor() {
              super(...arguments),
                (this.inputName = "required"),
                (this.normalizeInput = mn),
                (this.createValidator = (n) => uC);
            }
            enabled(n) {
              return n;
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Ve(e)))(r || e);
              };
            })()),
            (e.ɵdir = P({
              type: e,
              selectors: [
                [
                  "",
                  "required",
                  "",
                  "formControlName",
                  "",
                  3,
                  "type",
                  "checkbox",
                ],
                ["", "required", "", "formControl", "", 3, "type", "checkbox"],
                ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
              ],
              hostVars: 1,
              hostBindings: function (n, r) {
                2 & n && qt("required", r._enabled ? "" : null);
              },
              inputs: { required: "required" },
              features: [ue([P1]), J],
            })),
            e
          );
        })(),
        cw = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = at({ type: e })),
            (e.ɵinj = et({ imports: [ZC] })),
            e
          );
        })(),
        B1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = at({ type: e })),
            (e.ɵinj = et({ imports: [cw] })),
            e
          );
        })(),
        dw = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: ff, useValue: n.warnOnNgModelWithFormControl },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = at({ type: e })),
            (e.ɵinj = et({ imports: [cw] })),
            e
          );
        })();
      class fw extends Ba {
        constructor(t, n, r) {
          super(sf(n), af(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(t) {
          return this.controls[this._adjustIndex(t)];
        }
        push(t, n = {}) {
          this.controls.push(t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        insert(t, n, r = {}) {
          this.controls.splice(t, 0, n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(t, n = {}) {
          let r = this._adjustIndex(t);
          r < 0 && (r = 0),
            this.controls[r] &&
              this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: n.emitEvent });
        }
        setControl(t, n, r = {}) {
          let o = this._adjustIndex(t);
          o < 0 && (o = 0),
            this.controls[o] &&
              this.controls[o]._registerOnCollectionChange(() => {}),
            this.controls.splice(o, 1),
            n && (this.controls.splice(o, 0, n), this._registerControl(n)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(t, n = {}) {
          PC(this, 0, t),
            t.forEach((r, o) => {
              FC(this, !1, o),
                this.at(o).setValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (t.forEach((r, o) => {
              this.at(o) &&
                this.at(o).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = [], n = {}) {
          this._forEachChild((r, o) => {
            r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this.controls.map((t) => t.getRawValue());
        }
        clear(t = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }));
        }
        _adjustIndex(t) {
          return t < 0 ? t + this.length : t;
        }
        _syncPendingControls() {
          let t = this.controls.reduce(
            (n, r) => !!r._syncPendingControls() || n,
            !1
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          this.controls.forEach((n, r) => {
            t(n, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((t) => t.enabled || this.disabled)
            .map((t) => t.value);
        }
        _anyControls(t) {
          return this.controls.some((n) => n.enabled && t(n));
        }
        _setUpControls() {
          this._forEachChild((t) => this._registerControl(t));
        }
        _allControlsDisabled() {
          for (const t of this.controls) if (t.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(t) {
          t.setParent(this),
            t._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(t) {
          return this.at(t) ?? null;
        }
      }
      function hw(e) {
        return (
          !!e &&
          (void 0 !== e.asyncValidators ||
            void 0 !== e.validators ||
            void 0 !== e.updateOn)
        );
      }
      let H1 = (() => {
        class e {
          constructor() {
            this.useNonNullable = !1;
          }
          get nonNullable() {
            const n = new e();
            return (n.useNonNullable = !0), n;
          }
          group(n, r = null) {
            const o = this._reduceControls(n);
            let i = {};
            return (
              hw(r)
                ? (i = r)
                : null !== r &&
                  ((i.validators = r.validator),
                  (i.asyncValidators = r.asyncValidator)),
              new Ii(o, i)
            );
          }
          record(n, r = null) {
            const o = this._reduceControls(n);
            return new OC(o, r);
          }
          control(n, r, o) {
            let i = {};
            return this.useNonNullable
              ? (hw(r)
                  ? (i = r)
                  : ((i.validators = r), (i.asyncValidators = o)),
                new xi(n, { ...i, nonNullable: !0 }))
              : new xi(n, r, o);
          }
          array(n, r, o) {
            const i = n.map((s) => this._createControl(s));
            return new fw(i, r, o);
          }
          _reduceControls(n) {
            const r = {};
            return (
              Object.keys(n).forEach((o) => {
                r[o] = this._createControl(n[o]);
              }),
              r
            );
          }
          _createControl(n) {
            return n instanceof xi || n instanceof Ba
              ? n
              : Array.isArray(n)
              ? this.control(
                  n[0],
                  n.length > 1 ? n[1] : null,
                  n.length > 2 ? n[2] : null
                )
              : this.control(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: dw })),
          e
        );
      })();
      const $1 = [
        { path: "", component: GO },
        {
          path: "sign-in",
          component: (() => {
            class e {
              constructor(n, r, o) {
                (this.fb = n),
                  (this.api = r),
                  (this.router = o),
                  (this.signInForm = this.fb.group({
                    username: ["", Pa.required],
                    password: ["", Pa.required],
                  })),
                  (this.signUpForm = this.fb.group({
                    username: ["", Pa.required],
                    password: ["", Pa.required],
                  }));
              }
              ngOnInit() {}
              signIn() {
                this.api
                  .signIn(
                    this.signInForm.value.username,
                    this.signInForm.value.password
                  )
                  .subscribe((o) => {
                    this.router.navigate(["/"]);
                  });
              }
              signUp() {
                this.api
                  .signUp(
                    this.signUpForm.value.username,
                    this.signUpForm.value.password
                  )
                  .subscribe((o) => {
                    this.router.navigate(["/"]);
                  });
              }
            }
            return (
              (e.ɵfac = function (n) {
                return new (n || e)(_(H1), _(Yd), _(be));
              }),
              (e.ɵcmp = bn({
                type: e,
                selectors: [["app-sign-in"]],
                decls: 16,
                vars: 2,
                consts: [
                  [1, "complex-form", 3, "formGroup", "submit"],
                  [1, "form-title"],
                  [
                    "type",
                    "text",
                    "name",
                    "username",
                    "placeholder",
                    "Your username",
                    "required",
                    "",
                    "formControlName",
                    "username",
                    1,
                    "form-element",
                  ],
                  [
                    "type",
                    "password",
                    "name",
                    "password",
                    "placeholder",
                    "Your password",
                    "required",
                    "",
                    "formControlName",
                    "password",
                    1,
                    "form-element",
                  ],
                  ["id", "signin", "name", "action", 1, "btn"],
                  [
                    "type",
                    "text",
                    "name",
                    "username",
                    "placeholder",
                    "Enter a username",
                    "required",
                    "",
                    "formControlName",
                    "username",
                    1,
                    "form-element",
                  ],
                  [
                    "type",
                    "password",
                    "name",
                    "password",
                    "placeholder",
                    "Enter a password",
                    "required",
                    "",
                    "formControlName",
                    "password",
                    1,
                    "form-element",
                  ],
                  ["id", "signup", "name", "action", 1, "btn"],
                ],
                template: function (n, r) {
                  1 & n &&
                    (K(0, "form", 0),
                    He("submit", function () {
                      return r.signIn();
                    }),
                    K(1, "div", 1),
                    mt(2, "Sign In"),
                    X(),
                    ye(3, "input", 2)(4, "input", 3),
                    K(5, "div")(6, "button", 4),
                    mt(7, "Sign in"),
                    X()()(),
                    K(8, "form", 0),
                    He("submit", function () {
                      return r.signUp();
                    }),
                    K(9, "div", 1),
                    mt(10, "Sign Up"),
                    X(),
                    ye(11, "input", 5)(12, "input", 6),
                    K(13, "div")(14, "button", 7),
                    mt(15, "Sign up"),
                    X()()()),
                    2 & n &&
                      (Is("formGroup", r.signInForm),
                      _l(8),
                      Is("formGroup", r.signUpForm));
                },
                dependencies: [WC, Fa, AC, TC, Wa, za, gf],
              })),
              e
            );
          })(),
        },
        { path: "**", redirectTo: "/" },
        {
          path: "game",
          component: (() => {
            class e {
              constructor() {}
              ngOnInit() {}
            }
            return (
              (e.ɵfac = function (n) {
                return new (n || e)();
              }),
              (e.ɵcmp = bn({
                type: e,
                selectors: [["app-game"]],
                decls: 55,
                vars: 0,
                consts: [
                  ["charset", "utf-8"],
                  [
                    "name",
                    "viewport",
                    "content",
                    "width=device-width,initial-scale=1",
                  ],
                  ["id", "p1Title"],
                  ["data-row", "5", "data-col", "1"],
                  [1, "pawn", "aTeam"],
                  ["data-row", "5", "data-col", "2", 1, "td2"],
                  ["data-row", "5", "data-col", "3"],
                  [1, "king", "aTeam"],
                  ["data-row", "5", "data-col", "4", 1, "td2"],
                  ["data-row", "5", "data-col", "5"],
                  ["data-row", "4", "data-col", "1", 1, "td2"],
                  ["data-row", "4", "data-col", "2"],
                  ["data-row", "4", "data-col", "3", 1, "td2"],
                  ["data-row", "4", "data-col", "4"],
                  ["data-row", "4", "data-col", "5", 1, "td2"],
                  ["data-row", "3", "data-col", "1"],
                  ["data-row", "3", "data-col", "2", 1, "td2"],
                  ["data-row", "3", "data-col", "3"],
                  ["data-row", "3", "data-col", "4", 1, "td2"],
                  ["data-row", "3", "data-col", "5"],
                  ["data-row", "2", "data-col", "1", 1, "td2"],
                  ["data-row", "2", "data-col", "2"],
                  ["data-row", "2", "data-col", "3", 1, "td2"],
                  ["data-row", "2", "data-col", "4"],
                  ["data-row", "2", "data-col", "5", 1, "td2"],
                  ["data-row", "1", "data-col", "1"],
                  [1, "pawn", "bTeam"],
                  ["data-row", "1", "data-col", "2", 1, "td2"],
                  ["data-row", "1", "data-col", "3"],
                  [1, "king", "bTeam"],
                  ["data-row", "1", "data-col", "4", 1, "td2"],
                  ["data-row", "1", "data-col", "5"],
                  ["id", "p2Title"],
                  ["href", "/credits.html"],
                ],
                template: function (n, r) {
                  1 & n &&
                    (K(0, "html")(1, "head"),
                    ye(2, "meta", 0)(3, "meta", 1),
                    K(4, "title"),
                    mt(5, "Onitama"),
                    X()(),
                    K(6, "body")(7, "h1", 2),
                    mt(8, "Player 1"),
                    X(),
                    K(9, "table")(10, "tr")(11, "td", 3),
                    ye(12, "p", 4),
                    X(),
                    K(13, "td", 5),
                    ye(14, "p", 4),
                    X(),
                    K(15, "td", 6),
                    ye(16, "p", 7),
                    X(),
                    K(17, "td", 8),
                    ye(18, "p", 4),
                    X(),
                    K(19, "td", 9),
                    ye(20, "p", 4),
                    X()(),
                    K(21, "tr"),
                    ye(22, "td", 10)(23, "td", 11)(24, "td", 12)(25, "td", 13)(
                      26,
                      "td",
                      14
                    ),
                    X(),
                    K(27, "tr"),
                    ye(28, "td", 15)(29, "td", 16)(30, "td", 17)(31, "td", 18)(
                      32,
                      "td",
                      19
                    ),
                    X(),
                    K(33, "tr"),
                    ye(34, "td", 20)(35, "td", 21)(36, "td", 22)(37, "td", 23)(
                      38,
                      "td",
                      24
                    ),
                    X(),
                    K(39, "tr")(40, "td", 25),
                    ye(41, "p", 26),
                    X(),
                    K(42, "td", 27),
                    ye(43, "p", 26),
                    X(),
                    K(44, "td", 28),
                    ye(45, "p", 29),
                    X(),
                    K(46, "td", 30),
                    ye(47, "p", 26),
                    X(),
                    K(48, "td", 31),
                    ye(49, "p", 26),
                    X()()(),
                    K(50, "h1", 32),
                    mt(51, "Player 2"),
                    X(),
                    K(52, "footer")(53, "a", 33),
                    mt(54, "credits"),
                    X()()()());
                },
                styles: [
                  "table[_ngcontent-%COMP%]{border:3px solid black}td[_ngcontent-%COMP%]{width:6vw;height:6vw;vertical-align:middle;text-align:center;margin:0;background-color:#ba7a3a}.td2[_ngcontent-%COMP%]{background-color:#f0d2b4}.pawn[_ngcontent-%COMP%]{width:2vw;height:2vw;margin:auto;background-color:#000;border:2px solid white;border-radius:50%}.king[_ngcontent-%COMP%]{width:2vw;height:2vw;margin:auto;padding:1;background-color:#000;border:4px solid gold;border-radius:50%}.aTeam[_ngcontent-%COMP%]{background-color:#8b0000}.bTeam[_ngcontent-%COMP%]{background-color:indigo}[_ngcontent-%COMP%]:root{--mainColor: #fa991c;--bgColor: #032539;--secColor: #1c768f;--offwhite: #fbf3f2}.kiaButton[_ngcontent-%COMP%], .slide[_ngcontent-%COMP%]{color:#fff;background-color:var(--mainColor);display:block;margin-left:auto;margin-right:auto;border-color:#0f1225;font-size:84%;width:18vw;height:5vh;margin:1%,auto;padding:1%,0;border-radius:12em;border:1.5px solid;transition-duration:.35s;box-shadow:0 3px #999;cursor:pointer}.kiaButton[_ngcontent-%COMP%]:hover, .slide[_ngcontent-%COMP%]:hover{background-color:#fff;color:var(--mainColor)}.kiaButton[_ngcontent-%COMP%]:active, .slide[_ngcontent-%COMP%]:active{box-shadow:0 1px #666;transform:translateY(3px)}.info[_ngcontent-%COMP%]{color:#666;font-size:12px;transition:.1s;overflow:hidden}.info[_ngcontent-%COMP%]:focus-within{color:var(--mainColor);font-size:15px}.infoField[_ngcontent-%COMP%]{outline:none;background-color:#ffffff21;width:90%;color:#666;display:block;transition:.5;resize:none;border-radius:10px;border:1px solid #555;font-size:15px;margin:auto auto 1.5%;padding:.5%}.infoField[_ngcontent-%COMP%]:focus{border:3px solid var(--mainColor);background-color:#fff;font-size:15px;color:#000;outline:none}",
                ],
              })),
              e
            );
          })(),
        },
      ];
      let U1 = (() => {
          class e {
            constructor(n) {
              (this.router = n),
                (this.router.errorHandler = (r) => {
                  this.router.navigate(["/"]);
                });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(be));
            }),
            (e.ɵmod = at({ type: e })),
            (e.ɵinj = et({ imports: [UD.forRoot($1), UD] })),
            e
          );
        })(),
        G1 = (() => {
          class e {
            constructor(n, r) {
              (this.api = n), (this.router = r);
            }
            ngOnInit() {}
            signOut() {
              this.api.signOut().subscribe((n) => {
                this.router.navigate(["/sign-in"]);
              });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(Yd), _(be));
            }),
            (e.ɵcmp = bn({
              type: e,
              selectors: [["app-header"]],
              decls: 8,
              vars: 0,
              consts: [
                ["routerLink", "/", "id", "title"],
                [
                  "routerLink",
                  "/sign-in",
                  "id",
                  "signin-button",
                  1,
                  "btn",
                  "header-btn",
                  "hidden",
                ],
                [
                  "id",
                  "signout-button",
                  1,
                  "btn",
                  "header-btn",
                  "hidden",
                  3,
                  "click",
                ],
                ["id", "error-box"],
              ],
              template: function (n, r) {
                1 & n &&
                  (K(0, "header")(1, "a", 0),
                  mt(2, "Webtama"),
                  X(),
                  K(3, "a", 1),
                  mt(4, "Sign in"),
                  X(),
                  K(5, "a", 2),
                  He("click", function () {
                    return r.signOut();
                  }),
                  mt(6, "Sign out"),
                  X()(),
                  ye(7, "p", 3));
              },
              dependencies: [Aa],
              styles: [
                'header[_ngcontent-%COMP%]{display:flex;height:64px;width:100%;background-color:#12cec5;box-shadow:0 1px 1px #ccc;justify-content:flex-end;transition:top .3s;z-index:1;position:relative}header[_ngcontent-%COMP%]   #title[_ngcontent-%COMP%]{float:left;color:#000;text-decoration:none;margin-left:5px;font-family:Jazz LET,fantasy;width:100%;font-size:40px}.header-btn[_ngcontent-%COMP%]{font-size:15px;margin-left:5px;margin-right:5px;border-radius:10px;text-align:center;color:#3c3d3f;background:#ffffff;border:2px #3c3d3f solid;padding:15px 10px 0;display:inline-block;text-decoration:none}#error-box[_ngcontent-%COMP%]{color:red;visibility:hidden}#error-box[_ngcontent-%COMP%]:before{content:"Error: "}.btn[_ngcontent-%COMP%]{border-radius:10px;text-align:center;font-size:20px;color:#3c3d3f;background:#ffffff;border:2px solid black;padding:10px 20px}.btn[_ngcontent-%COMP%]:hover{background:#3c3d3f;color:#fff;cursor:pointer}',
              ],
            })),
            e
          );
        })(),
        z1 = (() => {
          class e {
            constructor() {
              this.title = "Webtama";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = bn({
              type: e,
              selectors: [["app-root"]],
              decls: 2,
              vars: 0,
              template: function (n, r) {
                1 & n && ye(0, "app-header")(1, "router-outlet");
              },
              dependencies: [xd, G1],
            })),
            e
          );
        })(),
        W1 = (() => {
          class e {
            constructor() {}
            intercept(n, r) {
              const o = n.clone({ withCredentials: !0 });
              return r.handle(o);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = x({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        q1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = at({ type: e, bootstrap: [z1] })),
            (e.ɵinj = et({
              providers: [{ provide: qd, useClass: W1, multi: !0 }],
              imports: [GR, UO, B1, dw, U1],
            })),
            e
          );
        })();
      (function dx() {
        Iv = !1;
      })(),
        UR()
          .bootstrapModule(q1)
          .catch((e) => console.error(e));
    },
  },
  (ne) => {
    ne((ne.s = 362));
  },
]);
