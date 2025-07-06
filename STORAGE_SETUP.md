# Supabase Storage Setup Guide

Follow these steps to configure image storage for PostMaster:

## 📋 **Step 1: Access Supabase Dashboard**

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `nrqxoydedjnubfmmgbot`

## 🪣 **Step 2: Create Storage Bucket**

1. In the left sidebar, click **"Storage"**
2. Click **"New bucket"**
3. Fill in the details:
   - **Name**: `post-images`
   - **Public bucket**: ✅ **Yes** (check this box)
   - **File size limit**: `10MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`
4. Click **"Create bucket"**

## 🔐 **Step 3: Configure Storage Policies**

1. In Storage, click on your `post-images` bucket
2. Go to the **"Policies"** tab
3. Click **"New policy"**
4. Click **"For full customization"**
5. Add these policies one by one:

### **Policy 1: Allow Users to Upload**
```sql
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### **Policy 2: Allow Anyone to View Images**
```sql
CREATE POLICY "Users can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');
```

### **Policy 3: Allow Users to Update Their Images**
```sql
CREATE POLICY "Users can update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### **Policy 4: Allow Users to Delete Their Images**
```sql
CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## ✅ **Step 4: Test the Configuration**

1. Save each policy after creating it
2. Your bucket should show as **Public** with 4 policies applied
3. The bucket URL should be: `https://nrqxoydedjnubfmmgbot.supabase.co/storage/v1/object/public/post-images/`

## 🚀 **Step 5: Enable Real Uploads**

Once storage is configured, I'll update the code to use real uploads instead of demo mode.

---

## 🆘 **Need Help?**

If you run into issues:
1. Make sure the bucket is marked as **Public**
2. Verify all 4 policies are applied and enabled
3. Check that the MIME types include all image formats
4. Ensure the file size limit is set to 10MB or higher

Let me know when you've completed these steps and I'll enable real uploads! 🎉