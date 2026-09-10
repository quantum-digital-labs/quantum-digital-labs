import { useCallback, useState } from 'react';
import type { FieldErrors, FieldValues } from 'react-hook-form';
import type { AlertSeverity } from '../components/common/AlertDialog';

function collectMessages(errors: FieldErrors<FieldValues>, prefix = ''): string[] {
  const messages: string[] = [];

  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;
    const label = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && 'message' in value && value.message) {
      messages.push(String(value.message));
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      messages.push(...collectMessages(value as FieldErrors<FieldValues>, label));
    }
  }

  return messages;
}

/** Blur focused inputs before opening a modal so aria-hidden is not applied to a focused ancestor. */
function releaseFocusBeforeModal(): void {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }
}

/** Allow MUI Select/Menu to unmount before Dialog sets aria-hidden on ancestors. */
const MODAL_FOCUS_SETTLE_MS = 50;

export function useValidationPopup() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<string[]>([]);

  const showErrors = useCallback((errors: FieldErrors<FieldValues>) => {
    const messages = collectMessages(errors);
    if (messages.length === 0) return;
    releaseFocusBeforeModal();
    setFields(messages);
    window.setTimeout(() => setOpen(true), MODAL_FOCUS_SETTLE_MS);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return {
    open,
    fields,
    showErrors,
    close,
  };
}

interface AlertState {
  open: boolean;
  title: string;
  message: string;
  severity: AlertSeverity;
}

const idleAlert: AlertState = {
  open: false,
  title: '',
  message: '',
  severity: 'error',
};

/** Popup helper for invalid credentials, submit failures, and similar alerts. */
export function useAlertPopup() {
  const [state, setState] = useState<AlertState>(idleAlert);

  const show = useCallback(
    (options: { title: string; message: string; severity?: AlertSeverity }) => {
      releaseFocusBeforeModal();
      window.setTimeout(() => {
        releaseFocusBeforeModal();
        setState({
          open: true,
          title: options.title,
          message: options.message,
          severity: options.severity ?? 'error',
        });
      }, MODAL_FOCUS_SETTLE_MS);
    },
    [],
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    open: state.open,
    title: state.title,
    message: state.message,
    severity: state.severity,
    show,
    close,
  };
}
