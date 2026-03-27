# Build & Submit

Build an app locally and submit it to TestFlight (iOS) or Google Play (Android).

## Usage

```
/testflight
/testflight ios
/testflight android
/testflight ios int
/testflight android prod
```

- First argument: platform (`ios`, `android`, or omit for both)
- Second argument: build profile (e.g., `int`, `uat`, `prod`). Defaults to `prod` if not specified.

## Instructions

When the user invokes this skill, execute the following steps directly. Do NOT tell the user to run commands themselves — run them.

### 1. Determine platform and profile

Parse the arguments to determine:
- **Platform:** `ios`, `android`, or both (if not specified)
- **Profile:** The EAS build/submit profile name (defaults to `prod`)

### 2. Pre-flight checks

Verify EAS CLI is installed by running `npx eas-cli --version`.

Parse `eas.json` and check for the required submit configuration under the chosen profile:

**For iOS:** Verify `ascAppId` exists under `submit.<profile>.ios`.

If `ascAppId` is missing, stop and tell the user:

> Non-interactive submit requires `ascAppId` in `eas.json` under `submit.<profile>.ios`.
>
> To find it: **App Store Connect > Your App > General > App Information > Apple ID** (the numeric ID).

**For Android:** Verify `serviceAccountKeyPath` exists under `submit.<profile>.android`.

If `serviceAccountKeyPath` is missing, stop and tell the user:

> Non-interactive submit requires `serviceAccountKeyPath` in `eas.json` under `submit.<profile>.android`.
>
> Follow Expo's guide to create a Google Service Account Key:
> https://github.com/expo/fyi/blob/main/creating-google-service-account.md
>
> Summary:
> 1. In **Google Cloud Console**, create a new project (or use existing)
> 2. Go to **Service Accounts** and create a new service account
> 3. Copy the service account email address
> 4. Click **Manage keys > Add Key > Create new key > JSON** and download the file
> 5. Enable the **Google Play Android Developer API** in your Google Cloud project
> 6. In **Google Play Console > Users and permissions**, invite the service account email
> 7. Assign app permissions needed for uploading and managing releases
> 8. Place the JSON key in `./service-account/` and ensure it's in `.gitignore`
>
> Then add it to `eas.json`:
> ```json
> "submit": {
>   "<profile>": {
>     "android": {
>       "serviceAccountKeyPath": "./service-account/play-store-service-account.json"
>     }
>   }
> }
> ```
>
> Alternatively, upload the key via `eas credentials` or the EAS dashboard under **Credentials > Android > Service Credentials**.

### 3. Auto-increment build number (Android)

Before building for Android, automatically increment the `buildNumber` in `app.config.js` for the matching profile/environment.

1. Read `app.config.js` and find the `buildNumber` value for the current profile's environment:
   - `prod` profile → the `IS_PROD` block
   - `uat` profile → the `IS_UAT` block
   - All other profiles (e.g., `int`, `dev-int`) → the default/else block
2. Increment the numeric value by 1 (e.g., `'102'` → `'103'`).
3. Save the updated `app.config.js`.

This avoids Google Play rejecting the upload for a duplicate `versionCode`.

**For iOS:** Also increment the `buildNumber` for the matching profile's environment using the same logic above. This ensures the iOS build number stays current for App Store Connect / TestFlight.

### 4. Build locally

Run the build with `--non-interactive` using the determined profile.

**IMPORTANT:** Do NOT add `--submit` — it is not supported with `--local`. Build and submit must be two separate steps.

**For iOS:**

```bash
npx eas-cli build -p ios --profile <PROFILE> --local --non-interactive
```

**For Android:**

```bash
npx eas-cli build -p android --profile <PROFILE> --local --non-interactive
```

This command will take several minutes. Use a generous timeout (10 minutes).

The build output ends with a line like:
```
You can find the build artifacts in /path/to/build-XXXXX.ipa   (iOS)
You can find the build artifacts in /path/to/build-XXXXX.aab   (Android)
```

Extract the artifact file path from that line.

**If the build fails:**
- **Signing errors (iOS):** Suggest `eas credentials` to manage certificates and provisioning profiles.
- **Keystore errors (Android):** Suggest `eas credentials` to manage the upload keystore.
- **Build cache issues:** Suggest re-running with `--clear-cache`.
- **Missing native dependencies:** Suggest `npx expo prebuild --clean` first.

### 5. Submit

Using the artifact path extracted from step 3, submit it with the same profile.

**For iOS (TestFlight):**

```bash
npx eas-cli submit -p ios --path <IPA_PATH> --profile <PROFILE> --non-interactive
```

If submit fails with an auth error, suggest the user create an App Store Connect API key at https://appstoreconnect.apple.com/access/integrations/api and configure it with `eas credentials`.

**For Android (Google Play):**

```bash
npx eas-cli submit -p android --path <AAB_PATH> --profile <PROFILE> --non-interactive
```

If submit fails with an auth error, suggest the user verify the service account key is valid and has the correct permissions in Google Play Console.

**If Android submit fails for any reason:** Do NOT delete the `.aab` file. Instead, move it to a known location so the user can retry manually:

```bash
mv <AAB_PATH> ./build-output/
```

Create the `build-output/` directory first if it doesn't exist. Tell the user the `.aab` file has been saved there and provide the retry command:

```
npx eas-cli submit -p android --path ./build-output/<FILENAME>.aab --profile <PROFILE> --non-interactive
```

### 6. Clean up and report

After successful submission:

1. Delete the build artifact to free disk space:
   ```bash
   rm <ARTIFACT_PATH>
   ```

2. Tell the user:

   **For iOS:**
   - The build has been submitted to App Store Connect.
   - It takes a few minutes for Apple to process it.
   - Once processed, it appears in TestFlight.
   - Internal testers are notified automatically.
   - External testers require an additional review by Apple.

   **For Android:**
   - The build has been submitted to Google Play Console.
   - It takes a few minutes for Google to process it.
   - Once processed, it appears in the configured track (typically internal testing).
   - Internal testers can access it immediately after processing.
   - Production releases require a separate rollout in Google Play Console.
