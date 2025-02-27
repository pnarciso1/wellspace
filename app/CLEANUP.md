## UI Verification

After database cleanup, verify in the UI:

1. MGPP Dashboard:
   - Should show "Enroll in Program" button
   - No progress should be visible

2. Pre-Assessment:
   - Should be locked
   - No previous responses should be visible

3. Video Section:
   - Should be locked
   - No progress should be saved

4. Medication Log:
   - Should be locked
   - No medications should be visible when unlocked

5. Doctor Visit Tool:
   - Should be locked
   - No previous data should be visible

## Common Issues

1. Foreign Key Constraints:
   - Always delete in the correct order (responses → medications → health records → enrollment)
   - Check for any custom foreign key relationships before deletion

2. Missing Records:
   - Some tables might not have records if the user didn't reach that part of the program
   - This is normal and won't cause errors

3. Partial Cleanup:
   - If any step fails, start over from the beginning
   - Verify each step before proceeding to the next

## Testing After Cleanup

1. Start Fresh:
   - Enroll in the program
   - Complete pre-assessment
   - Watch video
   - Add medications
   - Prepare doctor visit

2. Verify Features:
   - All features should work as if new user
   - No old data should appear
   - All progress should start from beginning

## Notes

- This process is for test/development purposes only
- Never use these commands on production data without proper backup
- Always verify user ID before deletion
- Keep this documentation updated as schema changes

END_OF_FILE