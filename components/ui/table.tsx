'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

function Table({
  className,
  containerLabel,
  ...props
}: React.ComponentProps<'table'> & { containerLabel?: string }) {
  return (
    <div
      data-slot="table-container"
      className="relative block w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-ring"
      role={containerLabel ? 'region' : undefined}
      aria-label={containerLabel}
      tabIndex={containerLabel ? 0 : undefined}
    >
      <table
        data-slot="table"
        className={cn(
          'w-full min-w-full table-auto caption-bottom text-[15px]',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b transition-colors hover:bg-muted/60 data-[state=selected]:bg-muted has-aria-expanded:bg-muted/60',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-11 whitespace-nowrap px-3 text-left align-middle text-xs font-bold text-foreground [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'break-words p-3 align-middle leading-6 whitespace-normal [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-[15px] text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
