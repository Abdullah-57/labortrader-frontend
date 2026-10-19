'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

type NativeSelectProps = Omit<React.ComponentProps<'select'>, 'size'> & {
  size?: 'sm' | 'default';
};

function NativeSelect({
  className,
  size = 'default',
  children,
  onChange,
  ref: forwardedRef,
  ...props
}: NativeSelectProps) {
  const selectRef = React.useRef<HTMLSelectElement | null>(null);
  const [selection, setSelection] = React.useState(props.defaultValue);
  const options: { value: string; label: React.ReactNode }[] = [];
  function collectOptions(nodes: React.ReactNode) {
    React.Children.forEach(nodes, (node) => {
      if (
        !React.isValidElement<{ value?: string; children?: React.ReactNode }>(
          node,
        )
      )
        return;
      if (node.type === 'option' || Object.hasOwn(node.props, 'value')) {
        options.push({
          value:
            node.props.value ??
            React.Children.toArray(node.props.children)
              .filter(
                (child) =>
                  typeof child === 'string' || typeof child === 'number',
              )
              .join(''),
          label: node.props.children,
        });
      } else if (node.props.children) collectOptions(node.props.children);
    });
  }
  collectOptions(children);
  const currentValue = props.value ?? selection ?? options[0]?.value ?? '';
  const label = options.find(
    (option) => option.value === String(currentValue),
  )?.label;
  React.useEffect(() => {
    const form = selectRef.current?.form;
    let frame: number;
    const reset = () => {
      frame = requestAnimationFrame(() =>
        setSelection(selectRef.current?.value ?? ''),
      );
    };
    form?.addEventListener('reset', reset);
    return () => {
      form?.removeEventListener('reset', reset);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div
      className={cn(
        'group/native-select relative w-fit has-[select:disabled]:opacity-50',
        className,
      )}
      data-slot="native-select-wrapper"
      data-size={size}
      data-wrap-label={!props.multiple ? '' : undefined}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-8 w-full min-w-0 appearance-none rounded-lg border bg-transparent py-1 pr-8 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5 outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
        {...props}
        ref={(element) => {
          selectRef.current = element;
          if (typeof forwardedRef === 'function') forwardedRef(element);
          else if (forwardedRef) forwardedRef.current = element;
        }}
        onChange={(event) => {
          setSelection(event.target.value);
          onChange?.(event);
        }}
      >
        {children}
      </select>
      {!props.multiple && (
        <span
          className="native-select-value"
          data-empty={String(currentValue) === ''}
          aria-hidden="true"
        >
          {label}
        </span>
      )}
      <ChevronDownIcon
        className="text-muted-foreground top-1/2 right-2.5 size-4 -translate-y-1/2 pointer-events-none absolute select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<'option'>) {
  return (
    <option
      data-slot="native-select-option"
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<'optgroup'>) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
