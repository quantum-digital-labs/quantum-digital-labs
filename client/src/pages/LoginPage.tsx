import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AuthShell,
  FormErrorAlert,
  PageContainer,
  ValidationDialog,
} from '../components';
import { COMPANY, ROUTES } from '../constants';
import { useAppDispatch } from '../hooks';
import { useAlertPopup, useValidationPopup } from '../hooks/useValidationPopup';
import { loginRequest, resendVerificationRequest, verifyEmailByCodeRequest } from '../services';
import { setCredentials } from '../store/slices/authSlice';
import { saveSession } from '../utils/authStorage';
import type { FormStatus } from '../utils';
import { goldLinkSx } from '../theme/surfaces';
import { loginSchema, type LoginValues } from '../validations';

const fieldSx = {
  '& .MuiInputBase-root': {
    bgcolor: 'rgba(255,255,255,0.98)',
    borderRadius: 2,
    minHeight: 56,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.18)',
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    width: 0,
  },
  '& .MuiFormHelperText-root': {
    minHeight: 18,
    mx: 0,
    mt: 0.6,
    color: 'rgba(255,255,255,0.65)',
  },
  '& .MuiFormHelperText-root.Mui-error': {
    color: '#FFB4A8',
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(46px, 16px) scale(1)',
    color: 'rgba(12, 35, 64, 0.48)',
  },
  '& .MuiInputLabel-root.Mui-error': {
    color: '#C62828',
  },
  '& .MuiInputLabel-shrink': {
    display: 'none',
  },
} as const;

const LOGIN_HIGHLIGHTS = [
  'Required to apply for jobs and internships',
  'Required to submit a quote request',
  'The rest of the website stays open to everyone',
] as const;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const popup = useValidationPopup();
  const alert = useAlertPopup();
  const locationState = (location.state as { from?: string; email?: string } | null) ?? {};
  const from =
    locationState.from &&
    locationState.from !== ROUTES.login &&
    locationState.from !== ROUTES.register &&
    locationState.from !== ROUTES.verifyEmail
      ? locationState.from
      : ROUTES.home;

  const authReason = from.startsWith(ROUTES.jobsApplied)
    ? 'Sign in to view and track the jobs you have applied for.'
    : from.startsWith(ROUTES.internshipsApplied)
      ? 'Sign in to view and track the internships you have applied for.'
      : from.startsWith(ROUTES.admin) || from.startsWith(ROUTES.adminLogin)
        ? 'Sign in with a staff account to open the admin CMS.'
        : from.includes('/apply')
          ? 'Sign in or register to submit this application.'
          : from.startsWith(ROUTES.quote)
            ? 'Sign in or register to send a quote request.'
            : null;

  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [needsRegister, setNeedsRegister] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { email: locationState.email?.trim() ?? '', password: '' },
  });
  const emailValue = watch('email');
  const passwordValue = watch('password');

  const isUnverifiedMessage = (message: string) =>
    /verify your email|verification link|not verified/i.test(message);

  const isRegisterRequiredMessage = (message: string) =>
    /register first to login/i.test(message);

  const finishSignIn = (session: Awaited<ReturnType<typeof loginRequest>>) => {
    saveSession(session);
    dispatch(setCredentials(session));
    setStatus('success');
    setNeedsVerification(false);
    setPendingPath(from);
    alert.show({
      title: 'Signed in successfully',
      message: 'Welcome back. You can continue your application or quote request.',
      severity: 'success',
    });
  };

  const handleVerifyCode = async () => {
    const email = emailValue.trim();
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
        message: 'The verification email contains a 6-digit code. Type it here — do not open the link from your mail app.',
        severity: 'warning',
      });
      return;
    }

    setVerifyingCode(true);
    try {
      await verifyEmailByCodeRequest(email, code);
      if (passwordValue) {
        const session = await loginRequest(email, passwordValue);
        finishSignIn(session);
        return;
      }
      alert.show({
        title: 'Email verified',
        message: 'Your email is verified. Enter your password and sign in.',
        severity: 'success',
      });
      setNeedsVerification(false);
    } catch (err) {
      alert.show({
        title: 'Could not verify',
        message: err instanceof Error ? err.message : 'Please request a new code.',
        severity: 'error',
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResendVerification = async (email: string) => {
    const target = email.trim();
    if (!target) {
      alert.show({
        title: 'Email required',
        message: 'Enter the email address you used to register, then request a new verification link.',
        severity: 'warning',
      });
      return;
    }

    setResending(true);
    try {
      await resendVerificationRequest(target);
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

  const onSubmit = async (values: LoginValues) => {
    setStatus('loading');
    setError(null);
    setNeedsVerification(false);
    setNeedsRegister(false);
    try {
      const session = await loginRequest(values.email, values.password, 'public');
      finishSignIn(session);
    } catch (err) {
      setStatus('error');
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      const unverified = isUnverifiedMessage(message);
      const mustRegister = isRegisterRequiredMessage(message);
      setNeedsVerification(unverified);
      setNeedsRegister(mustRegister);

      if (mustRegister) {
        alert.show({
          title: 'Account not found',
          message: 'Register first to login',
          severity: 'warning',
        });
        return;
      }

      const isCredentialIssue =
        !unverified &&
        /incorrect|no account|password|email|credentials|invalid email or password/i.test(
          message,
        );
      alert.show({
        title: unverified
          ? 'Email not verified'
          : isCredentialIssue
            ? 'Invalid credentials'
            : 'Sign in failed',
        message: unverified
          ? `${message} Enter the 6-digit code from your email here. Do not open the link in your mail app.`
          : isCredentialIssue
            ? `${message} Please check your email and password, or register a new account.`
            : message,
        severity: unverified ? 'warning' : 'error',
      });
    }
  };

  const handleAlertClose = () => {
    const goRegister = needsRegister;
    const emailForRegister = emailValue.trim();
    alert.close();
    setNeedsRegister(false);
    if (goRegister) {
      navigate(ROUTES.register, {
        replace: true,
        state: { email: emailForRegister, from },
      });
      return;
    }
    if (pendingPath) {
      const next = pendingPath;
      setPendingPath(null);
      navigate(next, { replace: true });
    }
  };

  return (
    <PageContainer contained={false}>
      <AuthShell
        badge="Member access"
        title={`Welcome back to ${COMPANY.brandName}`}
        tagline={COMPANY.tagline}
        description="Sign in to apply for a job or internship, or to request a quote. You can browse the rest of the site without an account."
        highlights={LOGIN_HIGHLIGHTS}
      >
        <Box
          className="qdl-fade-up"
          sx={{
            width: '100%',
            maxWidth: 440,
            p: { xs: 2.75, sm: 3.5 },
            borderRadius: 3.5,
            border: '1px solid rgba(184, 149, 107, 0.35)',
            bgcolor: 'rgba(7, 24, 40, 0.78)',
            backdropFilter: 'blur(22px)',
            boxShadow:
              '0 28px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.25,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: -40,
              right: -30,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(184,149,107,0.28), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <Stack spacing={0.75} sx={{ position: 'relative' }}>
            <Typography variant="overline" sx={{ color: 'accent.light', letterSpacing: '0.12em' }}>
              Secure sign in
            </Typography>
            <Typography variant="h4" sx={{ color: 'common.white', fontWeight: 700 }}>
              Sign in
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {authReason ?? 'Enter your details to continue.'}
            </Typography>
          </Stack>

          <Alert
            severity="info"
            sx={{
              bgcolor: 'rgba(184, 149, 107, 0.12)',
              color: 'common.white',
              border: '1px solid rgba(184, 149, 107, 0.3)',
              borderRadius: 2,
              '& .MuiAlert-icon': { color: 'accent.light' },
            }}
          >
            New here?{' '}
            <Link component={RouterLink} to={ROUTES.register} sx={{ ...goldLinkSx, color: 'accent.light' }}>
              Create an account
            </Link>{' '}
            — then sign in with the same email and password.
          </Alert>

          <FormErrorAlert error={error} />

          {needsVerification ? (
            <Alert
              severity="warning"
              sx={{
                bgcolor: 'rgba(184, 149, 107, 0.14)',
                color: 'common.white',
                border: '1px solid rgba(184, 149, 107, 0.38)',
                borderRadius: 2,
                '& .MuiAlert-icon': { color: 'accent.light' },
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              <Stack spacing={1.25}>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  This account is not verified yet. Enter the 6-digit code from your
                  email — mail apps cannot open localhost links.
                </Typography>
                <TextField
                  label="6-digit code"
                  value={verifyCode}
                  onChange={(event) =>
                    setVerifyCode(event.target.value.replace(/[^\d]/g, '').slice(0, 6))
                  }
                  slotProps={{
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
                    '& .MuiInputBase-root': {
                      bgcolor: 'rgba(255,255,255,0.98)',
                    },
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      letterSpacing: '0.45em',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                    },
                    '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
                      left: '50%',
                      transform: 'translate(-50%, 16px)',
                      width: 'max-content',
                    },
                  }}
                />
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={verifyingCode || status === 'loading'}
                    onClick={() => void handleVerifyCode()}
                    sx={{
                      fontWeight: 700,
                      bgcolor: 'accent.main',
                      color: 'accent.contrastText',
                      '&:hover': { bgcolor: 'accent.light' },
                    }}
                  >
                    {verifyingCode ? 'Verifying…' : 'Verify email'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={resending || status === 'loading'}
                    onClick={() => void handleResendVerification(emailValue)}
                    sx={{
                      fontWeight: 700,
                      color: 'accent.light',
                      borderColor: 'rgba(184, 149, 107, 0.55)',
                    }}
                  >
                    {resending ? 'Sending…' : 'Resend code'}
                  </Button>
                </Stack>
              </Stack>
            </Alert>
          ) : null}

          <Stack
            component="form"
            spacing={2.1}
            noValidate
            onSubmit={handleSubmit(onSubmit, popup.showErrors)}
            sx={{ position: 'relative' }}
          >
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              autoComplete="email"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message || 'Use the email you registered with'}
              slotProps={{
                inputLabel: { shrink: Boolean(emailValue) },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: 'rgba(12,35,64,0.45)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={errors.password?.message || 'At least 8 characters'}
              slotProps={{
                inputLabel: { shrink: Boolean(passwordValue) },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'rgba(12,35,64,0.45)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />

            <Stack spacing={1.5} sx={{ pt: 0.25 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={status === 'loading'}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  py: 1.4,
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: 'accent.main',
                  color: 'accent.contrastText',
                  boxShadow: '0 10px 28px rgba(184, 149, 107, 0.35)',
                  '&:hover': {
                    bgcolor: 'accent.light',
                    boxShadow: '0 14px 34px rgba(184, 149, 107, 0.42)',
                  },
                }}
              >
                {status === 'loading' ? 'Signing in...' : 'Sign in to continue'}
              </Button>
              <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Don&apos;t have an account?{' '}
                <Link component={RouterLink} to={ROUTES.register} underline="hover" sx={goldLinkSx}>
                  Register free
                </Link>
                {' · '}
                <Link
                  component={RouterLink}
                  to={ROUTES.verifyEmail}
                  underline="hover"
                  sx={goldLinkSx}
                >
                  Verify email
                </Link>
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: 'wrap',
              pt: 0.5,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              mt: 0.5,
            }}
          >
            {['Services', 'Careers', 'Internships'].map((label) => (
              <Box
                key={label}
                sx={{
                  px: 1.1,
                  py: 0.4,
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                {label}
              </Box>
            ))}
          </Stack>
        </Box>
      </AuthShell>

      <ValidationDialog
        open={popup.open}
        fields={popup.fields}
        onClose={popup.close}
        title="Sign in incomplete"
        message="Please fix these fields before continuing:"
      />
      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        confirmLabel={
          pendingPath ? 'Continue' : needsRegister ? 'Register' : 'OK'
        }
        secondaryLabel={
          needsRegister
            ? 'Cancel'
            : needsVerification && alert.severity === 'warning'
              ? resending
                ? 'Sending…'
                : 'Resend code'
              : undefined
        }
        secondaryDisabled={needsRegister ? false : resending}
        onSecondary={
          needsRegister
            ? () => {
                setNeedsRegister(false);
                alert.close();
              }
            : needsVerification && alert.severity === 'warning'
              ? () => {
                  alert.close();
                  void handleResendVerification(emailValue);
                }
              : undefined
        }
        onClose={handleAlertClose}
      />
    </PageContainer>
  );
}
