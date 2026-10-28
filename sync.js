(() => {
  'use strict';
  const Core = window.NaplexSyncCore;
  const GUEST_KEY = 'naplex-study-companion-v1';
  const ACCOUNT_PREFIX = 'naplex-study-companion-account-v2:';
  // Firebase's browser configuration identifies the project; it is not an admin credential.
  const CONFIG = {
    apiKey: 'AIzaSyARpc7GuZaojALbvBRkY9WApXPJ2JfP6Sw',
    authDomain: 'naplex-study-companion.firebaseapp.com',
    projectId: 'naplex-study-companion',
    storageBucket: 'naplex-study-companion.firebasestorage.app',
    messagingSenderId: '177164791463',
    appId: '1:177164791463:web:0a4fb273a5cd48f5633582'
  };
  const SDK = 'https://www.gstatic.com/firebasejs/11.10.0/';
  const device = (globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() :
    'tab-' + Date.now() + '-' + Math.random().toString(36).slice(2));
  let auth, db, fbAuth, fbDb, user = null, records = {}, clock = 0, unsubscribe = null;
  let generation = 0, pendingTimer = null, flushing = false, flushAgain = false, remoteReady = false;
  let callback = () => {}, currentStatus = 'Preparing sync…', readyPromise;

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  }
  function status(text) { currentStatus = text; callback({type:'status'}); }
  function guestState() { return read(GUEST_KEY, Core.empty()); }
  function guestHasData() {
    const g = guestState();
    return !!(g.examDate || Object.keys(g.days || {}).some(k => g.days[k]) ||
      Object.keys(g.lessons || {}).some(k => g.lessons[k]) || Object.keys(g.scores || {}).length ||
      Object.values(g.notes || {}).some(Boolean));
  }
  function accountKey() { return ACCOUNT_PREFIX + user.uid; }
  function persist() {
    if (user && !write(accountKey(), {records, clock})) {
      status('This browser could not save progress on this device. Export a backup and check your browser storage.');
      return false;
    }
    return true;
  }
  function notifyData() { callback({type:'data', state:Core.project(records)}); }
  function importGuest() {
    if (!user || !remoteReady || !guestHasData()) return false;
    save(Core.combineGuest(Core.project(records), guestState()));
    try { localStorage.setItem(accountKey() + ':guest-imported', '1'); } catch {}
    callback({type:'imported'});
    return true;
  }
  function canImportGuest() {
    if (!user || !guestHasData()) return false;
    try { return localStorage.getItem(accountKey() + ':guest-imported') !== '1'; } catch { return true; }
  }
  function schedule(delay = 1200) {
    if (!user) return;
    if (!navigator.onLine) { status('Offline — changes are saved on this device and will sync when you reconnect.'); return; }
    if (flushing) { flushAgain = true; return; }
    clearTimeout(pendingTimer);
    pendingTimer = setTimeout(flush, delay);
    status('Saving your progress…');
  }
  async function flush() {
    if (!user || !db) return;
    if (!navigator.onLine) { status('Offline — changes are saved on this device and will sync when you reconnect.'); return; }
    if (flushing) { flushAgain = true; return; }
    const run = generation, uid = user.uid, snapshot = Core.cleanRecords(records);
    const ref = fbDb.doc(db, 'progress', uid);
    flushing = true; flushAgain = false;
    try {
      const saved = await fbDb.runTransaction(db, async transaction => {
        const document = await transaction.get(ref);
        const remote = document.exists() ? document.data().records : {};
        const merged = Core.merge(remote, snapshot);
        transaction.set(ref, {version:2, records:merged});
        return merged;
      });
      if (run !== generation || !user || user.uid !== uid) return;
      const merged = Core.merge(records, saved);
      const changed = !Core.sameRecords(records, merged);
      records = merged;
      clock = Math.max(clock, ...Object.values(records).map(r => r.n), 0);
      persist();
      if (changed) notifyData();
      if (!Core.sameRecords(records, saved)) flushAgain = true;
      status(flushAgain ? 'Saving your progress…' : 'Progress is synced.');
    } catch (error) {
      if (run !== generation) return;
      if (!navigator.onLine || error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        status('Waiting for a connection — your changes remain on this device.');
      } else {
        status('Sync could not complete. Your changes remain on this device; check your connection or export a backup.');
      }
      flushAgain = true;
    } finally {
      flushing = false;
      if (flushAgain && user) schedule(run === generation ? 10000 : 100);
    }
  }
  function save(state) {
    if (!user) {
      if (!write(GUEST_KEY, state)) status('This browser could not save progress. Check browser storage or export a backup.');
      return;
    }
    const changed = Core.recordChanges(records, state, device, clock);
    if (Core.sameRecords(records, changed.records)) return;
    records = changed.records; clock = changed.clock;
    persist();
    schedule();
  }
  function changeUser(next) {
    generation++;
    clearTimeout(pendingTimer);
    if (unsubscribe) { unsubscribe(); unsubscribe = null; }
    user = next || null; records = {}; clock = 0; flushAgain = false; remoteReady = false;
    if (!user) {
      currentStatus = 'Studying on this device. Sign in to sync.';
      callback({type:'user', state:guestState()});
      return;
    }
    const cache = read(accountKey(), {});
    records = Core.cleanRecords(cache.records);
    clock = Math.max(Number.isSafeInteger(cache.clock) ? cache.clock : 0, ...Object.values(records).map(r => r.n), 0);
    currentStatus = navigator.onLine ? 'Connecting your account…' : 'Offline — changes stay on this device until you reconnect.';
    callback({type:'user', state:Core.project(records)});
    const run = generation;
    const ref = fbDb.doc(db, 'progress', user.uid);
    unsubscribe = fbDb.onSnapshot(ref, {includeMetadataChanges:true}, snapshot => {
      if (run !== generation) return;
      if (!snapshot.metadata.fromCache) remoteReady = true;
      const remote = Core.cleanRecords(snapshot.exists() ? snapshot.data().records : {});
      const merged = Core.merge(records, remote), changed = !Core.sameRecords(records, merged);
      records = merged;
      clock = Math.max(clock, ...Object.values(records).map(r => r.n), 0);
      persist();
      if (changed) notifyData();
      if (!Core.sameRecords(records, remote)) schedule();
      else if (!snapshot.metadata.fromCache) status('Progress is synced.');
      else if (!navigator.onLine) status('Offline — changes stay on this device until you reconnect.');
    }, () => {
      if (run === generation) status('Could not connect to your account. Your progress remains on this device.');
    });
  }
  async function init(onEvent) {
    callback = onEvent;
    readyPromise = (async () => {
      if (!window.isSecureContext) {
        status('Account sync requires HTTPS. Open the published app on your phone to sign in.');
        throw new Error('Account sync requires HTTPS or localhost.');
      }
      try {
        const [fbApp, authModule, dbModule] = await Promise.all([
          import(SDK + 'firebase-app.js'),
          import(SDK + 'firebase-auth.js'),
          import(SDK + 'firebase-firestore.js')
        ]);
        fbAuth = authModule; fbDb = dbModule;
        const app = fbApp.initializeApp(CONFIG);
        auth = fbAuth.getAuth(app);
        db = fbDb.getFirestore(app);
        fbAuth.onAuthStateChanged(auth, changeUser, () => status('Could not connect to the account service.'));
      } catch {
        status('Account service unavailable. Your device-only progress is still available.');
        throw new Error('Account service unavailable. Check your internet connection and try again.');
      }
    })();
    // A rejected initialization is reported in the interface, not as an unhandled rejection.
    readyPromise.catch(() => {});
  }
  async function available() {
    if (!readyPromise) throw new Error('Account service is not ready.');
    await readyPromise;
    return auth;
  }
  async function signIn(email, password) {
    await available();
    return fbAuth.signInWithEmailAndPassword(auth, email.trim(), password);
  }
  async function createAccount(email, password) {
    await available();
    if (password.length < 8) throw new Error('Choose a password with at least 8 characters.');
    const result = await fbAuth.createUserWithEmailAndPassword(auth, email.trim(), password);
    try { await fbAuth.sendEmailVerification(result.user); return true; } catch { return false; }
  }
  async function resetPassword(email) {
    await available();
    if (!email.trim()) throw new Error('Enter your email address first.');
    await fbAuth.sendPasswordResetEmail(auth, email.trim());
  }
  async function signOut() { await available(); await fbAuth.signOut(auth); }
  function describeError(error) {
    const messages = {
      'auth/invalid-email':'Enter a valid email address.',
      'auth/invalid-credential':'Email or password was not recognized.',
      'auth/wrong-password':'Email or password was not recognized.',
      'auth/user-not-found':'Email or password was not recognized.',
      'auth/email-already-in-use':'That email already has an account. Sign in instead.',
      'auth/weak-password':'Choose a stronger password.',
      'auth/too-many-requests':'Too many attempts. Please wait and try again.',
      'auth/network-request-failed':'Could not connect. Check your internet connection.',
      'auth/operation-not-allowed':'Account sign-in is not available yet.'
    };
    return messages[error.code] || (error.message && !error.code ? error.message : 'Could not complete that request. Please try again.');
  }
  window.addEventListener('online', () => { if (user) schedule(100); });
  window.addEventListener('offline', () => { if (user) status('Offline — changes stay on this device until you reconnect.'); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && user && navigator.onLine) schedule(300); });
  window.NaplexSync = {
    init, save, signIn, createAccount, resetPassword, signOut, importGuest, canImportGuest,
    syncNow: () => schedule(10),
    info: () => ({email:user && user.email, signedIn:!!user, status:currentStatus, remoteReady, secure:window.isSecureContext}),
    describeError
  };
})();
