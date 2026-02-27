# LeaseU Manual QA Checklist

## A. Public Browsing (No Auth)

- [ ] **Landing page** loads without login — hero, stats, sections render
- [ ] **Browse page** (`/browse`) loads, shows approved listings
- [ ] **Browse empty state** — if no approved listings, shows "No listings found" with link to post
- [ ] **Listing detail** (`/listings/:id`) loads without login; image, title, price, description visible
- [ ] **Listing detail** — "Sign in to message the host" prompt shown (not a crash)
- [ ] **404 page** — visiting `/nonexistent` shows styled 404 page

## B. Auth UX

- [ ] **Login** — invalid credentials show: "Invalid email or password..."
- [ ] **Login** — empty fields prevented by `required` attribute
- [ ] **Login** — spinner shows while loading; button disabled to prevent double-submit
- [ ] **Signup** — password < 6 chars shows client-side error
- [ ] **Signup** — success redirects to `/login?registered=1` with green banner
- [ ] **Signup** — duplicate email shows "An account with this email already exists"
- [ ] **Auth modal** — appears when clicking "Contact Host" while logged out
- [ ] **Logout** — clears state, returns to home

## C. Access Gating (FSU Verified)

- [ ] **Post page** (`/post`) — logged out: shows "Sign in to post" with login link
- [ ] **Post page** — logged in non-FSU: shows "Only verified FSU students can post" dialog
- [ ] **Post page** — logged in FSU: shows PostWizard
- [ ] **Messages page** (`/messages`) — logged out: redirects to login
- [ ] **Listing detail** — logged in non-FSU: "Only verified @fsu.edu accounts can message hosts" shown with disabled button
- [ ] **Admin page** (`/admin`) — logged out: redirects to login
- [ ] **Admin page** — non-admin user: shows "Not Authorized" page (not crash)

## D. Post Listing Flow

- [ ] **Step 1** — select listing type advances to step 2
- [ ] **Step 2** — all fields render; form validates on Continue
- [ ] **Step 3** — review shows correct data; boost toggle works
- [ ] **Submit** — spinner shows on button; button disabled during submit
- [ ] **Submit success** — shows "Listing Submitted for Approval" with green checkmark, then redirects
- [ ] **Submit validation error** — shows human-readable field errors (not `[object Object]`)
- [ ] **Submit RLS error** — shows "Only verified FSU student hosts can post" (not crash)
- [ ] **Price coercion** — entering "750" produces correct priceCents (75000)

## E. Host Dashboard

- [ ] (No dedicated host dashboard exists — host sees their listings via post/browse)
- [ ] Listing created is `status=pending` and not visible on browse until admin approves

## F. Messaging

- [ ] **Inbox** (`/messages`) — empty state shows "No messages yet" with Browse link
- [ ] **Send message** — dialog opens, send button disables during send
- [ ] **Send message** — success shows "Message sent!" confirmation
- [ ] **Send error** — human-readable error (not raw object)
- [ ] **Report listing** — dialog opens, submit works, shows confirmation

## G. Admin Dashboard

- [ ] **Pending tab** — shows pending listings with Approve/Reject buttons
- [ ] **Approved tab** — shows approved listings with Remove button
- [ ] **Removed tab** — shows removed listings
- [ ] **Reports tab** — shows reports
- [ ] **Approve/Reject/Remove** — spinner on button during action; success feedback banner
- [ ] **Site Images tab** — save shows feedback (not raw `alert`)
- [ ] **Empty tabs** — show "No pending/approved/removed listings" or "No reports"
- [ ] **Error handling** — all admin actions show human-readable errors

## H. Reliability & Polish

- [ ] **Global error boundary** — force an error; page shows "Something went wrong" with Try Again + Go Home
- [ ] **Loading state** — route transitions show spinner
- [ ] **No console errors** — navigate through all pages; no React errors in console
- [ ] **Forms** — all inputs have labels; keyboard submit works; focus outlines visible
- [ ] **Error messages** — nowhere renders `[object Object]` or crashes on error objects
