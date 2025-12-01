-- Reset all existing user balances to $0 instead of the default $100
-- This removes the mock data from the database
UPDATE user_balances 
SET available_balance = 0.00 
WHERE available_balance = 100.00;