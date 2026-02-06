'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@/components/ui/error-message';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  prefix?: string;
  // Forward all Input props
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'none';
  autoComplete?: string;
  maxLength?: number;
  style?: React.CSSProperties;
  /** Additional content to render after the label (e.g. toggle button) */
  labelSuffix?: React.ReactNode;
}

export function FormField({
  id,
  label,
  required = false,
  error,
  prefix,
  labelSuffix,
  style: wrapperStyle,
  ...inputProps
}: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', ...wrapperStyle }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {labelSuffix}
      </div>
      <Input
        id={id}
        prefix={prefix}
        error={!!error}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {error && <ErrorMessage id={`${id}-error`} message={error} visible />}
    </div>
  );
}
