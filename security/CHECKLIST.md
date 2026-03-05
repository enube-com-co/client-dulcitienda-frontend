# Dulcitienda Security Checklist

**Purpose:** Ongoing security maintenance and review  
**Frequency:** Review weekly, update quarterly  
**Owner:** Development Team + Security Lead  

---

## Daily Checks

### Deployment Monitoring
- [ ] Review Vercel deployment logs for errors
- [ ] Check Convex dashboard for failed mutations/queries
- [ ] Monitor error tracking (Sentry) for new issues
- [ ] Verify security headers are present on production

```bash
# Quick header check
curl -I https://dulcitienda.com.co | grep -E "(X-Frame-Options|X-Content-Type-Options|Content-Security-Policy)"
```

### Security Alerts
- [ ] Review any security alerts from Vercel
- [ ] Check Convex notifications for unusual activity
- [ ] Monitor GitHub security advisories for dependencies

---

## Weekly Checks

### Dependency Review
- [ ] Run `npm audit`
- [ ] Check for outdated packages: `npm outdated`
- [ ] Review Dependabot PRs
- [ ] Update critical security patches immediately

```bash
# Weekly security audit
npm audit
npm outdated
```

### Code Review Checklist
For every PR, ensure:
- [ ] No hardcoded secrets or API keys
- [ ] No `console.log` statements with sensitive data
- [ ] Input validation implemented for all user inputs
- [ ] Authentication checks for protected routes
- [ ] Authorization checks for mutations
- [ ] Rate limiting for new endpoints
- [ ] Error handling without information leakage
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Images have proper domains configured

### Access Review
- [ ] Review Vercel team access
- [ ] Review Convex project access
- [ ] Review GitHub repository access
- [ ] Remove access for departed team members

---

## Monthly Checks

### Security Scanning
- [ ] Run OWASP ZAP scan on staging
- [ ] Run Lighthouse security audit
- [ ] Check SSL certificate expiration
- [ ] Verify domain security settings

```bash
# Lighthouse CI
npx lighthouse https://dulcitienda.com.co --preset=desktop --only-categories=performance,accessibility,best-practices,seo
```

### Data Review
- [ ] Review audit logs for suspicious activity
- [ ] Check rate limiting effectiveness
- [ ] Verify backup integrity (if applicable)
- [ ] Review data retention compliance

### Third-Party Review
- [ ] Review Convex security updates
- [ ] Review Vercel security advisories
- [ ] Check Next.js security releases
- [ ] Verify any new third-party integrations

---

## Quarterly Checks

### Full Security Audit
- [ ] Review all findings from previous audit
- [ ] Verify all HIGH/CRITICAL issues resolved
- [ ] Update security documentation
- [ ] Re-run full penetration test

### Policy Review
- [ ] Review and update privacy policy
- [ ] Review terms of service
- [ ] Update security.txt expiration date
- [ ] Review incident response plan

### Access Audit
- [ ] Full access review (principle of least privilege)
- [ ] Rotate any long-lived credentials
- [ ] Review API key usage
- [ ] Update emergency contact list

### Compliance Review
- [ ] GDPR compliance check
- [ ] Data processing agreement review
- [ ] Cookie policy compliance
- [ ] Accessibility compliance (WCAG)

---

## Annual Checks

### Comprehensive Security Assessment
- [ ] Full external penetration test
- [ ] Code security audit by third party
- [ ] Infrastructure security review
- [ ] Disaster recovery test

### Policy Updates
- [ ] Update all security policies
- [ ] Security training for team
- [ ] Incident response drill
- [ ] Business continuity plan review

---

## Pre-Release Checklist

### Before Any Production Deployment

#### Code Security
- [ ] All tests passing
- [ ] No security vulnerabilities in `npm audit`
- [ ] Environment variables properly set
- [ ] No debug/development flags enabled
- [ ] Error pages don't leak stack traces

#### Environment
- [ ] Production environment variables configured
- [ ] Sentry DSN is production project
- [ ] Analytics tracking ID correct
- [ ] robots.txt configured correctly

#### Configuration
- [ ] Security headers configured in next.config.ts
- [ ] CSP policy tested and working
- [ ] Image domains properly restricted
- [ ] CORS settings verified

#### Verification
- [ ] Manual smoke test of critical paths
- [ ] Verify authentication flows
- [ ] Test rate limiting
- [ ] Confirm error tracking receiving events
- [ ] Verify security headers in production

---

## Incident Response Checklist

### When Security Incident Detected

#### Immediate (First 15 minutes)
- [ ] Identify and isolate affected systems
- [ ] Preserve logs and evidence
- [ ] Notify security team lead
- [ ] Document timeline of events

#### Short Term (First hour)
- [ ] Assess scope of breach
- [ ] Identify compromised data
- [ ] Implement temporary mitigations
- [ ] Notify stakeholders (internal)

#### Medium Term (First day)
- [ ] Root cause analysis
- [ ] Permanent fix implementation
- [ ] Legal/compliance review if needed
- [ ] Customer notification if required

#### Long Term (Following weeks)
- [ ] Post-incident review
- [ ] Update security measures
- [ ] Team training on lessons learned
- [ ] Update incident response plan

---

## Tool Configuration Checklist

### Sentry
- [ ] DSN configured for production
- [ ] PII scrubbing enabled
- [ ] Alert rules configured
- [ ] Release tracking enabled
- [ ] Source maps uploaded

### Vercel
- [ ] Production branch protection
- [ ] Preview deployments disabled for sensitive branches
- [ ] Team access properly restricted
- [ ] Analytics enabled

### Convex
- [ ] Production deployment key rotated
- [ ] Dashboard access restricted
- [ ] Rate limits configured
- [ ] Backups enabled

### GitHub
- [ ] Branch protection rules
- [ ] Required reviews enabled
- [ ] Secret scanning enabled
- [ ] Dependabot alerts enabled
- [ ] CodeQL analysis enabled

---

## New Feature Security Review

### Before Starting Development
- [ ] Security requirements documented
- [ ] Threat model created
- [ ] Privacy impact assessment (if needed)

### During Development
- [ ] Security unit tests written
- [ ] Input validation implemented
- [ ] Authentication/authorization added
- [ ] Error handling reviewed

### Before Release
- [ ] Security code review completed
- [ ] Penetration test for critical features
- [ ] Documentation updated
- [ ] Monitoring/alerting configured

---

## Security Metrics to Track

### Monthly Metrics
| Metric | Target | Current |
|--------|--------|---------|
| NPM vulnerabilities | 0 | _ |
| Failed authentication attempts | < 100 | _ |
| Rate limit hits | < 1000 | _ |
| Error rate | < 1% | _ |
| Dependency age (avg) | < 3 months | _ |

### Quarterly Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Security audit findings | 0 critical/high | _ |
| Mean time to patch | < 7 days | _ |
| Security training completion | 100% | _ |
| Incident response time | < 15 min | _ |

---

## Contact Information

### Security Team
- **Security Lead:** [Name] - [Email]
- **DevOps Lead:** [Name] - [Email]
- **On-Call Engineer:** [Phone]

### External Contacts
- **Vercel Support:** https://vercel.com/help
- **Convex Support:** https://convex.dev/support
- **Legal Counsel:** [Email]

---

## Document History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-03-05 | 1.0 | Initial checklist | Security Audit |

---

*This checklist is a living document. Update it as the application evolves.*
