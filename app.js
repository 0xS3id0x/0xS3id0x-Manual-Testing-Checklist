/* ════════════════════════════════════════════════════════════
   VULNERABILITY DATA
════════════════════════════════════════════════════════════ */
const DATA = [

  // ── LOGIN FLOW ──────────────────────────────────────────
  {
    id: "login", title: "LOGIN FLOW", color: "var(--cyan)",
    items: [
      { id:"L01", title:"Username Enumeration via Response Difference",          sev:"medium",   tags:["ENUM","TIMING"],              ref:"HackerOne #1",                body:"Compare response body, status code, timing, and redirect on valid vs invalid username. Different messages like 'wrong password' vs 'user not found' = enumeration." },
      { id:"L02", title:"Brute Force — No Rate Limit",                           sev:"high",     tags:["BRUTE","RATE-LIMIT"],          ref:"Galaxy #RL",                  body:"Send 100+ login attempts with no lockout. Test X-Forwarded-For / X-Real-IP rotation to bypass IP-based limiting. Also try null/empty OTP codes." },
      { id:"L03", title:"SQL Injection in Login Fields",                          sev:"critical", tags:["SQLi"],                        ref:"Galaxy #SQL",                 body:"Try: admin'-- / ' OR 1=1-- / ' OR 'x'='x in username/password. Use sqlmap --data with the login POST body." },
      { id:"L04", title:"Default / Weak Credentials",                            sev:"high",     tags:["CREDS"],                       ref:"2026-Guide",                  body:"Try admin:admin, admin:password, test:test, root:root, user:user. Check for env-specific default creds (Jenkins, Grafana, etc)." },
      { id:"L05", title:"Account Lockout Bypass via Parameter Pollution",        sev:"high",     tags:["HPP","BYPASS"],                ref:"Galaxy #HPP",                 body:"Duplicate the 'username' param with correct value appended. Try JSON parameter pollution: {'user':'victim','user':'attacker'}. Some parsers take the last or first value." },
      { id:"L06", title:"CSRF on Login Form",                                    sev:"medium",   tags:["CSRF"],                        ref:"H1 Top CSRF",                 body:"Login CSRF can lead to pre-login session fixation or credential exposure. Test if login form has CSRF token and whether it's validated." },
      { id:"L07", title:"Host Header Injection on Login",                        sev:"high",     tags:["HOST-HEADER"],                 ref:"H1 Top Reports",              body:"Inject Host: attacker.com — if the app sends a password-reset or 'welcome' email with a link built from Host header, you capture the link." },
      { id:"L08", title:"Timing Attack on Login",                                sev:"medium",   tags:["TIMING"],                     ref:"2026-Guide",                  body:"Measure response time difference between valid and invalid usernames. >50ms delta = oracle. Use Burp Intruder 'Grep Extract' + compare." },
      { id:"L09", title:"Password Not Hashed / Stored in Plaintext",            sev:"critical", tags:["CRYPTO"],                      ref:"2026-Guide",                  body:"After registering, try resetting password — if reset email contains your original password = plaintext storage. Also check response bodies and debug endpoints." },
      { id:"L10", title:"Login Redirect Open Redirect",                          sev:"medium",   tags:["OPEN-REDIRECT"],               ref:"H1 Top Open Redirect",        body:"Test the 'next', 'redirect', 'return_to', 'goto' parameters on login for open redirect. Try: ?next=//evil.com, ?next=https://evil.com, ?next=%0D%0Alocation:evil.com." },
      { id:"L11", title:"Session Token Not Invalidated on Logout",              sev:"high",     tags:["SESSION"],                     ref:"Galaxy #ATO",                 body:"Log in, copy session cookie, log out, replay the cookie — if still authenticated = session fixation / improper invalidation." },
      { id:"L12", title:"Session Fixation",                                      sev:"high",     tags:["SESSION"],                     ref:"2026-Guide",                  body:"Set your own session ID via URL param or cookie before login. If the server doesn't rotate session on auth, you can hijack sessions with a known ID." },
      { id:"L13", title:"JWT None Algorithm / Weak Secret",                     sev:"critical", tags:["JWT"],                         ref:"H1 Top Auth",                 body:"Decode JWT, change alg to 'none', strip signature. Try HS256 brute with weak secrets (secret, password, 123456). Test RS256→HS256 confusion." },
      { id:"L14", title:"Login via OAuth — ATO via State Param Missing",        sev:"high",     tags:["OAUTH","CSRF"],                ref:"H1 Top OAuth",                body:"If OAuth login doesn't validate 'state' CSRF token, attacker can link their OAuth token to victim's account via CSRF." },
      { id:"L15", title:"Concurrent Login Sessions Unlimited",                   sev:"low",      tags:["LOGIC"],                       ref:"2026-Guide",                  body:"Log in from 10 devices simultaneously — no notification, no session limit. Business logic flaw, can indicate token sharing risk." },
      { id:"L16", title:"X-Forwarded-For Rate Limit Bypass",                    sev:"high",     tags:["RATE-LIMIT","BYPASS"],         ref:"Galaxy #RL",                  body:"Add headers: X-Forwarded-For: 1.1.1.1, X-Real-IP: 2.2.2.2, X-Client-IP, X-Originating-IP, Forwarded: for=1.2.3.4 — rotate per request to bypass IP-based lockout." },
      { id:"L17", title:"Login Response Reveals Password Hash",                  sev:"high",     tags:["INFO-DISC"],                   ref:"H1 Info Disclosure",          body:"Inspect JSON response body for hash/password fields. Common in verbose APIs returning full user objects after login." },
      { id:"L18", title:"Insecure Remember Me Token",                            sev:"high",     tags:["SESSION","CRYPTO"],            ref:"2026-Guide",                  body:"Decode 'remember_me' cookie — if it's base64(user_id) or user_id:hash with weak HMAC, it's forgeable. Test by modifying user_id to admin's." },
    ]
  },

  // ── REGISTRATION ────────────────────────────────────────
  {
    id: "register", title: "REGISTRATION / SIGNUP FLOW", color: "var(--green)",
    items: [
      { id:"R01", title:"Username Enumeration via Registration",                 sev:"medium",   tags:["ENUM"],                        ref:"2026-Guide",                  body:"Try registering an existing username/email — does error message reveal 'Email already taken'? Use Burp Intruder to enumerate valid emails from a wordlist." },
      { id:"R02", title:"No Email Verification — Account Takeover Pre-Hijack",  sev:"high",     tags:["ATO","PRE-HIJACK"],            ref:"H1 Top ATO",                  body:"Register with victim@example.com without verifying — victim later registers same email via SSO. If SSO account merges, attacker inherits it." },
      { id:"R03", title:"Mass Assignment / Parameter Pollution on Registration", sev:"critical", tags:["MASS-ASSIGN"],                 ref:"2026-Guide",                  body:"Add extra params to register POST: role=admin, is_admin=true, user_type=SUPERADMIN, verified=true. Some frameworks bind all input to model." },
      { id:"R04", title:"Weak Password Policy",                                  sev:"low",      tags:["POLICY"],                      ref:"2026-Guide",                  body:"Register with password '1' or 'a'. No complexity enforcement = easier brute force. Note for report: combine with no-lockout for chain." },
      { id:"R05", title:"XSS via Registration Fields",                           sev:"high",     tags:["XSS"],                         ref:"H1 Top XSS",                  body:"Inject <script>alert(1)</script> in name, username, bio, company fields. Stored XSS may fire in admin dashboard, profile pages, or notifications." },
      { id:"R06", title:"HTML Injection in Registration Confirmation Email",     sev:"medium",   tags:["HTML-INJ"],                    ref:"Galaxy #HTML",                body:"Inject HTML in name field — if it renders in confirmation email without escaping, escalate with phishing links or defacement." },
      { id:"R07", title:"No Rate Limit on Registration",                         sev:"low",      tags:["RATE-LIMIT"],                  ref:"Galaxy #RL",                  body:"Automate 1000 registrations with unique emails — if no CAPTCHA or rate limit, usable for spam/abuse." },
      { id:"R08", title:"Duplicate Registration — Different Case / Unicode",     sev:"high",     tags:["LOGIC","ATO"],                 ref:"H1 Top ATO",                  body:"Register user@example.com, then USER@example.com or usér@example.com. If both create accounts sharing data, ATO via email collision." },
      { id:"R09", title:"IDOR — Predictable User ID on Registration",            sev:"high",     tags:["IDOR"],                        ref:"H1 Top IDOR",                 body:"After registering, note the returned user_id. If sequential integers, test access to id-1, id-2 etc. on profile/API endpoints." },
      { id:"R10", title:"Registration CSRF",                                     sev:"medium",   tags:["CSRF"],                        ref:"H1 Top CSRF",                 body:"Is registration form protected by CSRF token? If not, attacker can register an account using victim's session context (e.g., auto-login CSRF chain)." },
      { id:"R11", title:"Email Header Injection",                                sev:"medium",   tags:["EMAIL-INJ"],                   ref:"2026-Guide",                  body:"In the email field, inject: victim@example.com%0ACc:attacker@evil.com — if app sends emails without sanitising, CC-inject arbitrary recipients." },
      { id:"R12", title:"Invite-Only Bypass",                                    sev:"medium",   tags:["BYPASS","LOGIC"],              ref:"2026-Guide",                  body:"If registration requires invite code, try: empty code, null, 0000, reusing old code, or accessing /register directly bypassing invite flow." },
      { id:"R13", title:"Account Takeover via Unverified Email Change",          sev:"critical", tags:["ATO","EMAIL"],                 ref:"H1 Top ATO",                  body:"Change email to victim@example.com without verification — if app immediately reassigns email, login with new email = ATO." },
      { id:"R14", title:"Profile Picture Upload — RCE / XSS",                   sev:"critical", tags:["UPLOAD","RCE","XSS"],          ref:"H1 Top Upload",               body:"Upload SVG with <script> tag, PHP/JSP/ASPX file with image extension, polyglot files. Check if MIME type validated server-side vs client-side only." },
    ]
  },

  // ── 2FA / MFA ───────────────────────────────────────────
  {
    id: "2fa", title: "2FA / MFA BYPASS", color: "var(--red)",
    items: [
      { id:"T01", title:"Direct Endpoint Access After First Factor",             sev:"critical", tags:["BYPASS","ACCESS-CTRL"],        ref:"Galaxy #2FA",                 body:"After username/password step, directly navigate to /dashboard or /profile — if app doesn't enforce 2FA state check on each request, bypass complete." },
      { id:"T02", title:"OTP Brute Force — No Rate Limit",                      sev:"critical", tags:["BRUTE","RATE-LIMIT"],          ref:"Galaxy #2FA",                 body:"2FA codes are 6 digits (1M combos) or 4 digits (10k). If no lockout after N attempts, brute with Intruder. Also try 000000 and 123456." },
      { id:"T03", title:"OTP Reuse — No Single-Use Enforcement",                sev:"high",     tags:["LOGIC"],                       ref:"Galaxy #2FA",                 body:"Use a 2FA code, note it, wait for the TTL window — try using the same code again. Some implementations don't mark codes as used." },
      { id:"T04", title:"OTP Leaked in Response Body",                          sev:"critical", tags:["INFO-DISC"],                   ref:"H1 Top MFA",                  body:"After triggering 2FA, inspect the JSON response from /send-otp or /verify — some implementations return the OTP in the response for 'debug'." },
      { id:"T05", title:"Response Manipulation — Change false to true",         sev:"critical", tags:["RESP-MANIP","BYPASS"],         ref:"Galaxy #2FA",                 body:"Intercept the 2FA verification response in Burp. Change {'success':false,'2fa_required':true} → {'success':true,'2fa_required':false}. Forward and test access." },
      { id:"T06", title:"2FA Code Valid Across Accounts",                       sev:"critical", tags:["LOGIC","ATO"],                 ref:"H1 Top MFA",                  body:"Trigger 2FA on your own account, copy OTP, then attempt to use it on a victim account's 2FA challenge. Missing account binding = global OTP." },
      { id:"T07", title:"Long OTP Validity Window",                             sev:"medium",   tags:["LOGIC"],                       ref:"Galaxy #2FA",                 body:"Generate OTP, wait 15–30 minutes, attempt to use it. If still valid, window is too long = brute force window opens. Note TOTP should be 30s." },
      { id:"T08", title:"2FA Bypass via Password Reset",                        sev:"critical", tags:["BYPASS","ATO"],               ref:"H1 Top MFA",                  body:"Reset password via email link — does the reset flow skip 2FA? If resetting password authenticates without 2FA, it's a full bypass." },
      { id:"T09", title:"2FA Backup Code Enumeration",                          sev:"high",     tags:["BRUTE","INFO-DISC"],           ref:"Galaxy #2FA",                 body:"If backup codes are short (8 chars) and no rate limit on backup code input, enumerate. Also test if backup codes are shown in plaintext after setup." },
      { id:"T10", title:"CSRF on 2FA Disable Endpoint",                         sev:"high",     tags:["CSRF"],                        ref:"H1 Top CSRF",                 body:"Is there a CSRF token on 'Disable 2FA' form? Craft CSRF PoC to disable victim's 2FA silently via social engineering." },
      { id:"T11", title:"Null / Empty OTP Accepted",                            sev:"critical", tags:["BYPASS"],                      ref:"Galaxy #2FA",                 body:"Submit 2FA verification with OTP field empty, null, undefined, or '0'. Some validation is done client-side only." },
      { id:"T12", title:"Skip 2FA via API vs UI Discrepancy",                   sev:"critical", tags:["BYPASS","API"],               ref:"H1 Top Auth",                 body:"UI enforces 2FA but direct API call to /api/v1/login with valid creds may not. Test same auth flow via API endpoint directly." },
      { id:"T13", title:"OAuth Login Bypasses 2FA",                             sev:"high",     tags:["OAUTH","BYPASS"],              ref:"H1 Top OAuth",                body:"App enforces 2FA on password login but allows OAuth (Google/GitHub) login to the same account without 2FA check." },
      { id:"T14", title:"2FA Code Predictability — Weak PRNG",                 sev:"high",     tags:["CRYPTO"],                      ref:"2026-Guide",                  body:"Collect 10+ OTPs over time, check for sequential patterns or weak entropy. Some custom implementations use timestamp-based or low-entropy PRNG." },
      { id:"T15", title:"Race Condition on OTP Verification",                   sev:"high",     tags:["RACE","BYPASS"],              ref:"H1 Top Race Condition",        body:"Send 2 concurrent OTP verification requests simultaneously. Race condition may bypass lockout or double-process validation." },
      { id:"T16", title:"X-Forwarded-For Bypass on 2FA Lockout",               sev:"high",     tags:["RATE-LIMIT","BYPASS"],         ref:"Galaxy #RL",                  body:"After triggering rate limit on 2FA, rotate IP via X-Forwarded-For header to reset lockout counter per-IP." },
      { id:"T17", title:"Response Manipulation Using Expired or Old OTP",       sev:"critical", tags:["RESP-MANIP","BYPASS","OTP"],   ref:"Galaxy #2FA",                 body:"Submit an old/expired OTP and intercept the verification response. Change denial fields (success=false, status=invalid_otp, otp_valid=false) to a valid success state and check if session is marked as 2FA-verified server-side." },
      { id:"T18", title:"2FA Bypass Across Secondary Flows (Reset/Email/Disable)", sev:"critical", tags:["BYPASS","FLOW","ATO"],      ref:"H1 Top MFA",                  body:"Test flows outside primary login: password reset completion, email change confirmation, backup-code regeneration, and disable-2FA endpoints. Verify each flow enforces fresh 2FA proof and does not trust only client state." },
      { id:"T19", title:"CAPTCHA Bypass via Verification Response Tampering",    sev:"high",     tags:["CAPTCHA","RESP-MANIP","BYPASS"], ref:"Bot Protection Bypass",     body:"On OTP or recovery challenges protected by CAPTCHA, submit invalid CAPTCHA/OTP then tamper response flags (captcha_passed=false, challenge_required=true) to true/false success values. Confirm backend re-validates CAPTCHA instead of trusting frontend response." },
    ]
  },

  // ── PASSWORD RESET ───────────────────────────────────────
  {
    id: "reset", title: "PASSWORD RESET FLOW", color: "var(--yellow)",
    items: [
      { id:"P01", title:"Host Header Injection — Reset Link Hijacking",         sev:"critical", tags:["HOST-HEADER","ATO"],           ref:"H1 Top ATO",                  body:"Intercept the forgot-password request, change Host: attacker.com. If reset email contains a link built from Host header, attacker receives it." },
      { id:"P02", title:"Password Reset Token — No Expiry",                     sev:"medium",   tags:["LOGIC","TOKEN"],               ref:"Galaxy #RESET",               body:"Request reset token, don't use it. Come back 48h+ later — if still valid = no expiry. Report: combine with host header for chain." },
      { id:"P03", title:"Password Reset Token — Guessable / Sequential",        sev:"critical", tags:["CRYPTO","TOKEN"],              ref:"Galaxy #RESET",               body:"Request multiple reset tokens rapidly. If tokens are sequential (e.g., hex+counter) or timestamp-based, pre-compute victim's token." },
      { id:"P04", title:"Password Reset Token Reuse",                           sev:"high",     tags:["TOKEN","LOGIC"],               ref:"Galaxy #RESET",               body:"Use a reset token, set new password. Replay the same token to set another password. Token not invalidated after use = reusable." },
      { id:"P05", title:"No Rate Limit on Password Reset Requests",             sev:"medium",   tags:["RATE-LIMIT","DOS"],            ref:"Galaxy #RL",                  body:"Flood victim's email with reset requests (email bombing). Also test if multiple simultaneous reset requests generate multiple valid tokens." },
      { id:"P06", title:"Password Reset via Username — No Token",               sev:"critical", tags:["LOGIC","ATO"],                 ref:"Galaxy #RESET",               body:"Test if /reset?user=admin directly resets password via GET, or if reset link just contains username without a secret token." },
      { id:"P07", title:"CSRF on Password Reset Form",                          sev:"high",     tags:["CSRF"],                        ref:"H1 Top CSRF",                 body:"Is the password change form (with old + new password) protected by CSRF? Craft PoC to force password change via CSRF." },
      { id:"P08", title:"Password Reset Token Leaked in Referer Header",        sev:"high",     tags:["INFO-DISC","TOKEN"],           ref:"H1 Top Info Disclosure",      body:"After clicking reset link, if user navigates to a third-party (embedded image, analytics), the token leaks in Referer header." },
      { id:"P09", title:"Weak Token Entropy / MD5(timestamp)",                  sev:"critical", tags:["CRYPTO","TOKEN"],              ref:"Galaxy #RESET",               body:"Decode token from base64 or hex — check if it's MD5/SHA1 of email+timestamp. Recreate token with known email and guessed timestamp." },
      { id:"P10", title:"Reset Password Doesn't Invalidate Active Sessions",    sev:"high",     tags:["SESSION"],                     ref:"H1 Top ATO",                  body:"After resetting password, old sessions remain valid. An attacker who had session access retains it despite password change." },
      { id:"P11", title:"Password Reset Link Works for Other Accounts",         sev:"critical", tags:["IDOR","ATO"],                  ref:"H1 Top IDOR",                 body:"Request reset for your own account, then modify the token's user_id/email parameter to victim's — if token is linked to user param vs server-side session." },
      { id:"P12", title:"HTTP Password Reset Link (No HTTPS)",                  sev:"medium",   tags:["TRANSPORT"],                   ref:"2026-Guide",                  body:"Reset link sent over HTTP = interceptable on network. Also check if token transmitted in URL vs POST body." },
      { id:"P13", title:"New Password Not Checked Against Policy",              sev:"low",      tags:["POLICY"],                      ref:"2026-Guide",                  body:"Reset to '1' or a previously used password. Weak policy or password history not enforced in reset flow." },
      { id:"P14", title:"Account Enumeration via Reset Response",               sev:"medium",   tags:["ENUM"],                        ref:"2026-Guide",                  body:"Different responses for registered vs unregistered emails: 'Email sent' vs 'Email not found' = user enumeration." },
      { id:"P15", title:"Race Condition on Token Use",                          sev:"high",     tags:["RACE"],                        ref:"H1 Top Race Condition",        body:"Send two simultaneous requests to use the same reset token. Race condition might allow setting two different passwords or bypassing single-use." },
      { id:"P16", title:"Self-XSS via New Password Field",                      sev:"medium",   tags:["XSS"],                         ref:"H1 Top XSS",                  body:"Set new password to <script>alert(1)</script> — if reflected on account page or login error message without encoding." },
    ]
  },

  // ── EMAIL VERIFICATION ───────────────────────────────────
  {
    id: "email", title: "EMAIL VERIFICATION / CHANGE FLOW", color: "var(--purple)",
    items: [
      { id:"E01", title:"Email Verification Bypass — Direct Access",            sev:"high",     tags:["BYPASS","LOGIC"],              ref:"H1 Top Auth",                 body:"After registering, navigate to protected pages directly without clicking verification email. If app doesn't gate on is_verified flag, bypass complete." },
      { id:"E02", title:"Email Change Without Current Password",                sev:"high",     tags:["ATO","LOGIC"],                 ref:"H1 Top ATO",                  body:"Change email to victim@example.com from profile settings without confirming current password = low-effort ATO enabler." },
      { id:"E03", title:"Email Change Not Requiring Verification of New Email", sev:"critical", tags:["ATO"],                         ref:"H1 Top ATO",                  body:"Change email to attacker-controlled address — if new email activated immediately without verification link, ATO via email reset." },
      { id:"E04", title:"Email Verification Token Reuse",                       sev:"medium",   tags:["TOKEN","LOGIC"],               ref:"2026-Guide",                  body:"Use verification link once. Try clicking it again — if app re-verifies or doesn't invalidate, token is reusable." },
      { id:"E05", title:"Email Verification Token Bruteforce",                  sev:"high",     tags:["BRUTE","TOKEN"],               ref:"Galaxy #2FA",                 body:"If token is short (6–8 digit numeric), try brute forcing with no rate limit on /verify?token=XXXXXX." },
      { id:"E06", title:"Account Pre-Hijacking via Unverified Email",           sev:"critical", tags:["PRE-HIJACK","ATO"],            ref:"H1 Top ATO",                  body:"Register victim@example.com without verifying. Victim later registers via SSO (Google) with same email — if accounts merge, attacker controls it." },
      { id:"E07", title:"Old Email Not Notified on Email Change",               sev:"medium",   tags:["LOGIC"],                       ref:"2026-Guide",                  body:"Change email without notifying old email address. Victim has no recovery path. Report as business logic flaw + potential ATO enabler." },
      { id:"E08", title:"Email Verification Link Valid Too Long",               sev:"low",      tags:["TOKEN"],                       ref:"2026-Guide",                  body:"Request verification, use link 7+ days later. Still valid = long/infinite expiry. Combine with phishing for delayed exploitation." },
      { id:"E09", title:"CSRF on Email Change Endpoint",                        sev:"high",     tags:["CSRF","ATO"],                  ref:"H1 Top CSRF",                 body:"No CSRF protection on email change form = attacker can change victim's email via social engineering (img src / invisible form auto-submit)." },
      { id:"E10", title:"Email Change Reflected Without Encoding — XSS",       sev:"high",     tags:["XSS"],                         ref:"H1 Top XSS",                  body:"Enter <img src=x onerror=alert(1)> as new email. If reflected in confirmation message or notification without encoding = stored/reflected XSS." },
      { id:"E11", title:"Email Enumeration via Change Response",                sev:"low",      tags:["ENUM"],                        ref:"2026-Guide",                  body:"Try changing email to existing user's email. 'Email already in use' vs generic error = user enumeration." },
      { id:"E12", title:"Verification Token Leaked in URL / Analytics",        sev:"medium",   tags:["INFO-DISC","TOKEN"],           ref:"H1 Top Info Disclosure",      body:"Verification link contains token in URL. If page loads third-party scripts (analytics, pixels), token leaks in Referer header." },
    ]
  },

  // ── SESSION MANAGEMENT ───────────────────────────────────
  {
    id: "session", title: "SESSION MANAGEMENT", color: "var(--orange)",
    items: [
      { id:"S01", title:"Session Not Rotated After Login",                       sev:"high",     tags:["SESSION"],                     ref:"2026-Guide",                  body:"Note session cookie before login, complete login — if cookie unchanged = session fixation vulnerability." },
      { id:"S02", title:"Session Cookie Missing Secure Flag",                    sev:"medium",   tags:["SESSION","COOKIE"],            ref:"2026-Guide",                  body:"Check session cookie flags in Burp: missing Secure flag = transmitted over HTTP. Missing HttpOnly = accessible via JS." },
      { id:"S03", title:"Session Cookie Missing SameSite Attribute",            sev:"medium",   tags:["CSRF","COOKIE"],               ref:"H1 Top CSRF",                 body:"No SameSite=Lax/Strict = cookie sent in cross-site requests = CSRF risk. Test with Burp's CSRF PoC generator." },
      { id:"S04", title:"Concurrent Sessions — No Invalidation on Password Change", sev:"high", tags:["SESSION"],                     ref:"2026-Guide",                  body:"Login from device A. Change password from device B. Device A session still works = old sessions not invalidated." },
      { id:"S05", title:"Predictable Session Token",                             sev:"critical", tags:["SESSION","CRYPTO"],            ref:"H1 Top Auth",                 body:"Collect 20 session tokens, look for patterns — timestamps, base64-encoded user data, sequential values." },
      { id:"S06", title:"JWT — Sensitive Data in Payload",                      sev:"medium",   tags:["JWT","INFO-DISC"],             ref:"H1 Top Info Disclosure",      body:"Decode JWT payload (base64). Check for email, role, internal IDs, PII — not encrypted, just encoded." },
      { id:"S07", title:"JWT — Algorithm Confusion (RS256 to HS256)",           sev:"critical", tags:["JWT","CRYPTO"],                ref:"H1 Top Auth",                 body:"If server uses RS256, get the public key, then forge token signed with HS256 using public key as HMAC secret. Many libraries vulnerable." },
      { id:"S08", title:"Long Session Timeout",                                  sev:"low",      tags:["SESSION"],                     ref:"2026-Guide",                  body:"Session valid for 30+ days without activity = longer window for token theft exploitation. Note absolute vs idle timeout." },
      { id:"S09", title:"Session Token in URL",                                  sev:"medium",   tags:["SESSION","INFO-DISC"],         ref:"2026-Guide",                  body:"Session passed as GET parameter (?session=xxx) = logged in server logs, proxy history, browser history, Referer header." },
    ]
  },

  // ── OAUTH / SSO ──────────────────────────────────────────
  {
    id: "oauth", title: "OAUTH / SSO FLOW", color: "var(--purple)",
    items: [
      { id:"O01", title:"Missing State Parameter — CSRF on OAuth",              sev:"high",     tags:["OAUTH","CSRF"],                ref:"H1 Top OAuth",                body:"OAuth flow doesn't include 'state' param or doesn't validate it. Attacker can CSRF-link their OAuth token to victim's account." },
      { id:"O02", title:"Authorization Code Reuse",                             sev:"high",     tags:["OAUTH"],                       ref:"H1 Top OAuth",                body:"Capture auth code from OAuth flow. Attempt to exchange it a second time. Code should be single-use; if reusable = ATO risk." },
      { id:"O03", title:"Open Redirect in redirect_uri",                        sev:"critical", tags:["OAUTH","OPEN-REDIRECT"],       ref:"H1 Top OAuth",                body:"Modify redirect_uri to attacker domain. If not strictly validated, auth code sent to attacker. Try: redirect_uri=https://evil.com, path traversal variants." },
      { id:"O04", title:"Token Leakage via Referer",                            sev:"high",     tags:["OAUTH","INFO-DISC"],           ref:"H1 Top OAuth",                body:"After OAuth callback, if page loads third-party content, access_token in URL leaks via Referer header." },
      { id:"O05", title:"Account Takeover via Email Merge",                     sev:"critical", tags:["OAUTH","ATO"],                 ref:"H1 Top ATO",                  body:"OAuth provider doesn't verify email — register with provider using victim's email, use SSO login to merge/access victim account." },
      { id:"O06", title:"Implicit Flow Token Theft",                            sev:"high",     tags:["OAUTH"],                       ref:"H1 Top OAuth",                body:"OAuth implicit flow exposes access_token in URL fragment — vulnerable to leakage via JS, Referer, browser history." },
      { id:"O07", title:"PKCE Not Enforced — Code Interception",               sev:"high",     tags:["OAUTH","MOBILE"],              ref:"H1 Top OAuth",                body:"No PKCE (Proof Key for Code Exchange) = auth code interceptable by malicious app on same device. Test mobile/desktop OAuth." },
      { id:"O08", title:"scope Parameter Manipulation",                         sev:"high",     tags:["OAUTH","PRIV-ESC"],            ref:"H1 Top OAuth",                body:"Escalate scope: request 'admin' or 'write' scope not initially granted. Some servers return expanded tokens without proper scope validation." },
    ]
  },

  // ── API AUTH ─────────────────────────────────────────────
  {
    id: "api", title: "API AUTHENTICATION", color: "var(--cyan)",
    items: [
      { id:"A01", title:"API Key in JavaScript / Client-Side Code",             sev:"high",     tags:["INFO-DISC","API"],             ref:"H1 Top Info Disclosure",      body:"Search JS files for: api_key, apiKey, Authorization, Bearer, secret. Use gau + katana + grep or Burp's JS parser." },
      { id:"A02", title:"API Endpoint Without Authentication",                  sev:"critical", tags:["ACCESS-CTRL","API"],           ref:"H1 Top Auth",                 body:"Remove Authorization header from authenticated request — does endpoint still respond with data? Test every API endpoint without auth header." },
      { id:"A03", title:"HTTP Method Override — Auth Bypass",                   sev:"high",     tags:["BYPASS","API"],               ref:"2026-Guide",                  body:"Try adding X-HTTP-Method-Override: GET on POST endpoint or _method=GET param. Some APIs skip auth checks for GET." },
      { id:"A04", title:"Versioned API — Old Version Without Auth",             sev:"high",     tags:["API","BYPASS"],               ref:"H1 Top Auth",                 body:"If /api/v2/users requires auth, test /api/v1/users — old versions may lack auth controls." },
      { id:"A05", title:"GraphQL Introspection Enabled",                        sev:"info",     tags:["GRAPHQL","RECON"],             ref:"H1 Top GraphQL",              body:"POST {__schema{types{name}}} — if introspection enabled, enumerate all queries/mutations/types for attack surface mapping." },
      { id:"A06", title:"JWT in API — kid Header Injection",                    sev:"critical", tags:["JWT","API"],                  ref:"H1 Top Auth",                 body:"Modify JWT 'kid' header to: ../../dev/null, or a SQL statement. Path traversal in kid can load attacker-controlled signing key." },
      { id:"A07", title:"API Rate Limit Bypass via Null Byte",                  sev:"medium",   tags:["RATE-LIMIT","BYPASS"],         ref:"Galaxy #RL",                  body:"Append %00, null bytes, or whitespace to key parameters. Some WAFs/rate-limiters don't normalize before counting." },
      { id:"A08", title:"CORS Misconfiguration on Auth Endpoints",              sev:"high",     tags:["CORS"],                        ref:"H1 Top Reports",              body:"Check: Origin: https://evil.com in request — if Access-Control-Allow-Origin: https://evil.com + Access-Control-Allow-Credentials: true = session theft." },
    ]
  },

  // ── MISC / CHAINS ────────────────────────────────────────
  {
    id: "misc", title: "MISC AUTH / ACCOUNT TAKEOVER CHAINS", color: "var(--green)",
    items: [
      { id:"M01", title:"Account Takeover via Subdomain Takeover",              sev:"critical", tags:["SUBDOMAIN-TAKEOVER","ATO"],    ref:"H1 Top Sub Takeover",         body:"Find dangling CNAME pointing to unclaimed service (S3, GitHub Pages, Heroku). Claim it, host phishing page or steal OAuth redirect." },
      { id:"M02", title:"Chained: Open Redirect + OAuth = ATO",                sev:"critical", tags:["CHAIN","OAUTH","ATO"],         ref:"H1 Top OAuth",                body:"Find open redirect on target domain. Use as redirect_uri in OAuth (whitelisted by domain). Auth code goes to attacker via redirect." },
      { id:"M03", title:"Chained: XSS + CSRF Token Theft = Account Takeover",  sev:"critical", tags:["CHAIN","XSS","CSRF","ATO"],    ref:"H1 Top XSS",                  body:"XSS reads CSRF token from DOM, uses it to make authenticated state-changing request (email change, password change)." },
      { id:"M04", title:"Business Logic — Negative Quantity / Price Manipulation", sev:"high",  tags:["LOGIC","CHAIN"],              ref:"H1 Top Business Logic",        body:"In any payment/upgrade flow: test negative values, zero price, integer overflow in quantity fields." },
      { id:"M05", title:"Password Change Without Old Password",                 sev:"critical", tags:["ATO","LOGIC"],                 ref:"Galaxy #ATO",                 body:"POST /change-password with only new_password and confirm_password — if old password not required = ATO via CSRF or XSS." },
      { id:"M06", title:"Account Deletion Without Confirmation",                sev:"high",     tags:["CSRF","LOGIC"],                ref:"H1 Top CSRF",                 body:"DELETE /api/account — no confirmation, no CSRF protection, no re-auth = mass account deletion possible via CSRF." },
      { id:"M07", title:"Information Disclosure — /debug, /.env, /config",     sev:"high",     tags:["INFO-DISC","RECON"],           ref:"H1 Top Info Disclosure",      body:"Test: /.env, /config.php, /debug, /actuator, /phpinfo.php, /server-status — commonly exposed in misconfigured staging environments." },
      { id:"M08", title:"Race Condition — Parallel Request ATO",               sev:"high",     tags:["RACE"],                        ref:"H1 Top Race Condition",        body:"Send 20 parallel requests to a one-time-use endpoint (email verify, coupon redeem, password reset token). Race condition may allow multiple uses." },
    ]
  },

  // ── XSS TESTING ────────────────────────────────────────────
  {
    id: "xsslab", title: "XSS TESTING CHECKLIST", color: "var(--red)",
    items: [
      { id:"X01", title:"Reflected XSS in Search and Error Pages",              sev:"high",     tags:["XSS","REFLECTED"],            ref:"H1 Top XSS",                  body:"Inject payloads in query and path parameters: <script>alert(1)</script>, \"><svg/onload=alert(1)>, and URL-encoded variants. Check search, 404, and validation errors." },
      { id:"X02", title:"Stored XSS in Profile, Comments, and Support Tickets",  sev:"critical", tags:["XSS","STORED"],               ref:"H1 Top XSS",                  body:"Submit payloads in rich text and plain text fields, then view as another user/admin. Test markdown, mentions, and notification previews." },
      { id:"X03", title:"DOM XSS from location.hash or postMessage",             sev:"high",     tags:["XSS","DOM"],                  ref:"PortSwigger DOM XSS",         body:"Test client-side sinks using controlled sources: hash, search params, localStorage, and postMessage. Look for innerHTML, insertAdjacentHTML, eval, and new Function usage." },
      { id:"X04", title:"XSS Filter Bypass via Event Handlers and SVG",          sev:"high",     tags:["XSS","BYPASS"],               ref:"XSS Cheat Sheet",             body:"Try payloads without script tag, such as <img src=x onerror=alert(1)> and SVG-based payloads. Test mixed casing, UTF-7 style encodings, and broken HTML contexts." },
    ]
  },

  // ── GRAPHQL TESTING ────────────────────────────────────────
  {
    id: "graphql", title: "GRAPHQL TESTING CHECKLIST", color: "var(--cyan)",
    items: [
      { id:"GQ01", title:"GraphQL Introspection and Schema Exposure",            sev:"info",     tags:["GRAPHQL","RECON"],            ref:"GraphQL Security Guide",      body:"First try payload: {\"query\":\"{ __schema { queryType { name } mutationType { name } } }\"}. Then run __schema and __type queries in all environments. If disabled in production, test for aliases or batched tricks that still expose schema metadata." },
      { id:"GQ02", title:"IDOR in Node and Resolver Arguments",                  sev:"critical", tags:["GRAPHQL","IDOR"],             ref:"H1 Top IDOR",                 body:"Change userId, accountId, orgId, and nested object IDs in queries/mutations. Verify authorization at resolver level, not only at route level." },
      { id:"GQ03", title:"Query Depth and Cost DoS",                             sev:"high",     tags:["GRAPHQL","DOS"],              ref:"OWASP API Security",          body:"Send deeply nested queries, heavy fragments, and large alias counts. Confirm server enforces depth, complexity, and rate limits with safe error handling." },
      { id:"GQ04", title:"GraphQL Verb Tampering and CSRF",                      sev:"medium",   tags:["GRAPHQL","CSRF"],             ref:"GraphQL CSRF Notes",          body:"Try GET for state-changing mutations, content-type bypasses, and missing CSRF validation on cookie-auth GraphQL endpoints." },
    ]
  },

  // ── LOGIC BUG TESTING ──────────────────────────────────────
  {
    id: "logic", title: "APP LOGIC BUG CHECKLIST", color: "var(--yellow)",
    items: [
      { id:"LB01", title:"Step/State Skipping in Multi-Step Flows",              sev:"high",     tags:["LOGIC","WORKFLOW"],           ref:"H1 Business Logic",           body:"Skip required steps by direct API calls or URL jumps, especially checkout, KYC, and onboarding. Verify backend enforces state transitions." },
      { id:"LB02", title:"Price, Quantity, and Currency Manipulation",            sev:"critical", tags:["LOGIC","PAYMENT"],            ref:"H1 Business Logic",           body:"Tamper subtotal, discount, tax, coupon stacking, negative quantity, and currency conversion fields. Compare client values against final server charge." },
      { id:"LB03", title:"Privilege Escalation via Hidden Parameters",            sev:"high",     tags:["LOGIC","PRIV-ESC"],           ref:"Mass Assignment Cases",       body:"Add role, plan, is_admin, approval_status, or feature flags in update requests. Check whether backend ignores or accepts unauthorized fields." },
      { id:"LB04", title:"Race Conditions in One-Time Actions",                   sev:"high",     tags:["LOGIC","RACE"],               ref:"H1 Race Condition",           body:"Replay simultaneous requests for redeem, withdraw, verify, and reset endpoints. Look for duplicate processing before lock/transaction commit." },
      { id:"LB05", title:"IDOR/BOLA Across Object Access and Actions",            sev:"critical", tags:["LOGIC","IDOR","BOLA"],       ref:"OWASP API Top 10",            body:"Change object identifiers (user_id, order_id, file_id, team_id) in read and write requests. Validate ownership checks on every object-level action, not just list endpoints." },
      { id:"LB06", title:"Race Conditions in Coupon, Payment, Inventory, and OTP", sev:"critical", tags:["LOGIC","RACE","PAYMENT"],   ref:"H1 Race Condition",           body:"Send parallel requests to apply coupons twice, double-charge/refund, oversell inventory, and submit OTP concurrently. Confirm transactional locks and idempotency enforcement." },
      { id:"LB07", title:"Bypass Rate Limits, CAPTCHA, and Anti-Bot Controls",    sev:"high",     tags:["LOGIC","BYPASS","ANTI-BOT"], ref:"Bot Bypass Testing",          body:"Test IP/header rotation, token reuse, device fingerprint resets, timing jitter, and endpoint variants. Verify bot controls are enforced server-side across login, signup, reset, and OTP flows." },
      { id:"LB08", title:"Negative Testing, Precision, and Currency Rounding Bugs", sev:"high",    tags:["LOGIC","PRECISION","PAYMENT"], ref:"Financial Logic Testing",     body:"Try negative/zero values, boundary decimals, and mixed-currency totals. Look for floating-point errors, inconsistent rounding, and mismatches between displayed and charged amounts." },
      { id:"LB09", title:"Workflow Bypass via Parameter and State Manipulation",   sev:"high",     tags:["LOGIC","WORKFLOW","BYPASS"],  ref:"Business Flow Abuse",         body:"Tamper hidden step/state params such as status=approved, step=complete, or is_verified=true. Confirm backend recalculates state and rejects skipped or forged transitions." },
    ]
  },

  // ── 403 BYPASS TESTING ─────────────────────────────────────
  {
    id: "bypass403", title: "403 BYPASS CHECKLIST", color: "var(--orange)",
    items: [
      { id:"B40301", title:"Path Normalization and Encoding Bypass",              sev:"high",     tags:["403","BYPASS"],               ref:"403 Bypass Playbook",         body:"Test /admin, /admin/, /./admin, /%2e/admin, /admin..;/, //admin, and encoded slashes. Check whether proxy and backend normalize differently." },
      { id:"B40302", title:"Header-Based Access Control Bypass",                  sev:"high",     tags:["403","HEADER"],               ref:"H1 Access Control",           body:"Try X-Original-URL, X-Rewrite-URL, X-Forwarded-For, X-Client-IP, and Host overrides to bypass edge restrictions or trust-based ACL checks." },
      { id:"B40303", title:"HTTP Method and Content-Type Confusion",              sev:"medium",   tags:["403","METHOD"],               ref:"OWASP WSTG",                  body:"Switch between GET/POST/HEAD/OPTIONS and JSON/form content types. Some controls block one method but allow another for the same action." },
      { id:"B40304", title:"Case and Extension-Based ACL Evasion",                sev:"medium",   tags:["403","ACL"],                  ref:"WAF Bypass Notes",            body:"Test /Admin, /ADMIN, /admin.json, /admin.php, and path suffixes. Validate that ACL is resource-based and not weak string matching." },
    ]
  },

  // ── SUBDOMAIN TAKEOVER TESTING ─────────────────────────────
  {
    id: "subtake", title: "SUBDOMAIN TAKEOVER CHECKLIST", color: "var(--purple)",
    items: [
      { id:"SD01", title:"Dangling CNAME Discovery",                              sev:"high",     tags:["SUBDOMAIN-TAKEOVER","DNS"],   ref:"Can I Take Over XYZ",         body:"Enumerate subdomains and resolve CNAME chains. Flag records pointing to unclaimed SaaS targets like GitHub Pages, Heroku, or cloud storage." },
      { id:"SD02", title:"Fingerprint Unclaimed Service Responses",               sev:"high",     tags:["SUBDOMAIN-TAKEOVER","RECON"], ref:"Subjack Patterns",            body:"Check HTTP body/title for provider-specific unclaimed messages. Confirm takeover potential against known fingerprints before reporting." },
      { id:"SD03", title:"Check Expired or Misconfigured Third-Party Integrations", sev:"medium", tags:["SUBDOMAIN-TAKEOVER","MISCONF"], ref:"Asset Inventory",           body:"Review old marketing/helpdesk/docs integrations. Decommissioned services often leave stale DNS entries that can be claimed by attackers." },
      { id:"SD04", title:"Verify Impact Beyond PoC",                              sev:"high",     tags:["SUBDOMAIN-TAKEOVER","IMPACT"], ref:"H1 Top Reports",              body:"After safe PoC claim, test cookie scope, OAuth redirect trust, CSP whitelists, and email links to show practical account or phishing impact." },
    ]
  },

  // ── WORDPRESS TESTING ──────────────────────────────────────
  {
    id: "wordpress", title: "WORDPRESS CHECKLIST", color: "var(--green)",
    items: [
      { id:"WP01", title:"Version and Plugin Enumeration",                        sev:"medium",   tags:["WORDPRESS","RECON"],          ref:"WPScan Guide",                body:"Identify core version, themes, and plugins via readme files, asset paths, and meta generator tags. Cross-check with known vulnerable versions." },
      { id:"WP02", title:"User Enumeration via Author Archives and REST API",     sev:"medium",   tags:["WORDPRESS","ENUM"],           ref:"WP Security",                 body:"Try /?author=1 and /wp-json/wp/v2/users to enumerate usernames. Combine with weak password policy or XML-RPC brute-force tests." },
      { id:"WP03", title:"XML-RPC Abuse and Brute Force",                         sev:"high",     tags:["WORDPRESS","BRUTE"],          ref:"WP XML-RPC Abuse",            body:"Test /xmlrpc.php for pingback abuse and multicall brute force amplification. Verify rate limiting and disablement where unnecessary." },
      { id:"WP04", title:"Upload and RCE in Plugin Endpoints",                    sev:"critical", tags:["WORDPRESS","UPLOAD","RCE"],   ref:"WordPress CVE Trends",        body:"Test media and plugin upload handlers for MIME bypass, path traversal, and unauthenticated file write. Validate execution and directory protections." },
    ]
  },

  // ── DORKING CHECKLIST ──────────────────────────────────────
  {
    id: "dorking", title: "GOOGLE / GITHUB / FOFA DORKING CHECKLIST", color: "var(--cyan)",
    items: [
      { id:"DK01", title:"Google Dorks for Sensitive Files and Panels",           sev:"medium",   tags:["DORKING","GOOGLE","RECON"],  ref:"Google Dorking",              body:"Use site:target.tld with patterns like inurl:admin, ext:env, ext:sql, intitle:index of, and exposed backup filename patterns." },
      { id:"DK02", title:"GitHub Dorks for Leaked Secrets",                        sev:"high",     tags:["DORKING","GITHUB","SECRETS"], ref:"GitHub Secret Hunting",       body:"Search org and public repos for API keys, tokens, JWT secrets, private keys, and environment files. Validate revoked vs active secrets safely." },
      { id:"DK03", title:"FOFA Asset Discovery and Service Fingerprinting",        sev:"medium",   tags:["DORKING","FOFA","ASSET"],     ref:"FOFA Query Guide",            body:"Pivot on domain, cert CN/SAN, favicon hash, title, and IP ranges to map forgotten assets and exposed admin services." },
      { id:"DK04", title:"Cross-Source Correlation for Shadow Assets",             sev:"high",     tags:["DORKING","ASM"],              ref:"Attack Surface Mapping",      body:"Correlate Google, GitHub, FOFA, crt.sh, and DNS records to identify staging hosts, old APIs, and abandoned infrastructure." },
    ]
  },

  // ── SHODAN DORKING CHECKLIST ───────────────────────────────
  {
    id: "shodandork", title: "SHODAN DORKING CHECKLIST", color: "var(--orange)",
    items: [
      { id:"SDORK01", title:"Find Exposed Admin Panels and Dashboards",            sev:"high",     tags:["SHODAN","DORKING","RECON"],  ref:"Shodan Query Guide",          body:"Search by org, domain, ASN, and title filters for exposed admin interfaces (Jenkins, Kibana, Grafana, phpMyAdmin, panels). Validate access control and internet exposure." },
      { id:"SDORK02", title:"Discover Public Services by Port and Product",         sev:"medium",   tags:["SHODAN","ASM"],               ref:"Attack Surface Mapping",      body:"Use queries with port, product, ssl cert, and http.title fields to find forgotten services and non-standard management ports." },
      { id:"SDORK03", title:"Locate Misconfigured Databases and Message Queues",    sev:"critical", tags:["SHODAN","INFO-DISC"],         ref:"Exposed Service Risks",       body:"Hunt for exposed Elasticsearch, MongoDB, Redis, RabbitMQ, and similar services. Confirm authentication requirements and sensitive data exposure safely." },
      { id:"SDORK04", title:"Correlate Shodan with DNS and CT Logs",                sev:"high",     tags:["SHODAN","RECON","CHAIN"],      ref:"Asset Correlation",           body:"Cross-reference Shodan results with subdomain enumeration and certificate transparency logs to identify shadow infrastructure and stale endpoints." },
    ]
  },

  // ── JAVASCRIPT ANALYSIS ────────────────────────────────────
  {
    id: "jsanalysis", title: "JAVASCRIPT ANALYSIS CHECKLIST", color: "var(--yellow)",
    items: [
      { id:"JSA01", title:"Secrets and Tokens in JS Bundles",                     sev:"high",     tags:["JS","INFO-DISC"],             ref:"Client-Side Secrets",         body:"Search bundles and source maps for apiKey, bearer, secret, firebase, stripe, and internal endpoints. Validate if keys are restricted and non-sensitive." },
      { id:"JSA02", title:"Hidden Endpoints and Debug Routes",                     sev:"medium",   tags:["JS","RECON","API"],           ref:"JS Recon Workflow",           body:"Extract fetch/XHR URLs, GraphQL endpoints, feature flags, and internal routes from minified JS. Probe for auth or access control gaps." },
      { id:"JSA03", title:"DOM Sinks and Unsafe Templating",                       sev:"high",     tags:["JS","XSS","DOM"],             ref:"DOM XSS Guide",               body:"Trace untrusted inputs to sinks like innerHTML, outerHTML, document.write, eval, setTimeout(string), and jQuery html() usage." },
      { id:"JSA04", title:"Client-Side Authorization Logic Reliance",              sev:"high",     tags:["JS","ACCESS-CTRL"],           ref:"Client vs Server Auth",       body:"Identify privileged UI checks enforced only in JS flags. Replay blocked actions directly via API to confirm backend authorization is authoritative." },
    ]
  },

  // ── SSRF TESTING ────────────────────────────────────────────
  {
    id: "ssrf", title: "SSRF CHECKLIST", color: "var(--orange)",
    items: [
      { id:"SSRF01", title:"Basic SSRF in URL Fetch Features",                     sev:"critical", tags:["SSRF","INTERNAL"],            ref:"OWASP SSRF",                  body:"Test URL inputs in webhooks, importers, avatars, and PDF renderers with internal targets like 127.0.0.1, localhost, and internal RFC1918 ranges." },
      { id:"SSRF02", title:"Cloud Metadata Access via SSRF",                        sev:"critical", tags:["SSRF","CLOUD"],               ref:"Cloud Metadata Risks",        body:"Probe metadata endpoints (for example IMDS) using direct and encoded URLs. Check if outbound filtering and hop protections block credential exposure." },
      { id:"SSRF03", title:"Bypass Allowlist with URL Parser Tricks",               sev:"high",     tags:["SSRF","BYPASS"],              ref:"URL Parser Bypasses",         body:"Try userinfo (@), DNS rebinding candidates, mixed encodings, decimal/octal IP forms, redirects, and protocol smuggling to bypass hostname allowlists." },
      { id:"SSRF04", title:"Blind SSRF Detection and Impact Chaining",              sev:"high",     tags:["SSRF","BLIND","CHAIN"],       ref:"Blind SSRF Testing",          body:"Use out-of-band interaction endpoints to detect blind SSRF, then test internal service reachability and chained impact (Redis, admin APIs, token services)." },
    ]
  },

  // ── INFORMATION DISCLOSURE TESTING ─────────────────────────
  {
    id: "infodisc", title: "INFORMATION DISCLOSURE CHECKLIST", color: "var(--cyan)",
    items: [
      { id:"ID01", title:"Sensitive Files and Backup Artifacts Exposed",            sev:"high",     tags:["INFO-DISC","RECON"],          ref:"H1 Info Disclosure",          body:"Check common sensitive paths such as /.env, /config, /backup.zip, /.git, /swagger.json, and debug artifacts. Verify directory listing and object storage exposure." },
      { id:"ID02", title:"Verbose Error Messages and Stack Traces",                 sev:"medium",   tags:["INFO-DISC","DEBUG"],          ref:"OWASP Error Handling",        body:"Trigger invalid input and server errors to look for stack traces, framework versions, file paths, SQL queries, and internal service details." },
      { id:"ID03", title:"PII and Secrets in API/Frontend Responses",               sev:"high",     tags:["INFO-DISC","API"],            ref:"API Data Exposure",           body:"Inspect API and frontend responses for excessive data fields like tokens, hashes, internal IDs, email metadata, and hidden admin flags." },
      { id:"ID04", title:"Token and Secret Leakage via Logs/Referer/Source Maps",   sev:"high",     tags:["INFO-DISC","TOKEN","JS"],     ref:"Source Map Disclosure",       body:"Check whether auth tokens or secrets appear in URLs, Referer headers, logs, source maps, or client-side bundles. Confirm long-lived token exposure impact." },
    ]
  },

  // ── SSTI TESTING ────────────────────────────────────────────
  {
    id: "ssti", title: "SSTI CHECKLIST", color: "var(--purple)",
    items: [
      { id:"SSTI01", title:"Baseline Probe Across All Inputs",                       sev:"high",     tags:["SSTI","DETECTION"],           ref:"Template Injection Guide",    body:"Inject {{7*7}} into every input field. If the application returns 49, SSTI is confirmed (Jinja2/Twig)." },
      { id:"SSTI02", title:"Template Breakout Variants",                             sev:"high",     tags:["SSTI","BYPASS"],              ref:"SSTI Payload Notes",          body:"Try }}{{7*7}} and }}[[7*7]] to break out of existing template syntax." },
      { id:"SSTI03", title:"Engine-Specific Payloads",                               sev:"high",     tags:["SSTI","FREEMARKER","ERB"],    ref:"Multi-Engine SSTI",           body:"Try ${7*7} for FreeMarker, Velocity, or JavaScript template engines, and try <%= 7*7 %> for ERB (Ruby) templates." },
      { id:"SSTI04", title:"Automation and Filter Character Fuzzing",                sev:"medium",   tags:["SSTI","AUTOMATION"],          ref:"tplmap Workflow",             body:"Once confirmed, use a tool like tplmap to automate exploitation. Also fuzz filter/sanitizer behavior with characters: #^<&'\"-." },
    ]
  },

  // ── FILE UPLOAD TESTING ─────────────────────────────────────
  {
    id: "fileupload", title: "FILE UPLOAD VULNERABILITIES CHECKLIST", color: "var(--green)",
    items: [
      { id:"FU01", title:"Unrestricted File Type Upload",                           sev:"critical", tags:["UPLOAD","RCE"],               ref:"H1 Top Upload",               body:"Upload executable or script files using double extensions, MIME spoofing, and polyglots. Confirm server-side validation and storage outside executable paths." },
      { id:"FU02", title:"Stored XSS via SVG/HTML Upload",                          sev:"high",     tags:["UPLOAD","XSS"],               ref:"File Upload XSS",             body:"Upload SVG/HTML with active payloads and open in application preview context. Verify content sanitization, forced download headers, and safe rendering." },
      { id:"FU03", title:"Path Traversal in File Name or Archive Extraction",       sev:"critical", tags:["UPLOAD","TRAVERSAL"],         ref:"Zip Slip Cases",              body:"Try filenames and archives containing traversal sequences to overwrite arbitrary files. Test zip/tar extraction logic and destination path normalization." },
      { id:"FU04", title:"Upload DoS via Large Files and Decompression Bombs",      sev:"medium",   tags:["UPLOAD","DOS"],               ref:"Upload Hardening",            body:"Test oversized files, high part-count multipart bodies, and compressed bombs. Verify quota, content-length checks, and backend processing limits." },
    ]
  },

  // ── RACE CONDITION TESTING ──────────────────────────────────
  {
    id: "race", title: "RACE CONDITIONS CHECKLIST", color: "var(--purple)",
    items: [
      { id:"RC01", title:"Double Spend / Double Redeem in Financial Actions",       sev:"critical", tags:["RACE","PAYMENT"],             ref:"H1 Race Condition",           body:"Fire simultaneous checkout, wallet debit, coupon redeem, and refund requests. Check for duplicated balance updates and missing idempotency keys." },
      { id:"RC02", title:"Inventory Oversell with Concurrent Checkout",             sev:"high",     tags:["RACE","INVENTORY"],           ref:"Business Logic Race",         body:"Purchase the final stock item from multiple sessions at once. Confirm atomic stock decrement and reservation expiration behavior." },
      { id:"RC03", title:"Account Security Race in OTP/Reset/Verify",               sev:"high",     tags:["RACE","OTP","RESET"],         ref:"Auth Flow Race Testing",      body:"Submit parallel verify/reset requests using one token or OTP. Validate single-use enforcement and transaction-level state locking." },
      { id:"RC04", title:"Role/Permission Update Race Window",                      sev:"high",     tags:["RACE","PRIV-ESC"],            ref:"Access Control Timing Bugs",  body:"Race privileged actions while role downgrade, session revocation, or account disable is in progress. Ensure authorization checks happen at execution time." },
    ]
  },

]; // end DATA


/* ════════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════════ */
let checked          = JSON.parse(localStorage.getItem('vuln-checked') || '{}');
let activeFilter     = 'all';
let searchQ          = '';
let collapsedSections = JSON.parse(localStorage.getItem('vuln-collapsed-sections') || '{}');

function save() {
  localStorage.setItem('vuln-checked', JSON.stringify(checked));
  localStorage.setItem('vuln-collapsed-sections', JSON.stringify(collapsedSections));
}


/* ════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════ */
function sevTag(s) {
  return `<span class="tag tag-${s}">${s.toUpperCase()}</span>`;
}

function genericTag(t) {
  return `<span class="tag tag-generic">${escapeHTML(t)}</span>`;
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function itemKey(sectionId, itemId) {
  return `${sectionId}:${itemId}`;
}

function isChecked(sectionId, itemId) {
  return !!checked[itemKey(sectionId, itemId)];
}

function migrateCheckedKeys() {
  const migrated = {};
  DATA.forEach(section => {
    section.items.forEach(item => {
      if (checked[item.id] || checked[itemKey(section.id, item.id)]) {
        migrated[itemKey(section.id, item.id)] = true;
      }
    });
  });
  checked = migrated;
}

function matchesFilter(item) {
  if (activeFilter === 'all')    return true;
  const key = itemKey(item.sectionId, item.id);
  if (activeFilter === 'done')   return !!checked[key];
  if (activeFilter === 'undone') return !checked[key];
  return item.sev === activeFilter;
}

function matchesSearch(item) {
  if (!searchQ) return true;
  const q = searchQ.toLowerCase();
  return (
    item.title.toLowerCase().includes(q) ||
    item.body.toLowerCase().includes(q)  ||
    item.tags.some(t => t.toLowerCase().includes(q)) ||
    item.sev.includes(q)
  );
}


/* ════════════════════════════════════════════════════════════
   CARD HTML
════════════════════════════════════════════════════════════ */
function cardHTML(item, sectionId) {
  const done = isChecked(sectionId, item.id);
  return `
    <div class="card${done ? ' done' : ''}" data-id="${item.id}" data-section="${sectionId}" data-sev="${item.sev}">
      <div class="card-top">
        <div class="card-check">${done ? '✓' : ''}</div>
        <div class="card-title">${escapeHTML(item.title)}</div>
      </div>
      <div class="card-body">${escapeHTML(item.body)}</div>
      <div class="card-footer">
        ${sevTag(item.sev)}
        ${item.tags.map(genericTag).join('')}
        <span class="card-ref">${escapeHTML(item.ref)}</span>
      </div>
    </div>`;
}


/* ════════════════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════════════════ */
function render() {
  const content   = document.getElementById('content');
  content.innerHTML = '';
  let anyVisible  = false;

  DATA.forEach(section => {
    const sectionItems = section.items.map(item => ({ ...item, sectionId: section.id }));
    const visItems = sectionItems.filter(i => matchesFilter(i) && matchesSearch(i));
    if (visItems.length === 0) return;
    anyVisible = true;

    const secDone = visItems.filter(i => isChecked(section.id, i.id)).length;
    const secPct  = visItems.length ? Math.round(secDone / visItems.length * 100) : 0;
    const isCollapsed = collapsedSections[section.id];
    const allSectionDone = section.items.length > 0 && section.items.every(i => isChecked(section.id, i.id));

    const secEl = document.createElement('div');
    secEl.className      = 'section';
    secEl.dataset.section = section.id;

    secEl.innerHTML = `
      <div class="sec-header" data-toggle="${section.id}">
        <div class="sec-num" style="border-color:${section.color}20;color:${section.color}">
          ${String(DATA.indexOf(section) + 1).padStart(2, '0')}
        </div>
        <div class="sec-title" style="color:${section.color}">${section.title}</div>
        <div class="sec-progress">
          <span style="color:${section.color}">${secDone}/${visItems.length}</span>
          <div class="sec-pbar">
            <div class="sec-pbar-fill" style="width:${secPct}%;background:${section.color}"></div>
          </div>
        </div>
        <button class="sec-check-toggle" data-section-check="${section.id}">
          ${allSectionDone ? 'UNCHECK ALL' : 'CHECK ALL'}
        </button>
        <div class="sec-meta">${visItems.length} CHECKS</div>
        <div class="sec-arrow ${isCollapsed ? '' : 'open'}">▶</div>
      </div>
      <div class="cards ${isCollapsed ? 'collapsed' : ''}"
           style="${isCollapsed ? 'max-height:0;' : 'max-height:9999px;'}"
           id="cards-${section.id}">
        ${visItems.map(item => cardHTML(item, section.id)).join('')}
      </div>`;

    content.appendChild(secEl);
  });

  document.getElementById('empty').style.display = anyVisible ? 'none' : 'block';
  updateStats();
  attachListeners();
}


/* ════════════════════════════════════════════════════════════
   STATS
════════════════════════════════════════════════════════════ */
function updateStats() {
  const allItems = DATA.flatMap(section => section.items.map(item => ({ ...item, sectionId: section.id })));
  const visible  = allItems.filter(i => matchesFilter(i) && matchesSearch(i));
  const done     = visible.filter(i => isChecked(i.sectionId, i.id)).length;
  const pct      = visible.length ? Math.round(done / visible.length * 100) : 0;

  document.getElementById('s-total').textContent = visible.length;
  document.getElementById('s-done').textContent  = done;
  document.getElementById('s-crit').textContent  = visible.filter(i => i.sev === 'critical').length;
  document.getElementById('s-high').textContent  = visible.filter(i => i.sev === 'high').length;
  document.getElementById('s-med').textContent   = visible.filter(i => i.sev === 'medium').length;
  document.getElementById('s-low').textContent   = visible.filter(i => i.sev === 'low').length;
  document.getElementById('s-pct').textContent   = pct + '%';
  document.getElementById('main-pbar').style.width = pct + '%';
  document.getElementById('pct-txt').textContent = pct + '%';
}


/* ════════════════════════════════════════════════════════════
   EVENT LISTENERS (re-attached after each render)
════════════════════════════════════════════════════════════ */
function attachListeners() {
  // Card toggle
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const sectionId = card.dataset.section;
      const key = itemKey(sectionId, id);
      checked[key] = !checked[key];
      if (!checked[key]) delete checked[key];
      save();
      render();
    });
  });

  // Section collapse
  document.querySelectorAll('.sec-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const id = hdr.dataset.toggle;
      collapsedSections[id] = !collapsedSections[id];
      render();
    });
  });

  // Section check/uncheck all
  document.querySelectorAll('.sec-check-toggle').forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const sectionId = btn.dataset.sectionCheck;
      const section = DATA.find(s => s.id === sectionId);
      if (!section) return;
      const shouldCheckAll = !section.items.every(i => isChecked(sectionId, i.id));
      section.items.forEach(item => {
        const key = itemKey(sectionId, item.id);
        if (shouldCheckAll) checked[key] = true;
        else delete checked[key];
      });

      save();
      render();
    });
  });
}


/* ════════════════════════════════════════════════════════════
   STATIC EVENT LISTENERS (set once on load)
════════════════════════════════════════════════════════════ */
document.getElementById('search').addEventListener('input', e => {
  searchQ = e.target.value.trim();
  render();
});

document.querySelectorAll('.fbtn[data-f]').forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.f;
    document.querySelectorAll('.fbtn[data-f]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

document.getElementById('reset-btn').addEventListener('click', () => {
  checked = {};
  save();
  render();
});


/* ════════════════════════════════════════════════════════════
   BOOT
════════════════════════════════════════════════════════════ */
migrateCheckedKeys();
save();
render();
