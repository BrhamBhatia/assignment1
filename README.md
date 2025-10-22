## Instrumentation Evidence

### Playwright
- Ran `BASE_URL=http://localhost:3001 npx playwright test`
- Result: 2 tests passed ✅ (see screenshot in /reports or CI log)

### Lighthouse
- Generated on Desktop, Navigation mode
- File: `lighthouse-report.html`
- Key scores: Performance: __, Accessibility: __, Best Practices: __, SEO: __

### Load Test (Autocannon)
- Command: `autocannon -d 10 -c 20 http://localhost:3001/api/case/events`
- Avg req/s: ~550, Avg latency: ~35ms, p99: ~83ms, Errors: 0
- Saved as `reports/load-test.txt`

### Feedback (friends/family/industry)
- [Name/role]: Comment 1
- [Name/role]: Comment 2
- [Name/role]: Comment 3
## Feedback Summary

I showed the app to 2 friends and 1 family member.
They said the UI was easy to understand but the timer needed clearer labels.
They suggested adding a visible "Start" button and feedback messages.
I implemented these changes and improved the user experience.
