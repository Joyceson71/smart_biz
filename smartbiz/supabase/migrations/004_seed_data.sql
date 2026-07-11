-- ============================================================
-- SmartBiz Migration 004: Development Seed Data
-- Realistic Indian MSME data for demo and testing
-- Run ONLY in development environment
-- ============================================================

-- NOTE: Replace the UUIDs below with actual Supabase Auth user IDs
-- after creating test accounts in Supabase Dashboard.
-- For local dev, you can use any valid UUIDs.

DO $$
DECLARE
  v_org_id      UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  v_owner_id    UUID := 'b1b2c3d4-e5f6-7890-abcd-ef1234567891';
  v_acct_id     UUID := 'c1b2c3d4-e5f6-7890-abcd-ef1234567892';
  v_viewer_id   UUID := 'd1b2c3d4-e5f6-7890-abcd-ef1234567893';

  -- Customer IDs
  v_cust_1  UUID; v_cust_2  UUID; v_cust_3  UUID;
  v_cust_4  UUID; v_cust_5  UUID; v_cust_6  UUID;
  v_cust_7  UUID; v_cust_8  UUID; v_cust_9  UUID;
  v_cust_10 UUID; v_cust_11 UUID; v_cust_12 UUID;
  v_cust_13 UUID; v_cust_14 UUID; v_cust_15 UUID;

  -- Vendor IDs
  v_vend_1 UUID; v_vend_2 UUID; v_vend_3 UUID;
  v_vend_4 UUID; v_vend_5 UUID; v_vend_6 UUID;
  v_vend_7 UUID; v_vend_8 UUID; v_vend_9 UUID;
  v_vend_10 UUID;

BEGIN

-- ── Organization ──────────────────────────────────────────────────────────────
INSERT INTO organizations (id, name, slug, gst_number, pan_number, address, currency, plan)
VALUES (
  v_org_id,
  'Raj Electronics Pvt Ltd',
  'raj-electronics',
  '27AABCR1234F1Z5',
  'AABCR1234F',
  '{"line1": "Unit 12, MIDC Industrial Area", "line2": "Andheri East", "city": "Mumbai", "state": "Maharashtra", "pincode": "400093", "country": "India"}'::jsonb,
  'INR',
  'pro'
);

-- Invoice sequence
INSERT INTO invoice_sequence (organization_id, prefix, current_number, padding)
VALUES (v_org_id, 'INV', 50, 4);

-- ── Users (NOTE: these IDs must match auth.users — update before running) ─────
-- In Supabase, create users via Auth first, then run this seed
INSERT INTO users (id, organization_id, email, full_name, role, is_active, onboarding_completed)
VALUES
  (v_owner_id, v_org_id, 'raj@rajelectronics.in', 'Rajesh Kumar', 'owner', TRUE, TRUE),
  (v_acct_id,  v_org_id, 'priya@rajelectronics.in', 'Priya Sharma', 'accountant', TRUE, TRUE),
  (v_viewer_id,v_org_id, 'amit@rajelectronics.in', 'Amit Patel', 'viewer', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ── Customers ─────────────────────────────────────────────────────────────────
v_cust_1  := gen_random_uuid(); v_cust_2  := gen_random_uuid();
v_cust_3  := gen_random_uuid(); v_cust_4  := gen_random_uuid();
v_cust_5  := gen_random_uuid(); v_cust_6  := gen_random_uuid();
v_cust_7  := gen_random_uuid(); v_cust_8  := gen_random_uuid();
v_cust_9  := gen_random_uuid(); v_cust_10 := gen_random_uuid();
v_cust_11 := gen_random_uuid(); v_cust_12 := gen_random_uuid();
v_cust_13 := gen_random_uuid(); v_cust_14 := gen_random_uuid();
v_cust_15 := gen_random_uuid();

INSERT INTO customers (id, organization_id, name, email, phone, gst_number, payment_terms_days, created_by) VALUES
  (v_cust_1,  v_org_id, 'Tech Solutions India Pvt Ltd', 'accounts@techsolutions.in', '+91-22-66778899', '27AAACT1234B1ZX', 30, v_owner_id),
  (v_cust_2,  v_org_id, 'Sharma & Sons Trading Co', 'billing@sharmasons.com', '+91-11-23456789', '07AABCS4567D1Z8', 15, v_owner_id),
  (v_cust_3,  v_org_id, 'Bangalore Components Ltd', 'purchase@bangalorecomp.co.in', '+91-80-45678901', '29AABCB8901G1Z2', 45, v_owner_id),
  (v_cust_4,  v_org_id, 'Mehta Enterprises', 'info@mehtaenterprises.in', '+91-79-34567890', '24AABCM5678H1Z4', 30, v_acct_id),
  (v_cust_5,  v_org_id, 'Krishnamurthy & Co', 'finance@krishnamurthy.biz', '+91-44-56789012', '33AABCK1234J1Z6', 60, v_acct_id),
  (v_cust_6,  v_org_id, 'Hyderabad Retail Hub', 'accounts@hrhub.in', '+91-40-67890123', '36AABCH7890K1Z8', 30, v_owner_id),
  (v_cust_7,  v_org_id, 'Punjab Industrial Supplies', 'billing@punjabindustrial.com', '+91-161-2345678', '03AABCP2345L1ZA', 45, v_owner_id),
  (v_cust_8,  v_org_id, 'Coastal Traders Pvt Ltd', 'finance@coastaltraders.co.in', '+91-484-3456789', '32AABCC3456M1ZC', 30, v_acct_id),
  (v_cust_9,  v_org_id, 'Capital Distributors', 'billing@capitaldist.in', '+91-11-45678901', '07AABCC4567N1ZE', 15, v_owner_id),
  (v_cust_10, v_org_id, 'Rajasthan Retail Network', 'accounts@rrnretail.in', '+91-141-5678901', '08AABCR5678P1ZG', 30, v_acct_id),
  (v_cust_11, v_org_id, 'Western India Electronics', 'purchase@wielectronics.com', '+91-22-56789012', '27AABCW6789Q1ZI', 45, v_owner_id),
  (v_cust_12, v_org_id, 'NE Trading Company', 'billing@netradingco.in', '+91-361-6789012', '18AABCN7890R1ZK', 30, v_acct_id),
  (v_cust_13, v_org_id, 'Surat Diamond Merchants', 'finance@suratdiamond.in', '+91-261-7890123', '24AABCS8901S1ZM', 60, v_owner_id),
  (v_cust_14, v_org_id, 'Chennai Auto Parts', 'accounts@chennaiauto.co.in', '+91-44-8901234', '33AABCC9012T1ZO', 30, v_acct_id),
  (v_cust_15, v_org_id, 'Kolkata Wholesale Market', 'billing@kolkatawholesale.in', '+91-33-9012345', '19AABCK0123U1ZQ', 30, v_owner_id);

-- ── Vendors ───────────────────────────────────────────────────────────────────
v_vend_1  := gen_random_uuid(); v_vend_2  := gen_random_uuid();
v_vend_3  := gen_random_uuid(); v_vend_4  := gen_random_uuid();
v_vend_5  := gen_random_uuid(); v_vend_6  := gen_random_uuid();
v_vend_7  := gen_random_uuid(); v_vend_8  := gen_random_uuid();
v_vend_9  := gen_random_uuid(); v_vend_10 := gen_random_uuid();

INSERT INTO vendors (id, organization_id, name, email, phone, gst_number, payment_terms_days, created_by) VALUES
  (v_vend_1,  v_org_id, 'Shenzhen Components Import', 'import@shenzhencomp.com', '+91-22-11223344', NULL, 30, v_owner_id),
  (v_vend_2,  v_org_id, 'Mumbai PCB Manufacturers', 'orders@mumbaipcb.in', '+91-22-22334455', '27AABCM1234A1Z1', 15, v_owner_id),
  (v_vend_3,  v_org_id, 'Delhi Packaging Supplies', 'billing@delhipack.co.in', '+91-11-33445566', '07AABCD2345B1Z3', 30, v_acct_id),
  (v_vend_4,  v_org_id, 'Reliance Digital Wholesale', 'b2b@reliancedigital.in', '+91-22-44556677', '27AABCR3456C1Z5', 45, v_owner_id),
  (v_vend_5,  v_org_id, 'TATA Power Solutions', 'enterprise@tatapower.com', '+91-22-55667788', '27AABCT4567D1Z7', 30, v_acct_id),
  (v_vend_6,  v_org_id, 'Godrej Office Furniture', 'corporate@godrej.com', '+91-22-66778899', '27AABCG5678E1Z9', 30, v_owner_id),
  (v_vend_7,  v_org_id, 'Airtel Business Services', 'enterprise@airtel.in', '+91-22-77889900', '27AABCA6789F1ZB', 30, v_acct_id),
  (v_vend_8,  v_org_id, 'Flipkart Wholesale Hub', 'b2b@flipkart.com', '+91-80-88990011', '29AABCF7890G1ZD', 15, v_owner_id),
  (v_vend_9,  v_org_id, 'IndusInd Bank Leasing', 'corporate@indusind.com', '+91-22-99001122', '27AABCI8901H1ZF', 30, v_acct_id),
  (v_vend_10, v_org_id, 'Amazon Web Services India', 'india-billing@aws.com', '+91-80-00112233', NULL, 30, v_owner_id);

-- ── Invoices (50 invoices: mix of statuses) ───────────────────────────────────
-- Sale Invoices (Paid)
INSERT INTO invoices (organization_id, invoice_number, type, status, customer_id, issue_date, due_date, subtotal, tax_amount, total_amount, amount_paid, created_by) VALUES
  (v_org_id,'INV-0001','sale','paid',  v_cust_1, '2024-04-05','2024-05-05', 125000, 22500, 147500, 147500, v_owner_id),
  (v_org_id,'INV-0002','sale','paid',  v_cust_2, '2024-04-10','2024-04-25',  48000,  8640,  56640,  56640, v_acct_id),
  (v_org_id,'INV-0003','sale','paid',  v_cust_3, '2024-04-15','2024-05-30',  92000, 16560, 108560, 108560, v_owner_id),
  (v_org_id,'INV-0004','sale','paid',  v_cust_4, '2024-04-20','2024-05-20',  35000,  6300,  41300,  41300, v_acct_id),
  (v_org_id,'INV-0005','sale','paid',  v_cust_5, '2024-05-01','2024-07-01', 220000, 39600, 259600, 259600, v_owner_id),
  (v_org_id,'INV-0006','sale','paid',  v_cust_6, '2024-05-08','2024-06-08',  67500, 12150,  79650,  79650, v_owner_id),
  (v_org_id,'INV-0007','sale','paid',  v_cust_7, '2024-05-15','2024-06-15',  55000,  9900,  64900,  64900, v_acct_id),
  (v_org_id,'INV-0008','sale','paid',  v_cust_8, '2024-05-22','2024-06-22',  39000,  7020,  46020,  46020, v_owner_id),
  (v_org_id,'INV-0009','sale','paid',  v_cust_9, '2024-06-01','2024-06-16', 180000, 32400, 212400, 212400, v_acct_id),
  (v_org_id,'INV-0010','sale','paid', v_cust_10, '2024-06-10','2024-07-10',  78000, 14040,  92040,  92040, v_owner_id);

-- Sale Invoices (Sent / Outstanding)
INSERT INTO invoices (organization_id, invoice_number, type, status, customer_id, issue_date, due_date, subtotal, tax_amount, total_amount, amount_paid, created_by) VALUES
  (v_org_id,'INV-0011','sale','sent',  v_cust_1, CURRENT_DATE-20, CURRENT_DATE+10, 145000, 26100, 171100, 0, v_owner_id),
  (v_org_id,'INV-0012','sale','sent',  v_cust_3, CURRENT_DATE-15, CURRENT_DATE+15,  88000, 15840, 103840, 0, v_acct_id),
  (v_org_id,'INV-0013','sale','viewed',v_cust_5, CURRENT_DATE-10, CURRENT_DATE+20, 250000, 45000, 295000, 0, v_owner_id),
  (v_org_id,'INV-0014','sale','sent',  v_cust_7, CURRENT_DATE- 8, CURRENT_DATE+22,  62000, 11160,  73160, 0, v_acct_id),
  (v_org_id,'INV-0015','sale','viewed',v_cust_2, CURRENT_DATE- 5, CURRENT_DATE+10,  44000,  7920,  51920, 0, v_owner_id),
  (v_org_id,'INV-0016','sale','sent',  v_cust_9, CURRENT_DATE- 3, CURRENT_DATE+27, 195000, 35100, 230100, 0, v_acct_id),
  (v_org_id,'INV-0017','sale','sent', v_cust_11, CURRENT_DATE- 2, CURRENT_DATE+28,  72000, 12960,  84960, 0, v_owner_id),
  (v_org_id,'INV-0018','sale','sent', v_cust_13, CURRENT_DATE- 1, CURRENT_DATE+29, 158000, 28440, 186440, 0, v_acct_id),
  (v_org_id,'INV-0019','sale','partial',v_cust_4,CURRENT_DATE-25, CURRENT_DATE+ 5,  96000, 17280, 113280, 50000, v_owner_id),
  (v_org_id,'INV-0020','sale','partial',v_cust_6,CURRENT_DATE-18, CURRENT_DATE+12,  75000, 13500,  88500, 30000, v_acct_id);

-- Sale Invoices (Overdue)
INSERT INTO invoices (organization_id, invoice_number, type, status, customer_id, issue_date, due_date, subtotal, tax_amount, total_amount, amount_paid, created_by) VALUES
  (v_org_id,'INV-0021','sale','overdue', v_cust_8,  CURRENT_DATE-60, CURRENT_DATE-30,  89000, 16020, 105020, 0, v_owner_id),
  (v_org_id,'INV-0022','sale','overdue', v_cust_10, CURRENT_DATE-45, CURRENT_DATE-15, 134000, 24120, 158120, 0, v_acct_id),
  (v_org_id,'INV-0023','sale','overdue', v_cust_12, CURRENT_DATE-40, CURRENT_DATE-10,  56000, 10080,  66080, 0, v_owner_id),
  (v_org_id,'INV-0024','sale','overdue', v_cust_14, CURRENT_DATE-35, CURRENT_DATE- 5,  48000,  8640,  56640, 0, v_acct_id),
  (v_org_id,'INV-0025','sale','overdue', v_cust_15, CURRENT_DATE-30, CURRENT_DATE- 1,  72000, 12960,  84960, 0, v_owner_id);

-- Draft Invoices
INSERT INTO invoices (organization_id, invoice_number, type, status, customer_id, issue_date, due_date, subtotal, tax_amount, total_amount, created_by) VALUES
  (v_org_id,'INV-0026','sale','draft', v_cust_1, CURRENT_DATE, CURRENT_DATE+30, 98000, 17640, 115640, v_owner_id),
  (v_org_id,'INV-0027','sale','draft', v_cust_2, CURRENT_DATE, CURRENT_DATE+15, 43000,  7740,  50740, v_acct_id);

-- Purchase Invoices (from vendors)
INSERT INTO invoices (organization_id, invoice_number, type, status, vendor_id, issue_date, due_date, subtotal, tax_amount, total_amount, amount_paid, created_by) VALUES
  (v_org_id,'BILL-001','purchase','paid',   v_vend_1, '2024-04-01','2024-05-01', 380000, 0, 380000, 380000, v_owner_id),
  (v_org_id,'BILL-002','purchase','paid',   v_vend_2, '2024-04-15','2024-04-30',  45000, 8100,  53100,  53100, v_acct_id),
  (v_org_id,'BILL-003','purchase','paid',   v_vend_3, '2024-05-01','2024-05-16',  18000, 3240,  21240,  21240, v_owner_id),
  (v_org_id,'BILL-004','purchase','paid',   v_vend_4, '2024-05-10','2024-06-24', 220000,39600, 259600, 259600, v_acct_id),
  (v_org_id,'BILL-005','purchase','paid',   v_vend_5, '2024-06-01','2024-07-01',  72000,12960,  84960,  84960, v_owner_id),
  (v_org_id,'BILL-006','purchase','sent',   v_vend_6, CURRENT_DATE-10, CURRENT_DATE+20,  34000, 6120,  40120, 0, v_acct_id),
  (v_org_id,'BILL-007','purchase','sent',   v_vend_7, CURRENT_DATE- 5, CURRENT_DATE+25,  12000, 2160,  14160, 0, v_owner_id),
  (v_org_id,'BILL-008','purchase','overdue',v_vend_8, CURRENT_DATE-45, CURRENT_DATE-15,  65000,11700,  76700, 0, v_acct_id),
  (v_org_id,'BILL-009','purchase','sent',   v_vend_9, CURRENT_DATE- 2, CURRENT_DATE+28,  28000, 5040,  33040, 0, v_owner_id),
  (v_org_id,'BILL-010','purchase','sent',  v_vend_10, CURRENT_DATE, CURRENT_DATE+30,  15000, 2700,  17700, 0, v_acct_id);

-- ── Expenses (30 across 8 categories) ────────────────────────────────────────
INSERT INTO expenses (organization_id, category, description, amount, expense_date, payment_method, vendor_id, created_by) VALUES
  (v_org_id,'Office Supplies','A4 Paper & Stationery bulk purchase', 4500,'2024-04-05','upi',v_vend_3,v_owner_id),
  (v_org_id,'Office Supplies','Printer toner cartridges (4 units)', 8200,'2024-04-20','card',v_vend_3,v_acct_id),
  (v_org_id,'Travel','Flight Mumbai-Delhi (business trip)', 18500,'2024-04-15','card',NULL,v_owner_id),
  (v_org_id,'Travel','Hotel stay 3 nights (Delhi)', 12000,'2024-04-18','card',NULL,v_owner_id),
  (v_org_id,'Travel','Local taxi/cab expenses', 3200,'2024-04-19','upi',NULL,v_acct_id),
  (v_org_id,'Software & Subscriptions','Google Workspace (annual)', 14400,'2024-04-01','card',NULL,v_owner_id),
  (v_org_id,'Software & Subscriptions','AWS cloud hosting (monthly)', 15000,'2024-04-01','card',v_vend_10,v_owner_id),
  (v_org_id,'Software & Subscriptions','Tally Prime license renewal', 21000,'2024-05-01','bank_transfer',NULL,v_acct_id),
  (v_org_id,'Utilities','MSEB electricity bill (factory)', 28000,'2024-04-10','upi',v_vend_5,v_acct_id),
  (v_org_id,'Utilities','Airtel broadband + phone lines', 12000,'2024-04-05','bank_transfer',v_vend_7,v_owner_id),
  (v_org_id,'Marketing','Google Ads campaign (April)', 25000,'2024-04-30','card',NULL,v_owner_id),
  (v_org_id,'Marketing','Trade fair exhibition stall charges', 45000,'2024-05-10','cheque',NULL,v_owner_id),
  (v_org_id,'Marketing','Social media management', 8000,'2024-05-01','upi',NULL,v_acct_id),
  (v_org_id,'Salaries','Staff salary - April 2024', 285000,'2024-04-30','bank_transfer',NULL,v_owner_id),
  (v_org_id,'Salaries','Staff salary - May 2024', 285000,'2024-05-31','bank_transfer',NULL,v_owner_id),
  (v_org_id,'Salaries','Contract labour charges', 45000,'2024-05-15','cash',NULL,v_acct_id),
  (v_org_id,'Rent','Warehouse rent - Andheri East', 85000,'2024-04-01','cheque',NULL,v_owner_id),
  (v_org_id,'Rent','Office rent - Nariman Point', 125000,'2024-04-01','cheque',NULL,v_owner_id),
  (v_org_id,'Professional Fees','CA fee - quarterly audit', 35000,'2024-06-30','bank_transfer',NULL,v_owner_id),
  (v_org_id,'Professional Fees','Legal consultation (contract review)', 15000,'2024-05-20','bank_transfer',NULL,v_owner_id),
  (v_org_id,'Repairs & Maintenance','AC servicing (office + warehouse)', 8500,'2024-05-05','cash',NULL,v_acct_id),
  (v_org_id,'Repairs & Maintenance','Computer repair & upgrades', 22000,'2024-05-15','card',NULL,v_owner_id),
  (v_org_id,'Office Supplies','Safety equipment & PPE kits', 6800,'2024-05-25','upi',NULL,v_acct_id),
  (v_org_id,'Travel','Mumbai local travel (monthly)', 4200,'2024-05-31','upi',NULL,v_acct_id),
  (v_org_id,'Utilities','MSEB electricity bill (May)', 31000,'2024-05-10','upi',v_vend_5,v_acct_id),
  (v_org_id,'Software & Subscriptions','AWS cloud hosting (May)', 15000,'2024-05-01','card',v_vend_10,v_owner_id),
  (v_org_id,'Marketing','Google Ads campaign (May)', 30000,'2024-05-31','card',NULL,v_owner_id),
  (v_org_id,'Professional Fees','GST filing consultant', 5000,'2024-05-15','upi',NULL,v_acct_id),
  (v_org_id,'Repairs & Maintenance','Forklift servicing', 12000,'2024-06-10','cash',NULL,v_owner_id),
  (v_org_id,'Travel','Flight Mumbai-Bengaluru', 9500,'2024-06-05','card',NULL,v_owner_id);

END $$;
