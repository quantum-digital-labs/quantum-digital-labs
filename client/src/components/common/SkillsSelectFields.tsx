import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import { APPLICATION_SKILL_OTHER } from '../../data/applicationSkills';

interface SkillsFormValues extends FieldValues {
  selectedSkills: string[];
  otherSkill?: string;
}

interface SkillsSelectFieldsProps<T extends SkillsFormValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  options: string[];
}

export function SkillsSelectFields<T extends SkillsFormValues>({
  control,
  errors,
  options,
}: SkillsSelectFieldsProps<T>) {
  const selectedSkillsRaw =
    useWatch({ control, name: 'selectedSkills' as Path<T> }) ?? [];
  const selectedSkills = (
    Array.isArray(selectedSkillsRaw) ? selectedSkillsRaw : []
  ) as string[];
  const showOther = selectedSkills.includes(APPLICATION_SKILL_OTHER);  const skillsError = errors.selectedSkills?.message
    ? String(errors.selectedSkills.message)
    : undefined;
  const otherError = errors.otherSkill?.message
    ? String(errors.otherSkill.message)
    : undefined;

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Controller
          name={'selectedSkills' as Path<T>}
          control={control}
          render={({ field }) => {
            const value = (Array.isArray(field.value) ? field.value : []) as string[];
            return (
              <FormControl fullWidth required error={Boolean(skillsError)}>
                <InputLabel id="application-skills-label">Skills</InputLabel>
                <Select
                  {...field}
                  labelId="application-skills-label"
                  label="Skills"
                  multiple
                  value={value}
                  onChange={(event) => {
                    const next = event.target.value;
                    field.onChange(typeof next === 'string' ? next.split(',') : next);
                  }}
                  renderValue={(selected) => {
                    const items = selected as string[];
                    return items.length === 0 ? (
                      'Select skills'
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {items.map((skill) => (
                          <Chip key={skill} size="small" label={skill} />
                        ))}
                      </Box>
                    );
                  }}
                >
                  {options.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      <Checkbox checked={value.includes(skill)} />
                      <ListItemText primary={skill} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {skillsError ?? 'Select technical skills from our openings. Choose Other if yours is not listed.'}
                </FormHelperText>
              </FormControl>
            );
          }}
        />
      </Grid>
      {showOther ? (
        <Grid size={{ xs: 12 }}>
          <Controller
            name={'otherSkill' as Path<T>}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label="Other skill"
                placeholder="Enter the skill"
                error={Boolean(otherError)}
                helperText={otherError ?? 'Required when Other is selected'}
              />
            )}
          />
        </Grid>
      ) : null}
    </>
  );
}
