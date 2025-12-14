/*
  # Add Installment Payment Tracking

  1. New Columns in stripe_subscriptions table
    - `installment_plan` (text) - Type of payment plan (one_time, 2x, 3x, 6x, 9x)
    - `total_installments` (integer) - Total number of installments for the plan
    - `completed_installments` (integer) - Number of completed installments
    - `next_payment_date` (timestamptz) - Date of next payment
  
  2. Security
    - No new RLS policies needed - using existing subscription access controls
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'installment_plan'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN installment_plan text DEFAULT 'one_time';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'total_installments'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN total_installments integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'completed_installments'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN completed_installments integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'next_payment_date'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN next_payment_date timestamptz;
  END IF;
END $$;
