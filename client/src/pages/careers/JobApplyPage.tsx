import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, type ReactNode, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { getJobById } from '../../data';
import { useAppSelector, useContentItem, useMyApplications } from '../../hooks';
import { useAlertPopup, useValidationPopup } from '../../hooks/useValidationPopup';
import { fetchJob, submitJobApplication } from '../../services';
import { RESUME_ACCEPT, type FormStatus } from '../../utils';
import {
  JOB_EXPERIENCE_OPTIONS,
  createJobApplicationSchema,
  experienceMatchesJob,
  experienceOptionLabel,
  jobExperienceMismatchMessage,
  parsePostedExperience,
  type JobApplicationValues,
} from '../../validations';
export function JobApplyPage() {
  const { jobId = '' } = useParams();
  const navigate = useNavigate();
  const { item: job, loading } = useContentItem(jobId, fetchJob, getJobById);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const popup = useValidationPopup();
  const alert = useAlertPopup();
  const { hasAppliedJob, markJobApplied } = useMyApplications();
  const accountEmail = useAppSelector((state) => state.auth.user?.email ?? '');
  const alreadyApplied = hasAppliedJob(jobId);
  const schema = useMemo(
    () => createJobApplicationSchema(job?.experience ?? ''),
    [job?.experience],
  );
  const requiredExperience = job ? parsePostedExperience(job.experience) : null;
  const requiredExperienceLabel = requiredExperience
    ? experienceOptionLabel(requiredExperience)
    : job?.experience;

  const {
    register,
    control,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    formState: { errors },
    reset,
    setValue,
  } = useForm<JobApplicationValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: accountEmail,
      phone: '',
      location: '',
      education: '',
                      experience: undefined,
      skills: '',
      linkedin: '',
      portfolio: '',
      coverLetter: '',
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

  if (loading && !job) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading role…</Typography>
      </PageContainer>
    );
  }

  if (!job) {
    return <Navigate to={ROUTES.jobs} replace />;
  }

  const onSubmit = async (values: JobApplicationValues) => {
    if (job && !experienceMatchesJob(job.experience, values.experience)) {
      const message = jobExperienceMismatchMessage(job.experience);
      setFieldError('experience', { type: 'validate', message });
      popup.showErrors({ experience: { type: 'validate', message } });
      return;
    }

    setStatus('loading');
    setError(null);
    try {
      await submitJobApplication(job.id, {
        ...values,
        email: accountEmail,
      });
      markJobApplied(job.id);
      reset();
      navigate(ROUTES.jobsApplied, { replace: true });
    } catch (err) {
      setStatus('error');
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      const already = /already applied/i.test(message);
      if (already) {
        markJobApplied(job.id);
        navigate(ROUTES.jobsApplied, { replace: true });
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
            { label: 'Careers', to: ROUTES.jobs },
            { label: job.title, to: ROUTES.jobDetail(job.id) },
            { label: 'Apply' },
          ]}
        />
        <SuccessPanel
          title="You have already applied"
          message={`Your application for ${job.title} is already on file. You cannot apply for this role again.`}
          primaryLabel="View More Jobs"
          primaryTo={ROUTES.jobs}
          secondaryLabel="Back to role"
          secondaryTo={ROUTES.jobDetail(job.id)}
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
          { label: 'Careers', to: ROUTES.jobs },
          { label: job.title, to: ROUTES.jobDetail(job.id) },
          { label: 'Apply' },
        ]}
      />

      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography component="h1" variant="h2">
          Apply for {job.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in your basic candidate details below. Fields marked required help us
          review your application for this role.
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
              <FormSection
                title="Personal details"
                description="How we can identify and reach you."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full name"
                      required
                      {...register('fullName')}
                      error={Boolean(errors.fullName)}
                      helperText={errors.fullName?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <AccountEmailField email={accountEmail} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      {...register('phone')}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Current location"
                      required
                      placeholder="City, State"
                      {...register('location')}
                      error={Boolean(errors.location)}
                      helperText={errors.location?.message}
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
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <Divider />

              <FormSection
                title="Education & experience"
                description="Your academic and professional background."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Education"
                      required
                      placeholder="Degree, college / university, year"
                      {...register('education')}
                      error={Boolean(errors.education)}
                      helperText={errors.education?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="experience"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Years of experience"
                          required
                          error={Boolean(errors.experience)}
                          helperText={
                            errors.experience?.message ??
                            (requiredExperienceLabel
                              ? `This role requires ${requiredExperienceLabel}`
                              : undefined)
                          }
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value);
                            if (!job || !value) {
                              clearErrors('experience');
                              return;
                            }
                            if (!experienceMatchesJob(job.experience, value)) {
                              setFieldError('experience', {
                                type: 'validate',
                                message: jobExperienceMismatchMessage(job.experience),
                              });
                              return;
                            }
                            clearErrors('experience');
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select range
                          </MenuItem>
                          {JOB_EXPERIENCE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Key skills"
                      required
                      placeholder="Comma-separated skills"
                      {...register('skills')}
                      error={Boolean(errors.skills)}
                      helperText={errors.skills?.message}
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <Divider />

              <FormSection
                title="Links & documents"
                description="Optional profile links plus your resume and cover letter."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="LinkedIn profile"
                      placeholder="https://linkedin.com/in/..."
                      {...register('linkedin')}
                      error={Boolean(errors.linkedin)}
                      helperText={errors.linkedin?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Portfolio / website"
                      placeholder="https://..."
                      {...register('portfolio')}
                      error={Boolean(errors.portfolio)}
                      helperText={errors.portfolio?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Cover letter"
                      required
                      multiline
                      minRows={4}
                      placeholder="Briefly explain why you are a fit for this role."
                      {...register('coverLetter')}
                      error={Boolean(errors.coverLetter)}
                      helperText={errors.coverLetter?.message}
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <TermsAccept control={control} name="acceptTerms" variant="job" />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ pt: 0.5 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={status === 'loading'}
                  sx={{ minWidth: 180 }}
                >
                  {status === 'loading' ? 'Submitting...' : 'Submit application'}
                </Button>
                <RouterButton to={ROUTES.jobDetail(job.id)} variant="outlined">
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
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.summary}
                </Typography>
              </Stack>
              <Divider />
              <Stack spacing={1}>
                <SummaryRow label="Department" value={job.department} />
                <SummaryRow label="Location" value={job.location} />
                <SummaryRow label="Experience" value={job.experience} />
                <SummaryRow label="Job type" value={job.jobType} />
              </Stack>
              <Divider />
              <Typography variant="body2" color="text.secondary">
                After you submit, you will receive a confirmation on this page. Our team
                reviews applications and contacts shortlisted candidates by email.
              </Typography>
              <RouterButton to={ROUTES.jobs} variant="text" sx={{ alignSelf: 'flex-start' }}>
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
        title="Application incomplete"
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

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: 'space-between' }}
    >
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
