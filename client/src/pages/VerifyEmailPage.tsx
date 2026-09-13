import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertDialog, AuthShell, PageContainer } from '../components';
import { COMPANY, ROUTES } from '../constants';
import { useAppDispatch } from '../hooks';
import { useAlertPopup } from '../hooks/useValidationPopup';
import {
  resendVerificationRequest,
  verifyEmailByCodeRequest,
  verifyEmailRequest,
} from '../services';
import { setCredentials } from '../store/slices/authSlice';
import { authPanel, goldLinkSx, primaryButtonSx } from '../theme/surfaces';
import { saveSession } from '../utils/authStorage';

type VerifyState = 'idle' | 'loading' | 'success' | 'error';

type VerifyLocationState = {
  email?: string;
  justRegistered?: boolean;
};

function holdViewportOnFocus() {
  const { scrollX, scrollY } = window;
  requestAnimationFrame(() => {
    window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
  });
}

export function VerifyEmailPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const locationState = (location.state as VerifyLocationState | null) ?? {};
  const emailFromQuery = searchParams.get('email')?.trim() ?? '';
  const initialEmail = locationState.email?.trim() || emailFromQuery;
  const alert = useAlertPopup();
  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'idle');
  const [goLogin, setGoLogin] = useState(false);
  const [message, setMessage] = useState(
    token
      ? 'Verifying your email…'
      : locationState.justRegistered && initialEmail
        ? `We sent a 6-digit code to ${initialEmail}. Enter it below to activate your account.`
        : 'Enter the 6-digit code from your email. Do not open a localhost link from your mail app.',
  );
  const [resendEmail, setResendEmail] = useState(initialEmail);
  const [verifyCode, setVerifyCode] = useState('');
  const [resending, setResending] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await verifyEmailRequest(token);
        if (cancelled) return;
        setState('success');
        setMessage(result.message);
        setGoLogin(true);
        alert.show({
          title: 'Email verified',
          message: 'Your email is verified. Continue to sign in.',
          severity: 'success',
        });
      } catch (err) {
        if (cancelled) return;
        setState('error');
        setMessage(
          err instanceof Error
            ? err.message
            : 'Verification failed. Please request a new link.',
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleVerifyCode = async () => {
    const email = resendEmail.trim();
    const code = verifyCode.replace(/\s/g, '');
    if (!email) {
      alert.show({
        title: 'Email required',
        message: 'Enter the email address you used to register.',
        severity: 'warning',
      });
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      alert.show({
        title: 'Enter the 6-digit code',
        message: 'Type the code from your verification email.',
        severity: 'warning',
      });
      return;
    }

    setVerifyingCode(true);
    try {
      const session = await verifyEmailByCodeRequest(email, code);
      saveSession(session);
      dispatch(setCredentials(session));
      setState('success');
      setMessage('Email verified. You are now signed in.');
      setGoLogin(true);
      alert.show({
        title: 'Email verified',
        message: 'Your email is verified and you are now signed in.',
        severity: 'success',
      });
    } catch (err) {
      setState('error');
      setMessage(
        err instanceof Error ? err.message : 'Verification failed. Please request a new code.',
      );
    } finally {
      setVerifyingCode(false);
    }
  };

  /** After verifying, the user is already signed in (verifyOtp establishes a
   * session) — send them onward instead of back through a login form. */
  const goAfterVerify = () => {
    navigate(ROUTES.home, { replace: true });
  };

  const handleAlertClose = () => {
    alert.close();
    if (goLogin) {
      setGoLogin(false);
      goAfterVerify();
    }
  };

  const handleResend = async () => {
    const email = resendEmail.trim();
    if (!email) {
      alert.show({
        title: 'Email required',
        message: 'Enter the email address you used to register.',
        severity: 'warning',
      });
      return;
    }
    setResending(true);
    try {
      await resendVerificationRequest(email);
      alert.show({
        title: 'Verify your email',
        message: 'To sign in to your account, first verify your email',
        severity: 'success',
      });
    } catch (err) {
      alert.show({
        title: 'Could not resend',
        message: err instanceof Error ? err.message : 'Please try again.',
        severity: 'error',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <PageContainer contained={false}>
      <AuthShell
        title={`Verify email · ${COMPANY.brandName}`}
        tagline={COMPANY.tagline}
        description="Confirm your email address to activate your account and sign in."
      >
        <Box
          className="qdl-fade-up"
          sx={{ ...authPanel, display: 'flex', flexDirection: 'column', gap: 2.25 }}
        >
          <Typography variant="h4" sx={{ color: 'common.white' }}>
            Email verification
          </Typography>

          {state === 'loading' ? (
            <Stack spacing={2} sx={{ alignItems: 'center', py: 2 }}>
              <CircularProgress sx={{ color: 'accent.main' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                {message}
              </Typography>
            </Stack>
          ) : (
            <Alert
              severity={
                state === 'success' ? 'success' : state === 'error' ? 'error' : 'info'
              }
              sx={{
                bgcolor: 'rgba(46, 90, 140, 0.22)',
                color: 'common.white',
                border: '1px solid rgba(184, 149, 107, 0.25)',
                '& .MuiAlert-icon': { color: 'accent.light' },
              }}
            >
              {message}
            </Alert>
          )}

          {state === 'success' ? (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={goAfterVerify}
              sx={{
                ...primaryButtonSx,
                bgcolor: 'accent.main',
                color: 'accent.contrastText',
                '&:hover': { bgcolor: 'accent.light' },
              }}
            >
              Continue
            </Button>
          ) : (
            <Stack spacing={1.75}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Enter the email you registered with and the 6-digit code from your inbox.
              </Typography>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={resendEmail}
                onChange={(event) => setResendEmail(event.target.value)}
                onFocus={holdViewportOnFocus}
                slotProps={{
                  inputLabel: { shrink: Boolean(resendEmail) },
                }}
                sx={{
                  '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,0.97)' },
                  '& .MuiOutlinedInput-notchedOutline legend': { width: 0 },
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                  },
                  '& .MuiInputLabel-root': {
                    left: '50%',
                    transform: 'translate(-50%, 16px) scale(1)',
                    width: 'max-content',
                  },
                  '& .MuiInputLabel-shrink': {
                    display: 'none',
                  },
                }}
              />
              <TextField
                label="6-digit code"
                value={verifyCode}
                onChange={(event) =>
                  setVerifyCode(event.target.value.replace(/[^\d]/g, '').slice(0, 6))
                }
                onFocus={holdViewportOnFocus}
                slotProps={{
                  inputLabel: { shrink: Boolean(verifyCode) },
                  htmlInput: {
                    inputMode: 'numeric',
                    maxLength: 6,
                    style: { textAlign: 'center', letterSpacing: '0.45em' },
                  },
                }}
                sx={{
                  width: '100%',
                  maxWidth: 260,
                  alignSelf: 'center',
                  '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,0.97)' },
                  '& .MuiOutlinedInput-notchedOutline legend': { width: 0 },
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    letterSpacing: '0.45em',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  },
                  '& .MuiInputLabel-root': {
                    left: '50%',
                    transform: 'translate(-50%, 16px) scale(1)',
                    width: 'max-content',
                  },
                  '& .MuiInputLabel-shrink': {
                    display: 'none',
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                disabled={verifyingCode}
                onClick={() => void handleVerifyCode()}
                sx={{
                  ...primaryButtonSx,
                  bgcolor: 'accent.main',
                  color: 'accent.contrastText',
                  '&:hover': { bgcolor: 'accent.light' },
                }}
              >
                {verifyingCode ? 'Verifying…' : 'Verify email'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                disabled={resending}
                onClick={() => void handleResend()}
                sx={{
                  color: 'accent.light',
                  borderColor: 'rgba(184, 149, 107, 0.55)',
                }}
              >
                {resending ? 'Sending…' : 'Resend code'}
              </Button>
              <Typography
                variant="body2"
                align="center"
                sx={{ color: 'rgba(255,255,255,0.72)' }}
              >
                Ready to sign in?{' '}
                <Link
                  component={RouterLink}
                  to={ROUTES.login}
                  underline="hover"
                  sx={goldLinkSx}
                >
                  Sign in
                </Link>
              </Typography>
            </Stack>
          )}
        </Box>
      </AuthShell>

      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        confirmLabel={goLogin ? 'Continue to sign in' : 'OK'}
        onClose={handleAlertClose}
      />
    </PageContainer>
  );
}
