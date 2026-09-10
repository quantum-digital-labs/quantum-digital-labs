import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  AccountEmailField,
  AlertDialog,
  AppBreadcrumbs,
  FormErrorAlert,
  PageContainer,
  RouterButton,
  SuccessPanel,
  TermsAccept,
  ValidationDialog,
} from '../../components';
import { ROUTES } from '../../constants';
import { getInternshipById } from '../../data';
import { useAppSelector, useContentItem, useMyApplications } from '../../hooks';
import { useAlertPopup, useValidationPopup } from '../../hooks/useValidationPopup';
import { fetchInternship, submitInternshipApplication } from '../../services';
import { RESUME_ACCEPT, type FormStatus } from '../../utils';
import {
  internshipApplicationSchema,
  type InternshipApplicationValues,
} from '../../validations';

const fieldSx = {
  '& .MuiFormHelperText-root': {
    minHeight: 20,
    mx: 0,
    mt: 0.75,
  },
} as const;

export function InternshipApplyPage() {
  const { internshipId = '' } = useParams();
  const navigate = useNavigate();
  const { item, loading } = useContentItem(
    internshipId,
    fetchInternship,
    getInternshipById,
  );
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const popup = useValidationPopup();
  const alert = useAlertPopup();
  const { hasAppliedInternship, markInternshipApplied } = useMyApplications();
  const accountEmail = useAppSelector((state) => state.auth.user?.email ?? '');
  const alreadyApplied = hasAppliedInternship(internshipId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InternshipApplicationValues>({
    resolver: zodResolver(internshipApplicationSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: accountEmail,
      phone: '',
      college: '',
      course: '',
      year: '',
      skills: '',
      message: '',
      panNumber: '',
      aadhaarNumber: '',
      acceptTerms: false,
      resume: undefined,
    },
  });

  useEffect(() => {
    if (accountEmail) {
      setValue('email', accountEmail);
    }
  }, [accountEmail, setValue]);

  if (loading && !item) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading internship…</Typography>
      </PageContainer>
    );
  }

  if (!item) {
    return <Navigate to={ROUTES.internships} replace />;
  }

  const onSubmit = async (values: InternshipApplicationValues) => {
    setStatus('loading');
    setError(null);
    try {
      await submitInternshipApplication(item.id, {
        ...values,
        email: accountEmail,
      });
      markInternshipApplied(item.id);
      reset();
      navigate(ROUTES.internshipsApplied, { replace: true });
    } catch (err) {
      setStatus('error');
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      const already = /already applied/i.test(message);
      if (already) {
        markInternshipApplied(item.id);
        navigate(ROUTES.internshipsApplied, { replace: true });
        return;
      }
      alert.show({
        title: 'Application not submitted',
        message,
        severity: 'error',
      });
    }
  };

  if (alreadyApplied) {
    return (
      <PageContainer>
        <AppBreadcrumbs
          items={[
            { label: 'Home', to: ROUTES.home },
            { label: 'Internships', to: ROUTES.internships },
            { label: item.role, to: ROUTES.internshipDetail(item.id) },
            { label: 'Apply' },
          ]}
        />
        <SuccessPanel
          title="You have already applied"
          message={`Your application for ${item.role} is already on file. You cannot apply for this role again.`}
          primaryLabel="View Internship Roles"
          primaryTo={ROUTES.internships}
          secondaryLabel="Back to role"
          secondaryTo={ROUTES.internshipDetail(item.id)}
        />
        <Button variant="contained" disabled sx={{ alignSelf: 'flex-start', minWidth: 180 }}>
          Applied
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Internships', to: ROUTES.internships },
          { label: item.role, to: ROUTES.internshipDetail(item.id) },
          { label: 'Apply' },
        ]}
      />

      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography component="h1" variant="h2">
          Apply for {item.role}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete your basic details for this internship role. Required fields help us
          review your application.
        </Typography>
      </Stack>

      <FormErrorAlert error={error} />

      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit, popup.showErrors)}
            sx={formBoxSx}
          >
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Typography variant="h6">Personal details</Typography>
                <Typography variant="body2" color="text.secondary">
                  How we can identify and reach you.
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full name"
                    required
                    {...register('fullName')}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AccountEmailField email={accountEmail} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    required
                    {...register('phone')}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="PAN number"
                    required
                    placeholder="ABCDE1234F"
                    slotProps={{
                      htmlInput: { maxLength: 10, style: { textTransform: 'uppercase' } },
                    }}
                    {...register('panNumber')}
                    error={Boolean(errors.panNumber)}
                    helperText={errors.panNumber?.message || '10-character PAN'}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Aadhaar number"
                    required
                    placeholder="XXXX XXXX XXXX"
                    slotProps={{
                      htmlInput: { maxLength: 14 },
                    }}
                    {...register('aadhaarNumber')}
                    error={Boolean(errors.aadhaarNumber)}
                    helperText={errors.aadhaarNumber?.message || '12-digit Aadhaar number'}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="College / University"
                    required
                    {...register('college')}
                    error={Boolean(errors.college)}
                    helperText={errors.college?.message}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Stack spacing={0.5}>
                <Typography variant="h6">Academic details</Typography>
                <Typography variant="body2" color="text.secondary">
                  Your course background for this internship role.
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Course"
                    required
                    {...register('course')}
                    error={Boolean(errors.course)}
                    helperText={errors.course?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Year"
                    required
                    placeholder="e.g. 2026"
                    inputMode="numeric"
                    autoComplete="off"
                    {...register('year', {
                      onChange: (event) => {
                        const digits = String(event.target.value)
                          .replace(/\D/g, '')
                          .slice(0, 4);
                        event.target.value = digits;
                      },
                    })}
                    error={Boolean(errors.year)}
                    helperText={errors.year?.message ?? 'Enter a 4-digit year'}
                    slotProps={{
                      htmlInput: {
                        maxLength: 4,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                      },
                    }}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Skills"
                    required
                    placeholder="Comma-separated skills"
                    {...register('skills')}
                    error={Boolean(errors.skills)}
                    helperText={errors.skills?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Message"
                    required
                    multiline
                    minRows={3}
                    placeholder="Why are you interested in this internship role?"
                    {...register('message')}
                    error={Boolean(errors.message)}
                    helperText={errors.message?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="resume"
                    control={control}
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <TextField
                        fullWidth
                        type="file"
                        label="Resume"
                        required
                        name={name}
                        inputRef={ref}
                        onBlur={onBlur}
                        onChange={(event) => {
                          const files = (event.target as HTMLInputElement).files;
                          onChange(files && files.length > 0 ? files : undefined);
                        }}
                        slotProps={{
                          inputLabel: { shrink: true },
                          htmlInput: { accept: RESUME_ACCEPT },
                        }}
                        error={Boolean(errors.resume)}
                        helperText={
                          typeof errors.resume?.message === 'string'
                            ? errors.resume.message
                            : 'PDF, DOC, or DOCX up to 5MB'
                        }
                        sx={fieldSx}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <TermsAccept control={control} name="acceptTerms" variant="internship" />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={status === 'loading'}
                  sx={{ minWidth: 180 }}
                >
                  {status === 'loading' ? 'Submitting...' : 'Submit application'}
                </Button>
                <RouterButton to={ROUTES.internshipDetail(item.id)} variant="outlined">
                  Back to role details
                </RouterButton>
              </Stack>
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={summaryPanelSx}>
            <Stack spacing={2}>
              <Typography variant="h5">Role summary</Typography>
              <Stack spacing={0.75}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.summary}
                </Typography>
              </Stack>
              <Divider />
              <Stack spacing={1}>
                <SummaryRow label="Domain" value={item.domain} />
                <SummaryRow label="Duration" value={item.duration} />
                <SummaryRow label="Mode" value={item.mode} />
              </Stack>
              <RouterButton
                to={ROUTES.internships}
                variant="text"
                sx={{ alignSelf: 'flex-start' }}
              >
                Browse other roles
              </RouterButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <ValidationDialog
        open={popup.open}
        fields={popup.fields}
        onClose={popup.close}
        title="Internship application incomplete"
        message="Please complete these required fields before submitting:"
      />
      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={alert.close}
      />
    </PageContainer>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  );
}

const formBoxSx = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;

const summaryPanelSx = {
  position: { md: 'sticky' },
  top: { md: 96 },
  p: { xs: 2.5, md: 3 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;
