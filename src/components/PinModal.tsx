import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Delete, Lock, X } from 'lucide-react';
import { UI_COPY } from '../data/i18n';
import { ADMIN_EMAIL, auth, PASSCODE_SUFFIX } from '../firebase';
import { markSetupComplete } from '../services/firestoreService';
import { Language } from '../types';

const LOCK_STORAGE_KEY = 'snapcell_pin_lock_state';
const ACCOUNT_KNOWN_KEY = 'snapcell_account_initialized';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 5 * 60 * 1000;

interface LockState {
  attempts: number;
  lockedUntil: number;
}

function readLockState(): LockState {
  try {
    const raw = localStorage.getItem(LOCK_STORAGE_KEY);
    if (!raw) return { attempts: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw);
    return {
      attempts: Number(parsed.attempts) || 0,
      lockedUntil: Number(parsed.lockedUntil) || 0,
    };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function writeLockState(state: LockState): void {
  try {
    localStorage.setItem(LOCK_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

interface PinModalProps {
  lang: Language;
  open: boolean;
  setupComplete: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  lang,
  open,
  setupComplete,
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [providerHint, setProviderHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [accountExistsLocal, setAccountExistsLocal] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ACCOUNT_KNOWN_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [lockState, setLockState] = useState<LockState>(() => readLockState());
  const [nowMs, setNowMs] = useState(() => Date.now());

  const isSetupMode = !setupComplete && !accountExistsLocal;
  const isLocked = lockState.lockedUntil > nowMs;
  const remainingSec = Math.max(0, Math.ceil((lockState.lockedUntil - nowMs) / 1000));

  useEffect(() => {
    if (!open) {
      setPin('');
      setFirstPin('');
      setConfirmStep(false);
      setErrorMsg('');
      setProviderHint(false);
      return;
    }
    setLockState(readLockState());
    setNowMs(Date.now());
  }, [open]);

  useEffect(() => {
    if (!open || !isLocked) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      if (current >= lockState.lockedUntil) {
        const cleared = { attempts: 0, lockedUntil: 0 };
        setLockState(cleared);
        writeLockState(cleared);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open, isLocked, lockState.lockedUntil]);

  const markAccountExists = () => {
    setAccountExistsLocal(true);
    try {
      localStorage.setItem(ACCOUNT_KNOWN_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const registerWrongAttempt = () => {
    const nextAttempts = lockState.attempts + 1;
    const nextState: LockState =
      nextAttempts >= MAX_ATTEMPTS
        ? { attempts: 0, lockedUntil: Date.now() + LOCK_DURATION_MS }
        : { attempts: nextAttempts, lockedUntil: 0 };
    setLockState(nextState);
    writeLockState(nextState);
    setNowMs(Date.now());
  };

  const submitPin = async (enteredPin: string) => {
    if (busy || isLocked) return;
    const t = UI_COPY[lang].pinModal;

    if (isSetupMode) {
      if (!confirmStep) {
        setFirstPin(enteredPin);
        setPin('');
        setConfirmStep(true);
        setErrorMsg('');
        return;
      }

      if (enteredPin !== firstPin) {
        setPin('');
        setFirstPin('');
        setConfirmStep(false);
        setErrorMsg(t.setupMismatch);
        return;
      }

      setBusy(true);
      setErrorMsg('');
      try {
        await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, enteredPin + PASSCODE_SUFFIX);
        markAccountExists();
        await markSetupComplete();
        const cleared = { attempts: 0, lockedUntil: 0 };
        setLockState(cleared);
        writeLockState(cleared);
        onSuccess();
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        if (code === 'auth/email-already-in-use') {
          markAccountExists();
          setPin('');
          setFirstPin('');
          setConfirmStep(false);
          setErrorMsg(t.wrongCode);
        } else if (code === 'auth/operation-not-allowed') {
          setPin('');
          setFirstPin('');
          setConfirmStep(false);
          setProviderHint(true);
        } else {
          setPin('');
          setErrorMsg(t.wrongCode);
        }
      } finally {
        setBusy(false);
      }
      return;
    }

    // Standard login mode
    setBusy(true);
    setErrorMsg('');
    setProviderHint(false);
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, enteredPin + PASSCODE_SUFFIX);
      markAccountExists();
      if (!setupComplete) {
        await markSetupComplete();
      }
      const cleared = { attempts: 0, lockedUntil: 0 };
      setLockState(cleared);
      writeLockState(cleared);
      onSuccess();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      setPin('');
      if (code === 'auth/operation-not-allowed') {
        setProviderHint(true);
      } else {
        setErrorMsg(t.wrongCode);
        registerWrongAttempt();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDigit = (digit: string) => {
    if (busy || isLocked || pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (errorMsg) setErrorMsg('');
    if (next.length === 4) {
      void submitPin(next);
    }
  };

  const handleBackspace = () => {
    if (busy || isLocked) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (busy) return;
    setPin('');
    setErrorMsg('');
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!open) return null;

  const t = UI_COPY[lang].pinModal;
  const heading = isLocked
    ? t.lockedTitle
    : isSetupMode
    ? confirmStep
      ? t.setupConfirmTitle
      : t.setupTitle
    : t.unlockTitle;

  const mins = String(Math.floor(remainingSec / 60)).padStart(2, '0');
  const secs = String(remainingSec % 60).padStart(2, '0');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-[#1C1C1C] border border-[#2F2F2F] rounded-2xl p-6 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        dir="ltr"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-[#0B0B0B] border border-[#2C2C2C] flex items-center justify-center text-[#FFD600]">
            <Lock className="w-4 h-4" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancel}
            className="w-9 h-9 rounded-xl bg-[#0B0B0B] border border-[#2C2C2C] flex items-center justify-center text-white hover:border-[#FFD600]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-display text-lg font-extrabold text-white">{heading}</h3>

          {isLocked ? (
            <p className="text-sm font-bold text-[#FFD600] tabular-nums">
              {t.lockedWait} {mins}:{secs}
            </p>
          ) : (
            <div className="flex items-center justify-center gap-3 pt-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.length > idx
                      ? 'bg-[#FFD600] border-[#FFD600] scale-110'
                      : 'bg-[#0B0B0B] border-[#3A3A3A]'
                  }`}
                />
              ))}
            </div>
          )}

          {errorMsg && !isLocked && (
            <p className="text-xs font-bold text-red-400">{errorMsg}</p>
          )}

          {providerHint && (
            <p className="text-xs text-[#FFD600] bg-[#0B0B0B] border border-[#FFD600]/30 rounded-lg p-2.5 leading-relaxed">
              {t.providerHint}
            </p>
          )}
        </div>

        {/* Numeric 4-digit PIN keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={busy || isLocked}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-xl bg-[#0B0B0B] border border-[#2C2C2C] hover:border-[#FFD600] text-xl font-extrabold text-white tabular-nums transition-colors active:scale-95 disabled:opacity-40"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            disabled={busy || isLocked}
            onClick={handleClear}
            className="h-14 rounded-xl bg-[#0B0B0B] border border-[#2C2C2C] hover:border-[#FFD600] text-xs font-bold text-[#9A9A9A] hover:text-white transition-colors active:scale-95 disabled:opacity-40"
          >
            {t.clear}
          </button>
          <button
            type="button"
            disabled={busy || isLocked}
            onClick={() => handleDigit('0')}
            className="h-14 rounded-xl bg-[#0B0B0B] border border-[#2C2C2C] hover:border-[#FFD600] text-xl font-extrabold text-white tabular-nums transition-colors active:scale-95 disabled:opacity-40"
          >
            0
          </button>
          <button
            type="button"
            disabled={busy || isLocked}
            onClick={handleBackspace}
            aria-label="Backspace"
            className="h-14 rounded-xl bg-[#0B0B0B] border border-[#2C2C2C] hover:border-[#FFD600] flex items-center justify-center text-white transition-colors active:scale-95 disabled:opacity-40"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
