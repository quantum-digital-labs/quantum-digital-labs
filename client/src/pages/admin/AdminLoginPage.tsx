import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AuthShell,
  FormErrorAlert,
  PageContainer,
  ValidationDialog,
} from '../../components';
import { COMPANY, ROUTES } from '../../constants';
import { useAppDispatch } from '../../hooks';
import { useAlertPopup, useValidationPopup } from '../../hooks/useValidationPopup';
import { loginRequest } from '../../services';
import { setCredentials } from '../../store/slices/authSlice';
import { saveSession } from '../../utils/authStorage';
import type { FormStatus } from '../../utils';
import { loginSchema, type LoginValues } from '../../validations';

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

export function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const popup = useValidationPopup();
  const alert = useAlertPopup();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' },
  });
  const emailValue = watch('email');
  const passwordValue = watch('password');

  const onSubmit = async (values: LoginValues) => {
    setStatus('loading');
    setError(null);
    try {
      const session = await loginRequest(values.email, values.password, 'admin');
      saveSession(session);
      dispatch(setCredentials(session));
      setStatus('success');
      setPendingPath(ROUTES.admin);
      alert.show({
        title: 'Admin signed in',
        message: 'Welcome to the Quantum Digital Labs CMS.',
        severity: 'success',
      });
    } catch (err) {
      setStatus('error');
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      alert.show({
        title: 'Admin sign in failed',
        message,
        severity: 'error',
      });
    }
  };

  const handleAlertClose = () => {
    alert.close();
    if (pendingPath) {
      const next = pendingPath;
      setPendingPath(null);
      navigate(next, { replace: true });
    }
  };

  return (
    <PageContainer contained={false}>
      <AuthShell
        badge="Admin Portal"
        title={`${COMPANY.shortName} CMS`}
        tagline="Staff sign in"
        description="Sign in with an admin or editor account to manage site content and applications."
        highlights={[
          'Manage jobs, internships, and services',
          'Edit portfolio, projects, and blog posts',
          'Update application statuses',
        ]}
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
          }}
        >
          <Stack spacing={0.75}>
            <Typography variant="overline" sx={{ color: 'accent.light', letterSpacing: '0.12em' }}>
              Admin Portal
            </Typography>
            <Typography variant="h4" sx={{ color: 'common.white', fontWeight: 700 }}>
              Staff sign in
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Use your Quantum Digital Labs staff credentials.
            </Typography>
          </Stack>

          <FormErrorAlert error={error} />

          <Stack
            component="form"
            spacing={2.1}
            noValidate
            onSubmit={handleSubmit(onSubmit, popup.showErrors)}
          >
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              autoComplete="username"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message || 'Staff email address'}
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
              {status === 'loading' ? 'Signing in...' : 'Sign in to CMS'}
            </Button>
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
        confirmLabel={pendingPath ? 'Continue' : 'OK'}
        onClose={handleAlertClose}
      />
    </PageContainer>
  );
}
