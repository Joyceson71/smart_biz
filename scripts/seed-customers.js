const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .filter(line => line.trim() !== '' && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...valueParts] = line.split('=');
    acc[key.trim()] = valueParts.join('=').trim();
    return acc;
  }, {});

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Starting bulk insertion of customers...");

  // Fetch admin user to associate customers with
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError || !users || users.length === 0) {
    console.error("Could not fetch a user to assign the customers to.", usersError);
    process.exit(1);
  }
  const adminUserId = users[0].id;
  console.log(`Using admin user ID: ${adminUserId}`);

  // Read large dataset
  const datasetPath = path.resolve(__dirname, '../large_dataset.json');
  const rawData = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  
  // Transform data to match customers schema
  // Schema: id (auto), user_id, first_name, last_name, email, phone, status, created_at
  const mappedData = rawData.map(item => {
    const [firstName, ...lastNameParts] = item.name.split(' ');
    return {
      user_id: adminUserId,
      first_name: firstName,
      last_name: lastNameParts.join(' ') || 'User',
      email: item.email,
      status: item.status === 'active' ? 'Active' : 'Inactive',
      created_at: item.createdAt
    };
  });

  const CHUNK_SIZE = 500;
  let successCount = 0;
  
  for (let i = 0; i < mappedData.length; i += CHUNK_SIZE) {
    const chunk = mappedData.slice(i, i + CHUNK_SIZE);
    console.log(`Inserting chunk ${i / CHUNK_SIZE + 1} (${chunk.length} records)...`);
    
    const { error } = await supabase
      .from('customers')
      .insert(chunk);
      
    if (error) {
      console.error(`Error inserting chunk ${i / CHUNK_SIZE + 1}:`, error);
      process.exit(1);
    }
    
    successCount += chunk.length;
  }

  console.log(`Successfully inserted ${successCount} customers!`);
}

run().catch(console.error);
