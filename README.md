# NAPLEX Study Companion

A 12-week study companion for the North American Pharmacist Licensure Examination. It includes 60 original review lessons, 156 practice questions with explanations, worked calculations, a five-day checklist for each week, a notebook, and progress tracking.

## Use the app

Open the [NAPLEX Study Companion](https://sethdow25-hub.github.io/naplex-study-companion/) in a desktop browser or Chrome on Android. On Android, use the browser's **Install app** or **Add to Home screen** option when available.

## Download and run on Windows

1. Select **Code → Download ZIP** on the repository page and extract the entire ZIP.
2. Double-click **Start NAPLEX Study.cmd**. Your browser opens the app.
3. Keep the app's console window open while using it. The launcher uses the Codex bundled Python runtime if available, or an installed Python 3. If neither is available, install Python from [python.org](https://www.python.org/downloads/).

To use the local copy on an Android phone, connect the phone and computer to the same trusted Wi-Fi, keep the app running on the computer, and open the Android address shown in the app window in Chrome on the phone. Local-network access may require a Windows firewall choice. This local phone connection depends on the computer being on; independent installation and offline access require HTTPS hosting.

## Progress and privacy

Study without an account, or open **Settings → Create account** to sync your date, completed days and lessons, best quiz scores, and notes. Sign in with the same email and password on your computer and Android phone. Each person gets a separate account. If you already studied before signing in, choose **Add device progress to my account** once the account has connected.

Progress is also saved on the current device. After the app and account have been opened online, you can continue studying offline; changes are sent when the connection returns. Different items are merged. If the same note is edited on two devices while offline, one edit may replace the other. Use **Settings → Export backup** to keep an additional copy; importing a backup replaces the current workspace and its changes sync when signed in.

Accounts, email addresses, progress, and notes are stored by Google Firebase in the project administered by the app owner. Database rules restrict each signed-in user to their own progress; the project owner can administer the service. Avoid saving confidential patient information. Account sign-in is available on the HTTPS site or a localhost computer; it is disabled on insecure local Wi-Fi addresses. Firebase's no-cost plan has usage limits, so availability may be affected if the shared app exceeds them.

For your own deployment, create a Firebase project, enable email/password authentication, create a Firestore database, apply `firestore.rules`, and replace the public browser configuration in `sync.js` with your project's configuration. Do not publish service-account credentials or other private keys.

## Study sources and scope

The app contains original summaries and questions linked to sources such as NABP, NIH, CDC and FDA. They have not been independently reviewed by a pharmacist or NABP. The app is not an official NABP product or a complete exam review. Clinical recommendations can change, and the notes are not automatically updated. Verify details with current primary sources and drug labels, and use a comprehensive question bank for additional practice.

The current [NABP NAPLEX content outline](https://nabp.pharmacy/wp-content/uploads/2024/09/NAPLEX-Content-Outline.pdf) and [candidate bulletin](https://read.nxtbook.com/nabp/bulletin/naplex_mpje_bulletin/) are the primary references for exam content and policies.
