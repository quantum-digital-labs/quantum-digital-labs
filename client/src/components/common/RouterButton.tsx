import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

type RouterButtonProps = ButtonProps & {
  to: string;
};

export function RouterButton({ to, children, ...props }: RouterButtonProps) {
  return (
    <Button component={RouterLink} to={to} {...props}>
      {children}
    </Button>
  );
}
