-- Enable RLS on organization-scoped tables
ALTER TABLE "organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workflow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "execution" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "execution_checkpoint" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "credential" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_invite" ENABLE ROW LEVEL SECURITY;

-- Example policy for organization table (users can only see their own org)
CREATE POLICY org_isolation ON "organization" USING (id = current_setting('app.org_id')::text);

-- Similar policies for other tables, assuming app.org_id is set in session
-- For user: USING (organization_id = current_setting('app.org_id')::text)
-- And so on for all org-scoped tables.

-- Note: This is a basic setup. In code, set the session variable before queries.