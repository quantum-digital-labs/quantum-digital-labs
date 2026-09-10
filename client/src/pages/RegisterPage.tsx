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
import { useAlertPopup, useValidationPopup } from '../hooks/useValidationPopup';
import { registerRequest } from '../services';
import type { FormStatus } from '../utils';
import { authPanel, goldLinkSx, primaryButtonSx } from '../theme/surfaces';
import { registerSchema, type RegisterValues } from '../validations';

const fieldSx = {
  '& .MuiInputBase-root': {
    bgcolor: 'rgba(255,255,255,0.97)',
    borderRadius: 2,
    minHeight: 56,
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    width: 0,
  },
  '& .MuiFormHelperText-root': {
    minHeight: 20,
    mx: 0,
    mt: 0.75,
    color: 'rgba(255,255,255,0.72)',
  },
  '& .MuiFormHelperText-root.Mui-error': {
    color: '#FFB4A8',
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(16px, 16px) scale(1)',
    color: 'rgba(12, 35, 64, 0.48)',
  },
  '& .MuiInputLabel-root.Mui-error': {
    color: '#C62828',
  },
  '& .MuiInputLabel-shrink': {
    display: 'none',
  },
} as const;

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const popup = useValidationPopup();
  const alert = useAlertPopup();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const locationEmail =
    (location.state as { email?: string } | null)?.email?.trim() ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: locationEmail,
      password: '',
      confirmPassword: '',
    },
  });
  const emailValue = watch('email');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = async (values: RegisterValues) => {
    setStatus('loading');
    setError(null);
    try {
      const result = await registerRequest(values.email, values.password);
      setStatus('success');
      setPendingVerifyEmail(result.email);
      alert.show({
        title: 'Verify your email',
        message: 'To sign in to your account, first verify your email',
        severity: 'success',
      });
    } catch (err) {
      setStatus('error');
      const message =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.';
      setError(message);
      const alreadyExists = /already exists|sign in|not verified|resend/i.test(message);
      if (/not verified|resend/i.test(message)) {
        setPendingVerifyEmail(values.email);
      }
      alert.show({
        title: alreadyExists ? 'Account already exists' : 'Registration failed',
        message,
        severity: alreadyExists ? 'warning' : 'error',
      });
    }
  };

  const handleAlertClose = () => {
    alert.close();
    if (pendingVerifyEmail) {
      const email = pendingVerifyEmail;
      setPendingVerifyEmail(null);
      navigate(
        `${ROUTES.verifyEmail}?email=${encodeURIComponent(email)}`,
        { replace: true, state: { email, justRegistered: true } },
      );
    }
  };

  return (
    <PageContainer contained={false}>
      <AuthShell
        title={`Join ${COMPANY.brandName}`}
        tagline={COMPANY.tagline}
        description="Create your account to access services, careers, and the full Quantum Digital Labs experience."
      >
        <Box className="qdl-fade-up" sx={{ ...authPanel, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          <Stack spacing={0.75}>
            <Typography variant="h4" sx={{ color: 'common.white' }}>
              Create account
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Fill in the details below. Password fields must match.
            </Typography>
          </Stack>

          <Alert
            severity="info"
            sx={{
              bgcolor: 'rgba(46, 90, 140, 0.22)',
              color: 'common.white',
              border: '1px solid rgba(184, 149, 107, 0.25)',
              '& .MuiAlert-icon': { color: 'accent.light' },
            }}
          >
            After you create an account we email a 6-digit code. Enter that code to activate your account, then sign in.
          </Alert>

          <FormErrorAlert error={error} />

          <Stack
            component="form"
            spacing={2.25}
            noValidate
            onSubmit={handleSubmit(onSubmit, popup.showErrors)}
          >
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              autoComplete="email"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message || 'We will send a 6-digit verification code here'}
              slotProps={{ inputLabel: { shrink: Boolean(emailValue) } }}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={
                errors.password?.message ||
                'At least 8 characters, with a letter, a number, and a special character'
              }
              slotProps={{
                inputLabel: { shrink: Boolean(passwordValue) },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((value) => !value)}
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
            <TextField
              fullWidth
              label="Confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              {...register('confirmPassword')}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message || 'Re-enter the same password'}
              slotProps={{
                inputLabel: { shrink: Boolean(confirmPasswordValue) },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                        }
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
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

            <Stack spacing={1.5} sx={{ pt: 0.5 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={status === 'loading'}
                sx={{
                  ...primaryButtonSx,
                  bgcolor: 'accent.main',
                  color: 'accent.contrastText',
                  '&:hover': { bgcolor: 'accent.light' },
                }}
              >
                {status === 'loading' ? 'Creating account...' : 'Create account'}
              </Button>
              <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                Already registered?{' '}
                <Link component={RouterLink} to={ROUTES.login} underline="hover" sx={goldLinkSx}>
                  Sign in
                </Link>
                {' · '}
                <Link
                  component={RouterLink}
                  to={ROUTES.verifyEmail}
                  underline="hover"
                  sx={goldLinkSx}
                >
                  Resend verification
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </AuthShell>

      <ValidationDialog
        open={popup.open}
        fields={popup.fields}
        onClose={popup.close}
        title="Registration incomplete"
        message="Please fix these fields before continuing:"
      />
      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        confirmLabel={pendingVerifyEmail ? 'Enter verification code' : 'OK'}
        onClose={handleAlertClose}
      />
    </PageContainer>
  );
}
