import type { TxKeyPath } from '@/lib/i18n';

export type SupportContactKind = 'phone' | 'email' | 'instagram';

export type SupportContact = {
  kind: SupportContactKind;
  labelTx: TxKeyPath;
  value: string;
  href: string;
};

export const SETTINGS_SUPPORT_CONTACTS: SupportContact[] = [
  {
    kind: 'phone',
    labelTx: 'settings.support_contacts.phone_label',
    value: '+994 50 555 55 55',
    href: 'tel:+994505555555',
  },
  {
    kind: 'email',
    labelTx: 'settings.support_contacts.email_label',
    value: 'planandeat@gmail.com',
    href: 'mailto:planandeat@gmail.com',
  },
  {
    kind: 'instagram',
    labelTx: 'settings.support_contacts.instagram_label',
    value: '@planeat',
    href: 'https://instagram.com/planeat',
  },
];
