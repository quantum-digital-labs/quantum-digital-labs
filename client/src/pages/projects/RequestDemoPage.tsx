import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import {
  AlertDialog,
  AppBreadcrumbs,
  FormErrorAlert,
  PageContainer,
  RouterButton,
  SuccessPanel,
  ValidationDialog,
} from '../../components';
import { ROUTES } from '../../constants';
import { PROJECTS } from '../../data';
import { useAlertPopup, useValidationPopup } from '../../hooks/useValidationPopup';
import { submitDemo } from '../../services';
import type { FormStatus } from '../../utils';
import { requestDemoSchema, type RequestDemoValues } from '../../validations';

export function RequestDemoPage() {
  const [searchParams] = useSearchParams();
  const projectParam = searchParams.get('project') ?? '';
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | undefined>();
  const popup = useValidationPopup();
  const alert = useAlertPopup();

  const defaultProject = useMemo(() => {
    if (PROJECTS.some((item) => item.id === projectParam)) return projectParam;
    return PROJECTS[0]?.id ?? '';
  }, [projectParam]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RequestDemoValues>({
    resolver: zodResolver(requestDemoSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      project: defaultProject,
      requirements: '',
      preferredDate: '',
      message: '',
    },
  });

  const onSubmit = async (values: RequestDemoValues) => {
    setStatus('loading');
    setError(null);
    try {
      const result = await submitDemo(values);
      setReference(result.referenceNumber);
      setStatus('success');
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        project: defaultProject,
        requirements: '',
        preferredDate: '',
        message: '',
      });
      alert.show({
        title: 'Demo request submitted',
        message: result.referenceNumber
          ? `We received your demo request. Reference: ${result.referenceNumber}.`
          : 'We received your demo request and will follow up with scheduling options.',
        severity: 'success',
      });
    } catch (err) {
      setStatus('error');
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      alert.show({
        title: 'Demo request not submitted',
        message,
        severity: 'error',
      });
    }
  };

  if (status === 'success') {
    return (
      <PageContainer>
        <AppBreadcrumbs
          items={[
            { label: 'Home', to: ROUTES.home },
            { label: 'Projects', to: ROUTES.projects },
            { label: 'Request Demo' },
          ]}
        />
        <SuccessPanel
          title="Demo Request Submitted Successfully"
          message="We received your demo request and will follow up with scheduling options."
          referenceNumber={reference}
          primaryLabel="Back to Projects"
          primaryTo={ROUTES.projects}
          secondaryLabel="Back to Home"
          secondaryTo={ROUTES.home}
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

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Projects', to: ROUTES.projects },
          { label: 'Request Demo' },
        ]}
      />
      <Typography component="h1" variant="h2">
        Request Demo
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Share your requirements and preferred date. After success you return to projects.
      </Typography>
      <FormErrorAlert error={error} />

      <Stack
        component="form"
        spacing={2}
        noValidate
        onSubmit={handleSubmit(onSubmit, popup.showErrors)}
        sx={formBoxSx}
      >
        <TextField
          label="Name"
          required
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          type="email"
          required
          {...register('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <TextField
          label="Phone"
          required
          {...register('phone')}
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
        />
        <TextField
          label="Company"
          required
          {...register('company')}
          error={Boolean(errors.company)}
          helperText={errors.company?.message}
        />
        <Controller
          name="project"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Project"
              required
              error={Boolean(errors.project)}
              helperText={errors.project?.message}
            >
              {PROJECTS.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.title}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <TextField
          label="Requirements"
          required
          multiline
          minRows={4}
          {...register('requirements')}
          error={Boolean(errors.requirements)}
          helperText={errors.requirements?.message}
        />
        <TextField
          label="Preferred Date"
          type="date"
          required
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('preferredDate')}
          error={Boolean(errors.preferredDate)}
          helperText={errors.preferredDate?.message}
        />
        <TextField label="Message" multiline minRows={2} {...register('message')} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button type="submit" variant="contained" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : 'Submit Demo Request'}
          </Button>
          <RouterButton to={ROUTES.projects} variant="outlined">
            Back to Projects
          </RouterButton>
        </Stack>
      </Stack>

      <ValidationDialog
        open={popup.open}
        fields={popup.fields}
        onClose={popup.close}
        title="Demo request incomplete"
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

const formBoxSx = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;
