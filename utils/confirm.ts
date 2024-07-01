'use client'

import Confirmation, { Props as ConfimationProps } from '../src/app/components/Confirmation';
import { createConfirmation } from 'react-confirm';

const defaultConfirmation = createConfirmation(Confirmation);

export function confirm(confirmation: string, options: ConfimationProps = {}) {
  return defaultConfirmation({ confirmation, ...options });
}