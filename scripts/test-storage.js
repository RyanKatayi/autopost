const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testStorage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    return
  }

  console.log('🔗 Supabase URL:', supabaseUrl)
  console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 20) + '...')

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // Test if we can list buckets
    console.log('\n📂 Testing bucket access...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.log('⚠️  Cannot list buckets:', listError.message)
      console.log('This is normal - anon key has limited permissions')
    } else {
      console.log('✅ Available buckets:', buckets?.map(b => b.name) || 'none')
    }
    
    // Test if post-images bucket exists
    console.log('\n🪣 Testing post-images bucket...')
    const { data: files, error: filesError } = await supabase.storage
      .from('post-images')
      .list('', { limit: 1 })
    
    if (filesError) {
      if (filesError.message.includes('not found') || filesError.message.includes('does not exist')) {
        console.log('❌ Bucket "post-images" does not exist yet')
        console.log('\n📋 Next steps:')
        console.log('1. Go to your Supabase dashboard')
        console.log('2. Navigate to Storage')
        console.log('3. Create a bucket named "post-images"')
        console.log('4. Make it public')
        console.log('5. Apply the storage policies')
        console.log('\nDetailed instructions: /STORAGE_SETUP.md')
      } else {
        console.log('⚠️  Bucket access error:', filesError.message)
      }
    } else {
      console.log('✅ Bucket "post-images" exists and is accessible!')
      console.log('📁 Files in bucket:', files?.length || 0)
      
      // Test upload
      console.log('\n📤 Testing upload...')
      const testData = new Uint8Array([137, 80, 78, 71]) // PNG header
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload('test-connection.png', testData, {
          contentType: 'image/png'
        })
      
      if (uploadError) {
        console.log('❌ Upload test failed:', uploadError.message)
        console.log('Check your storage policies and authentication')
      } else {
        console.log('✅ Upload test successful!')
        console.log('🎉 Storage is fully configured and ready!')
        
        // Clean up test file
        await supabase.storage
          .from('post-images')
          .remove(['test-connection.png'])
        console.log('🧹 Cleaned up test file')
      }
    }
    
  } catch (error) {
    console.error('❌ Storage test failed:', error.message)
  }
}

testStorage()