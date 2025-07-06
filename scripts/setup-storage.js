const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function setupStorage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local')
    console.log('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Create storage bucket
    console.log('Creating storage bucket...')
    const { data: bucket, error: bucketError } = await supabase.storage
      .createBucket('post-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      })
    
    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError
    }
    
    console.log('✅ Storage bucket created or already exists')
    
    // Test upload permissions
    console.log('Testing upload permissions...')
    const testFile = Buffer.from('test')
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload('test/test.txt', testFile)
    
    if (uploadError) {
      console.log('⚠️  Upload test failed:', uploadError.message)
      console.log('You may need to set up storage policies manually')
    } else {
      console.log('✅ Upload test successful')
      
      // Clean up test file
      await supabase.storage
        .from('post-images')
        .remove(['test/test.txt'])
    }
    
    console.log('\n🎉 Storage setup complete!')
    console.log('You can now enable real uploads by updating /app/api/upload/route.ts')
    
  } catch (error) {
    console.error('❌ Storage setup failed:', error.message)
    console.log('\nManual setup required:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to Storage')
    console.log('3. Create a bucket named "post-images"')
    console.log('4. Set it as public')
    console.log('5. Apply the policies from /supabase/storage.sql')
  }
}

setupStorage()